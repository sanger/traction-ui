import { createRouter, createWebHashHistory } from 'vue-router'
import { LoginCallback } from '@okta/okta-vue'
import { navigationGuard } from '@okta/okta-vue'
import TractionDashboard from '@/views/TractionDashboard.vue'

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
      component: () => import('@/views/GeneralReception.vue'),
    },
    {
      path: '/labwhere-reception',
      name: 'LabWhereReception',
      meta: { page: 'LabWhere Reception - Scan In/Out', requiresAuth: true },
      component: () => import('@/views/LabwhereReception.vue'),
    },
    {
      path: '/label-printing',
      name: 'LabelPrinting',
      meta: { page: 'Label Printing', requiresAuth: true },
      component: () => import('@/views/LabelPrinting.vue'),
    },
    {
      path: '/qc-results-upload',
      name: 'QcResultsUpload',
      meta: { page: 'QC Results Upload', requiresAuth: true },
      component: () => import('@/views/QcResultsUpload.vue'),
    },
    {
      path: '/sample-report',
      name: 'SampleReport',
      meta: { page: 'Sample Report', requiresAuth: true },
      component: () => import('@/views/SampleReport.vue'),
    },
    {
      path: '/flexible-pooling',
      name: 'FlexiblePoolingIndex',
      meta: { page: 'Flexible Pooling', paginated: true, requiresAuth: true },
      beforeEnter(to) {
        checkPaginationParams(to)
      },
      component: () => import('@/views/FlexiblePoolingIndex.vue'),
    },
    {
      path: '/flexible-pool/:id',
      name: 'FlexiblePool',
      component: () => import('@/views/FlexiblePoolCreate.vue'),
      meta: { page: 'FlexiblePool', requiresAuth: true },
      props: true,
    },
    {
      path: '/flexible-pool/:id/sub-pool/:position',
      name: 'FlexibleIndividualPoolCreate',
      component: () => import('@/views/FlexibleIndividualPoolCreate.vue'),
      meta: { page: 'FlexibleIndividualPoolCreate', requiresAuth: true },
      props: true,
    },
    {
      path: '/pacbio',
      component: () => import('@/views/PacbioView.vue'),
      meta: { pipeline: 'PacBio', requiresAuth: true },
      children: [
        { path: '', redirect: 'samples' },
        {
          path: 'samples',
          name: 'PacbioSampleIndex',
          component: () => import('@/views/pacbio/PacbioSampleIndex.vue'),
          meta: { page: 'Samples', paginated: true },
          beforeEnter(to) {
            checkPaginationParams(to)
          },
        },
        {
          path: 'plates',
          name: 'PacbioPlateIndex',
          component: () => import('@/views/pacbio/PacbioPlateIndex.vue'),
          meta: { page: 'Plates', paginated: true },
          beforeEnter(to) {
            checkPaginationParams(to)
          },
        },
        {
          path: 'libraries',
          name: 'PacbioLibraryIndex',
          component: () => import('@/views/pacbio/PacbioLibraryIndex.vue'),
          meta: { page: 'Libraries', paginated: true },
          beforeEnter(to) {
            checkPaginationParams(to)
          },
        },
        {
          path: 'pools',
          name: 'PacbioPoolIndex',
          component: () => import('@/views/pacbio/PacbioPoolIndex.vue'),
          meta: { page: 'Pools', paginated: true },
          beforeEnter(to) {
            checkPaginationParams(to)
          },
        },
        {
          path: 'runs',
          name: 'PacbioRunIndex',
          component: () => import('@/views/pacbio/PacbioRunIndex.vue'),
          meta: { page: 'Runs', paginated: true },
          beforeEnter(to) {
            checkPaginationParams(to)
          },
        },
        {
          path: 'run/:id',
          name: 'PacbioRunShow',
          component: () => import('@/views/pacbio/PacbioRunShow.vue'),
          meta: { page: 'Run' },
          props: true,
        },
        {
          path: 'pool/:id',
          name: 'PacbioPoolCreate',
          component: () => import('@/views/pacbio/PacbioPoolCreate.vue'),
          meta: { page: 'Pool' },
        },
        {
          path: 'library-batch',
          name: 'PacbioLibraryBatchCreate',
          description: 'Create a new library batch',
          component: () => import('@/views/pacbio/PacbioLibraryBatchCreate.vue'),
          meta: { page: 'Library Batch' },
        },
      ],
    },
    {
      path: '/ont',
      component: () => import('@/views/ONT.vue'),
      meta: { pipeline: 'ONT', requiresAuth: true },
      children: [
        {
          path: 'samples',
          name: 'ONTSampleIndex',
          component: () => import('@/views/ont/ONTSampleIndex.vue'),
          meta: { page: 'Samples', paginated: true },
          beforeEnter(to) {
            checkPaginationParams(to)
          },
        },
        {
          path: 'pool/:id',
          name: 'ONTPoolCreate',
          component: () => import('@/views/ont/ONTPoolCreate.vue'),
          props: true,
          meta: { page: 'Pool' },
        },
        {
          path: 'pools',
          name: 'ONTPoolIndex',
          component: () => import('@/views/ont/ONTPoolIndex.vue'),
          meta: { page: 'Pools', paginated: true },
          beforeEnter(to) {
            checkPaginationParams(to)
          },
        },
        {
          path: 'runs',
          name: 'ONTRunIndex',
          component: () => import('@/views/ont/ONTRunIndex.vue'),
          meta: { page: 'Runs', paginated: true },
          beforeEnter(to) {
            checkPaginationParams(to)
          },
        },
        {
          path: 'run/:id',
          name: 'ONTRunShow',
          component: () => import('@/views/ont/ONTRunShow.vue'),
          props: true,
          meta: { page: 'Run' },
        },
      ],
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/PageNotFound.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: () => ({ path: '/404' }),
    },
  ],
})

// Due to navigation guards mixin issue in vue-router-next, navigation guard logic need to be added manually
// See https://github.com/vuejs/router/issues/454
router.beforeEach(navigationGuard)

export default router
