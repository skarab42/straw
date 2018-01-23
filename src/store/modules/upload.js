import Vue from 'vue'
import { createFile } from './files'
import { upload } from '@/libs/smoothie-happy'

function createBoard () {
  return {
    uploading: false,
    stopped: false
  }
}

function createUpload ({ address, path, file }) {
  return {
    ...createFile(file),
    address,
    path,
    file,
    duplicate: false,
    uploading: false,
    uploadError: null,
    progress: {
      total: 0,
      loaded: 0,
      percent: 0
    }
  }
}

export default {
  namespaced: true,

  state: {
    uploadDialog: false,
    boardsCollection: {},
    uploadQueue: []
  },

  getters: {
    uploadDialog: state => state.uploadDialog,
    boardsCollection: state => state.boardsCollection,
    uploadQueue: state => state.uploadQueue,

    hasUpload: state => (upload, strict) => {
      return state.uploadQueue.some(u => {
        return u.address === upload.address &&
        u.path === upload.path &&
        u.file.name === upload.file.name &&
        (strict ? u.file.size === upload.file.size : true)
      })
    },

    isBoardUploading: state => address => {
      return state.boardsCollection[address].uploading
    },

    isBoardUploadStopped: state => address => {
      return state.boardsCollection[address].stopped
    },

    getBoardUploadQueue: state => address => {
      return state.uploadQueue.filter(upload => upload.address === address)
    },

    getBoardUploadableQueue: (state, getters) => address => {
      return getters.getBoardUploadQueue(address).filter(upload => !upload.hasError)
    },

    currentBoardUploadQueue: (state, getters, rootState) => {
      return getters.getBoardUploadQueue(rootState.boards.selectedBoardAddress)
    },

    currentBoardUploadableQueue: (state, getters, rootState) => {
      return getters.getBoardUploadableQueue(rootState.boards.selectedBoardAddress)
    },

    currentBoard: (state, getters, rootState) => {
      return state.boardsCollection[rootState.boards.selectedBoardAddress] || {}
    },

    currentBoardUploading: (state, getters) => {
      return getters.currentBoard.uploading || false
    },

    currentBoardUploadStopped: (state, getters) => {
      return getters.currentBoard.stopped || false
    }
  },

  mutations: {
    'SET_UPLOAD_DIALOG' (state, value) {
      state.uploadDialog = value
    },

    'ADD_BOARD' (state, { address, board }) {
      Vue.set(state.boardsCollection, address, board)
    },

    'UPDATE_BOARD' (state, { address, ...value }) {
      Object.assign(state.boardsCollection[address], value)
    },

    'REMOVE_BOARD' (state, { address }) {
      Vue.delete(state.boardsCollection, address)
    },

    'ADD_UPLOAD' (state, upload) {
      state.uploadQueue.push(upload)
    },

    'UPDATE_UPLOAD' (state, { key, ...upload }) {
      state.uploadQueue = state.uploadQueue.map(u => {
        if (u.key === key) {
          Object.assign(u, upload)
        }

        return u
      })
    },

    'REMOVE_UPLOAD' (state, upload) {
      state.uploadQueue = state.uploadQueue.filter(u => u.key !== upload.key)
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

    openUploadDialog ({ commit }) {
      commit('SET_UPLOAD_DIALOG', true)
    },

    closeUploadDialog ({ commit }) {
      commit('SET_UPLOAD_DIALOG', false)
    },

    addUploadFile ({ rootState, rootGetters, getters, commit }, file) {
      let address = rootState.boards.selectedBoardAddress
      let path = rootGetters['files/currentBoardPath']
      let upload = createUpload({ address, path, file })

      if (getters.hasUpload(upload)) {
        upload.duplicate = true
        upload.hasError = true
      }

      commit('ADD_UPLOAD', upload)
    },

    addUploadFiles ({ dispatch }, files) {
      files.forEach(file => dispatch('addUploadFile', file))
    },

    startUpload ({ rootState, getters, commit }) {
      let address = rootState.boards.selectedBoardAddress

      commit('UPDATE_BOARD', { address, uploading: true })
      processUpload.call(this, { address, getters, commit })
    },

    stopUpload ({ rootState, getters, commit }) {
      let address = rootState.boards.selectedBoardAddress

      commit('UPDATE_BOARD', { address, stopped: true })
    },

    removeUpload ({ commit }, upload) {
      if (!upload.uploading) {
        commit('REMOVE_UPLOAD', upload)
      }
    }
  }
}

// -----------------------------------------------------------------------------

function processUpload ({ address, getters, commit }) {
  if (!getters.isBoardUploading(address)) {
    return
  }

  if (getters.isBoardUploadStopped(address)) {
    commit('UPDATE_BOARD', { address, uploading: false, stopped: false })
    return
  }

  let queue = getters.getBoardUploadableQueue(address)
  let firstUpload = queue[0]

  if (!firstUpload) {
    commit('UPDATE_BOARD', { address, uploading: false })
    return
  }

  commit('UPDATE_UPLOAD', { ...firstUpload, uploading: true })

  let path = firstUpload.path
  let file = firstUpload.file

  let uploadProgress = progress => {
    commit('UPDATE_UPLOAD', { ...firstUpload, progress })
  }

  upload({ address, path, file, uploadProgress }).then(() => {
    this.dispatch('files/addFile', { address, path, file: { name: file.name, size: file.size } })
    commit('REMOVE_UPLOAD', firstUpload)
  })
  .catch(e => {
    commit('UPDATE_UPLOAD', {
      ...firstUpload,
      uploading: false,
      hasError: true,
      uploadError: e.message
    })
    this.dispatch('logs/pushMessage', {
      type: 'error',
      text: address + ' : ' + e.message
    })
  })
  .then(() => {
    processUpload.call(this, { address, getters, commit })
  })
}
