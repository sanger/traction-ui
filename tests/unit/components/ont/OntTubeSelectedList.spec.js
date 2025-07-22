import { mount, store, nextTick } from '@support/testHelper'
import OntTubeSelectedList from '@/components/ont/OntTubeSelectedList'
import { expect } from 'vitest'
import OntTubeFactory from '@tests/factories/OntTubeFactory'

const ontTubeFactory = OntTubeFactory()

describe('OntTubeSelectedList', () => {
  let wrapper

  describe('building the table', () => {
    beforeEach(() => {
      store.state.traction.ont.pools.resources.tubes = ontTubeFactory.storeData.tubes
      store.state.traction.ont.pools.resources.requests = ontTubeFactory.storeData.requests

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
      store.state.traction.ont.pools.resources.tubes = ontTubeFactory.storeData.tubes
      store.state.traction.ont.pools.resources.requests =
        ontTubeFactory.storeData.resources.requests

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
      expect(button.element.disabled).toBe(true)
    })

    it('it has a - button', () => {
      const button = wrapper.findComponent('#del-btn-191')
      expect(button.element).toBeTruthy()
      expect(button.element.disabled).toBe(false)
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
    it('call removeTubeFromPool when the - button is clicked', async () => {
      const removeTubeFromPoolSpy = vi.spyOn(wrapper.vm, 'removeTubeFromPool')
      const button = wrapper.find('#del-btn-191')
      await button.trigger('click')

      expect(removeTubeFromPoolSpy).toHaveBeenCalledWith('191')
      removeTubeFromPoolSpy.mockRestore()
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
