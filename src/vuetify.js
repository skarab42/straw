import Vue from 'vue'
import {
  Vuetify,
  VApp,
  VBtn,
  VIcon,
  VList,
  VGrid,
  VCard,
  VMenu,
  VAlert,
  VBadge,
  VDialog,
  VFooter,
  VSelect,
  VAvatar,
  VSwitch,
  VTooltip,
  VToolbar,
  VDivider,
  VSnackbar,
  VCheckbox,
  VDataTable,
  VTextField,
  VSubHeader,
  VBreadcrumbs,
  VProgressLinear,
  VProgressCircular,
  VNavigationDrawer,
  transitions
} from 'vuetify'

import '../node_modules/vuetify/src/stylus/app.styl'
import './assets/fonts/roboto/roboto.css'
import 'material-design-icons/iconfont/material-icons.css'

Vue.use(Vuetify, {
  components: {
    VApp,
    VBtn,
    VIcon,
    VList,
    VGrid,
    VCard,
    VMenu,
    VAlert,
    VBadge,
    VDialog,
    VFooter,
    VSelect,
    VAvatar,
    VSwitch,
    VTooltip,
    VToolbar,
    VDivider,
    VSnackbar,
    VCheckbox,
    VDataTable,
    VTextField,
    VSubHeader,
    VBreadcrumbs,
    VProgressLinear,
    VProgressCircular,
    VNavigationDrawer,
    transitions
  },
  theme: {
    primary: '#ee44aa',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }
})
