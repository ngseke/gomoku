import Vue from 'vue'
import Router from 'vue-router'

import Index from './views/Index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('./views/Register.vue')
    },
    {
      path: '/modify-profile',
      name: 'ModifyProfile',
      component: () => import('./views/ModifyProfile.vue')
    },
    {
      path: '/room/:id',
      name: 'Room',
      component: () => import('./views/Room.vue')
    },
    {
      path: '/**',
      component: Index
    },
  ]
})
