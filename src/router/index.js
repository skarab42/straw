import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/boards'
    },
    {
      path: '*',
      redirect: '/error'
    },
    {
      name: 'boards',
      path: '/boards',
      meta: { drawer: true, icon: 'dashboard', title: 'Boards manager' },
      component: () => import('@/components/Boards/BoardsPage')
    },
    {
      name: 'files',
      path: '/files',
      meta: { drawer: true, icon: 'folder_open', title: 'Files manager' },
      component: () => import('@/components/Files/FilesPage')
    },
    {
      name: 'moves',
      path: '/moves',
      meta: { drawer: true, icon: 'open_with', title: 'Moves & Homming' },
      component: () => import('@/components/Moves/MovesPage')
    },
    {
      name: 'config',
      path: '/config',
      meta: { drawer: true, icon: 'settings', title: 'Board config' },
      component: () => import('@/components/Config/ConfigPage')
    },
    {
      name: 'terminal',
      path: '/terminal',
      meta: { drawer: true, icon: 'keyboard', title: 'Terminal' },
      component: () => import('@/components/Terminal/TerminalPage')
    },
    {
      name: 'about',
      path: '/about',
      meta: { drawer: true, icon: 'help', title: 'About' },
      component: () => import('@/components/About/AboutPage')
    },
    {
      name: 'error',
      path: '/error',
      meta: { drawer: false, icon: 'error', title: 'Page not found' },
      component: () => import('@/components/Error/ErrorPage')
    }
  ]
})

// before route resolve
router.beforeResolve((to, from, next) => {
  // dispatch action
  store.dispatch('page/setIcon', to.meta.icon)
  store.dispatch('page/setTitle', to.meta.title)

  // set document title
  document.title = store.getters['page/title'] + ' | ' + store.getters['app/name']

  // resolve route
  next()
})

export default router
