import { mount, localVue, store, Data } from '@support/testHelper'
import OntTubeSelectedList from '@/components/ont/OntTubeSelectedList'
import Response from '@/api/Response'
import { expect } from 'vitest'

describe('OntTubeSelectedList', () => {
  let wrapper, mockTubes

  describe('building the table', () => {
    beforeEach(() => {
      const responseBody = new Response(Data.OntTubesRequest)._body
      mockTubes = responseBody.data
      const mockRequests = responseBody.included
      store.commit('traction/ont/pools/populateTubes', mockTubes)
      store.commit('traction/ont/pools/populateRequests', mockRequests)

      wrapper = mount(OntTubeSelectedList, {
        localVue,
        store,
      })
    })

    it('contains the correct fields', () => {
      const headers = wrapper.findAll('th')
      for (const field of wrapper.vm.requestFields) {
        expect(headers.filter((header) => header.text() === field)).toBeDefined()
      }
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(0)
       expect(wrapper.find('[data-testid=empty-text]').text()).toEqual('No tubes selected')
    })
  })

  describe('with a selected tube', () => {
    beforeEach(() => {
      const responseBody = new Response(Data.OntTubesRequest)._body
      mockTubes = responseBody.data
      const mockRequests = responseBody.included
      store.commit('traction/ont/pools/populateTubes', mockTubes)
      store.commit('traction/ont/pools/populateRequests', mockRequests)

      const selectTube = { id: '1', selected: true }
      const selectRequest = { id: '191', selected: true }
      store.commit('traction/ont/pools/selectTube', selectTube)
      store.commit('traction/ont/pools/selectRequest', selectRequest)

      wrapper = mount(OntTubeSelectedList, {
        localVue,
        store,
      })
    })

    it('contains the selected tube requests', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
      expect(wrapper.find('tbody').findAll('td').at(0).text()).toEqual('191')
      expect(wrapper.find('tbody').findAll('td').at(1).text()).toEqual('GENSAMPLE-1668092750-191')
      expect(wrapper.find('tbody').findAll('td').at(2).text()).toEqual('GEN-1668092750-3')
      expect(wrapper.find('tbody').findAll('td').at(3).text()).toEqual('basecalls')
      expect(wrapper.find('tbody').findAll('td').at(4).text()).toEqual('ONT_PromethIon')
      expect(wrapper.find('tbody').findAll('td').at(5).text()).toEqual('1')
      expect(wrapper.find('tbody').findAll('td').at(6).text()).toEqual('Remove')
    })

    it('deselects the tube and request when the remove button is clicked', async () => {
      const dispatch = vi.fn()
      store.dispatch = dispatch
      await wrapper.vm.$nextTick()
      const button = wrapper.find('#remove-btn-191')
      button.trigger('click')
      expect(dispatch).toHaveBeenCalledWith(
        'traction/ont/pools/deselectTubeAndContents',
        'GEN-1668092750-3',
      )
    })
  })
})
