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
      meta: { pipeline: 'Dashboard' },
      component: Dashboard,
    },
    {
      path: '/saphyr',
      component: Saphyr,
      meta: { pipeline: 'Saphyr' },
      children: [
        { path: '', redirect: 'reception', meta: { page: 'Reception' } },
        {
          path: 'reception',
          name: 'SaphyrReception',
          component: SaphyrReception,
          meta: { page: 'Reception' },
        },
        {
          path: 'samples',
          name: 'SaphyrSamples',
          component: SaphyrSamples,
          meta: { page: 'Samples' },
        },
        {
          path: 'libraries',
          name: 'SaphyrLibraries',
          component: SaphyrLibraries,
          meta: { page: 'Libraries' },
        },
        { path: 'runs', name: 'SaphyrRuns', component: SaphyrRuns, meta: { page: 'Runs' } },
        {
          path: 'run',
          name: 'SaphyrRun',
          component: SaphyrRun,
          props: { id: true },
          meta: { page: 'Run' },
        },
        { path: 'run/:id', component: SaphyrRun, props: true, meta: { page: 'Run' } },
      ],
    },
    {
      path: '/pacbio',
      component: Pacbio,
      meta: { pipeline: 'PacBio' },
      children: [
        { path: '', redirect: 'reception' },
        {
          path: 'reception',
          name: 'PacbioReceptionTube',
          component: PacbioReceptionTube,
          meta: { page: 'Tube Reception' },
        },
        {
          path: 'samples',
          name: 'PacbioSampleIndex',
          component: PacbioSampleIndex,
          meta: { page: 'Samples' },
        },
        {
          path: 'plates',
          name: 'PacbioPlateIndex',
          component: PacbioPlateIndex,
          meta: { page: 'Plates' },
        },
        {
          path: 'libraries',
          name: 'PacbioLibraryIndex',
          component: PacbioLibraryIndex,
          meta: { page: 'Libraries' },
        },
        {
          path: 'pools',
          name: 'PacbioPoolIndex',
          component: PacbioPoolIndex,
          meta: { page: 'Pools' },
        },
        {
          path: 'runs',
          name: 'PacbioRunIndex',
          component: PacbioRunIndex,
          meta: { page: 'Runs' },
        },
        {
          path: 'run/:id',
          name: 'PacbioRunShow',
          component: PacbioRunShow,
          props: true,
          meta: { page: 'Run' },
        },
        {
          path: 'plate-reception',
          name: 'PacbioPlateReception',
          component: PacbioReceptionPlate,
          meta: { page: 'Plate Reception' },
        },
        {
          path: 'pool/:id',
          name: 'PacbioPoolCreate',
          component: PacbioPoolCreate,
          props: true,
          meta: { page: 'Pool' },
        },
      ],
    },
    {
      path: '/ont',
      component: ONT,
      meta: { pipeline: 'ONT' },
      children: [
        { path: '', redirect: 'reception', meta: { page: 'Reception' } },
        {
          path: 'reception',
          name: 'OntReception',
          component: OntReception,
          meta: { page: 'Reception' },
        },
        { path: 'plates', name: 'OntPlates', component: OntPlates, meta: { page: 'Plates' } },
        {
          path: 'libraries',
          name: 'OntLibraries',
          component: OntLibraries,
          meta: { page: 'Libraries' },
        },
        {
          path: 'runs',
          name: 'OntHeronRuns',
          component: OntHeronRuns,
          meta: { page: 'Runs' },
        },
        {
          path: 'run/:id',
          name: 'OntHeronRun',
          component: OntHeronRun,
          props: true,
          meta: { page: 'Run' },
        },
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
