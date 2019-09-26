import { mount, localVue, store } from '../testHelper'
import PipelineView from '@/mixins/PipelineView'
import VueRouter from 'vue-router'

const MypipelineA = {
  name: 'MypipelineA',
  render (createElement) {
    return createElement('div', 'MypipelineA')
  }
}

const MypipelineB = {
  name: 'MypipelineB',
  render (createElement) {
    return createElement('div', 'MypipelineB')
  }
}

const Mypipeline = {
  name: 'Mypipeline',
  mixins: [PipelineView],
  props: {
    routes: {
      type: Array,
      default: () => {
        return [
          'a',
          'b'
        ]
      }
    }
  }
}

describe('PipelineView', () => {
  let wrapper, router

  beforeEach(() => {
   router = new VueRouter({
       routes: [{
        path: '/mypipeline',
        component: Mypipeline,
        children: [
          { path: '', component: MypipelineA },
          { path: 'a', component: MypipelineA },
          { path: 'b', component: MypipelineB }
        ]
      }]})

    wrapper = mount(Mypipeline, { store, router, localVue })
  })

  it('will have the correct name', () => {
    expect(wrapper.name()).toEqual('Mypipeline')
  })

  it('will have the correct class', () => {
    expect(wrapper.find('.mypipeline').exists()).toBeTruthy()
  })

  it('will have a title', () => {
    expect(wrapper.find('h4').text()).toEqual('Mypipeline')
  })

  it('will have some routes', () => {
    expect(wrapper.find('nav').findAll('a').length).toEqual(3)
  })

  describe('visiting a route', () => {

    let links

    beforeEach(() => {
      links = wrapper.find('nav').findAll('a')
    })

    describe('default', () => {

      beforeEach(() => {
        wrapper.vm.$router.push({path: '/mypipeline'})
      })

      it('will have the correct path', () => {
        expect(wrapper.vm.$route.path).toBe(`/mypipeline`)
      })

      it('will have the correct text', () => {
        expect(wrapper.find('div').text()).toMatch('MypipelineA')
      })
    })

    describe('child', () => {

      beforeEach(() => {
        links.at(2).trigger('click')
      })

      it('will have the correct path', () => {
        expect(wrapper.vm.$route.path).toBe(`/mypipeline/b`)
      })

      it('will have the correct text', () => {
        expect(wrapper.find('div').text()).toMatch('MypipelineB')
      })

    })

   

  })

})
