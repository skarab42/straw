import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import boards from './boards'

const vuexPersist = new VuexPersistence({
  strictMode: process.env.DEV,
  storage: window.localStorage
})

Vue.use(Vuex)

/*
* If not building with SSR mode, you can
* directly export the Store instantiation
*/

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      boards
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV,

    // Persistence
    mutations: {
      RESTORE_MUTATION: vuexPersist.RESTORE_MUTATION
    },
    plugins: [vuexPersist.plugin]
  })

  return Store
}
