import Store from '@/store.js'
import Samples from '../data/samples'

describe('Store.js', () => {

  let store, samples

  beforeEach(() => {
    store = Store
    samples = [
      { "id": 1, "name": "DN11111", "species": "cat" },
      { "id": 2, "name": "DN11112", "species": "cat" },
      { "id": 3, "name": "DN11113", "species": "dog" }
    ]
    store.commit('addSamples', samples)
  })

  afterEach(() => {
    store.commit('clear')
  })

  it('will have some samples', () => {
    expect(store.getters.samples.length).toEqual(3)
  })

  it('#selectedSamples', () => {
    samples[1].selected = true
    samples[2].selected = true
    expect(store.getters.selectedSamples().length).toEqual(2)
  })

  describe('#selectSample', () => {
    it('selected', () => {
      store.commit('selectSample', samples[0])
      expect(store.getters.selectedSamples().length).toEqual(1)
    })

    it('deselected', () => {
      store.commit('selectSample', samples[0])
      store.commit('selectSample', samples[0])
      expect(store.getters.selectedSamples().length).toEqual(0)
    })
  })

})
