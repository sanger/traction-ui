import Vue from 'vue'
import Router from 'vue-router'
import Runs from './views/Runs'
import Run from '@/views/Run'
import Reception from './views/Reception'
import Samples from './views/Samples'
import Libraries from './views/Libraries'

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
      path: '/reception',
      name: 'Reception',
      component: Reception
    },
    {
      path: '/run',
      name: 'Run',
      component: Run,
      props: {id: true}
    },
    { path: '/run/:id',
      component: Run,
      props: true
    },
    {
      path: '/samples',
      name: 'Samples',
      component: Samples,
      props: true
    },
    {
      path: '/libraries',
      name: 'Libraries',
      component: Libraries,
      props: true
    }
  ]
})
