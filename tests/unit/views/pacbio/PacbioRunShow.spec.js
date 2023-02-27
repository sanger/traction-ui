import PacbioRun from '@/views/pacbio/PacbioRunShow'
import { localVue, mount, store, router } from '@support/testHelper'
import { beforeEach, describe, expect, it } from 'vitest'

const smrtLinkVersions = [
  {
    id: 1,
    name: 'v10',
    default: true,
  },
  {
    id: 2,
    name: 'v11',
    default: false,
  },
]

describe('Run.vue', () => {
  let wrapper, mockRun, pacbioRun

  beforeEach(() => {
    mockRun = {
      id: '1',
      name: '',
      sequencing_kit_box_barcode: '',
      dna_control_complex_box_barcode: '',
      comments: '',
      system_name: '',
      wellDefaults: {
        binding_kit_box_barcode: '',
        ccs_analysis_output: 'Yes',
        generate_hifi: 'On Instrument',
        loading_target_p1_plus_p2: 0.85,
        movie_time: '',
        pre_extension_time: 2,
      },
      plate: {
        wells: [
          { position: 'A1', pools: [{ tube: { barcode: 'TRAC-1-1' } }] },
          { position: 'A2', pools: [{ tube: { barcode: 'TRAC-1-2' } }] },
          { position: 'B1', pools: [{ tube: { barcode: 'TRAC-1-3' } }] },
          { position: 'B2', pools: [{ tube: { barcode: 'TRAC-1-4' } }] },
        ],
      },
    }

    store.state.traction.pacbio.runCreate.resources.smrtLinkVersions = smrtLinkVersions
    mockRun.smrt_link_version_id = 1
    store.commit('traction/pacbio/runs/setCurrentRun', mockRun)

    wrapper = mount(PacbioRun, {
      store,
      router,
      localVue,
      stubs: {
        Plate: true,
        pacbioPoolList: true,
        PacbioRunInfoEdit: true,
      },
      propsData: { id: 'new' },
    })
    pacbioRun = wrapper.vm
  })

  describe('Pacbio Run Info', () => {
    it('dispays the run infomation', () => {
      expect(wrapper.findComponent({ ref: 'PacbioRunInfoEdit' })).toBeTruthy()
    })
  })

  describe('Pacbio Libraries Table', () => {
    it('dispays the pacbio library table', () => {
      expect(wrapper.findComponent({ ref: 'pacbioPoolList' })).toBeTruthy()
    })
  })

  describe('PacbioPlate', () => {
    it('dispays the pacbio run plate', () => {
      expect(wrapper.findComponent({ ref: 'plate' })).toBeTruthy()
    })
  })

  describe('Back button', () => {
    // TODO: not sure this is needed anymore?
    it('will always show', () => {
      expect(wrapper.find('#backToRunsButton').exists()).toBeTruthy()
      wrapper.find('#backToRunsButton').trigger('click')
      expect(wrapper.vm.$route.path).toBe('/pacbio/runs')
    })
  })

  describe('Reset button', () => {
    it('will show if the record is new', () => {
      expect(wrapper.find('#reset').exists()).toBeTruthy()
    })
  })

  describe('#create', () => {
    beforeEach(() => {
      pacbioRun.showAlert = vi.fn()
      pacbioRun.createRun = vi.fn()
      pacbioRun.redirectToRuns = vi.fn()
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
      expect(pacbioRun.showAlert).toBeCalledWith(
        'Failed to create run in Traction: this is an error',
        'danger',
        'run-validation-message',
      )
      expect(pacbioRun.redirectToRuns).not.toBeCalled()
    })
  })

  describe('#update', () => {
    beforeEach(() => {
      // create the mock of the method before mounting it for testing
      vi.spyOn(PacbioRun.methods, 'provider').mockImplementation(() => {})

      wrapper = mount(PacbioRun, {
        store,
        router,
        localVue,
        propsData: { id: 1 },
        stubs: {
          Plate: true,
          pacbioPoolList: true,
          PacbioRunInfoEdit: true,
        },
      })
      pacbioRun = wrapper.vm

      pacbioRun.showAlert = vi.fn()
      pacbioRun.updateRun = vi.fn()
      pacbioRun.editRun = vi.fn()
      pacbioRun.redirectToRuns = vi.fn()
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
      expect(pacbioRun.showAlert).toBeCalledWith(
        'Failed to create run in Traction: this is an error',
        'danger',
        'run-validation-message',
      )
      expect(pacbioRun.redirectToRuns).not.toBeCalled()
    })
  })

  describe('#created', () => {
    it('"findPools" gets called with a list of barcodes', () => {
      // TODO: awaiting refactoring
      // pacbioRun.findPools = vi.fn()
      // pacbioRun.editRun = vi.fn()
      // wrapper = mount(PacbioRun, {
      //   propsData: { id: 1 },
      //   store,
      //   router,
      //   localVue,
      //   stubs: {
      //     Plate: true,
      //     pacbioPoolList: true,
      //     PacbioRunInfoEdit: true,
      //   },
      // })
      // pacbioRun = wrapper.vm
      // expect(pacbioRun.findPools).toBeCalledWith({ barcode: 'TRAC-1-1,TRAC-1-2,TRAC-1-3,TRAC-1-4' })
    })
  })

  describe('#reset', () => {
    beforeEach(() => {
      pacbioRun.showAlert = vi.fn()
      pacbioRun.newRun = vi.fn()
    })

    it('calls newRun', async () => {
      pacbioRun.newRun.mockReturnValue([])
      pacbioRun.resetRun()
      expect(pacbioRun.newRun).toBeCalled()
      expect(pacbioRun.showAlert).toBeCalledWith(
        'Run has been reset',
        'success',
        'run-validation-message',
      )
    })
  })
})
