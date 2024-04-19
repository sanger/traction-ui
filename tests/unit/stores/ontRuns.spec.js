import { useOntRunsStore } from '@/stores/ontRuns'
import useOntRootStore from '@/stores/ontRoot'
import useRootStore from '@/stores'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout'
import { Data, createPinia, setActivePinia } from '@support/testHelper'
import Response from '@/api/v1/Response'
import { beforeEach, describe } from 'vitest'
import { flowCellType } from '@/stores/utilities/flowCell'

describe('useOntRunsStore', () => {
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('state', () => {
    it('should have an intialized state for currentrRunObj on initial load', () => {
      const store = useOntRunsStore()
      expect(store.currentRun).toEqual({
        flowcell_attributes: [{ ...flowCellType }],
        id: 'new',
        instrument_name: null,
        state: null,
      })
    })
  })
  describe('getters', () => {
    let store
    beforeEach(() => {
      store = useOntRunsStore()
      store.currentRun = {
        id: 1,
      }
      store.instruments = new Response(Data.OntInstruments).deserialize.instruments
      store.instrumentFlowcellLayout = InstrumentFlowcellLayout
    })

    it('"runRequest" returns "state.runRequest"', () => {
      const rootStore = useRootStore()
      const get = vi.fn()
      get.mockResolvedValue(Data.OntRuns)
      rootStore.api = {
        traction: { ont: { runs: 'aRunRequest' } },
      }
      const actual = store.runRequest
      expect(actual).toEqual('aRunRequest')
    })
  })
  describe('actions', () => {
    let failedResponse
    beforeEach(() => {
      failedResponse = {
        errors: [
          {
            title: 'Invalid field value',
            detail: 'started is not a valid value for state.',
            code: '103',
            status: '400',
          },
        ],
      }
    })
    describe('#newRun', () => {
      it('runs successfully', () => {
        const store = useOntRunsStore()
        store.currentRun = {
          id: 1,
          instrument_name: 'GXB02004',
          state: 'pending',
          flowcell_attributes: [{ tube_barcode: 'TRAC-A-1' }],
        }
        const newRun = {
          id: 'new',
          instrument_name: null,
          state: null,
          flowcell_attributes: [{ ...flowCellType }],
        }
        store.newRun()
        expect(store.currentRun).toEqual(newRun)
      })
    })

    describe('#createRun', () => {
      let create, store

      beforeEach(() => {
        create = vi.fn()
        store = useOntRunsStore()
        store.currentRun = {
          id: 1,
          instrument_name: 'GXB02004',
          state: 'pending',
          flowcell_attributes: [{ tube_barcode: 'TRAC-A-1' }],
        }
        const ontRootStore = useOntRootStore()
        ontRootStore.resources.instruments = [{ id: 1, name: 'GXB02004' }]
      })

      it('runs successfully', async () => {
        const promise = Promise.resolve(Data.OntRun)
        create.mockReturnValue(promise)
        store.runRequest.create = create

        const response = await store.createRun()
        const payload = {
          data: {
            data: {
              type: 'runs',
              attributes: {
                ont_instrument_id: 1,
                state: 'pending',
                flowcell_attributes: [],
              },
            },
          },
        }
        expect(create).toBeCalledWith(payload)
        expect(response.success).toBeTruthy()
      })

      it('runs unsuccessfully', async () => {
        const promise = Promise.reject(failedResponse)
        create.mockReturnValue(promise)
        store.runRequest.create = create
        const response = await store.createRun()
        expect(response.success).toBeFalsy()
        expect(response.errors).toEqual(failedResponse)
      })
    })

    describe('#updateRun', () => {
      let update, store, run, payload

      beforeEach(() => {
        run = {
          id: '16',
          state: 'pending',
          instrument_name: 'GXB02004',
          flowcell_attributes: [],
        }

        payload = {
          data: {
            type: 'runs',
            id: '16',
            attributes: {
              state: 'pending',
              ont_instrument_id: 1,
              flowcell_attributes: [],
            },
          },
        }
        update = vi.fn()
        store = useOntRunsStore()
        store.currentRun = run
        const ontRootStore = useOntRootStore()
        ontRootStore.resources.instruments = [{ id: 1, name: 'GXB02004' }]
      })

      it('successfully', async () => {
        const promise = Promise.resolve(Data.OntRun)
        update.mockReturnValue(promise)

        store.runRequest.update = update
        const response = await store.updateRun()

        expect(update).toBeCalledWith(payload)
        expect(response.success).toBeTruthy()
      })

      it('unsuccessfully', async () => {
        const promise = Promise.reject(failedResponse)
        update.mockReturnValue(promise)

        store.runRequest.update = update

        const response = await store.updateRun()
        expect(update).toBeCalledWith(payload)

        expect(response.success).toBeFalsy()
        expect(response.errors).toEqual(failedResponse)
      })
    })
    describe('#fetchRun', () => {
      let store, mockRun

      beforeEach(() => {
        store = useOntRunsStore()
        store.currentRun = {
          id: 1,
          instrument_name: 'GXB02004',
          state: 'pending',
          flowcell_attributes: [{ tube_barcode: 'TRAC-A-1' }],
        }
        const ontRootStore = useOntRootStore()
        ontRootStore.resources.instruments = [{ id: 1, name: 'GXB02004' }]

        mockRun = {
          id: 1,
          instrument_name: 'GXB02004',
          state: 'pending',
          flowcell_attributes: [],
        }
      })

      it('runs successfully', async () => {
        const find = vi.fn().mockReturnValue({
          success: true,
          data: {
            data: {
              id: mockRun.id,
              attributes: {
                state: mockRun.state,
                ont_instrument_id: 1,
              },
            },
            flowcell_attributes: mockRun.flowcell_attributes,
          },
          errors: [],
        })
        store.runRequest.find = find
        const response = await store.fetchRun(mockRun.id)
        expect(store.currentRun).toEqual(mockRun)
        expect(response.success).toBeTruthy()
      })
    })
    describe('#setPoolTubeBarcode', () => {
      let store
      beforeEach(() => {
        store = useOntRunsStore()
        store.currentRun = {
          id: '1',
          instrument_name: '',
          state: 'pending',
          flowcell_attributes: [],
        }
      })
      it('creates a flowcell object if one does not exist already for the position', () => {
        const obj = { barcode: 'TRAC-A-1', position: '1' }
        store.setPoolTubeBarcode(obj)
        expect(store.currentRun.flowcell_attributes.length).toEqual(1)
        expect(store.currentRun.flowcell_attributes[0]).toEqual({
          ...flowCellType,
          tube_barcode: 'TRAC-A-1',
          position: '1',
        })
      })

      it('updates the flowcell object is one exists for the position', () => {
        store.setPoolTubeBarcode({ barcode: 'TRAC-A-1', position: '1' })
        const obj = { barcode: 'TRAC-A-2', position: '1' }
        store.setPoolTubeBarcode(obj)
        expect(store.currentRun.flowcell_attributes.length).toEqual(1)
        expect(store.currentRun.flowcell_attributes[0]).toEqual({
          ...flowCellType,
          tube_barcode: 'TRAC-A-2',
          position: '1',
        })
      })
    })

    describe('#setFlowcellId', () => {
      let store
      beforeEach(() => {
        store = useOntRunsStore()
        store.currentRun = {
          id: '1',
          instrument_name: '',
          state: 'pending',
          flowcell_attributes: [],
        }
      })
      it('creates a flowcell object if one does not exist already for the position', () => {
        const obj = { $event: 'flowcell1', position: '1' }
        store.setFlowcellId(obj)
        expect(store.currentRun.flowcell_attributes.length).toEqual(1)
        expect(store.currentRun.flowcell_attributes[0]).toEqual({
          ...flowCellType,
          flowcell_id: 'flowcell1',
          position: '1',
        })
      })

      it('updates the flowcell object is one exists for the position', () => {
        store.setFlowcellId({ $event: 'flowcell1', position: '1' })
        const obj = { $event: 'flowcell1updated', position: '1' }
        store.setFlowcellId(obj)
        expect(store.currentRun.flowcell_attributes.length).toEqual(1)
        expect(store.currentRun.flowcell_attributes[0]).toEqual({
          ...flowCellType,
          flowcell_id: 'flowcell1updated',
          position: '1',
        })
      })
    })
    describe('#setInstrumentName', () => {
      it('sets instrument run in current run', () => {
        const store = useOntRunsStore()
        store.currentRun = {
          id: '1',
          instrument_name: '',
          state: 'pending',
          flowcell_attributes: [],
        }
        store.setInstrumentName('Instrument1')
        expect(store.currentRun.instrument_name).toEqual('Instrument1')
      })
    })
    describe('#setCurrenttRun', () => {
      it('sets current run', () => {
        const store = useOntRunsStore()
        store.currentRun = {
          id: '',
          instrument_name: '',
          state: '',
          flowcell_attributes: [],
        }
        const run = {
          id: '2',
          instrument_name: 'Instrument1',
          state: 'active',
          flowcell_attributes: [{ tube_barcode: 'TRAC-A-1' }],
        }
        store.setCurrentRun(run)
        expect(store.currentRun).toEqual(run)
      })
    })
    describe('#setState', () => {
      it('sets state of current run', () => {
        const store = useOntRunsStore()
        store.currentRun = {
          id: '',
          instrument_name: '',
          state: '',
          flowcell_attributes: [],
        }
        store.setState('active')
        expect(store.currentRun.state).toEqual('active')
      })
    })
  })
})
