import Vue from 'vue'
import uuid from 'uuid/v4'
import { ls, rm, mv, mkdir } from '@/libs/smoothie-happy'
import { humanFileSize } from '@/libs/utils'

const defaultPath = 'sd'
const notAsciiPattern = /[^\x00-\x7F]|\s/g

function createBoard () {
  return {
    loading: false,
    path: defaultPath,
    paths: {}
  }
}

function createPath () {
  return {
    folders: [],
    files: []
  }
}

function createBaseFile (file) {
  let name = file.name.toLowerCase()
  let invalidChars = validateFileName(name)
  let hasError = !!invalidChars

  return {
    ...file,
    name,
    key: uuid(),
    invalidChars,
    hasError
  }
}

function createFolder (folder) {
  return createBaseFile(folder)
}

export function validateFileName (name) {
  let chars = name.match(notAsciiPattern)
  return chars ? chars.map(c => c === ' ' ? 'space' : c) : null
}

export function createFile (file) {
  let fileBase = createBaseFile(file)
  let basename = file.name.split('.')
  let extension = ''
  let humanSize = humanFileSize(file.size)
  let empty = !file.size

  if (basename.length > 1) {
    extension = basename.pop()
  }

  basename = basename.join('.')

  if (empty) {
    fileBase.hasError = true
  }

  return {
    ...fileBase,
    basename,
    extension,
    humanSize,
    empty
  }
}

function sortByKey (arr) {
  return arr.sort((a, b) => a.name.localeCompare(b.name))
}

export default {
  namespaced: true,

  state: {
    boardsCollection: {},
    fileListLoading: false
  },

  getters: {
    boardsCollection: state => state.boardsCollection,
    fileListLoading: state => state.fileListLoading,

    selectedBoardAddress (state, getters, rootState) {
      return rootState.boards.selectedBoardAddress
    },

    getBoard (state, getters, rootState) {
      return address => state.boardsCollection[address] || {}
    },

    getBoardPaths (state, getters, rootState) {
      return address => getters.getBoard(address).paths || {}
    },

    getBoardPath (state, getters, rootState) {
      return (address, path) => getters.getBoardPaths(address)[path] || {}
    },

    getBoardFiles (state, getters, rootState) {
      return (address, path) => getters.getBoardPath(address, path).files || []
    },

    getBoardFolders (state, getters, rootState) {
      return (address, path) => getters.getBoardPath(address, path).folders || []
    },

    hasBoardFile (state, getters, rootState) {
      return (address, path, file) => getters.getBoardFiles(address, path, file).some(f => f.name === file.name.toLowerCase())
    },

    hasBoardFolder (state, getters, rootState) {
      return (address, path, folder) => getters.getBoardFolders(address, path, folder).some(f => f.name === folder.name.toLowerCase())
    },

    currentBoard (state, getters) {
      return getters.getBoard(getters.selectedBoardAddress)
    },

    currentBoardPaths (state, getters) {
      return getters.currentBoard.paths || {}
    },

    currentBoardPath (state, getters) {
      return getters.currentBoard.path || defaultPath
    },

    currentBoardHasPath (state, getters) {
      return function (path) {
        return !!getters.currentBoardPaths[path]
      }
    },

    currentBoardGetPath (state, getters) {
      return function (path = getters.currentBoardPath) {
        return getters.currentBoardPaths[path] || null
      }
    },

    currentBoardFolderList (state, getters) {
      let path = getters.currentBoardGetPath()
      return (path) ? sortByKey([...path.folders]) : []
    },

    currentBoardFileList (state, getters) {
      let path = getters.currentBoardGetPath()
      return (path) ? sortByKey([...path.files]) : []
    }
  },

  mutations: {
    'ADD_BOARD' (state, { address, board }) {
      Vue.set(state.boardsCollection, address, board)
    },

    'REMOVE_BOARD' (state, { address }) {
      Vue.delete(state.boardsCollection, address)
    },

    'SET_FILE_LIST_LOADING' (state, value) {
      state.fileListLoading = value
    },

    'SET_PATH' (state, { address, path }) {
      state.boardsCollection[address].path = path
    },

    'ADD_PATH' (state, { address, path, paths }) {
      Vue.set(state.boardsCollection[address].paths, path, paths)
    },

    'ADD_FOLDER' (state, { address, path, folder }) {
      state.boardsCollection[address].paths[path].folders.push(folder)
    },

    'UPDATE_FOLDER' (state, { address, path, key, ...folder }) {
      let paths = state.boardsCollection[address].paths[path]

      paths.folders = paths.folders.map(f => {
        if (f.key === key) {
          Object.assign(f, folder)
        }

        return f
      })
    },

    'REMOVE_FOLDER' (state, { address, path, folder }) {
      let paths = state.boardsCollection[address].paths[path]
      let folders = paths.folders.filter(f => f.name !== folder.name.toLowerCase())

      state.boardsCollection[address].paths[path].folders = folders
    },

    'ADD_FILE' (state, { address, path, file }) {
      state.boardsCollection[address].paths[path].files.push(file)
    },

    'UPDATE_FILE' (state, { address, path, key, ...file }) {
      let paths = state.boardsCollection[address].paths[path]

      paths.files = paths.files.map(f => {
        if (f.key === key) {
          Object.assign(f, file)
        }

        return f
      })
    },

    'REMOVE_FILE' (state, { address, path, file }) {
      let paths = state.boardsCollection[address].paths[path]
      let files = paths.files.filter(f => f.name !== file.name.toLowerCase())

      state.boardsCollection[address].paths[path].files = files
    }
  },

  actions: {
    addBoard ({ state, commit }, { address }) {
      if (!state.boardsCollection[address]) {
        commit('ADD_BOARD', { address, board: createBoard() })
      }
    },

    removeBoard ({ state, commit }, { address }) {
      if (state.boardsCollection[address]) {
        commit('REMOVE_BOARD', { address })
      }
    },

    addFile ({ commit, getters }, { address, path, file }) {
      if (getters.hasBoardFile(address, path, file)) {
        commit('REMOVE_FILE', { address, path, file })
      }

      commit('ADD_FILE', { address, path, file: createFile(file) })
    },

    addFiles ({ dispatch }, { address, path, files }) {
      files.forEach(file => dispatch('addFile', { address, path, file }))
    },

    addFolder ({ commit }, { address, path, folder }) {
      commit('ADD_FOLDER', { address, path, folder: createFolder(folder) })
    },

    addFolders ({ dispatch }, { address, path, folders }) {
      folders.forEach(folder => dispatch('addFolder', { address, path, folder }))
    },

    makeFolder ({ rootState, getters, commit, dispatch }, folder) {
      let address = rootState.boards.selectedBoardAddress
      let path = getters.currentBoardPath

      commit('SET_FILE_LIST_LOADING', true)

      mkdir({ address, path: path + '/' + folder.name }).then(() => {
        dispatch('addFolder', { address, path, folder })
      })
      .catch(e => {
        this.dispatch('logs/pushMessage', {
          type: 'error',
          text: address + ' : ' + e.message
        })
      })
      .then(() => {
        commit('SET_FILE_LIST_LOADING', false)
      })
    },

    openFolder ({ rootState, getters, commit, dispatch }, options) {
      let address = rootState.boards.selectedBoardAddress
      let settings = {
        // defaults settings
        path: getters.currentBoardPath,
        subpath: null,
        refresh: false,
        // user settings
        ...options
      }

      let path = settings.path

      if (settings.subpath) {
        path += '/' + settings.subpath
      }

      if (!settings.refresh && getters.currentBoardHasPath(path)) {
        return commit('SET_PATH', { address, path })
      }

      commit('SET_FILE_LIST_LOADING', true)

      ls({ address, path }).then(({ folders, files }) => {
        commit('ADD_PATH', { address, path, paths: createPath() })
        dispatch('addFolders', { address, path, folders })
        dispatch('addFiles', { address, path, files })
        commit('SET_PATH', { address, path })
      })
      .catch(e => {
        this.dispatch('logs/pushMessage', {
          type: 'error',
          text: address + ' : ' + e.message
        })
      })
      .then(() => {
        commit('SET_FILE_LIST_LOADING', false)
      })
    },

    removeFile ({ rootState, getters, commit }, file) {
      let address = rootState.boards.selectedBoardAddress
      let path = getters.currentBoardPath
      let source = path + '/' + file.name.toLowerCase()
      let isFile = !!file.humanSize

      commit('SET_FILE_LIST_LOADING', true)

      rm({ address, path: source }).then(() => {
        if (isFile) {
          commit('REMOVE_FILE', { address, path, file })
        } else {
          commit('REMOVE_FOLDER', { address, path, folder: file })
        }
      })
      .catch(e => {
        let messages = e.message

        if (!isFile) {
          messages += ', the directory is probably not empty'
        }

        this.dispatch('logs/pushMessage', {
          type: 'error',
          text: address + ' : ' + messages + '.'
        })

        throw e
      })
      .then(() => {
        commit('SET_FILE_LIST_LOADING', false)
      })
    },

    renameFile ({ rootState, getters, commit, dispatch }, { newName, ...file }) {
      let name = newName.toLowerCase()

      if (name === file.name) {
        return
      }

      let address = rootState.boards.selectedBoardAddress
      let path = getters.currentBoardPath
      let source = path + '/' + file.name
      let target = path + '/' + name
      let isFile = !!file.humanSize

      commit('SET_FILE_LIST_LOADING', true)

      mv({ address, source, target }).then(() => {
        if (isFile) {
          let newFile = createFile({ ...file, name })
          commit('UPDATE_FILE', { address, path, ...newFile, key: file.key })
        } else {
          let newFile = createFolder({ ...file, name })
          commit('UPDATE_FOLDER', { address, path, ...newFile, key: file.key })
        }
      })
      .catch(e => {
        this.dispatch('logs/pushMessage', {
          type: 'error',
          text: address + ' : ' + e.message
        })
      })
      .then(() => {
        commit('SET_FILE_LIST_LOADING', false)
      })
    }
  }
}
