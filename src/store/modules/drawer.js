export default {
  namespaced: true,

  state: {
    open: true,
    mini: false
  },

  getters: {
    open: state => state.open,
    mini: state => state.mini
  },

  mutations: {
    'SET_OPEN' (state, open) {
      state.open = open
    },

    'SET_MINI' (state, mini) {
      state.mini = mini
    }
  },

  actions: {
    setOpen ({ commit }, open) {
      commit('SET_OPEN', !!open)
    },

    toggleOpen ({ state, commit }) {
      commit('SET_OPEN', !state.open)
    },

    toggleMini ({ state, commit }) {
      commit('SET_MINI', !state.mini)
    }
  }
}
