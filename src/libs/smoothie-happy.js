import { get, post } from './http-request'

// git URL's
const apiURL = 'https://api.github.com/repos/Smoothieware/Smoothieware/'
// const rawURL = 'https://raw.githubusercontent.com/Smoothieware/Smoothieware/'

// encoding
const charset = 'ISO-8859-1'

// version pattern
const versionPattern = /Build version: (.*), Build date: (.*), MCU: (.*), System Clock: (.*)/

// ls pattern
const lsPattern = /^(.*)(\/|\s[0-9]+)$/gm

export function command (address, settings = {}) {
  return post('http://' + address + '/command', {
    charset,
    ...settings,
    data: settings.data.trim() + '\n'
  })
  .then(response => {
    response = response.trim()
    let test = response.toLowerCase()

    if (test.startsWith('error:unsupported command')) {
      throw new Error(response.slice(6))
    }

    return response
  })
}

// VERSION
// expected: Build version: edge-94de12c, Build date: Oct 28 2014 13:24:47, MCU: LPC1769, System Clock: 120MHz
// return: { branch: "edge", hash: "94de12c", date: "Oct 28 2014 13:24:47", mcu: "LPC1769", clock: "120MHz" }
// error: No version found.
export function version ({ address, ...settings }) {
  return command(address, {
    ...settings,
    data: 'version'
  })
  .then(response => {
    let matches = response.trim().match(versionPattern)

    if (matches) {
      // split branch-hash on dash
      let branch = matches[1].split('-')

      // response object
      return {
        address,
        version: {
          branch: branch[0],
          hash: branch[1],
          date: matches[2],
          mcu: matches[3],
          clock: matches[4]
        }
      }
    }

    throw new Error('No version found.')
  })
}

// List files
export function ls ({ address, path, ...settings }) {
  return command(address, {
    ...settings,
    data: 'ls -s ' + path
  })
  .then(response => {
    let result = null
    let folders = []
    let files = []

    response = response.trim()
    let test = response.toLowerCase()

    if (test.startsWith('could not open directory')) {
      throw new Error(response)
    }

    while ((result = lsPattern.exec(response)) !== null) {
      if (result[2] === '/') {
        folders.push({ name: result[1] })
      } else {
        files.push({ name: result[1], size: parseInt(result[2]) })
      }
    }

    return { folders, files }
  })
}

// Move/Rename file
export function mv ({ address, source, target, ...settings }) {
  return command(address, {
    ...settings,
    data: 'mv ' + source + ' ' + target
  })
  .then(response => {
    response = response.trim()
    let test = response.toLowerCase()

    if (test.startsWith('could not rename')) {
      throw new Error(response)
    }

    return response
  })
}

// Remove file
export function rm ({ address, path, ...settings }) {
  return command(address, {
    ...settings,
    data: 'rm ' + path
  })
  .then(response => {
    response = response.trim()
    let test = response.toLowerCase()

    if (test.startsWith('could not delete')) {
      throw new Error(response)
    }

    return response
  })
}

// make directory
export function mkdir ({ address, path, ...settings }) {
  return command(address, {
    ...settings,
    data: 'mkdir ' + path
  })
  .then(response => {
    response = response.trim()
    let test = response.toLowerCase()

    if (test.startsWith('could not create directory')) {
      throw new Error(response)
    }

    return response
  })
}

// Upload file
export function upload ({ address, path, file, ...settings }) {
  let filename = (path + '/' + file.name).replace(/^sd\//, '')

  return post('http://' + address + '/upload', {
    charset,
    ...settings,
    data: file,
    headers: {
      'X-Filename': filename
    }
  })
  .then(response => {
    response = response.trim()
    let test = response.toLowerCase()

    if (test.trim().toLowerCase() !== 'ok') {
      throw new Error(response)
    }

    return file
  })
}

// Firmware update/upgrade
export function getFirmwareCommits () {
  let url = apiURL + 'commits'
  let data = '?sha=edge&path=FirmwareBin/firmware.bin&per_page=100'

  return get(url, { data }).then(response => {
    if (!response.length) {
      throw new Error('Empty response...')
    }

    let json = JSON.parse(response)

    if (!json) {
      throw new Error('Empty response...')
    }

    let commits = {}

    json.forEach((commit, index) => {
      commits[commit.parents[0].sha.substr(0, 7)] = { index }
    })

    return commits
  })
}
