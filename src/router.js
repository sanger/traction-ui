import Vue from 'vue'
import Router from 'vue-router'
import Runs from './views/Runs'
import NewRun from './views/NewRun'
import ScanBarcodes from './views/ScanBarcodes'
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
      path: '/newrun',
      name: 'NewRun',
      component: NewRun,
      props: true
    },
    {
      path: '/scanbarcodes',
      name: 'ScanBarcodes',
      component: ScanBarcodes
    },
    {
      path: '/table',
      name: 'Table',
      component: Table,
      props: true
    }
  ]
})
