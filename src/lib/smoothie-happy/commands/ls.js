export default function ls (response, path) {
  response = response.trim()

  if (response.startsWith('Could not open directory')) {
    throw new Error(`Could not open "${path}" directory`)
  }

  // split lines
  let lines = response.split('\n').filter(v => v.length)

  // empty files list
  let files = []

  if (!lines.length) {
    return lines
  }

  // root path
  let rootPath = path !== '/' ? path : ''

  // for each lines (file)
  lines.forEach(file => {
    // remove trailing spaces
    file = file.trim()

    // is directory ?
    let isDir = file.endsWith('/')

    if (isDir && file.includes(' ')) {
      return // skip directory wite spaces
    }

    let filename = ''
    let extension = ''
    let size = 0

    if (!isDir) {
      let parts = file.split(' ')
      if (parts.length > 2) {
        return // skip file wite spaces
      }
      filename = parts[0]
      size = parseInt(parts[1])
      if (filename.includes('.')) {
        extension = '.' + filename.split('.').pop()
      }
    } else {
      filename = file.slice(0, -1)
    }

    // set file info
    files.push({
      name: filename,
      extension: extension,
      parent: rootPath.length ? rootPath : '/',
      path: rootPath + '/' + filename,
      type: isDir ? 'folder' : 'file',
      size: size
    })
  })

  return files
}
