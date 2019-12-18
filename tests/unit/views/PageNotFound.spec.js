import PageNotFound from '@/views/PageNotFound'
import Pacbio from '@/views/Pacbio'
import Saphyr from '@/views/Saphyr'
import SaphyrRuns from '@/views/saphyr/SaphyrRuns'
import PacbioRuns from '@/views/pacbio/PacbioRuns'
import Dashboard from '@/views/Dashboard'
import { mount, localVue, store } from '../testHelper'
import VueRouter from 'vue-router'

describe('PageNotFound.vue', () => {

  let wrapper, router, box

  beforeEach(() => {
   router = new VueRouter({ routes: [
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/saphyr',
        component: Saphyr,
        children: 
            { path: 'runs', name: 'SaphyrRuns', component: SaphyrRuns },
    },
    {
        path: '/pacbio',
        component: Pacbio,
        children:
            { path: 'runs', name: 'PacbioRuns', component: PacbioRuns },
    },
    ]
    })
    wrapper = mount(PageNotFound, { router, localVue,
      store }
    )
    box = wrapper.find('PageNotFound')
    console.log(box)

  })



  it('will have page not found text', () => {
    box.find('#backToDashboard').trigger('click')
    expect(wrapper.vm.$route.path).toBe('/')
  })
  it('will have page not found text', () => {
    box.find('#backToPacbioRuns').trigger('click')
    expect(wrapper.vm.$route.path).toBe('/pacbio/runs')
  })
  
})