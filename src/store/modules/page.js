export default {
  namespaced: true,

  state: {
    icon: null,
    title: null
  },

  getters: {
    icon: state => state.icon,
    title: state => state.title
  },

  mutations: {
    'SET_ICON' (state, icon) {
      state.icon = icon
    },

    'SET_TITLE' (state, title) {
      state.title = title
    }
  },

  actions: {
    setIcon ({ commit }, icon) {
      commit('SET_ICON', icon)
    },

    setTitle ({ commit }, title) {
      commit('SET_TITLE', title)
    }
  }
}
