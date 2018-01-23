import { version } from '../../../package.json'

export default {
  namespaced: true,

  state: {
    version,
    name: 'Straw.js',
    fullscreen: false
  },

  getters: {
    version: state => state.version,
    name: state => state.name,
    fullscreen: state => state.fullscreen
  },

  mutations: {
    'SET_FULLSCREEN' (state, fullscreen) {
      state.fullscreen = fullscreen
    }
  },

  actions: {
    setFullscreen ({ state, commit }, fullscreen) {
      commit('SET_FULLSCREEN', !!fullscreen)
    }
  }
}
