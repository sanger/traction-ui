import ApiMixin from '@/mixins/Api'
import build from '@/api/ApiBuilder'
import Config from '@/api/Config'
import { mount, localVue, store } from '../testHelper'

const Cmp = {
  template: '<div class="say-my-name"></div>',
  name: 'SayMyName',
  mixins: [ApiMixin],
  props: {
  },
  methods: {
  }
}

describe('Api', () => {

  let wrapper, cmp, api

  beforeEach(() => {
    api = build(Config, process.env)
    wrapper = mount(Cmp, {store, localVue})
    cmp = wrapper.vm
  })

  it('should have the api', () => {
    expect(Object.keys(cmp.api)).toEqual(Object.keys(api))
  })

})
