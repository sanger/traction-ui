import { mount, localVue, store } from '../testHelper'
import PipelineView from '@/mixins/PipelineView'
import VueRouter from 'vue-router'

const Cmp = {
  name: 'MyPipeline',
  mixins: [PipelineView],
  props: {
  },
  methods: {
  },
  data () {
    return {
    }
  }
}

describe('PipelineView', () => {
  let wrapper

  beforeEach(() => {
    let router = new VueRouter()

    wrapper = mount(Cmp, { store, router, localVue })
  })

  it('will have the correct name', () => {
    expect(wrapper.name()).toEqual('MyPipeline')
  })

  it('will have the correct class', () => {
    expect(wrapper.find('.mypipeline').exists()).toBeTruthy()
  })

  it('will have a title', () => {
    expect(wrapper.find('h4').text()).toEqual('MyPipeline')
  })

  it('will have some routes', () => {
    expect(wrapper.find('nav').findAll('a').length).toBeTruthy()
  })

  it('will have a description', () => {

  })

})
