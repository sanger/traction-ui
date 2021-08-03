// TODO: routes are not tested so cause errors on start
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
import PacbioReceptionTube from './views/pacbio/PacbioReceptionTube'
import PacbioPlateIndex from './views/pacbio/PacbioPlateIndex'
import PacbioSampleIndex from './views/pacbio/PacbioSampleIndex'
import PacbioLibraryIndex from './views/pacbio/PacbioLibraryIndex'
import PacbioPoolIndex from './views/pacbio/PacbioPoolIndex'
import PacbioRunIndex from './views/pacbio/PacbioRunIndex'
import PacbioRunShow from './views/pacbio/PacbioRunShow'
import ONT from './views/ONT'
import OntReception from './views/ont/OntReception'
import OntPlates from './views/ont/OntPlates'
import OntLibraries from './views/ont/OntLibraries'
import OntHeronRun from './views/ont/OntHeronRun'
import OntHeronRuns from './views/ont/OntHeronRuns'
import PacbioReceptionPlate from './views/pacbio/PacbioReceptionPlate'
import PacbioPoolCreate from './views/pacbio/PacbioPoolCreate'

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
        { path: 'reception', name: 'PacbioReceptionTube', component: PacbioReceptionTube },
        { path: 'samples', name: 'PacbioSampleIndex', component: PacbioSampleIndex },
        { path: 'plates', name: 'PacbioPlateIndex', component: PacbioPlateIndex },
        { path: 'libraries', name: 'PacbioLibraryIndex', component: PacbioLibraryIndex },
        { path: 'pools', name: 'PacbioPoolIndex', component: PacbioPoolIndex },
        { path: 'runs', name: 'PacbioRunIndex', component: PacbioRunIndex },
        { path: 'run/:id', name: 'PacbioRunShow', component: PacbioRunShow, props: true },
        { path: 'plate-reception', name: 'PacbioPlateReception', component: PacbioReceptionPlate },
        { path: 'pool/:id', name: 'PacbioPoolCreate', component: PacbioPoolCreate, props: true },
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
