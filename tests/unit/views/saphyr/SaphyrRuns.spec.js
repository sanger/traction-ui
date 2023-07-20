import Runs from '@/views/saphyr/SaphyrRuns'
import { mount, store, Data, flushPromises } from '@support/testHelper'
import Response from '@/api/Response'

describe('Runs.vue', () => {
  const pipeline = 'saphyr'
  let wrapper, runs, mockRuns

  beforeEach(async () => {
    mockRuns = new Response(Data.Runs).deserialize.runs
    store.commit('traction/saphyr/runs/setRuns', mockRuns)
    vi.spyOn(store.getters['traction/saphyr/runs/runRequest'], 'get').mockResolvedValue(
      mockRuns,
    )
    wrapper = mount(Runs, { store })
    runs = wrapper.vm
    wrapper.vm.tableData = mockRuns
    wrapper.vm.tableData[5].created_at = '03/21/2019 06:01'

    await flushPromises()
  })

  describe('created hook', () => {
    it('sets the runs data', () => {
      expect(runs.runs).toEqual(mockRuns)
    })
  })

  describe('building the table', () => {
    it('exists', () => {
      expect(wrapper.find('table').element).toBeTruthy()
    })

    it('contains the correct data', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(6)
    })
  })

  describe('sorting', () => {
    it('will sort the runs by created at', () => {
      expect(wrapper.find('tbody').findAll('tr')[0].text()).toMatch(/TRAC-678/)
    })
  })

  describe('filtering runs', () => {
    beforeEach(() => {
      wrapper = mount(Runs, {
        store,
        data() {
          return {
            filter: mockRuns[0].chip_barcode,
          }
        },
      })
      wrapper.vm.tableData = [mockRuns[0]]
    })
    
    it('will filter the runs in the table', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
      expect(wrapper.find('tbody').findAll('tr')[0].text()).toMatch(/TRAC-123/)
    })
  })

  describe('start button', () => {
    it('is enabled when the run state is pending', () => {
      // run at(0) is in state pending
      const button = wrapper.find('#startRun-6')
      expect(button.element.disabled).toBe(false)
    })

    it('is disabled if the run state is not pending', () => {
      // run at(4) is in state started
      const button = wrapper.find('#startRun-2')
      expect(button.element.disabled).toBe(true)
    })

    it('on click startRun is called', () => {
      // run at(0) is in state pending
      runs.startRun = vi.fn()

      const button = wrapper.find('#startRun-6')
      button.trigger('click')

      const id = wrapper.find('tbody').findAll('tr')[0].findAll('td')[0].text()
      expect(runs.startRun).toBeCalledWith({ id, pipeline })
    })
  })

  describe('complete button', () => {
    it('is enabled when the run state is pending', () => {
      // run at(0) is in state pending
      const button = wrapper.find('#completeRun-6')
      expect(button.element.disabled).toBe(false)
    })

    it('is enabled when the run state is started', () => {
      // run at(4) is in state started
      const button = wrapper.find('#completeRun-2')
      expect(button.element.disabled).toBe(false)
    })

    it('is disabled if the run state is completed', () => {
      // run at(3) is in state completed
      const button = wrapper.find('#completeRun-3')
      expect(button.element.disabled).toBe(true)
    })

    it('is disabled is the run state is cancelled', () => {
      // run at(2) is in state cancelled
      const button = wrapper.find('#completeRun-4')
      expect(button.element.disabled).toBe(true)
    })

    it('on click completeRun is called', () => {
      // run at(4) is in state started
      runs.completeRun = vi.fn()

      const button = wrapper.find('#completeRun-2')
      button.trigger('click')

      const id = wrapper.find('tbody').findAll('tr')[4].findAll('td')[0].text()
      expect(runs.completeRun).toBeCalledWith({ id, pipeline })
    })
  })

  describe('cancel button', () => {
    it('is enabled when the run state is pending', () => {
      // run at(0) is in state pending
      const button = wrapper.find('#cancelRun-6')
      expect(button.element.disabled).toBe(false)
    })

    it('is enabled when the run state is started', () => {
      // run at(4) is in state started
      const button = wrapper.find('#cancelRun-2')
      expect(button.element.disabled).toBe(false)
    })

    it('is disabled if the run state is completed', () => {
      // run at(3) is in state completed
      const button = wrapper.find('#cancelRun-3')
      expect(button.element.disabled).toBe(true)
    })

    it('is disabled is the run state is cancelled', () => {
      // run at(2) is in state cancelled
      const button = wrapper.find('#cancelRun-4')
      expect(button.element.disabled).toBe(true)
    })

    it('on click completeRun is called', () => {
      // run at(4) is in state started
      runs.cancelRun = vi.fn()

      const button = wrapper.find('#cancelRun-2')
      button.trigger('click')

      const id = wrapper.find('tbody').findAll('tr')[4].findAll('td')[0].text()
      expect(runs.cancelRun).toBeCalledWith({ id, pipeline })
    })
  })

  describe('new run button', () => {
    it('contains a create new run button', () => {
      expect(wrapper.find('#newRun')).toBeDefined()
    })

    it('will redirect to the run when newRun is clicked', async () => {
      const button = wrapper.find('#newRun')
      button.trigger('click')
      await flushPromises()
      expect(runs.$route.path).toEqual('/saphyr/run/new')
    })
  })

  describe('edit run button', () => {
    it('contains a create new run button', () => {
      expect(wrapper.find('#edit-1')).toBeDefined()
    })

    it('will redirect to the run when newRun is clicked', async () => {
      const button = wrapper.find('#edit-1')
      button.trigger('click')
      await flushPromises()
      expect(runs.$route.path).toEqual('/saphyr/run/1')
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
      mockRuns = new Response(Data.Runs).deserialize.runs

      store.commit('traction/saphyr/runs/setRuns', mockRuns)
      wrapper = mount(Runs, {
        store,
        data() {
          return {
            perPage: 2,
            currentPage: 1,
          }
        },
      })

      wrapper.vm.tableData = [mockRuns[0], mockRuns[1]]
    })

    it('will paginate the runs in the table', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
    })
  })

  describe('#provider', () => {
    beforeEach(() => {
      wrapper = mount(Runs, { store })
      runs = wrapper.vm

      runs.setRuns = vi.fn()
      runs.showAlert = vi.fn()
    })

    it('calls setRuns successfully', () => {
      runs.provider()
      expect(runs.setRuns).toBeCalled()
    })

    it('calls setRuns unsuccessfully', () => {
      runs.setRuns.mockImplementation(() => {
        throw Error('Raise this error')
      })
      runs.provider()
      expect(runs.showAlert).toBeCalled()
    })
  })

  describe('#updateRun', () => {
    const id = 1

    beforeEach(() => {
      runs.startRun = vi.fn()
      runs.completeRun = vi.fn()
      runs.cancelRun = vi.fn()
      runs.provider = vi.fn()
      runs.showAlert = vi.fn()
    })

    it('calls startRun successfully', () => {
      runs.updateRun('start', id)
      expect(runs.startRun).toBeCalledWith({ id, pipeline })
      expect(runs.provider).toBeCalled()
    })

    it('calls completeRun successfully', () => {
      runs.updateRun('complete', id)
      expect(runs.completeRun).toBeCalledWith({ id, pipeline })
      expect(runs.provider).toBeCalled()
    })

    it('calls cancelRun successfully', () => {
      runs.updateRun('cancel', id)
      expect(runs.cancelRun).toBeCalledWith({ id, pipeline })
      expect(runs.provider).toBeCalled()
    })

    it('calls setRuns unsuccessfully', () => {
      runs.startRun.mockImplementation(() => {
        throw Error('Raise this error')
      })
      runs.updateRun('start', id)
      expect(runs.provider).not.toBeCalled()
      expect(runs.showAlert).toBeCalled()
    })
  })
})
