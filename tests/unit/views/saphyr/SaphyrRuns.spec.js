import Runs from '@/views/saphyr/SaphyrRuns'
import { mount, localVue, store, Data, router } from '@support/testHelper'
import Response from '@/api/Response'

describe('Runs.vue', () => {
  const pipeline = 'saphyr'
  let wrapper, runs, mockRuns

  beforeEach(async () => {
    mockRuns = new Response(Data.Runs).deserialize.runs

    store.commit('traction/saphyr/runs/setRuns', mockRuns)
    wrapper = mount(Runs, { store, localVue, router })
    runs = wrapper.vm
  })

  describe('created hook', () => {
    it('sets the runs data', () => {
      expect(runs.runs).toEqual(mockRuns)
    })
  })

  describe('building the table', async () => {
    it('exists', () => {
      expect(wrapper.find('table').element).toBeTruthy()
    })

    it('contains the correct data', async () => {
      await wrapper.vm.$nextTick()
      expect(wrapper.findAll('tr').length).toEqual(6)
    })
  })

  describe('sorting', () => {
    it('will sort the runs by created at', async () => {
      await wrapper.vm.$nextTick()
      expect(wrapper.find('tbody').findAll('tr').at(1).text()).toMatch(/TRAC-678/)
    })
  })

  describe('filtering runs', () => {
    beforeEach(() => {
      wrapper = mount(Runs, {
        store,
        localVue,
        data() {
          return {
            filter: mockRuns[0].chip_barcode,
          }
        },
      })
    })

    it('will filter the runs in the table', async () => {
      const filterInput = wrapper.find('#filterInput')
      filterInput.element.value = mockRuns[0].chip_barcode
      filterInput.trigger('input')
      await wrapper.vm.$nextTick()
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
      expect(wrapper.find('tbody').findAll('tr').at(0).text()).toMatch(/TRAC-123/)
    })
  })

  // TODO: Move data creation into factories as we are having to reference data that is
  // outside of the tests.
  describe('start button', () => {
    it('is enabled when the run state is pending', async () => {
      // run at(0) is in state pending
      await wrapper.vm.$nextTick()
      const button = wrapper.find('#startRun-6')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('is disabled is the run state is not pending', async () => {
      // run at(4) is in state started
      await wrapper.vm.$nextTick()
      const button = wrapper.find('#startRun-2')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('on click startRun is called', async () => {
      // run at(0) is in state pending
      await wrapper.vm.$nextTick()
      runs.startRun = vi.fn()

      const button = wrapper.find('#startRun-6')
      button.trigger('click')

      const id = wrapper.find('tbody').findAll('tr').at(0).findAll('td').at(0).text()
      expect(runs.startRun).toBeCalledWith({ id, pipeline })
    })
  })

  describe('complete button', () => {
    it('is is enabled when the run state is pending', async () => {
      await wrapper.vm.$nextTick()
      // run at(0) is in state pending
      const button = wrapper.find('#completeRun-6')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('is is enabled when the run state is started', async () => {
      await wrapper.vm.$nextTick()
      // run at(4) is in state started
      const button = wrapper.find('#completeRun-2')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('is disabled if the run state is completed', async () => {
      // run at(3) is in state completed
      await wrapper.vm.$nextTick()
      const button = wrapper.find('#completeRun-3')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is disabled is the run state is cancelled', async () => {
      // run at(2) is in state cancelled
      await wrapper.vm.$nextTick()
      const button = wrapper.find('#completeRun-4')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('on click completeRun is called', async () => {
      // run at(4) is in state started
      await wrapper.vm.$nextTick()
      runs.completeRun = vi.fn()

      const button = wrapper.find('#completeRun-2')
      button.trigger('click')

      const id = wrapper.find('tbody').findAll('tr').at(4).findAll('td').at(0).text()
      expect(runs.completeRun).toBeCalledWith({ id, pipeline })
    })
  })

  describe('cancel button', () => {
    it('is is enabled when the run state is pending', async () => {
      // run at(0) is in state pending
      await wrapper.vm.$nextTick()
      const button = wrapper.find('#cancelRun-6')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('is is enabled when the run state is started', async () => {
      // run at(4) is in state started
      await wrapper.vm.$nextTick()
      const button = wrapper.find('#cancelRun-2')
      expect(button.attributes('disabled')).toBeFalsy()
    })

    it('is disabled if the run state is completed', async () => {
      // run at(3) is in state completed
      await wrapper.vm.$nextTick()
      const button = wrapper.find('#cancelRun-3')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('is disabled is the run state is cancelled', async () => {
      // run at(2) is in state cancelled
      await wrapper.vm.$nextTick()
      const button = wrapper.find('#cancelRun-4')
      expect(button.attributes('disabled')).toBeTruthy()
    })

    it('on click completeRun is called', async () => {
      // run at(4) is in state started
      await wrapper.vm.$nextTick()
      runs.cancelRun = vi.fn()

      const button = wrapper.find('#cancelRun-2')
      button.trigger('click')

      const id = wrapper.find('tbody').findAll('tr').at(4).findAll('td').at(0).text()
      expect(runs.cancelRun).toBeCalledWith({ id, pipeline })
    })
  })

  describe('new run button', () => {
    it('contains a create new run button', async () => {
      await wrapper.vm.$nextTick()
      expect(wrapper.find('#newRun')).toBeDefined()
    })

    it('will redirect to the run when newRun is clicked', async () => {
      await wrapper.vm.$nextTick()
      const button = wrapper.find('#newRun')
      button.trigger('click')
      expect(runs.$route.path).toEqual('/saphyr/run/new')
    })
  })

  describe('edit run button', () => {
    it('contains a create new run button', async () => {
      await wrapper.vm.$nextTick()
      expect(wrapper.find('#edit-1')).toBeDefined()
    })

    it('will redirect to the run when newRun is clicked', async () => {
      await wrapper.vm.$nextTick()
      const button = wrapper.find('#edit-1')
      button.trigger('click')
      expect(runs.$route.path).toEqual('/saphyr/run/1')
    })
  })

  describe('#showAlert', () => {
    it('emits an event with the message', async () => {
      await wrapper.vm.$nextTick()
      runs.showAlert('show this message', 'danger')
      expect(Object.values(store.state.traction.messages)).toContainEqual({
        type: 'danger',
        message: 'show this message',
      })
    })
  })

  describe('pagination', () => {
    beforeEach(() => {
      wrapper = mount(Runs, {
        store,
        localVue,
        data() {
          return {
            perPage: 2,
            currentPage: 1,
          }
        },
      })
    })

    it('will paginate the runs in the table', async () => {
      await wrapper.vm.$nextTick()
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
    })
  })

  describe('#provider', () => {
    beforeEach(() => {
      wrapper = mount(Runs, { store, localVue })
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
