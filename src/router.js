import Vue from 'vue'
import Router from 'vue-router'
import Runs from './views/Runs'
import NewRun from './views/NewRun'
import Reception from './views/Reception'
import Table from './views/Table'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: { name: 'Reception' },
      component: Reception
    },
    {
      path: '/runs',
      name: 'Runs',
      component: Runs
    },
    {
      path: '/newrun',
      name: 'NewRun',
      component: NewRun,
      props: true
    },
    {
      path: '/reception',
      name: 'Reception',
      component: Reception
    },
    {
      path: '/table',
      name: 'Table',
      component: Table,
      props: true
    }
  ]
})
