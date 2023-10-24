// TODO: routes are not tested so cause errors on start
import { createRouter, createWebHashHistory } from 'vue-router'
import TractionDashboard from '@/views/TractionDashboard'
import GeneralReception from '@/views/GeneralReception'
import LabelPrinting from '@/views/LabelPrinting'
import QcResultsUpload from '@/views/QcResultsUpload'
import PageNotFound from '@/views/PageNotFound'
import SaphyrView from '@/views/SaphyrView'
import SaphyrSamples from '@/views/saphyr/SaphyrSamples'
import SaphyrLibraries from '@/views/saphyr/SaphyrLibraries'
import SaphyrRuns from '@/views/saphyr/SaphyrRuns'
import SaphyrRun from '@/views/saphyr/SaphyrRun'
import PacbioView from '@/views/PacbioView'
import PacbioPlateIndex from '@/views/pacbio/PacbioPlateIndex'
import PacbioSampleIndex from '@/views/pacbio/PacbioSampleIndex'
import PacbioLibraryIndex from '@/views/pacbio/PacbioLibraryIndex'
import PacbioPoolIndex from '@/views/pacbio/PacbioPoolIndex'
import PacbioRunIndex from '@/views/pacbio/PacbioRunIndex'
import PacbioRunShow from '@/views/pacbio/PacbioRunShow'
import PacbioPoolCreate from '@/views/pacbio/PacbioPoolCreate'
import ONT from '@/views/ONT'
import ONTPoolCreate from '@/views/ont/ONTPoolCreate'
import ONTPoolIndex from '@/views/ont/ONTPoolIndex'
import ONTRunIndex from '@/views/ont/ONTRunIndex'
import ONTRun from '@/views/ont/ONTRun'
import ONTSampleIndex from '@/views/ont/ONTSampleIndex'

// This function gets or sets the query param defaults on the route being navigated 'to'
// This ensures DataFetcher has the correct query params when fetching initial data on page load
function checkPaginationParams(to) {
  Object.prototype.hasOwnProperty.call(to.query, 'page_size') ? '' : (to.query.page_size = 25)
  Object.prototype.hasOwnProperty.call(to.query, 'page_number') ? '' : (to.query.page_number = 1)
  Object.prototype.hasOwnProperty.call(to.query, 'page_count') ? '' : (to.query.page_count = 1)
}

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: { name: 'Dashboard' },
      component: TractionDashboard,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      meta: { pipeline: 'Dashboard' },
      component: TractionDashboard,
    },
    {
      path: '/reception',
      name: 'Reception',
      meta: { pipeline: 'Reception' },
      component: GeneralReception,
    },
    {
      path: '/label-printing',
      name: 'LabelPrinting',
      meta: { page: 'Label Printing' },
      component: LabelPrinting,
    },
    {
      path: '/qc-results-upload',
      name: 'QcResultsUpload',
      meta: { page: 'QC Results Upload' },
      component: QcResultsUpload,
    },
    {
      path: '/saphyr',
      component: SaphyrView,
      meta: { pipeline: 'Saphyr' },
      children: [
        { path: '', redirect: 'samples', meta: { page: 'Samples' } },
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
      component: PacbioView,
      meta: { pipeline: 'PacBio' },
      children: [
        { path: '', redirect: 'samples' },
        {
          path: 'samples',
          name: 'PacbioSampleIndex',
          component: PacbioSampleIndex,
          meta: { page: 'Samples', paginated: true },
          beforeEnter(to) {
            checkPaginationParams(to)
          },
        },
        {
          path: 'plates',
          name: 'PacbioPlateIndex',
          component: PacbioPlateIndex,
          meta: { page: 'Plates', paginated: true },
          beforeEnter(to) {
            checkPaginationParams(to)
          },
        },
        {
          path: 'libraries',
          name: 'PacbioLibraryIndex',
          component: PacbioLibraryIndex,
          meta: { page: 'Libraries', paginated: true },
          beforeEnter(to) {
            checkPaginationParams(to)
          },
        },
        {
          path: 'pools',
          name: 'PacbioPoolIndex',
          component: PacbioPoolIndex,
          meta: { page: 'Pools', paginated: true },
          beforeEnter(to) {
            checkPaginationParams(to)
          },
        },
        {
          path: 'runs',
          name: 'PacbioRunIndex',
          component: PacbioRunIndex,
          meta: { page: 'Runs', paginated: true },
          beforeEnter(to) {
            checkPaginationParams(to)
          },
        },
        {
          path: 'run/:id',
          name: 'PacbioRunShow',
          component: PacbioRunShow,
          props: true,
          meta: { page: 'Run' },
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
        {
          path: 'samples',
          name: 'ONTSampleIndex',
          component: ONTSampleIndex,
          meta: { page: 'Samples', paginated: true },
          beforeEnter(to) {
            checkPaginationParams(to)
          },
        },
        {
          path: 'pool/:id',
          name: 'ONTPoolCreate',
          component: ONTPoolCreate,
          props: true,
          meta: { page: 'Pool' },
        },
        {
          path: 'pools',
          name: 'ONTPoolIndex',
          component: ONTPoolIndex,
          meta: { page: 'Pools', paginated: true },
          beforeEnter(to) {
            checkPaginationParams(to)
          },
        },
        {
          path: 'runs',
          name: 'ONTRunIndex',
          component: ONTRunIndex,
          meta: { page: 'Runs', paginated: true },
          beforeEnter(to) {
            checkPaginationParams(to)
          },
        },
        {
          path: 'run/:id',
          name: 'ONTRun',
          component: ONTRun,
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
      path: '/:pathMatch(.*)*',
      redirect: { name: '404' },
    },
  ],
})

export default router
