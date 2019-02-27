import Vue from 'vue'
import Router from 'vue-router'
import Reception from './views/Reception'
import Samples from './views/Samples'
import Libraries from './views/Libraries'
import Runs from './views/Runs'
import NewRun from './views/NewRun'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: { name: 'Samples' },
      component: Samples
    },
    {
      path: '/reception',
      name: 'Reception',
      component: Reception
    },
    {
      path: '/samples',
      name: 'Samples',
      component: Samples
    },
    {
      path: '/libraries',
      name: 'Libraries',
      component: Libraries
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
    }
  ]
})
