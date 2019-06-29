import command from './command'
import version from './commands/version'
import ls from './commands/ls'
import mkdir from './commands/mkdir'

export default class Board {
  constructor (address, state = {}) {
    this.state = {
      address: address,
      name: address,
      version: {},
      files: [],
      path: '/sd',
      loading: false,
      selected: false,
      timeout: 0,
      ...state
    }
    if (state.files) {
      this.state.files = [ ...state.files ]
    }
  }

  command (data) {
    return command(this.state.address, data, this.state.timeout)
  }

  version () {
    return this.command('version')
      .then(response => {
        this.state.version = version(response.data)
        return this.state.version
      })
  }

  addFile (file) {
    let found = false
    this.state.files = this.state.files.map(oldFile => {
      if (file.path === oldFile.path) {
        found = true
        return { ...oldFile, ...file }
      }
      return oldFile
    })
    if (!found) {
      this.state.files.push({ ...file })
    }
    return this.state.files
  }

  addFiles (files) {
    files.forEach(file => this.addFile(file))
    return this.state.files
  }

  removeFile (file) {
    this.state.files = this.state.files.filter(oldFile => {
      return file.path !== oldFile.path
    })
    return this.state.files
  }

  removeFilesFromPath (path) {
    this.state.files = this.state.files.filter(file => {
      return !file.parent.startsWith(path)
    })
    return this.state.files
  }

  ls (path = '/sd') {
    return this.command(`ls -s ${path}`)
      .then(response => {
        this.removeFilesFromPath(path)
        this.addFiles(ls(response.data, path))
        return this.state.files
      })
  }

  mkdir (path) {
    return this.command(`mkdir ${path}`)
      .then(response => {
        let folder = mkdir(response.data, path)
        this.addFile(folder)
        return folder
      })
  }
}
