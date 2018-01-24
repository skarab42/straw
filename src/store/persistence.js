import VuexPersistence from 'vuex-persist'

// save state
function reducer (state) {
  return {
    showNotifications: state.logs.showNotifications,
    drawer: state.drawer,
    boards: state.boards,
    firmware: state.firmware
  }
}

// restore state
function restoreState (key, storage) {
  let store = JSON.parse(storage.getItem(key))

  return !store ? {} : {
    logs: { showNotifications: store.showNotifications },
    drawer: store.drawer,
    boards: store.boards,
    firmware: store.firmware
  }
}

// create localStorage persistence
export default new VuexPersistence({
  strictMode: process.env.NODE_ENV !== 'production',
  storage: window.localStorage,
  key: 'straw',
  restoreState,
  reducer
})
