import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from './views/Dashboard'
import PageNotFound from './views/PageNotFound'
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
import PacbioRun from './views/pacbio/PacbioRun'
import ONT from './views/ONT'
import OntPlates from './views/ont/OntPlates'
import ONTHeronRun from './views/ont/ONTHeronRun'
import OntHeronRuns from './views/ont/OntHeronRuns'

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
      component: Saphyr,
      children: [
        { path: '', redirect: 'reception'},
        { path: 'reception', name: 'SaphyrReception', component: SaphyrReception },
        { path: 'samples', name: 'SaphyrSamples', component: SaphyrSamples },
        { path: 'libraries', name: 'SaphyrLibraries', component: SaphyrLibraries },
        { path: 'runs', name: 'SaphyrRuns', component: SaphyrRuns },
        { path: 'run', name: 'SaphyrRun', component: SaphyrRun, props: {id: true} },
        { path: 'run/:id', component: SaphyrRun, props: true },
      ]
    },
    {
      path: '/pacbio',
      component: Pacbio,
      children: [
        { path: '', redirect: 'reception'},
        { path: 'reception', name: 'PacbioReception', component: PacbioReception },
        { path: 'samples', name: 'PacbioSamples', component: PacbioSamples },
        { path: 'libraries', name: 'PacbioLibraries', component: PacbioLibraries },
        { path: 'runs', name: 'PacbioRuns', component: PacbioRuns },
        { path: 'run/:id', name: 'PacbioRun', component: PacbioRun, props: true},
      ]
    },
    {
      path: '/ont',
      component: ONT,
      children: [
        { path: 'plates', name: 'OntPlates', component: OntPlates },
        { path: 'runs', name: 'HeronRuns', component: OntHeronRuns },
        { path: 'run/new', name: 'ONTHeronRun', component: ONTHeronRun },
      ]
    },
    {
      path: '/404',
      name: '404',
      component: PageNotFound
    },
    {
      path: '*',
      redirect: { name: '404'}
    }
  ]
})
