import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard'
import Saphyr from './views/Saphyr'
import SaphyrReception from './views/saphyr/SaphyrReception'
import SaphyrSamples from './views/saphyr/SaphyrSamples'
import SaphyrLibraries from './views/saphyr/SaphyrLibraries'
import SaphyrRuns from './views/saphyr/SaphyrRuns'
import SaphyrRun from './views/saphyr/SaphyrRun'
import Pacbio from './views/Pacbio'
import PacbioReception from './views/pacbio/PacbioReception'
import PacbioSamples from './views/pacbio/PacbioSamples'
import PacbioLibraries from './views/pacbio/PacbioLibraries'
import PacbioRuns from './views/pacbio/PacbioRuns'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: { name: 'Dashboard' },
      component: Dashboard
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/saphyr',
      name: 'Saphyr',
      component: Saphyr,
      children: [
        { path: 'reception', component: SaphyrReception },
        { path: 'samples', component: SaphyrSamples },
        { path: 'libraries', component: SaphyrLibraries },
        { path: 'runs', component: SaphyrRuns },
        { path: 'run', component: SaphyrRun, props: {id: true} },
        { path: 'run/:id', component: SaphyrRun, props: true }
      ]
    },
    {
      path: '/pacbio',
      name: 'Pacbio',
      component: Pacbio,
      children: [
        { path: 'reception', component: PacbioReception },
        { path: 'samples', component: PacbioSamples },
        { path: 'libraries', component: PacbioLibraries },
        { path: 'runs', component: PacbioRuns }
      ]
    }
  ]
})
