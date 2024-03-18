import { mount, createTestingPinia, Data } from '@support/testHelper.js'
import PacbioLabwareSelectedList from '@/components/pacbio/PacbioLabwareSelectedList.vue'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import { dataToObjectById } from '@/api/JsonApi.js'
import PacbioTubeWell from '@/components/labware/PacbioTubeWell.vue'

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
function mountWithStore({ state = {}, stubActions = false, plugins = [], props } = {}) {
  const wrapperObj = mount(PacbioLabwareSelectedList, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioPoolCreate: state,
          },
          stubActions,
          plugins,
        }),
      ],
    },
    props,
    stubs: {
      VueSelecto: true,
      Plate: true,
      PacbioTubeWell: true,
    },
  })
  const storeObj = usePacbioPoolCreateStore()
  return { wrapperObj, storeObj }
}

describe('PacbioLabwareSelectedList', () => {
  let wrapper, store
  const data = Data.PacbioPlatesRequest.data.included
  const plates = dataToObjectById({
    data: Data.PacbioPlatesRequest.data.data,
    includeRelationships: true,
  })
  const wells = dataToObjectById({
    data: Data.PacbioPlatesRequest.data.included.slice(0, 4),
    includeRelationships: true,
  })
  const plateRequests = dataToObjectById({
    data: Data.PacbioPlatesRequest.data.included.slice(4, 7),
    includeRelationships: true,
  })
  const tubes = dataToObjectById({
    data: Data.PacbioTubesRequest.data.data,
    includeRelationships: true,
  })
  const requests = dataToObjectById({
    data: Data.PacbioTubesRequest.data.included,
    includeRelationships: true,
  })

  it('should not display any labware when there is no labware', () => {
    const { wrapperObj } = mountWithStore({
      props: {
        labware: [],
      },
    })
    const label = wrapperObj.find('[data-attribute="warning-label"]')
    expect(label.text()).toBe('Please select labware to view the samples')
  })

  describe('when mounted with Plate', () => {
    beforeEach(() => {
      const labware = [
        {
          type: 'plates',
          barcode: 'DN814327C',
        },
      ]
      const { wrapperObj, storeObj } = mountWithStore({
        state: {
          selected: {
            plates: {
              61: { id: '61' },
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
      })

      wrapper = wrapperObj
      store = storeObj
    })
    it('should display the plate labware', () => {
      const items = wrapper.findAll('[data-type="selected-labware-item"]')
      expect(items.length).toBe(1)
      expect(wrapper.find('[data-attribute=labware-name]').text()).toContain('DN814327C')
    })
    it('should emit closed event when remove button is clicked', async () => {
      store.deselectPlateAndContents = vi.fn()
      const button = wrapper.find('#remove-btn-61')
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
          barcode: 'GEN-1680611780-6',
        },
      ]
      const { wrapperObj, storeObj } = mountWithStore({
        state: {
          selected: {
            tubes: {
              1: { id: '1' },
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
      })

      wrapper = wrapperObj
      store = storeObj
    })

    it('should display the tube labware', async () => {
      const items = wrapper.findAll('[data-type="selected-labware-item"]')
      expect(items.length).toBe(1)
      expect(wrapper.find('[data-attribute=labware-name]').text()).toContain('GEN-1680611780-6')
      const tubeWellComponent = wrapper.findComponent(PacbioTubeWell)
      expect(tubeWellComponent.exists()).toBe(true)
    })
    it('should select request associated with the tube', async () => {
      store.selectRequest = vi.fn()
      const tubeWellComponent = wrapper.findComponent(PacbioTubeWell)
      await tubeWellComponent.vm.$emit('click', {
        id: 1,
        selected: true,
      })
      expect(store.selectRequest).toHaveBeenCalledOnce()
    })
    it('should emit closed event when remove button is clicked', async () => {
      store.deselectPlateAndContents = vi.fn()
      const button = wrapper.find('#remove-btn-1')
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
          barcode: 'GEN-1680611780-6',
        },
      ]
      const { wrapperObj, storeObj } = mountWithStore({
        state: {
          selected: {
            plates: {
              61: { id: '61' },
            },
            tubes: {
              1: { id: '1' },
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
      })

      wrapper = wrapperObj
      store = storeObj
    })
    it('should display all labware in order', async () => {
      const items = wrapper.findAll('[data-type="selected-labware-item"]')
      expect(items.length).toBe(2)
      expect(items[0].find('[data-attribute=labware-name]').text()).toContain('DN814327C')
      expect(items[1].find('[data-attribute=labware-name]').text()).toContain('GEN-1680611780-6')
    })
    describe('Table view', () => {
      beforeEach(() => {
        wrapper.find('[data-attribute=table-check-box]').trigger('click')
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

    //   it.only('contains the correct data', async () => {
    //     expect(wrapper.find('tbody').findAll('tr').length).toEqual(3)
    //     expect(wrapper.find('tbody').findAll('td').length).toEqual(18)
    //     let incrementIndex = 0
    //     Object.values(store.resources.requests).map((request) => {
    //       expect(wrapper.find('tbody').findAll('td')[incrementIndex].text()).toEqual(
    //         request.source_identifier ?? '',
    //       )
    //       expect(wrapper.find('tbody').findAll('td')[incrementIndex + 1].text()).toEqual(
    //         request.sample_species ?? '',
    //       )
    //       expect(wrapper.find('tbody').findAll('td')[incrementIndex + 2].text()).toEqual(
    //         request.library_type ?? '',
    //       )
    //       expect(wrapper.find('tbody').findAll('td')[incrementIndex + 3].text()).toEqual(
    //         request.number_of_smrt_cells ?? '',
    //       )
    //       expect(wrapper.find('tbody').findAll('td')[incrementIndex + 4].text()).toEqual(
    //         request.estimate_of_gb_required ?? '',
    //       )
    //       incrementIndex += 5
    //     })
      })
    })
  })
})
