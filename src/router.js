import { createRouter, createWebHashHistory } from 'vue-router'
import { LoginCallback } from '@okta/okta-vue'
import { navigationGuard } from '@okta/okta-vue'
import { checkFeatureFlag } from '@/api/featureFlag.js'
import TractionDashboard from '@/views/TractionDashboard.vue'
import GeneralReception from '@/views/GeneralReception.vue'
import LabelPrinting from '@/views/LabelPrinting.vue'
import QcResultsUpload from '@/views/QcResultsUpload.vue'
import LabwhereReception from '@/views/LabwhereReception.vue'
import SampleReport from '@/views/SampleReport.vue'
import PageNotFound from '@/views/PageNotFound.vue'
import FlexiblePoolCreate from '@/views/FlexiblePoolCreate.vue'
import PacbioView from '@/views/PacbioView.vue'
import PacbioPlateIndex from '@/views/pacbio/PacbioPlateIndex.vue'
import PacbioSampleIndex from '@/views/pacbio/PacbioSampleIndex.vue'
import PacbioLibraryIndex from '@/views/pacbio/PacbioLibraryIndex.vue'
import PacbioPoolIndex from '@/views/pacbio/PacbioPoolIndex.vue'
import PacbioRunIndex from '@/views/pacbio/PacbioRunIndex.vue'
import PacbioRunShow from '@/views/pacbio/PacbioRunShow.vue'
import PacbioPoolCreate from '@/views/pacbio/PacbioPoolCreate.vue'
import PacbioLibraryBatchCreate from '@/views/pacbio/PacbioLibraryBatchCreate.vue'
import ONT from '@/views/ONT.vue'
import ONTPoolCreate from '@/views/ont/ONTPoolCreate.vue'
import ONTPoolIndex from '@/views/ont/ONTPoolIndex.vue'
import ONTRunIndex from '@/views/ont/ONTRunIndex.vue'
import ONTRunShow from '@/views/ont/ONTRunShow.vue'
import ONTSampleIndex from '@/views/ont/ONTSampleIndex.vue'
import FlexiblePoolingIndex from '@/views/FlexiblePoolingIndex.vue'
import FlexibleIndividualPoolCreate from '@/views/FlexibleIndividualPoolCreate.vue'

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
      path: '/login-callback',
      component: LoginCallback,
    },
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
      meta: { pipeline: 'Reception', requiresAuth: true },
      component: GeneralReception,
    },
    {
      path: '/labwhere-reception',
      name: 'LabWhereReception',
      meta: { page: 'LabWhere Reception - Scan In/Out', requiresAuth: true },
      component: LabwhereReception,
    },
    {
      path: '/label-printing',
      name: 'LabelPrinting',
      meta: { page: 'Label Printing', requiresAuth: true },
      component: LabelPrinting,
    },
    {
      path: '/qc-results-upload',
      name: 'QcResultsUpload',
      meta: { page: 'QC Results Upload', requiresAuth: true },
      component: QcResultsUpload,
    },
    {
      path: '/sample-report',
      name: 'SampleReport',
      meta: { page: 'Sample Report', requiresAuth: true },
      component: SampleReport,
    },
    {
      path: '/flexible-pooling',
      name: 'FlexiblePoolingIndex',
      meta: { page: 'Flexible Pooling', paginated: true, requiresAuth: true },
      beforeEnter(to) {
        checkPaginationParams(to)
      },
      component: FlexiblePoolingIndex,
    },
    {
      path: '/flexible-pool/:id',
      name: 'FlexiblePool',
      component: FlexiblePoolCreate,
      meta: { page: 'FlexiblePool', requiresAuth: true },
      props: true,
    },
    {
      path: '/flexible-pool/:id/sub-pool/:position',
      name: 'FlexibleIndividualPoolCreate',
      component: FlexibleIndividualPoolCreate,
      meta: { page: 'FlexibleIndividualPoolCreate', requiresAuth: true },
      props: true,
    },
    {
      path: '/pacbio',
      component: PacbioView,
      meta: { pipeline: 'PacBio', requiresAuth: true },
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
          meta: { page: 'Run' },
          props: true,
        },
        {
          path: 'pool/:id',
          name: 'PacbioPoolCreate',
          component: PacbioPoolCreate,
          meta: { page: 'Pool' },
        },
        {
          path: 'library-batch',
          name: 'PacbioLibraryBatchCreate',
          description: 'Create a new library batch',
          component: PacbioLibraryBatchCreate,
          meta: { page: 'Library Batch' },
        },
      ],
    },
    {
      path: '/ont',
      component: ONT,
      meta: { pipeline: 'ONT', requiresAuth: true },
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
          name: 'ONTRunShow',
          component: ONTRunShow,
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
      redirect: () => ({ path: '/404' }),
    },
  ],
})

const flaggedNavigationGuard = async (guard) => {
  const flagged = await checkFeatureFlag('Y26-111-user-auth')
  if (flagged) {
    return navigationGuard(guard)
  }
}

// Due to navigation guards mixin issue in vue-router-next, navigation guard logic need to be added manually
// See https://github.com/vuejs/router/issues/454
router.beforeEach(flaggedNavigationGuard)

export default router
