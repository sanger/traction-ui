import ONTRuns from '@/views/ont/ONTRuns'
import { mount, localVue, store, Data, router } from '@support/testHelper'
import Response from '@/api/Response'

describe('ONTRuns.vue', () => {
  let wrapper, runs, mockRuns

  beforeEach(() => {
    mockRuns = new Response(Data.OntRuns).deserialize.runs
    store.commit('traction/ont/runs/setRuns', mockRuns)

    wrapper = mount(ONTRuns, { store, router, localVue })
    runs = wrapper.vm
    runs.provider = vi.fn()
  })

  describe('created hook', () => {
    it('sets the runs data', () => {
      expect(runs.runs.length).toEqual(mockRuns.length)
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
      expect(runs.$route.path).toEqual('/ont/run/new')
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

  describe('#provider', () => {
    beforeEach(() => {
      wrapper = mount(ONTRuns, { store, localVue })
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
})
