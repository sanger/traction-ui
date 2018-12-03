import Store from '@/store.js'

describe('Store.js', () => {

  let store, requests, samples

  beforeEach(() => {
    store = Store
  })

  afterEach(() => {
    store.commit('clear')
  })

  describe('requests', () => {
    beforeEach(() => {
      requests = [
        { "id": 1, "name": "DN11111", "species": "cat" },
        { "id": 2, "name": "DN11112", "species": "cat" },
        { "id": 3, "name": "DN11113", "species": "dog" }
      ]
      store.commit('addRequests', requests)
    })

    it('will have some requests', () => {
      expect(store.getters.requests.length).toEqual(3)
    })

    it('will not add duplicate requests', () =>{
      requests = [
        { "id": 1, "name": "DN11111", "species": "cat" },
        { "id": 2, "name": "DN11112", "species": "cat" },
        { "id": 4, "name": "DN11114", "species": "dog" }
      ]
      store.commit('addRequests', requests)
      expect(store.getters.requests.length).toEqual(4)
    })

    describe('#selectRequest', () => {
      it('selected', () => {
        store.commit('selectRequest', requests[0])
        expect(store.getters.selectedRequests().length).toEqual(1)
      })

      it('deselected', () => {
        store.commit('selectRequest', requests[0])
        store.commit('selectRequest', requests[0])
        expect(store.getters.selectedRequests().length).toEqual(0)
      })
    })

    it('#selectedRequests', () => {
      requests[1].selected = true
      requests[2].selected = true
      expect(store.getters.selectedRequests().length).toEqual(2)
    })
  })


  describe('samples', () => {
    beforeEach(() => {
      samples = [
        { "id": 1, "name": "DN11111", "species": "cat" },
        { "id": 2, "name": "DN11112", "species": "cat" },
        { "id": 3, "name": "DN11113", "species": "dog" }
      ]
      store.commit('addSamples', samples)
    })


    it('will have some samples', () => {
      expect(store.getters.samples.length).toEqual(3)
    })  

    it('will not add duplicate samples', () =>{
      samples = [
        { "id": 1, "name": "DN11111", "species": "cat" },
        { "id": 2, "name": "DN11112", "species": "cat" },
        { "id": 4, "name": "DN11114", "species": "dog" }
      ]
      store.commit('addSamples', samples)
      expect(store.getters.samples.length).toEqual(4)
    })

    describe('#selectSamples', () => {
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

})
