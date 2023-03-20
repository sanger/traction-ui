import PacbioRuns from '@/views/pacbio/PacbioRunIndex'
import { mount, localVue, store, Data, router } from '@support/testHelper'
import Response from '@/api/Response'
import flushPromises from 'flush-promises'

describe('Runs.vue', () => {
  const pipeline = 'pacbio'
  let wrapper, runs, mockRuns

  beforeEach(async () => {
    mockRuns = new Response(Data.PacbioRuns).deserialize.runs
    const get = vi.spyOn(store.state.api.traction.pacbio.runs, 'get')
    get.mockReturnValue(Data.PacbioRuns)

    wrapper = mount(PacbioRuns, { store, router, localVue })
    runs = wrapper.vm
    await flushPromises()
  })

  describe('building the table', () => {
    it('exists', () => {
      expect(wrapper.find('table').exists()).toBeTruthy
    })

    it('contains the correct data', async () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(6)
    })
  })

  describe('new run button', () => {
    it('contains a create new run button', () => {
      expect(wrapper.find('button').exists()).toBeTruthy()
    })

    it('will redirect to the run when newRun is clicked', async () => {
      const button = wrapper.find('[data-action=new-run]')
      button.trigger('click')
      expect(runs.$route.path).toEqual('/pacbio/run/new')
    })
  })

  describe('start button', () => {
    let button

    it('is enabled when the run state is pending', () => {
      // run at(1) is in state pending
      button = wrapper.find('#startRun-1')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('is disabled is the run state is started', () => {
      // run at(2) is in state started
      button = wrapper.find('#startRun-2')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is disabled is the run state is completed', () => {
      // run at(3) is in state started
      button = wrapper.find('#startRun-3')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is disabled is the run state is cancelled', () => {
      // run at(4) is in state started
      button = wrapper.find('#startRun-4')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('on click startRun is called', () => {
      runs.startRun = vi.fn()

      button = wrapper.find('#startRun-1')
      button.trigger('click')
      expect(runs.startRun).toBeCalledWith({ id: mockRuns[0].id, pipeline })
    })
  })

  describe('complete button', () => {
    let button

    it('is is enabled when the run state is pending', () => {
      // run at(1) is in state pending
      button = wrapper.find('#completeRun-1')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is is enabled when the run state is started', () => {
      // run at(2) is in state started
      button = wrapper.find('#completeRun-2')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('is disabled if the run state is completed', () => {
      // run at(3) is in state cancelled
      button = wrapper.find('#completeRun-3')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is disabled is the run state is cancelled', () => {
      // run at(4) is in state cancelled
      button = wrapper.find('#completeRun-4')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('on click completeRun is called', () => {
      // run at(2) is in state started
      runs.completeRun = vi.fn()

      button = wrapper.find('#completeRun-2')
      button.trigger('click')

      expect(runs.completeRun).toBeCalledWith({ id: mockRuns[1].id, pipeline })
    })
  })

  describe('cancel button', () => {
    let button

    it('is is enabled when the run state is pending', () => {
      // run at(1) is in state pending
      button = wrapper.find('#cancelRun-1')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is is enabled when the run state is started', () => {
      // run at(2) is in state started
      button = wrapper.find('#cancelRun-2')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('is disabled if the run state is completed', () => {
      // run at(3) is in state cancelled
      button = wrapper.find('#cancelRun-3')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is disabled is the run state is cancelled', () => {
      // run at(4) is in state cancelled
      button = wrapper.find('#cancelRun-4')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('on click cancelRun is called', () => {
      // run at(2) is in state started
      runs.cancelRun = vi.fn()

      button = wrapper.find('#cancelRun-2')
      button.trigger('click')

      expect(runs.cancelRun).toBeCalledWith({ id: mockRuns[1].id, pipeline })
    })
  })

  describe('generate sample sheet button', () => {
    let button

    it('it exists when the run has wells with pools', () => {
      button = wrapper.find('#generate-sample-sheet-1')
      expect(button.isVisible()).toBe(true) // button is shown
    })

    it('it does not exist when the run has wells without pools', async () => {
      const noPoolsRun = Data.PacbioRuns
      noPoolsRun.data.data[0].attributes.all_wells_have_pools = false
      const get = vi.spyOn(store.state.api.traction.pacbio.runs, 'get')
      get.mockReturnValue(noPoolsRun)
      wrapper = mount(PacbioRuns, { store, router, localVue })
      await flushPromises()

      button = wrapper.find('#generate-sample-sheet-1')
      expect(button.isVisible()).toBe(false) // button is hidden
    })

    it('on click generateSampleSheetPath is called', () => {
      button = wrapper.find('#generate-sample-sheet-1')

      expect(button.attributes('href')).toEqual(runs.generateSampleSheetPath(1))
    })
  })

  describe('sorting', () => {
    it('will sort the runs by created at', () => {
      expect(wrapper.find('tbody').findAll('tr').at(0).text()).toMatch(/Sequel II/)
    })
  })

  describe('filtering runs', () => {
    beforeEach(async () => {
      const get = vi.spyOn(store.state.api.traction.pacbio.runs, 'get')
      get.mockReturnValue(Data.PacbioRuns)

      wrapper = mount(PacbioRuns, {
        store,
        localVue,
        data() {
          return {
            filter: mockRuns[0].name,
          }
        },
      })
      await flushPromises()
    })

    it('will filter the runs in the table', () => {
      wrapper.vm.$nextTick(() => {
        expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
        expect(wrapper.find('tbody').findAll('tr').at(0).text()).toMatch(/Sequel II/)
      })
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

  describe('pagination', () => {
    beforeEach(async () => {
      const get = vi.spyOn(store.state.api.traction.pacbio.runs, 'get')
      get.mockReturnValue(Data.PacbioRuns)

      wrapper = mount(PacbioRuns, {
        store,
        localVue,
        data() {
          return {
            perPage: 2,
            currentPage: 1,
          }
        },
      })
      await flushPromises()
    })

    it('will paginate the runs in the table', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
    })
  })

  describe('#updateRun', () => {
    const id = 1
    beforeEach(() => {
      runs.startRun = vi.fn()
      runs.completeRun = vi.fn()
      runs.cancelRun = vi.fn()
      runs.showAlert = vi.fn()
    })

    it('calls startRun successfully', () => {
      runs.updateRun('start', id)
      expect(runs.startRun).toBeCalledWith({ id, pipeline })
    })

    it('calls completeRun successfully', () => {
      runs.updateRun('complete', id)
      expect(runs.completeRun).toBeCalledWith({ id, pipeline })
    })

    it('calls cancelRun successfully', () => {
      const id = 1
      runs.updateRun('cancel', id)
      expect(runs.cancelRun).toBeCalledWith({ id, pipeline })
    })

    it('calls setRuns unsuccessfully', () => {
      runs.startRun.mockImplementation(() => {
        throw Error('Raise this error')
      })
      runs.updateRun('start', 1)
      expect(runs.showAlert).toBeCalled()
    })
  })

  describe('generate sample sheet link', () => {
    let link, id

    beforeEach(() => {
      id = 1
      link = wrapper.find('#generate-sample-sheet-' + id)
    })

    it('exists', () => {
      expect(link).toBeTruthy()
    })

    it('has the correct href link', () => {
      expect(link.attributes('href')).toBe(
        import.meta.env.VITE_TRACTION_BASE_URL + '/v1/pacbio/runs/' + id + '/sample_sheet',
      )
    })
  })

  describe('Edit Run button', () => {
    it('contains a Edit Run button', () => {
      expect(wrapper.find('#editRun-1')).toBeDefined()
    })

    it('will call editRun when Edit is clicked', async () => {
      const button = wrapper.find('#editRun-1')
      button.trigger('click')
      expect(runs.$route.path).toEqual('/pacbio/run/1')
    })
  })
})
