// TODO: routes are not tested so cause errors on start
import Router from 'vue-router'
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
import ONTRuns from '@/views/ont/ONTRuns'
import ONTRun from '@/views/ont/ONTRun'
import ONTSampleIndex from '@/views/ont/ONTSampleIndex'

export default new Router({
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
          meta: { page: 'Samples' },
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
          meta: { page: 'Pools' },
        },
        {
          path: 'runs',
          name: 'ONTRuns',
          component: ONTRuns,
          meta: { page: 'Runs' },
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
      path: '*',
      redirect: { name: '404' },
    },
  ],
})
