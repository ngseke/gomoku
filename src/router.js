import Vue from 'vue'
import Router from 'vue-router'

import Index from './views/Index.vue'
import Register from './views/Register.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/reg',
      name: 'Register',
      component: Register
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: () => import('./views/About.vue')
    // }
  ]
})
