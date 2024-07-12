import { mount, store, Data, nextTick } from '@support/testHelper'
import OntTubeSelectedList from '@/components/ont/OntTubeSelectedList'
import Response from '@/api/v1/Response'
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
        store,
      })
    })

    it('contains the selected tube requests', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
      expect(wrapper.find('tbody').findAll('td')[0].text()).toEqual('191')
      expect(wrapper.find('tbody').findAll('td')[1].text()).toEqual('GENSAMPLE-1668092750-191')
      expect(wrapper.find('tbody').findAll('td')[2].text()).toEqual('GEN-1668092750-3')
      expect(wrapper.find('tbody').findAll('td')[3].text()).toEqual('basecalls')
      expect(wrapper.find('tbody').findAll('td')[4].text()).toEqual('ONT_PromethIon')
      expect(wrapper.find('tbody').findAll('td')[5].text()).toEqual('1')
    })

    it('it has a + button', () => {
      const button = wrapper.findComponent('#add-btn-191')
      expect(button.element).toBeTruthy()
      expect(button.element.disabled).toBe(false)
    })

    it('it has a - button', () => {
      const button = wrapper.findComponent('#del-btn-191')
      expect(button.element).toBeTruthy()
      expect(button.element.disabled).toBe(true)
    })

    it('it has a Remove button', () => {
      const button = wrapper.findComponent('#remove-btn-191')
      expect(button.element).toBeTruthy()
      expect(button.element.disabled).toBe(false)
    })

    it('disable + button, enable - button after + is clicked', async () => {
      const add_button = wrapper.find('#add-btn-191')
      const del_button = wrapper.find('#del-btn-191')
      expect(add_button.element).toBeTruthy()
      expect(del_button.element).toBeTruthy()
      await add_button.trigger('click')
      expect(add_button.element.disabled).toBe(true)
      expect(del_button.element.disabled).toBe(false)
    })

    it('call addTubeToPool when the + button is clicked', async () => {
      const addTubeToPoolSpy = vi.spyOn(wrapper.vm, 'addTubeToPool')
      const button = wrapper.find('#add-btn-191')
      await button.trigger('click')

      expect(addTubeToPoolSpy).toHaveBeenCalledWith('191')
      expect(wrapper.vm.disabledButtons[191]).toBe(true)
      addTubeToPoolSpy.mockRestore()
    }),

    it('deselects the tube and request when the remove button is clicked', async () => {
      const dispatch = vi.fn()
      store.dispatch = dispatch
      await nextTick()
      const button = wrapper.find('#remove-btn-191')
      button.trigger('click')
      expect(dispatch).toHaveBeenCalledWith(
        'traction/ont/pools/deselectTubeAndContents',
        'GEN-1668092750-3',
      )
    })
  })
})
