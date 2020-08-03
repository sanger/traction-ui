import PacbioRun from '@/views/pacbio/PacbioRun'    
import PacbioRuns from '@/views/pacbio/PacbioRuns'
import { mount, store, localVue } from '../../testHelper'
import VueRouter from 'vue-router'

describe('Run.vue', () => {

  let wrapper, mockRun, router, pacbioRun

  beforeEach(() => {
    router = new VueRouter({
      routes: [
        { path: '/run/:id', name: 'PacbioRun', component: PacbioRun },
        { path: '/runs', name: 'PacbioRuns', component: PacbioRuns },
      ]
    })

    mockRun = {
      id: '1',
      name: '',
      binding_kit_box_barcode: '',
      sequencing_kit_box_barcode: '',
      dna_control_complex_box_barcode: '',
      comments: '',
      system_name: '',
      plate: {
        wells: [
          { position: 'A1', library: { barcode: '' } },
          { position: 'A2', library: { barcode: '' } },
          { position: 'B1', library: { barcode: '' } },
          { position: 'B2', library: { barcode: '' } },
        ]
      }
    }

    store.commit('traction/pacbio/runs/setCurrentRun', mockRun)

    // TODO: remove shallowMount
    wrapper = mount(PacbioRun, {
        store, 
        router,
        localVue,
        stubs: {
          Plate: true,
          PacbioLibrariesList: true,
          PacbioRunInfo: true,
        },
        propsData: { id: 'new' }
    })
    pacbioRun = wrapper.vm
  })  

  describe('Alert', () => {
    it('has a alert', () => {
      expect(wrapper.findComponent({ref: 'alert'}).exists()).toBeTruthy()
    })
  })

  describe('Pacbio Run Info', () => {
    it('dispays the run infomation', () => {
      expect(wrapper.findComponent({ref: 'PacbioRunInfo'})).toBeTruthy()
    })
  })

  describe('Pacbio Libraries Table', () => {
    it('dispays the pacbio library table', () => {
      expect(wrapper.findComponent({ref: 'PacbioLibrariesList'})).toBeTruthy()
    })
  })

  describe('PacbioPlate', () => {
    it('dispays the pacbio run plate', () => {
      expect(wrapper.findComponent({ref: 'plate'})).toBeTruthy()
    })
  })

  describe('Back button', () => {
    it('will always show', () => {
      expect(wrapper.find('#backToRunsButton').exists()).toBeTruthy()
    })
  })

  describe('Reset button', () => {
    it('will show if the record is new', () => {
      expect(wrapper.find('#reset').exists()).toBeTruthy()
    })
  })
  
  describe('#create', () => {

    beforeEach(() => {
      pacbioRun.showAlert = jest.fn()
      pacbioRun.createRun = jest.fn()
      pacbioRun.redirectToRuns = jest.fn()
    })

    it('will show the create button', () => {
      expect(wrapper.find('#create').exists()).toBeTruthy()
    })

    it('calls createRun', async () => {
      pacbioRun.createRun.mockReturnValue([])

      await pacbioRun.runAction()
      expect(pacbioRun.createRun).toBeCalled()
    })

    it('successful', async () => {
      pacbioRun.createRun.mockReturnValue([])

      await pacbioRun.runAction()
      expect(pacbioRun.createRun).toBeCalled()
      expect(pacbioRun.redirectToRuns).toBeCalled()
    })

    it('unsuccessful', async () => {
      pacbioRun.createRun.mockReturnValue(['this is an error'])

      await pacbioRun.runAction()
      expect(pacbioRun.createRun).toBeCalled()
      expect(pacbioRun.showAlert).toBeCalledWith("Failed to create run in Traction: this is an error", 'danger')
      expect(pacbioRun.redirectToRuns).not.toBeCalled()
    })
  })

  // TODO: remove provider. May need to refactor pacbio run.
  describe('#update', () => {

    beforeEach(() => {
      wrapper = mount(PacbioRun, {
        store, 
        router,
        localVue,
        propsData: { id: 1},
        stubs: {
          Plate: true,
          PacbioLibrariesList: true,
          PacbioRunInfo: true,
        },
        methods: {
            provider() { return }
            
        }
      })
      pacbioRun = wrapper.vm

      pacbioRun.showAlert = jest.fn()
      pacbioRun.updateRun = jest.fn()
      pacbioRun.redirectToRuns = jest.fn()
    })

    it('will show the update button', () => {
      expect(wrapper.find('#update').exists()).toBeTruthy()
    })

    it('calls updateRun', async () => {
      pacbioRun.updateRun.mockReturnValue([])

      await pacbioRun.runAction()
      expect(pacbioRun.updateRun).toBeCalled()
    })

    it('successful', async () => {
      pacbioRun.updateRun.mockReturnValue([])

      await pacbioRun.runAction()
      expect(pacbioRun.updateRun).toBeCalled()
      expect(pacbioRun.redirectToRuns).toBeCalled()
    })

    it('unsuccessful', async () => {
      pacbioRun.updateRun.mockReturnValue(['this is an error'])

      await pacbioRun.runAction()
      expect(pacbioRun.updateRun).toBeCalled()
      expect(pacbioRun.showAlert).toBeCalledWith("Failed to create run in Traction: this is an error", 'danger')
      expect(pacbioRun.redirectToRuns).not.toBeCalled()
    })
  })

  describe('#reset', () => {

    beforeEach(() => {
        pacbioRun.showAlert = jest.fn()
        pacbioRun.newRun = jest.fn()
    })

    it('calls newRun', async () => {
      pacbioRun.newRun.mockReturnValue([])
      pacbioRun.resetRun()
      expect(pacbioRun.newRun).toBeCalled()
      expect(pacbioRun.showAlert).toBeCalledWith("Run has been reset", 'success')
    })
  })
})
