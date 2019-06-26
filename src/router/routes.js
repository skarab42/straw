const routes = [
  {
    path: '/',
    component: () => import('layouts/Page.vue'),
    children: [
      { path: '', redirect: 'boards' },
      { path: 'boards', component: () => import('pages/Boards.vue') },
      { path: 'files', component: () => import('pages/Files.vue') },
      { path: 'files/*', component: () => import('pages/Files.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
