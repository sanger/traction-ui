import { mount, localVue, store, Data } from '@support/testHelper'
import PacbioTubeSelectedList from '@/components/pacbio/PacbioTubeSelectedList'
import Response from '@/api/Response'
import { expect } from 'vitest'

describe('PacbioTubeSelectedList', () => {
  let wrapper, mockTubes

  describe('building the table', () => {
    beforeEach(() => {
      const responseBody = new Response(Data.PacbioTubesRequest)._body
      mockTubes = responseBody.data
      const mockRequests = responseBody.included
      store.commit('traction/pacbio/poolCreate/populateTubes', mockTubes)
      store.commit('traction/pacbio/poolCreate/populateRequests', mockRequests)

      wrapper = mount(PacbioTubeSelectedList, {
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
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
      expect(wrapper.find('.b-table-empty-row').text()).toEqual('No tubes selected')
    })
  })

  describe('with a selected tube', () => {
    beforeEach(() => {
      const responseBody = new Response(Data.PacbioTubesRequest)._body
      mockTubes = responseBody.data
      const mockRequests = responseBody.included

      store.commit('traction/pacbio/poolCreate/populateTubes', mockTubes)
      store.commit('traction/pacbio/poolCreate/populateRequests', mockRequests)

      const selectTube = { id: '1', selected: true }
      const selectRequest = { id: '241', selected: true }
      store.commit('traction/pacbio/poolCreate/selectTube', selectTube)
      store.commit('traction/pacbio/poolCreate/selectRequest', selectRequest)

      wrapper = mount(PacbioTubeSelectedList, {
        localVue,
        store,
      })
    })

    it('contains the selected tube requests', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
      expect(wrapper.find('tbody').findAll('td').at(0).text()).toEqual('GEN-1680611780-6')
      expect(wrapper.find('tbody').findAll('td').at(1).text()).toEqual('human')
      expect(wrapper.find('tbody').findAll('td').at(2).text()).toEqual('PacBio_Ultra_Low_Input')
      expect(wrapper.find('tbody').findAll('td').at(3).text()).toEqual('3')
      expect(wrapper.find('tbody').findAll('td').at(4).text()).toEqual('100')
      expect(wrapper.find('tbody').findAll('td').at(5).text()).toEqual('Remove')
    })

    it('deselects the tube and request when the remove button is clicked', async () => {
      const dispatch = vi.fn()
      store.dispatch = dispatch
      const button = wrapper.find('#remove-btn-241')
      await button.trigger('click')
      expect(dispatch).toHaveBeenCalledWith(
        'traction/pacbio/poolCreate/deselectTubeAndContents',
        'GEN-1680611780-6',
      )
    })
  })
})
