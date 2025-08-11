import ONTRunIndex from '@/views/ont/ONTRunIndex.vue'
import { mountWithStore, router, flushPromises } from '@support/testHelper.js'
import OntRunFactory from '@tests/factories/OntRunFactory.js'
import { useOntRunsStore } from '@/stores/ontRuns.js'

const ontRunFactory = OntRunFactory()

const mountComponent = () => {
  const plugins = [
    ({ store }) => {
      if (store.$id === 'root') {
        store.api.traction.ont.runs.get = vi.fn(() => ontRunFactory.responses.fetch)
      }
    },
  ]
  const initialState = {
    ontRuns: { resources: { runs: ontRunFactory.storeData.runs } },
  }

  const { wrapper } = mountWithStore(ONTRunIndex, {
    initialState,
    plugins,
    createStore: () => useOntRunsStore(),
    stubs: {
      PrinterModal: {
        template: '<div ref="printerModal"></div>',
      },
    },
  })
  return wrapper
}

describe('ONTRunIndex.vue', () => {
  let wrapper, runs

  beforeEach(async () => {
    wrapper = mountComponent()
    runs = wrapper.vm
    await flushPromises()
  })

  describe('building the table', () => {
    it('contains the correct data', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
    })

    it('contains the correct headers', () => {
      const headers = wrapper.findAll('th')

      for (const field of runs.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('orders the data by created_at desc', () => {
      expect(wrapper.find('tbody').findAll('tr')[0].text().includes('ONTRUN-2')).toBeTruthy()
    })
  })

  describe('New run button', () => {
    it('contains a create new run button', () => {
      expect(wrapper.find('button').exists()).toBeTruthy()
    })

    it('will redirect to the run when newRun is clicked', async () => {
      const button = wrapper.find('#newRun')
      button.trigger('click')
      await flushPromises()
      expect(router.currentRoute.value.path).toEqual('/ont/run/new')
    })
  })

  describe('Edit Run button', () => {
    it('contains a Edit Run button', () => {
      expect(wrapper.find('#editRun-1')).toBeDefined()
      expect(wrapper.find('#editRun-2')).toBeDefined()
    })

    it('will call editRun when Edit is clicked', async () => {
      const button = wrapper.find('#editRun-1')
      button.trigger('click')
      await flushPromises()
      expect(router.currentRoute.value.path).toEqual('/ont/run/1')
    })
  })

  describe('generate sample sheet button', () => {
    let button

    it('it exists when the run has wells with pools', () => {
      button = wrapper.find('#sample-sheet-1')
      expect(button.isVisible()).toBe(true) // button is shown
    })

    it('on click generateSampleSheetPath is called', () => {
      button = wrapper.find('#sample-sheet-1')

      expect(button.attributes('href')).toEqual(runs.generateSampleSheetPath(1))
    })
  })

  describe('#mapGetters', () => {
    it('sets the runs data', () => {
      expect(runs.runs.length).toEqual(Object.values(ontRunFactory.storeData.runs).length)
    })
  })

  describe('#generateId', () => {
    it('returns the generated text', () => {
      expect(runs.generateId('text', 'id')).toEqual('text-id')
    })
  })
})
