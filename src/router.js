import Vue from 'vue'
import Router from 'vue-router'

import Index from './views/Index.vue'
import Register from './views/Register.vue'
import ModifyProfile from './views/ModifyProfile.vue'

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
      component: Register
    },
    {
      path: '/modify-profile',
      name: 'ModifyProfile',
      component: () => import('./views/ModifyProfile.vue')
    },
    {
      path: '/room',
      name: 'Room',
      component: () => import('./views/Room.vue')
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('./views/About.vue')
    // }
  ]
})
