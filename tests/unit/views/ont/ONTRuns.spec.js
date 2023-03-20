import ONTRuns from '@/views/ont/ONTRuns'
import { mount, localVue, store, Data, router } from '@support/testHelper'
import Response from '@/api/Response'

describe('ONTRuns.vue', () => {
  let wrapper, runs, mockRuns

  beforeEach(async () => {
    vi.mock('swrv', () => ({
      default: vi.fn(() => ({
        data: {
          flipper_id: 'User',
          features: {
            dpl_281_ont_create_sequencing_runs: { enabled: true },
          },
        },
      })),
    }))

    mockRuns = new Response(Data.OntRuns).deserialize.runs

    const get = vi.spyOn(store.state.api.traction.ont.runs, 'get')
    get.mockResolvedValue(Data.OntRuns)

    wrapper = await mount(ONTRuns, { store, router, localVue })
    runs = wrapper.vm
  })

  describe('building the table', () => {
    it('exists', () => {
      expect(wrapper.find('table').exists()).toBeTruthy
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
    })

    it('contains the correct headers', async () => {
      const headers = wrapper.findAll('th')

      for (const field of runs.fields) {
        expect(headers.filter((header) => header.text() === field.label)).toBeDefined()
      }
    })

    it('orders the data by created_at desc', async () => {
      wrapper.vm.$nextTick(() =>
        expect(wrapper.find('tbody').findAll('tr').at(0).text().includes('ONTRUN-2')).toBeTruthy(),
      )
    })
  })

  describe('New run button', () => {
    it('contains a create new run button', () => {
      expect(wrapper.find('button').exists()).toBeTruthy()
    })

    it('will redirect to the run when newRun is clicked', async () => {
      const button = wrapper.find('#newRun')
      button.trigger('click')
      expect(runs.$route.path).toEqual('/ont/run/new')
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
      expect(runs.$route.path).toEqual('/ont/run/1')
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

  describe('#showAlert', () => {
    it('emits an event with the message', () => {
      runs.showAlert('show this message', 'danger')

      expect(Object.values(store.state.traction.messages)).toContainEqual({
        type: 'danger',
        message: 'show this message',
      })
    })
  })

  describe('#mapGetters', () => {
    it('sets the runs data', () => {
      expect(runs.runs.length).toEqual(mockRuns.length)
    })
  })

  describe('#generateId', () => {
    it('returns the generated text', () => {
      expect(runs.generateId('text', 'id')).toEqual('text-id')
    })
  })
})
