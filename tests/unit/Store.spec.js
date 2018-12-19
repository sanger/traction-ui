import Store from '@/store.js'
import axios from 'axios'
import flushPromises from 'flush-promises'

jest.mock('axios')

describe.skip('Store.js', () => {

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

  describe('actions', () => {
    it('#get', async () => {
      let response = {status: 200, data: { data: [
        {id: 1, attributes: {name: 'sample1', species: 'dog'}},
        {id: 2, attributes: {name: 'sample1', species: 'cat'}}
      ]}}
      axios.get.mockResolvedValue(response)
      store.dispatch('get')
      await flushPromises()
      expect(store.getters.requests.length).toEqual(2)
    })

    it('#post', async () => {
      let data = { data: { attributes: { samples: [{ id: 1, name: 'sample1', species: 'dog'}] }}}
      let response = {status: 200, data: { data: [{id: 1, attributes: {name: 'sample1', species: 'dog'}}]}}
      axios.post.mockResolvedValue(response)
      store.dispatch('post', data)
      await flushPromises()
      let headers = {'Content-Type': 'application/vnd.api+json', 'Accept': 'application/vnd.api+json'}
      expect(axios.post).toBeCalledWith('http://example.com/api/v1', data, { headers: headers })
    })

    it('#patch', async () => {
      let data = { data: { attributes: { requests: [{ id: 1, name: 'sample1', species: 'dog'}] }}}
      let response = {status: 200, data: { data: [{id: 1, attributes: {name: 'sample1', species: 'dog'}}]}}
      axios.patch.mockResolvedValue(response)
      store.dispatch('patch', data)
      await flushPromises()
      let headers = {'Content-Type': 'application/vnd.api+json', 'Accept': 'application/vnd.api+json'}
      expect(axios.patch).toBeCalledWith('http://example.com/api/v1', data, { headers: headers })
    })
  })

})
