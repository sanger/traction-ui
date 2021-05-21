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
import OntReception from './views/ont/OntReception'
import OntPlates from './views/ont/OntPlates'
import OntLibraries from './views/ont/OntLibraries'
import OntHeronRun from './views/ont/OntHeronRun'
import OntHeronRuns from './views/ont/OntHeronRuns'
import PacbioPlateReception from './views/pacbio/PacbioPlateReception'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: { name: 'Dashboard' },
      component: Dashboard,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/saphyr',
      component: Saphyr,
      children: [
        { path: '', redirect: 'reception' },
        { path: 'reception', name: 'SaphyrReception', component: SaphyrReception },
        { path: 'samples', name: 'SaphyrSamples', component: SaphyrSamples },
        { path: 'libraries', name: 'SaphyrLibraries', component: SaphyrLibraries },
        { path: 'runs', name: 'SaphyrRuns', component: SaphyrRuns },
        { path: 'run', name: 'SaphyrRun', component: SaphyrRun, props: { id: true } },
        { path: 'run/:id', component: SaphyrRun, props: true },
      ],
    },
    {
      path: '/pacbio',
      component: Pacbio,
      children: [
        { path: '', redirect: 'reception' },
        { path: 'reception', name: 'PacbioReception', component: PacbioReception },
        { path: 'samples', name: 'PacbioSamples', component: PacbioSamples },
        { path: 'libraries', name: 'PacbioLibraries', component: PacbioLibraries },
        { path: 'runs', name: 'PacbioRuns', component: PacbioRuns },
        { path: 'run/:id', name: 'PacbioRun', component: PacbioRun, props: true },
        { path: 'plate-reception', name: 'PacbioPlateReception', component: PacbioPlateReception },
      ],
    },
    {
      path: '/ont',
      component: ONT,
      children: [
        { path: '', redirect: 'reception' },
        { path: 'reception', name: 'OntReception', component: OntReception },
        { path: 'plates', name: 'OntPlates', component: OntPlates },
        { path: 'libraries', name: 'OntLibraries', component: OntLibraries },
        { path: 'runs', name: 'OntHeronRuns', component: OntHeronRuns },
        { path: 'run/:id', name: 'OntHeronRun', component: OntHeronRun, props: true },
      ],
    },
    {
      path: '/404',
      name: '404',
      component: PageNotFound,
    },
    {
      path: '*',
      redirect: { name: '404' },
    },
  ],
})
