import PacbioRun from '@/views/pacbio/PacbioRunShow'
import { localVue, mount, store, router, Data } from '@support/testHelper'
import { beforeEach, describe, expect, it } from 'vitest'
import { newRunType, existingRunType } from '@/store/traction/pacbio/runCreate/run'

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

describe('PacbioRunShow.vue', () => {
  beforeEach(() => {
    store.state.traction.pacbio.runCreate.resources.smrtLinkVersions = smrtLinkVersions
  })

  describe('new', () => {
    it('shows as a new run ', () => {
      const {
        state: {
          api: {
            traction: {
              pacbio: { smrt_link_versions: smrtLinkVersionsRequest },
            },
          },
        },
      } = store

      smrtLinkVersionsRequest.get = vi.fn()

      const wrapper = mount(PacbioRun, {
        store,
        router,
        localVue,
        stubs: {
          Plate: true,
          pacbioPoolList: true,
          PacbioRunInfoEdit: true,
          PacbioRunWellDefaultEdit: true,
        },
        propsData: { id: 'new' },
      })

      const type = newRunType

      const button = wrapper.find(`[data-action=${type.id}]`)
      expect(button.element.id).toEqual(type.id)
      expect(button.text()).toEqual(type.label)
    })
  })

  describe('existing run', () => {
    it('shows as an existing run ', () => {
      const {
        state: {
          api: {
            traction: {
              pacbio: {
                smrt_link_versions: smrtLinkVersionsRequest,
                runs: runsRequest,
                pools: poolsRequest,
              },
            },
          },
        },
      } = store

      smrtLinkVersionsRequest.get = vi.fn()
      runsRequest.find = vi.fn(() => Data.PacbioRun)
      poolsRequest.get = vi.fn(() => Data.PacbioPool)

      const wrapper = mount(PacbioRun, {
        store,
        router,
        localVue,
        stubs: {
          Plate: true,
          pacbioPoolList: true,
          PacbioRunInfoEdit: true,
          PacbioRunWellDefaultEdit: true,
        },
        propsData: { id: 1 },
      })

      const type = existingRunType

      const button = wrapper.find(`[data-action=${type.id}]`)
      expect(button.element.id).toEqual(type.id)
      expect(button.text()).toEqual(type.label)
    })
  })
})

// describe('PacbioRunShow.vue', () => {
//   let wrapper, mockRun, pacbioRun

//   beforeEach(() => {
//     mockRun = {
//       id: '1',
//       name: '',
//       sequencing_kit_box_barcode: '',
//       dna_control_complex_box_barcode: '',
//       comments: '',
//       system_name: '',
//       wellDefaults: {
//         binding_kit_box_barcode: '',
//         ccs_analysis_output: 'Yes',
//         generate_hifi: 'On Instrument',
//         loading_target_p1_plus_p2: 0.85,
//         movie_time: '',
//         pre_extension_time: 2,
//       },
//       plate: {
//         wells: [
//           { position: 'A1', pools: [{ tube: { barcode: 'TRAC-1-1' } }] },
//           { position: 'A2', pools: [{ tube: { barcode: 'TRAC-1-2' } }] },
//           { position: 'B1', pools: [{ tube: { barcode: 'TRAC-1-3' } }] },
//           { position: 'B2', pools: [{ tube: { barcode: 'TRAC-1-4' } }] },
//         ],
//       },
//     }

//     mockRun.smrt_link_version_id = 1
//     store.commit('traction/pacbio/runs/setCurrentRun', mockRun)

//     wrapper = mount(PacbioRun, {
//       store,
//       router,
//       localVue,
//       stubs: {
//         Plate: true,
//         pacbioPoolList: true,
//         PacbioRunInfoEdit: true,
//       },
//       propsData: { id: 'new' },
//     })
//     pacbioRun = wrapper.vm
//   })

//   describe('Reset button', () => {
//     it('will show if the record is new', () => {
//       expect(wrapper.find('#reset').exists()).toBeTruthy()
//     })
//   })

//   describe('#create', () => {
//     beforeEach(() => {
//       pacbioRun.showAlert = vi.fn()
//       pacbioRun.createRun = vi.fn()
//       pacbioRun.redirectToRuns = vi.fn()
//     })

//     it('will show the create button', () => {
//       expect(wrapper.find('#create').exists()).toBeTruthy()
//     })

//     it('calls createRun', async () => {
//       pacbioRun.createRun.mockReturnValue([])

//       await pacbioRun.runAction()
//       expect(pacbioRun.createRun).toBeCalled()
//     })

//     it('successful', async () => {
//       pacbioRun.createRun.mockReturnValue([])

//       await pacbioRun.runAction()
//       expect(pacbioRun.createRun).toBeCalled()
//       expect(pacbioRun.redirectToRuns).toBeCalled()
//     })

//     it('unsuccessful', async () => {
//       pacbioRun.createRun.mockReturnValue(['this is an error'])

//       await pacbioRun.runAction()
//       expect(pacbioRun.createRun).toBeCalled()
//       expect(pacbioRun.showAlert).toBeCalledWith(
//         'Failed to create run in Traction: this is an error',
//         'danger',
//         'run-validation-message',
//       )
//       expect(pacbioRun.redirectToRuns).not.toBeCalled()
//     })
//   })

//   describe('#update', () => {
//     beforeEach(() => {
//       // create the mock of the method before mounting it for testing
//       vi.spyOn(PacbioRun.methods, 'provider').mockImplementation(() => {})

//       wrapper = mount(PacbioRun, {
//         store,
//         router,
//         localVue,
//         propsData: { id: 1 },
//         stubs: {
//           Plate: true,
//           pacbioPoolList: true,
//           PacbioRunInfoEdit: true,
//         },
//       })
//       pacbioRun = wrapper.vm

//       pacbioRun.showAlert = vi.fn()
//       pacbioRun.updateRun = vi.fn()
//       pacbioRun.editRun = vi.fn()
//       pacbioRun.redirectToRuns = vi.fn()
//     })

//     it('will show the update button', () => {
//       expect(wrapper.find('#update').exists()).toBeTruthy()
//     })

//     it('calls updateRun', async () => {
//       pacbioRun.updateRun.mockReturnValue([])

//       await pacbioRun.runAction()
//       expect(pacbioRun.updateRun).toBeCalled()
//     })

//     it('successful', async () => {
//       pacbioRun.updateRun.mockReturnValue([])

//       await pacbioRun.runAction()
//       expect(pacbioRun.updateRun).toBeCalled()
//       expect(pacbioRun.redirectToRuns).toBeCalled()
//     })

//     it('unsuccessful', async () => {
//       pacbioRun.updateRun.mockReturnValue(['this is an error'])

//       await pacbioRun.runAction()
//       expect(pacbioRun.updateRun).toBeCalled()
//       expect(pacbioRun.showAlert).toBeCalledWith(
//         'Failed to create run in Traction: this is an error',
//         'danger',
//         'run-validation-message',
//       )
//       expect(pacbioRun.redirectToRuns).not.toBeCalled()
//     })
//   })

//   describe.skip('#created', () => {
//     it('"findPools" gets called with a list of barcodes', () => {
//       // TODO: awaiting refactoring
//       pacbioRun.findPools = vi.fn()
//       pacbioRun.editRun = vi.fn()
//       wrapper = mount(PacbioRun, {
//         propsData: { id: 1 },
//         store,
//         router,
//         localVue,
//         stubs: {
//           Plate: true,
//           pacbioPoolList: true,
//           PacbioRunInfoEdit: true,
//         },
//       })
//       pacbioRun = wrapper.vm
//       expect(pacbioRun.findPools).toBeCalledWith({ barcode: 'TRAC-1-1,TRAC-1-2,TRAC-1-3,TRAC-1-4' })
//     })
//   })

//   describe('#reset', () => {
//     beforeEach(() => {
//       pacbioRun.showAlert = vi.fn()
//       pacbioRun.newRun = vi.fn()
//     })

//     it('calls newRun', async () => {
//       pacbioRun.newRun.mockReturnValue([])
//       pacbioRun.resetRun()
//       expect(pacbioRun.newRun).toBeCalled()
//       expect(pacbioRun.showAlert).toBeCalledWith(
//         'Run has been reset',
//         'success',
//         'run-validation-message',
//       )
//     })
//   })
// })
