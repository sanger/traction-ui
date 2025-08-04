import { useOntRunsStore } from '@/stores/ontRuns.js'
import useOntRootStore from '@/stores/ontRoot.js'
import useRootStore from '@/stores'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout.json'
import { createPinia, setActivePinia } from '@support/testHelper.js'
import { beforeEach, describe, expect } from 'vitest'
import OntInstrumentFactory from '@tests/factories/OntInstrumentFactory.js'
import OntRunFactory from '@tests/factories/OntRunFactory.js'
import { successfulResponse } from '@tests/support/testHelper.js'
import OntPoolFactory from '@tests/factories/OntPoolFactory.js'
import * as ontRuns from '@/stores/utilities/ontRuns.js'

const ontInstrumentFactory = OntInstrumentFactory()
const ontRunFactory = OntRunFactory()
const ontPoolFactory = OntPoolFactory()

describe('useOntRunsStore', () => {
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('state', () => {
    it('should have the correct initialised state', () => {
      const store = useOntRunsStore()
      expect(store.currentRun).toEqual({
        flowcell_attributes: [],
        id: 'new',
        instrument_name: null,
        state: null,
        rebasecalling_process: null,
      })
      expect(store.pools).toEqual({})
    })
  })

  describe('getters', () => {
    let store
    beforeEach(() => {
      store = useOntRunsStore()
      store.currentRun = {
        id: 1,
      }
      store.instruments = ontInstrumentFactory.storeData.instruments
      store.instrumentFlowcellLayout = InstrumentFlowcellLayout
    })

    it('"runRequest" returns "state.runRequest"', () => {
      const rootStore = useRootStore()
      const get = vi.fn()
      get.mockResolvedValue(ontRunFactory.responses.fetch)
      rootStore.api = {
        traction: { ont: { runs: 'aRunRequest' } },
      }
      const actual = store.runRequest
      expect(actual).toEqual('aRunRequest')
    })

    describe('#getOrCreateFlowCell', () => {
      it('returns a flowcell if one is found at the given position', () => {
        store.currentRun = {
          flowcell_attributes: [{ tube_barcode: '123', flowcell_id: '1', position: 1 }],
        }
        const actual = store.getOrCreateFlowCell(1)
        expect(actual).toEqual({ tube_barcode: '123', flowcell_id: '1', position: 1 })
      })

      it('creates a new flowcell if one does not exist at the given position', () => {
        store.currentRun = {
          flowcell_attributes: [],
        }
        const actual = store.getOrCreateFlowCell(1)
        expect(actual).toEqual(
          expect.objectContaining({
            position: 1,
            errors: {},
            flowcell_id: '',
            tube_barcode: '',
            type: 'FlowCell',
          }),
        )
      })
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
        store.newRun()
        expect(store.currentRun).toEqual({
          flowcell_attributes: [],
          id: 'new',
          instrument_name: null,
          state: null,
          rebasecalling_process: null,
        })
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
          rebasecalling_process: '6mA all-context',
          flowcell_attributes: [{ tube_barcode: 'TRAC-2-42', flowcell_id: 1 }],
        }
        store.pools = { 1: { id: '1', tube: 1, tube_barcode: 'TRAC-2-42' } }
        const ontRootStore = useOntRootStore()
        ontRootStore.resources.instruments = [{ id: 1, name: 'GXB02004' }]
      })

      // tidy this up so we are pulling the data from the factory
      it('runs successfully', async () => {
        create.mockReturnValue(successfulResponse())
        store.runRequest.create = create
        const response = await store.createRun()
        const payload = {
          data: {
            data: {
              type: 'runs',
              attributes: {
                ont_instrument_id: 1,
                state: 'pending',
                rebasecalling_process: '6mA all-context',
                flowcell_attributes: [
                  { tube_barcode: 'TRAC-2-42', flowcell_id: 1, ont_pool_id: '1' },
                ],
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
          rebasecalling_process: '6mA all-context',
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
              rebasecalling_process: '6mA all-context',
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
        update.mockReturnValue(ontRunFactory.responses.fetch)

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
      let store
      beforeEach(() => {
        store = useOntRunsStore()
        const ontRootStore = useOntRootStore()
        ontRootStore.resources.instruments = ontInstrumentFactory.storeData.instruments
        ontRootStore.instrumentFlowcellLayout = InstrumentFlowcellLayout
      })

      it('runs successfully', async () => {
        const ontSingleRunFactory = OntRunFactory({ findBy: 'flowcells' })
        const find = vi.fn().mockReturnValue(ontSingleRunFactory.responses.fetch)
        store.runRequest.find = find

        const formattedRun = ontRuns.buildFormatedOntRun(
          Object.values(ontInstrumentFactory.storeData.instruments),
          Object.values(ontPoolFactory.storeData.resources.pools),
          ontSingleRunFactory.content.data,
          ontSingleRunFactory.content.included,
        )

        const response = await store.fetchRun(ontSingleRunFactory.content.data.id)
        expect(store.currentRun).toEqual({
          ...formattedRun,
          flowcell_attributes: [
            {
              errors: {},
              type: 'FlowCell',
              flowcell_id: 'ABC1234',
              ont_pool_id: 7,
              position: 1,
              tube_barcode: 'TRAC-2-34',
              validateBarcode: expect.any(Function),
              validateFlowCellId: expect.any(Function),
            },
          ],
        })
        expect(response.success).toBeTruthy()
      })
    })

    describe('#fetchPool', () => {
      let store

      beforeEach(() => {
        store = useOntRunsStore()
      })

      it('returns success true if the barcode is empty', async () => {
        const response = await store.fetchPool('')
        expect(response.success).toBeTruthy()
      })

      it('returns success true and sets the pool to state if the barcode is found', async () => {
        const rootStore = useRootStore()
        const get = vi.fn().mockReturnValue({
          status: 200,
          statusText: 'OK',
          ok: true,
          json: () =>
            Promise.resolve({
              data: [{ id: 7, type: 'pools', attributes: { tube: 2, tube_barcode: 'TRAC-2-34' } }],
            }),
        })
        rootStore.api.traction.ont.pools = { get }

        const response = await store.fetchPool('TRAC-2-34')
        expect(store.pools).toEqual({
          7: { id: 7, tube: 2, tube_barcode: 'TRAC-2-34', type: 'pools' },
        })
        expect(response.success).toBeTruthy()
      })

      it('returns success false and returns an error if the pool is not found', async () => {
        const rootStore = useRootStore()
        const get = vi.fn().mockReturnValue(failedResponse)
        rootStore.api.traction.ont.pools = { get }

        const response = await store.fetchPool('TRAC-2-34')
        expect(response.success).toBeFalsy()
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

    describe('#setCurrentRun', () => {
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

    describe('#setNewFlowCell', () => {
      it('adds a new flowcell to the current run', () => {
        const store = useOntRunsStore()
        store.currentRun = {
          id: '',
          instrument_name: '',
          state: '',
          flowcell_attributes: [],
        }
        store.setNewFlowCell('A1')
        expect(store.currentRun.flowcell_attributes).toEqual([
          {
            type: 'FlowCell',
            position: 'A1',
            flowcell_id: '',
            tube_barcode: '',
            errors: {},
            validateBarcode: expect.any(Function),
            validateFlowCellId: expect.any(Function),
          },
        ])
      })
    })
  })
})
