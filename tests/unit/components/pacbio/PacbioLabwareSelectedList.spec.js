import { mountWithStore } from '@support/testHelper.js'
import PacbioLabwareSelectedList from '@/components/pacbio/PacbioLabwareSelectedList.vue'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import PacbioTubeWell from '@/components/labware/PacbioTubeWell.vue'
import PacbioTubeFactory from '@tests/factories/PacbioTubeFactory.js'
import PacbioPlateFactory from '@tests/factories/PacbioPlateFactory.js'

const pacbioPlateFactory = PacbioPlateFactory()

/**
 * Helper method for mounting a component with a mock instance of pinia, with the given props.
 * This method also returns the wrapper and the store object for further testing.
 *
 * @param {*} - params to be passed to the createTestingPinia method for creating a mock instance of pinia
 * which includes
 * state - initial state of the store
 * stubActions - boolean to stub actions or not.
 * plugins - plugins to be used while creating the mock instance of pinia.
 */
const mountPacbioLabwareSelected = ({ state = {}, props } = {}) =>
  mountWithStore(PacbioLabwareSelectedList, {
    initialState: {
      pacbioPoolCreate: state,
    },
    props,
    createStore: () => usePacbioPoolCreateStore(),
  })

const pacbioTubeFactory = PacbioTubeFactory({ transformTubes: true })

// These tests are brittle and rely on testing the actual data.
// They are all passing as I referred to data in the tube factory/
describe('PacbioLabwareSelectedList', () => {
  let wrapper, store

  const { plates, wells, requests: plateRequests } = pacbioPlateFactory.storeData.resources
  const { tubes, requests } = pacbioTubeFactory.storeData

  it('should not display any labware when there is no labware', () => {
    ;({ wrapper, store } = mountPacbioLabwareSelected({
      props: {
        labware: [],
      },
    }))
    const label = wrapper.find('[data-attribute="warning-label"]')
    expect(label.text()).toBe('Please scan labware to view the samples')
  })

  describe('when mounted with Plate', () => {
    beforeEach(() => {
      const labware = [
        {
          type: 'plates',
          barcode: 'GEN-1680611780-1',
        },
      ]
      ;({ wrapper, store } = mountPacbioLabwareSelected({
        state: {
          selected: {
            plates: {
              1: { id: '1' },
            },
          },
          resources: {
            plates,
            wells,
          },
        },
        props: {
          labware,
        },
      }))
    })
    it('should display the plate labware', () => {
      const items = wrapper.findAll('[data-type="selected-labware-item"]')
      expect(items.length).toBe(1)
      expect(wrapper.find('[data-attribute=labware-name]').text()).toContain('GEN-1680611780-1')
    })
    it('should emit closed event when remove button is clicked', async () => {
      store.deselectPlateAndContents = vi.fn()
      const button = wrapper.find('#remove-btn-1')
      await button.trigger('click')
      expect(wrapper.emitted().closed).toBeTruthy()
    })
    describe('Plate@onSelect', () => {
      beforeEach(() => {
        store.selectPlate({ id: '61', selected: true })
      })

      it('selects the requests associated with the well', async () => {
        store.selectWellRequests = vi.fn()
        const selecto = wrapper.findComponent('.selecto-selection')
        const addedWell = wrapper.findAll('[data-attribute=well]')[0]
        addedWell.getAttribute = vi.fn(() => '1')
        const removedWell = wrapper.findAll('[data-attribute=well]')[1]
        removedWell.getAttribute = vi.fn(() => '2')
        await selecto.vm.$emit('select', {
          added: [addedWell],
          removed: [removedWell],
        })

        expect(store.selectWellRequests).toHaveBeenCalledWith('1')
        expect(store.selectWellRequests).toHaveBeenCalledWith('2')
      })
    })
  })

  describe('when mounted with Tube', () => {
    beforeEach(() => {
      const labware = [
        {
          type: 'tubes',
          barcode: 'TRAC-2-20',
        },
      ]
      ;({ wrapper, store } = mountPacbioLabwareSelected({
        state: {
          selected: {
            tubes: {
              1: { id: '20' },
            },
          },
          resources: {
            tubes,
            requests,
          },
        },
        props: {
          labware,
        },
      }))
    })

    it('should display the tube labware', async () => {
      const items = wrapper.findAll('[data-type="selected-labware-item"]')
      expect(items.length).toBe(1)
      expect(wrapper.find('[data-attribute=labware-name]').text()).toContain('TRAC-2-20')
      const tubeWellComponent = wrapper.findComponent(PacbioTubeWell)
      expect(tubeWellComponent.exists()).toBe(true)
    })
    it('should select request associated with the tube', async () => {
      store.selectRequestInSource = vi.fn()
      const tubeWellComponent = wrapper.findComponent(PacbioTubeWell)
      await tubeWellComponent.vm.$emit('click', {
        id: 1,
        selected: true,
      })
      expect(store.selectRequestInSource).toHaveBeenCalledOnce()
    })
    it('should emit closed event when remove button is clicked', async () => {
      const button = wrapper.find('#remove-btn-20')
      await button.trigger('click')
      expect(wrapper.emitted().closed).toBeTruthy()
    })
  })

  describe('when mounted with multiple labware', () => {
    beforeEach(() => {
      const labware = [
        {
          type: 'plates',
          barcode: 'DN814327C',
        },
        {
          type: 'tubes',
          barcode: 'TRAC-2-20',
        },
      ]
      ;({ wrapper, store } = mountPacbioLabwareSelected({
        state: {
          selected: {
            plates: {
              61: { id: '61' },
            },
            tubes: {
              1: { id: '20' },
            },
          },
          resources: {
            plates,
            wells,
            tubes,
            requests: { ...plateRequests, ...requests },
          },
        },
        props: {
          labware,
        },
      }))
    })
    it('should display all labware in order', async () => {
      const items = wrapper.findAll('[data-type="selected-labware-item"]')
      expect(items.length).toBe(2)
      expect(items[0].find('[data-attribute=labware-name]').text()).toContain('DN814327C')
      expect(items[1].find('[data-attribute=labware-name]').text()).toContain('TRAC-2-20')
    })
    describe('Table view', () => {
      beforeEach(() => {
        wrapper.find('[data-attribute=table-check-box]').trigger('click')
        //Select the requests associated with the tube
        store.selectRequestInSource({ request: '30', source_id: '30', selected: true })
      })
      it('should display table view', () => {
        expect(wrapper.find('[data-attribute=table-view]').exists()).toBe(true)
      })
      it('should display the correct fields', () => {
        const headers = wrapper.findAll('th')
        expect(headers.length).toBe(6)
        for (const field of wrapper.vm.state.requestFields) {
          expect(headers.filter((header) => header.text() === field)).toBeDefined()
        }
      })

      it('contains the correct data', async () => {
        expect(wrapper.find('tbody').findAll('tr').length).toEqual(11)
        expect(wrapper.find('tbody').findAll('td').length).toEqual(66)
      })
      it('contains the selected  requests in the same order as it is added', () => {
        //First plate
        expect(wrapper.find('tbody').findAll('td')[0].text()).toEqual('GEN-1710774222-1:H5')
        expect(wrapper.find('tbody').findAll('td')[1].text()).toEqual('human')

        //Tube at the end
        expect(wrapper.find('tbody').findAll('td')[12].text()).toEqual('GEN-1710774222-1:H4')
        expect(wrapper.find('tbody').findAll('td')[13].text()).toEqual('human')
        expect(wrapper.find('tbody').findAll('td')[14].text()).toEqual('Pacbio_HiFi')
        expect(wrapper.find('tbody').findAll('td')[15].text()).toEqual('3')
        expect(wrapper.find('tbody').findAll('td')[16].text()).toEqual('100')
      })

      it('displays the selected requests first when sortBySelection is true', async () => {
        //Tube requests
        expect(wrapper.find('[data-attribute=request-checkbox-30]').element.checked).toBe(true)
        //Plate requests
        expect(wrapper.find('[data-attribute=request-checkbox-40]').element.checked).toBe(false)
        expect(wrapper.find('[data-attribute=request-checkbox-41]').element.checked).toBe(false)
      })

      it('displays the selected requests first when sortBySelection is true', async () => {
        await wrapper.find('[data-attribute=sort-by-selection]').setChecked(true)
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.sortBySelection).toBe(true)
        //Tube requests displayed first
        expect(wrapper.find('tbody').findAll('td')[0].text()).toEqual('GEN-1710774222-1:H4')
        expect(wrapper.find('tbody').findAll('td')[1].text()).toEqual('human')
        expect(wrapper.find('tbody').findAll('td')[2].text()).toEqual('Pacbio_HiFi')
        expect(wrapper.find('tbody').findAll('td')[3].text()).toEqual('3')
        expect(wrapper.find('tbody').findAll('td')[4].text()).toEqual('100')
      })
      it('should call selectRequestInSource method on select checkbox click ', async () => {
        store.selectRequestInSource = vi.fn()
        await wrapper.find('[data-attribute=request-checkbox-30]').setChecked(false)
        expect(store.selectRequestInSource).toHaveBeenCalledWith(
          expect.objectContaining({
            request: '30',
            selected: false,
            source_id: '30',
          }),
        )
      })
      it('should call selectRequestInSource method on click on a table cell ', async () => {
        store.selectRequestInSource = vi.fn()
        wrapper.find('tbody').findAll('td')[0].trigger('click')
        expect(store.selectRequestInSource).toHaveBeenCalledWith(
          expect.objectContaining({
            request: '40',
            source_id: '40',
            selected: true,
          }),
        )
      })
    })
  })
})
