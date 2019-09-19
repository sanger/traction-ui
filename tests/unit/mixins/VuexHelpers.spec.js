import VuexHelpers from '@/mixins/VuexHelpers'
import { mount, localVue, store } from '../testHelper'

const Cmp = {
  template: '<div class="say-my-name"></div>',
  name: 'SayMyName',
  mixins: [VuexHelpers],
  props: {
  },
  methods: {
  }
}

describe('VuexHelpers', () => {
  it('works', () => {
    expect(true).toBeTruthy()
  })
})
