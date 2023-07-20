import PacbioRuns from '@/views/pacbio/PacbioRunIndex'
import { mount, store, Data, flushPromises } from '@support/testHelper'
import Response from '@/api/Response'

describe('Runs.vue', () => {
  let wrapper, runs, mockRuns

  beforeEach(async () => {
    mockRuns = new Response(Data.PacbioRuns).deserialize.runs
    const get = vi.spyOn(store.state.api.traction.pacbio.runs, 'get')
    get.mockReturnValue(Data.PacbioRuns)

    wrapper = mount(PacbioRuns, { store })
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

    it('contains the correct run skbb information', () => {
      const run2skbb = wrapper.find('tbody').findAll('tr')[0].findAll('td')[4].text()
      expect(run2skbb).toEqual('Plate 1: SKBB 2')

      const run6skbb = wrapper.find('tbody').findAll('tr')[5].findAll('td')[4].text()
      expect(run6skbb).toEqual('Plate 1: SKBB 6, Plate 2: SKBB 7')
    })
  })

  describe('new run button', () => {
    it('contains a create new run button', () => {
      expect(wrapper.find('[data-action=new-run]').exists()).toBeTruthy()
    })

    it('will redirect to the run when newRun is clicked', async () => {
      const button = wrapper.find('[data-action=new-run]')
      button.trigger('click')
      await flushPromises()
      expect(runs.$route.path).toEqual('/pacbio/run/new')
    })
  })

  describe('start button', () => {
    let button

    it('is enabled when the run state is pending', () => {
      // run at(1) is in state pending
      button = wrapper.find('#startRun-1')
      expect(button.element.disabled).toBe(false)
    })

    it('is disabled is the run state is started', () => {
      // run at(2) is in state started
      button = wrapper.find('#startRun-2')
      expect(button.element.disabled).toBe(true)
    })

    it('is disabled is the run state is completed', () => {
      // run at(3) is in state started
      button = wrapper.find('#startRun-3')
      expect(button.element.disabled).toBe(true)
    })

    it('is disabled is the run state is cancelled', () => {
      // run at(4) is in state started
      button = wrapper.find('#startRun-4')
      expect(button.element.disabled).toBe(true)
    })

    it('on click updateRun is called', () => {
      runs.updateRun = vi.fn()

      button = wrapper.find('#startRun-1')
      button.trigger('click')
      expect(runs.updateRun).toBeCalledWith({ id: mockRuns[0].id, state: 'started' })
    })
  })

  describe('complete button', () => {
    let button

    it('is enabled when the run state is pending', () => {
      // run at(1) is in state pending
      button = wrapper.find('#completeRun-1')
      expect(button.element.disabled).toBe(true)
    })

    it('is enabled when the run state is started', () => {
      // run at(2) is in state started
      button = wrapper.find('#completeRun-2')
      expect(button.element.disabled).toBe(false)
    })

    it('is disabled if the run state is completed', () => {
      // run at(3) is in state cancelled
      button = wrapper.find('#completeRun-3')
      expect(button.element.disabled).toBe(true)
    })

    it('is disabled is the run state is cancelled', () => {
      // run at(4) is in state cancelled
      button = wrapper.find('#completeRun-4')
      expect(button.element.disabled).toBe(true)
    })

    it('on click updateRun is called', () => {
      // run at(2) is in state started
      runs.updateRun = vi.fn()

      button = wrapper.find('#completeRun-2')
      button.trigger('click')

      expect(runs.updateRun).toBeCalledWith({ id: mockRuns[1].id, state: 'completed' })
    })
  })

  describe('cancel button', () => {
    let button

    it('is enabled when the run state is pending', () => {
      // run at(1) is in state pending
      button = wrapper.find('#cancelRun-1')
      expect(button.element.disabled).toBe(true)
    })

    it('is enabled when the run state is started', () => {
      // run at(2) is in state started
      button = wrapper.find('#cancelRun-2')
      expect(button.element.disabled).toBe(false)
    })

    it('is disabled if the run state is completed', () => {
      // run at(3) is in state cancelled
      button = wrapper.find('#cancelRun-3')
      expect(button.element.disabled).toBe(true)
    })

    it('is disabled is the run state is cancelled', () => {
      // run at(4) is in state cancelled
      button = wrapper.find('#cancelRun-4')
      expect(button.element.disabled).toBe(true)
    })

    it('on click updateRun is called', () => {
      // run at(2) is in state started
      runs.updateRun = vi.fn()

      button = wrapper.find('#cancelRun-2')
      button.trigger('click')

      expect(runs.updateRun).toBeCalledWith({ id: mockRuns[1].id, state: 'cancelled' })
    })
  })

  describe('generate sample sheet button', () => {
    let button

    it('it exists when the run has wells with pools', () => {
      button = wrapper.find('#generate-sample-sheet-1')
      expect(button.isVisible()).toBe(true) // button is shown
    })

    it('on click generateSampleSheetPath is called', () => {
      button = wrapper.find('#generate-sample-sheet-1')

      expect(button.attributes('href')).toEqual(runs.generateSampleSheetPath(1))
    })
  })

  describe('sorting', () => {
    it('will sort the runs by created at', () => {
      expect(wrapper.find('tbody').findAll('tr')[0].text()).toMatch(/Sequel II/)
    })
  })

  describe('filtering runs', () => {
    beforeEach(async () => {
      const get = vi.spyOn(store.state.api.traction.pacbio.runs, 'get')
      get.mockReturnValue(Data.PacbioRuns)
      wrapper = mount(PacbioRuns, {
        store,
        data() {
          return {
            filter: mockRuns[0].name,
          }
        },
      })
      await flushPromises()
      wrapper.vm.tableData = [mockRuns[0]]
    })

    it('will filter the runs in the table', () => {
      expect(wrapper.find('tbody').findAll('[data-testid="row"]').length).toEqual(1)
      expect(wrapper.find('tbody').findAll('[data-testid="row"]')[0].text()).toMatch(/Sequel I/)
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
        data() {
          return {
            perPage: 2,
            currentPage: 1,
          }
        },
      })
      wrapper.vm.tableData = [mockRuns[0], mockRuns[1]]
      await flushPromises()
    })

    it('will paginate the runs in the table', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
    })
  })

  describe('#updateRun', () => {
    const id = 1
    beforeEach(() => {
      runs.updateRun = vi.fn()
      runs.showAlert = vi.fn()
    })

    it('calls startRun successfully', () => {
      runs.updateRunState('started', id)
      expect(runs.updateRun).toBeCalledWith({ id, state: 'started' })
    })

    it('calls completeRun successfully', () => {
      runs.updateRunState('completed', id)
      expect(runs.updateRun).toBeCalledWith({ id, state: 'completed' })
    })

    it('calls cancelRun successfully', () => {
      const id = 1
      runs.updateRunState('cancelled', id)
      expect(runs.updateRun).toBeCalledWith({ id, state: 'cancelled' })
    })

    it('calls setRuns unsuccessfully', () => {
      runs.updateRun.mockImplementation(() => {
        throw Error('Raise this error')
      })
      runs.updateRunState('started', 1)
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
      await flushPromises()
      expect(runs.$route.path).toEqual('/pacbio/run/1')
    })
  })
})
