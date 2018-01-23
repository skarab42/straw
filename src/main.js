import 'babel-polyfill'

import Vue from 'vue'
import store from './store'
import router from './router'

import './vuetify'

import PageContainer from './components/PageContainer'
import PageDialog from './components/PageDialog'
import PageCard from './components/PageCard'
import BoardSelect from './components/BoardSelect'
import App from './components/App'

PageContainer.install(Vue)
PageDialog.install(Vue)
PageCard.install(Vue)
BoardSelect.install(Vue)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  store,
  router,
  el: '#app',
  template: '<App/>',
  components: { App }
})
