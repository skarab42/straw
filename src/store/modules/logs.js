import uuid from 'uuid/v4'

function createMessage (state, message) {
  let type = message.type || 'log'
  let time = Date.now()

  return {
    type,
    text: null,
    icon: state.filters[type].icon,
    notify: true,
    timeout: 10000,
    deleted: false,
    ...message,
    key: uuid(),
    time
  }
}

export default {
  namespaced: true,

  state: {
    dialog: false,
    messages: [],
    filter: 'all',
    filters: {
      all: { name: 'all', icon: 'notifications_active', color: 'primary' },
      log: { name: 'log', icon: 'message', color: 'grey' },
      info: { name: 'info', icon: 'info', color: 'info' },
      error: { name: 'error', icon: 'error', color: 'error' },
      warning: { name: 'warning', icon: 'warning', color: 'warning' },
      success: { name: 'success', icon: 'thumb_up', color: 'success' }
    },
    showNotifications: true
  },

  getters: {
    dialog: state => state.dialog,
    messages: state => state.messages,
    filter: state => state.filter,
    filters: state => state.filters,
    showNotifications: state => state.showNotifications,
    filterIcon: state => state.filters[state.filter].icon,
    filterColor: state => state.filters[state.filter].color,

    getFilteredMessages (state) {
      return function (type = state.filter) {
        return type === 'all'
        ? state.messages
        : state.messages.filter(m => m.type === type)
      }
    },

    filteredMessages (state, getters) {
      return getters.getFilteredMessages(state.filter)
    },

    notifications (state) {
      return state.messages.filter(m => m.notify)
    }
  },

  mutations: {
    'SET_DIALOG' (state, dialog) {
      state.dialog = dialog
    },

    'SET_FILTER' (state, filter) {
      state.filter = filter
    },

    'SET_SHOW_NOTIFICATIONS' (state, showNotifications) {
      state.showNotifications = showNotifications
    },

    'PUSH_MESSAGE' (state, message) {
      state.messages.push(message)
    },

    'REMOVE_MESSAGE' (state, message) {
      state.messages = state.messages.filter(m => m.key !== message.key)
    },

    'UPDATE_MESSAGE' (state, message) {
      state.messages = state.messages.map(m => {
        if (m.key === message.key) {
          Object.assign(m, message)
        }

        return m
      })
    }
  },

  actions: {
    setDialog ({ commit }, dialog) {
      commit('SET_DIALOG', !!dialog)
    },

    openDialog ({ commit }) {
      commit('SET_DIALOG', true)
    },

    closeDialog ({ commit }) {
      commit('SET_DIALOG', false)
    },

    setFilter ({ commit }, filter) {
      commit('SET_FILTER', filter)
    },

    setShowNotification ({ commit }, showNotifications) {
      commit('SET_SHOW_NOTIFICATIONS', showNotifications)
    },

    pushMessage ({ state, commit }, message) {
      let newMessage = createMessage(state, message)

      commit('PUSH_MESSAGE', newMessage)

      if (newMessage.notify) {
        setTimeout(() => {
          commit('UPDATE_MESSAGE', { ...newMessage, notify: false })
        }, newMessage.timeout)
      }
    },

    removeMessage ({ commit }, message) {
      commit('UPDATE_MESSAGE', { ...message, deleted: true })
      setTimeout(() => commit('REMOVE_MESSAGE', message), 300)
    },

    removeMessages ({ dispatch }, messages) {
      let timeout = 0

      Array.from(messages).reverse().forEach(message => {
        setTimeout(() => dispatch('removeMessage', message), timeout += 300)
      })
    }
  }
}
