import { nextTick, mountWithStore } from '@support/testHelper.js'
import OntTubeSelectedList from '@/components/ont/OntTubeSelectedList.vue'
import { expect } from 'vitest'
import OntTubeFactory from '@tests/factories/OntTubeFactory.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'

const ontTubeFactory = OntTubeFactory()

describe('OntTubeSelectedList', () => {
  let wrapper, store

  beforeEach(() => {
    ;({ wrapper, store } = mountWithStore(OntTubeSelectedList, {
      initialState: {
        ontPoolCreate: {
          resources: {
            tubes: ontTubeFactory.storeData.tubes,
            requests: ontTubeFactory.storeData.resources.requests,
          },
        },
      },
      createStore: () => useOntPoolCreateStore(),
    }))
  })

  describe('building the table', () => {
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
      store.selectTube('1')
      store.selectRequest('191')
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
      const button = wrapper.find('#del-btn-191')
      await button.trigger('click')
      expect(store.pooling.libraries).toEqual({})
    })
    it('deselects the tube and request when the remove button is clicked', async () => {
      const button = wrapper.find('#remove-btn-191')
      button.trigger('click')
      await nextTick()
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(0)
    })
  })
})
