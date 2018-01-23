import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import persistence from './persistence'

const strict = process.env.NODE_ENV !== 'production'

// localStorage.clear()

Vue.use(Vuex)

export default new Vuex.Store({
  strict,
  modules,
  plugins: [persistence.plugin],
  mutations: !strict ? {} : { RESTORE_MUTATION: persistence.RESTORE_MUTATION }
})
