import PacbioRuns from '@/views/pacbio/PacbioRunIndex'
import { mount, localVue, store, Data, router } from 'testHelper'
import Response from '@/api/Response'

describe('Runs.vue', () => {
  let wrapper, runs, mockRuns

  beforeEach(() => {
    mockRuns = new Response(Data.PacbioRuns).deserialize.runs

    store.commit('traction/pacbio/runs/setRuns', mockRuns)

    wrapper = mount(PacbioRuns, { store, router, localVue })
    runs = wrapper.vm
    runs.provider = jest.fn()
  })

  describe('created hook', () => {
    it('sets the runs data', () => {
      expect(runs.runs).toEqual(mockRuns)
    })
  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.findComponent({ ref: 'alert' })).toBeTruthy
    })
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
      let button = wrapper.find('#newRun')
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
      runs.startRun = jest.fn()

      button = wrapper.find('#startRun-1')
      button.trigger('click')
      expect(runs.startRun).toBeCalledWith(mockRuns[0].id)
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
      runs.completeRun = jest.fn()

      button = wrapper.find('#completeRun-2')
      button.trigger('click')

      expect(runs.completeRun).toBeCalledWith(mockRuns[1].id)
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
      runs.cancelRun = jest.fn()

      button = wrapper.find('#cancelRun-2')
      button.trigger('click')

      expect(runs.cancelRun).toBeCalledWith(mockRuns[1].id)
    })
  })

  describe('sorting', () => {
    it('will sort the runs by created at', () => {
      expect(
        wrapper
          .find('tbody')
          .findAll('tr')
          .at(0)
          .text(),
      ).toMatch(/Sequel II/)
    })
  })

  describe('filtering runs', () => {
    beforeEach(() => {
      wrapper = mount(PacbioRuns, {
        store,
        localVue,
        data() {
          return {
            filter: mockRuns[0].name,
          }
        },
      })
      wrapper.vm.provider = jest.fn()
    })

    it('will filter the runs in the table', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(1)
      expect(
        wrapper
          .find('tbody')
          .findAll('tr')
          .at(0)
          .text(),
      ).toMatch(/Sequel I/)
    })
  })

  describe('#showAlert', () => {
    it('emits an event with the message', () => {
      runs.showAlert(/show this message/)

      wrapper.vm.$nextTick(() => {
        expect(wrapper.findComponent({ ref: 'alert' }).text()).toMatch(/show this message/)
      })
    })
  })

  describe('pagination', () => {
    beforeEach(() => {
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
      wrapper.vm.provider = jest.fn()
    })

    it('will paginate the runs in the table', () => {
      expect(wrapper.find('tbody').findAll('tr').length).toEqual(2)
    })
  })

  describe('#provider', () => {
    beforeEach(() => {
      wrapper = mount(PacbioRuns, { store, localVue })
      runs = wrapper.vm

      runs.setRuns = jest.fn()
      runs.showAlert = jest.fn()
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
    beforeEach(() => {
      runs.startRun = jest.fn()
      runs.completeRun = jest.fn()
      runs.cancelRun = jest.fn()
      runs.showAlert = jest.fn()
    })

    it('calls startRun successfully', () => {
      runs.updateRun('start', 1)
      expect(runs.startRun).toBeCalledWith(1)
    })

    it('calls completeRun successfully', () => {
      runs.updateRun('complete', 1)
      expect(runs.completeRun).toBeCalledWith(1)
    })

    it('calls cancelRun successfully', () => {
      runs.updateRun('cancel', 1)
      expect(runs.cancelRun).toBeCalledWith(1)
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
        process.env.VUE_APP_TRACTION_BASE_URL + '/v1/pacbio/runs/' + id + '/sample_sheet',
      )
    })
  })

  describe('Edit Run button', () => {
    it('contains a Edit Run button', () => {
      expect(wrapper.find('#editRun-1')).toBeDefined()
    })

    it('will call editRun when Edit is clicked', async () => {
      let button = wrapper.find('#editRun-1')
      button.trigger('click')
      expect(runs.$route.path).toEqual('/pacbio/run/1')
    })
  })
})
