import Vue from 'vue'
import Router from 'vue-router'
import Runs from './views/Runs'
import ScanBarcodes from './views/ScanBarcodes'
import Run from '@/views/Run'
import Table from './views/Table'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: { name: 'ScanBarcodes' },
      component: ScanBarcodes
    },
    {
      path: '/runs',
      name: 'Runs',
      component: Runs
    },
    {
      path: '/scanbarcodes',
      name: 'ScanBarcodes',
      component: ScanBarcodes
    },
    {
      path: '/run',
      name: 'Run',
      component: Run,
      props: true
    },
    { path: '/run/:run',
      component: Run,
      props: true
    },
    {
      path: '/table',
      name: 'Table',
      component: Table,
      props: true
    }
  ]
})
