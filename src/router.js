import Vue from 'vue'
import Router from 'vue-router'
import Reception from './views/Reception'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {name: 'Reception'},
      component: Reception
},
    {
      path: '/reception',
      name: 'Reception',
      component: Reception
    }
  ]
})
