import { createPinia, setActivePinia } from 'pinia'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate'
import useRootStore from '@/stores'
import storePools from '@tests/data/StorePools'
import { Data } from '@support/testHelper'
import * as jsonapi from '@/api/JsonApi'
import {
  newRun,
  newPlate,
  newWell,
  createRunType,
  newRunType,
  existingRunType,
  defaultWellAttributes,
} from '@/stores/utilities/run'
import { beforeEach, expect, vi } from 'vitest'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes'

describe('usePacbioRunCreateStore', () => {
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })
  describe('getters', () => {
    // TODO: we probably need to sort the way we create the pools for tests
    const mockPools = [
      {
        id: '1',
        type: 'pools',
        barcode: 'TRAC-2-1',
        libraries: [
          {
            id: '1',
            sample_name: 'Sample48',
            group_id: 'bc1019',
            type: 'libraries',
            run_suitability: {
              ready_for_run: true,
              errors: [],
            },
          },
        ],
        tube: '1',
        volume: 1.0,
        concentration: 1.0,
        template_prep_kit_box_barcode: 'LK12345',
        insert_size: 100,
        source_identifier: 'DN1:A1',
        created_at: '2021-07-15T15:26:29.000Z',
        updated_at: '2021-07-15T15:26:29.000Z',
        run_suitability: {
          ready_for_run: true,
          errors: [],
          formattedErrors: [],
        },
      },
      {
        id: '2',
        type: 'pools',
        barcode: 'TRAC-2-2',
        libraries: [
          {
            id: '2',
            sample_name: 'Sample47',
            group_id: 'bc1011_BAK8A_OA',
            type: 'libraries',
            run_suitability: {
              ready_for_run: false,
              errors: [
                {
                  title: "can't be blank",
                  detail: "insert_size - can't be blank",
                  code: '100',
                  source: {
                    pointer: '/data/attributes/insert_size',
                  },
                },
              ],
            },
          },
        ],
        tube: '2',
        volume: 1.0,
        concentration: 1.0,
        template_prep_kit_box_barcode: 'LK12345',
        insert_size: null,
        source_identifier: 'DN1:B1',
        created_at: '2021-07-15T15:26:29.000Z',
        updated_at: '2021-07-15T15:26:29.000Z',
        run_suitability: {
          ready_for_run: false,
          formattedErrors: [
            "Pool insert_size - can't be blank",
            'Pool libraries - is invalid',
            "Library 2 (Sample47) insert_size - can't be blank",
          ],
          errors: [
            {
              title: "can't be blank",
              detail: "insert_size - can't be blank",
              code: '100',
              source: {
                pointer: '/data/attributes/insert_size',
              },
            },
            {
              title: 'is invalid',
              detail: 'libraries - is invalid',
              code: '100',
              source: {
                pointer: '/data/relationships/libraries',
              },
            },
          ],
        },
      },
    ]

    const smrtLinkVersions = {
      1: {
        id: 1,
        name: 'v1',
        default: true,
        active: true,
      },
      2: {
        id: 2,
        name: 'v2',
        default: false,
        active: true,
      },
    }

    describe('smrtLinkVersionList', () => {
      it('returns a list of smrt link version resources', () => {
        const store = usePacbioRunCreateStore()
        store.resources.smrtLinkVersions = smrtLinkVersions
        expect(store.smrtLinkVersionList).toEqual(smrtLinkVersions)
      })
    })
    describe('defaultSmrtLinkVersion', () => {
      it('returns the default SMRT Link Version', () => {
        const store = usePacbioRunCreateStore()
        store.resources.smrtLinkVersions = smrtLinkVersions
        expect(store.defaultSmrtLinkVersion).toEqual(smrtLinkVersions[1])
      })
    })
    describe('poolsArray', () => {
      it('"poolsArray" returns denormalized pools from "state.pools"', () => {
        const store = usePacbioRunCreateStore()
        store.$state = { ...storePools }
        expect(store.poolsArray).toEqual(mockPools)
      })

      it('"poolByBarcode" returns the pool with the specified barcode from "state.pools"', () => {
        const store = usePacbioRunCreateStore()
        store.$state = { ...storePools }
        const actual = store.poolByBarcode('TRAC-2-1')
        expect(actual).toEqual(mockPools[0])
      })

      it('"pools" returns pools successfully and with an empty library group_id if that library has no tag', () => {
        const store = usePacbioRunCreateStore()
        store.$state = { ...storePools }
        store.libraries[1] = {
          id: '1',
          request: '1',
          tag: '',
          type: 'libraries',
          run_suitability: { ready_for_run: true, errors: [] },
        }
        expect(store.poolsArray[0].libraries[0].group_id).toEqual(undefined)
      })
    })
    describe('getOrCreateWell', () => {
       const plateNumber = 1
      it('if it is a new well', () => {
        const store = usePacbioRunCreateStore()
        store.$state = {
          wells: {
            [plateNumber]: {},
          },
          defaultWellAttributes: { ...defaultWellAttributes() },
        }
        const position = 'A1'
        const well = store.getOrCreateWell( position, plateNumber )
        expect(well).toEqual(newWell({ position, ...store.resources.defaultWellAttributes }))
      })

      it('if it is an existing well', () => {
        const position = 'A1'
        const well = newWell({ position })
        const store = usePacbioRunCreateStore()
        store.$state = {
          ...store.$state,
          wells: { 1: { [position]: well } },
          defaultWellAttributes: { ...defaultWellAttributes() },
        }
        const gottenWell = store.getOrCreateWell(position, plateNumber)
        expect(gottenWell).toEqual(well)
      })
    })
  })
  describe('actions', () => {
    const failedResponse = {
      data: { data: [] },
      status: 500,
      statusText: 'Internal Server Error',
    }

    const plateNumber = 1

    const plates = {
      1: { ...newPlate(plateNumber) },
    }

    const wells = {
      1: {
        A1: { ...newWell({ position: 'A1' }) },
        A2: { ...newWell({ position: 'A2' }), pools: [1, 2] },
        _destroy: [],
      },
    }

    const defaultSmrtLinkVersion = {
      id: '1',
      version: 'v1',
      default: true,
    }

    describe('fetchSmrtLinkVersions', () => {
      it('handles success', async () => {
        //Mock useRootStore
        const rootStore = useRootStore()
        const get = vi.fn()
        get.mockResolvedValue(Data.TractionPacbioSmrtLinkVersions)
        rootStore.api = { traction: { pacbio: { smrt_link_versions: { get } } } }

        const store = usePacbioRunCreateStore()

        //Mock populateStateBy
        const mockapi = vi.spyOn(jsonapi, 'populateStateBy')
        mockapi.mockImplementation = vi.fn()

        const { success } = await store.fetchSmrtLinkVersions()

        expect(mockapi).toHaveBeenCalled()
        expect(mockapi).toHaveBeenCalledWith(
          store.$state,
          'smrtLinkVersions',
          Data.TractionPacbioSmrtLinkVersions.data.data,
          jsonapi.dataToObjectById,
          { populateResources: true },
        )
        expect(success).toBeTruthy()
        expect(get).toHaveBeenCalled()
      })

      it('handles failure', async () => {
        //Mock useroot store
        const rootStore = useRootStore()
        const get = vi.fn()
        get.mockRejectedValue(failedResponse)
        rootStore.api = { traction: { pacbio: { smrt_link_versions: { get } } } }

        const store = usePacbioRunCreateStore()

        //Mock populateStateBy
        const mockapi = vi.spyOn(jsonapi, 'populateStateBy')
        mockapi.mockImplementation = vi.fn()

        // apply action
        const { success } = await store.fetchSmrtLinkVersions()
        expect(mockapi.mockImplementation).not.toHaveBeenCalled()
        expect(success).toBeFalsy()
      })
    })

    describe('fetchRun', () => {
      it('handles success', async () => {
        //Mock useRootStore
        const rootStore = useRootStore()
        const find = vi.fn()
        find.mockResolvedValue(Data.PacbioRun)
        rootStore.api = { traction: { pacbio: { runs: { find } } } }

        //Mock populateStateBy
        const mockApiPopulateBy = vi.spyOn(jsonapi, 'populateStateBy')
        mockApiPopulateBy.mockImplementation = vi.fn()

        //Mock splitDataByParent
        const mockApiSplitData = vi.spyOn(jsonapi, 'splitDataByParent')
        mockApiSplitData.mockImplementation = vi.fn()

        const store = usePacbioRunCreateStore()
        const { success } = await store.fetchRun({ id: 1 })

        const smartLinkVersion = Data.PacbioRun.data.included.slice(10)[0]
        const plates = Data.PacbioRun.data.included.slice(0, 2)
        const wells = Data.PacbioRun.data.included.slice(2, 5)
        const pools = Data.PacbioRun.data.included.slice(5, 6)
        const tubes = Data.PacbioRun.data.included.slice(6, 7)
        const libraries = Data.PacbioRun.data.included.slice(7, 8)
        const tags = Data.PacbioRun.data.included.slice(8, 9)
        const requests = Data.PacbioRun.data.included.slice(9, 10)

        const smrtLinkVersion = {
          id: smartLinkVersion.id,
          type: smartLinkVersion.type,
          ...smartLinkVersion.attributes,
        }

        //runs
        expect(store.run).toEqual({
          id: Data.PacbioRun.data.data.id,
          ...Data.PacbioRun.data.data.attributes,
        })

        //plates
        expect(mockApiPopulateBy).toHaveBeenCalledWith(
          store.$state,
          'plates',
          plates,
          jsonapi.dataToObjectByPlateNumber,
          {
            includeRelationships: true,
          },
        )
        expect(store.plates).toEqual(
          jsonapi.dataToObjectByPlateNumber({ data: plates, includeRelationships: true }),
        )

        //wells
        expect(mockApiSplitData).toHaveBeenCalledWith({
          data: wells,
          fn: jsonapi.dataToObjectByPosition,
          includeRelationships: true,
          parent: {
            parentData: plates,
            children: 'wells',
            key: 'plate_number',
          },
        })

        expect(store.pools).toEqual(
          jsonapi.dataToObjectById({ data: pools, includeRelationships: true }),
        )
        expect(store.libraries).toEqual(
          jsonapi.dataToObjectById({ data: libraries, includeRelationships: true }),
        )
        expect(store.tags).toEqual(jsonapi.dataToObjectById({ data: tags }))
        expect(store.requests).toEqual(jsonapi.dataToObjectById({ data: requests }))
        expect(store.tubes).toEqual(jsonapi.dataToObjectById({ data: tubes }))
        expect(store.resources.smrtLinkVersions).toEqual(smrtLinkVersion)
        expect(success).toBeTruthy()
      })

      it('handles failure', async () => {
        //Mock useRootStore
        const rootStore = useRootStore()
        const find = vi.fn()
        find.mockRejectedValue(failedResponse)
        rootStore.api = { traction: { pacbio: { runs: { find } } } }

        //Mock populateStateBy
        const mockApiPopulateBy = vi.spyOn(jsonapi, 'populateStateBy')
        mockApiPopulateBy.mockImplementation = vi.fn()

        //Mock splitDataByParent
        const mockApiSplitData = vi.spyOn(jsonapi, 'splitDataByParent')
        mockApiSplitData.mockImplementation = vi.fn()

        const store = usePacbioRunCreateStore()
        const { success } = await store.fetchRun({ id: 1 })
        expect(mockApiPopulateBy).not.toHaveBeenCalled()
        expect(mockApiSplitData).not.toHaveBeenCalled()
        expect(success).toBeFalsy()
      })
    })

    describe('findPools', () => {
      it('returns the pool when given a valid tube barcode', async () => {
        const response = Data.PacbioPool
        const { data: pools, included } = response.data

        const poolsArray = pools.slice(0, 1)
        const tubes = included.slice(0, 1)
        const libraries = included.slice(1, 2)
        const requests = included.slice(2, 3)
        const tags = included.slice(3, 4)

        const store = usePacbioRunCreateStore()
        store.poolRequest.get = vi.fn().mockResolvedValue(response)

        // apply action
        const { success } = await store.findPools({ barcode: 'TRAC-2-1' })
        expect(success).toBeTruthy()

        expect(store.pools).toEqual(
          jsonapi.dataToObjectById({ data: poolsArray, includeRelationships: true }),
        )
        expect(store.tubes).toEqual(jsonapi.dataToObjectById({ data: tubes }))
        expect(store.libraries).toEqual(
          jsonapi.dataToObjectById({ data: libraries, includeRelationships: true }),
        )
        expect(store.requests).toEqual(jsonapi.dataToObjectById({ data: requests }))
        expect(store.tags).toEqual(jsonapi.dataToObjectById({ data: tags }))
      })
    })

    describe('saveRun', async () => {
      describe('create', () => {
        const run = newRun()
        const runType = createRunType({ id: run.id })

        it('success', async () => {
          const mockResponse = {
            status: '201',
            data: { data: {} },
          }
          //Mock useRootStore
          const rootStore = useRootStore()
          const create = vi.fn()
          create.mockResolvedValue(mockResponse)
          rootStore.api = { traction: { pacbio: { runs: { create } } } }

          const store = usePacbioRunCreateStore()
          store.$state = {
            runType,
            run,
            plates,
            wells,
            smrtLinkVersion: defaultSmrtLinkVersion,
            instrumentType: PacbioInstrumentTypes.Revio,
          }

          const { success } = await store.saveRun()
          expect(create).toHaveBeenCalled()
          expect(success).toBeTruthy()
        })

        it('failure', async () => {
          //Mock useRootStore
          const rootStore = useRootStore()
          const create = vi.fn()
          create.mockRejectedValue(failedResponse)
          rootStore.api = { traction: { pacbio: { runs: { create } } } }
          const store = usePacbioRunCreateStore()
          //Initilaize the store state
          store.$state = {
            runType,
            run,
            plates,
            wells,
            smrtLinkVersion: defaultSmrtLinkVersion,
            instrumentType: PacbioInstrumentTypes.Revio,
          }
          const { success } = await store.saveRun()
          expect(success).toBeFalsy()
        })
      })
      describe('update', () => {
        const run = { ...newRun(), id: 1 }
        const runType = createRunType({ id: run.id })

        it('success', async () => {
          const mockResponse = {
            status: '201',
            data: { data: {} },
          }
          //Mock useRootStore
          const rootStore = useRootStore()
          const update = vi.fn()
          update.mockResolvedValue(mockResponse)
          rootStore.api = { traction: { pacbio: { runs: { update } } } }

          const store = usePacbioRunCreateStore()
          //Initilaize the store state
          store.$state = {
            runType,
            run,
            plates,
            wells,
            smrtLinkVersion: defaultSmrtLinkVersion,
            instrumentType: PacbioInstrumentTypes.Revio,
          }
          const { success } = await store.saveRun()
          expect(update).toHaveBeenCalled()
          expect(success).toBeTruthy()
        })

        it('failure', async () => {
          const update = vi.fn()
          //Mock useRootStore
          const rootStore = useRootStore()
          update.mockRejectedValue(failedResponse)
          rootStore.api = { traction: { pacbio: { runs: { update } } } }

          const store = usePacbioRunCreateStore()
          //Initilaize the store state
          store.$state = {
            ...store.$state,
            runType,
            run,
            plates,
            wells,
            smrtLinkVersion: defaultSmrtLinkVersion,
            instrumentType: PacbioInstrumentTypes.Revio,
          }

          const { success } = await store.saveRun()
          expect(success).toBeFalsy()
        })
      })
    })
    describe('setRun', () => {
      // this works but we are getting into implementation so probably needs a method
      // to construct a new run with smrt link version
      it('for a new run', async () => {
        const run = newRun()
        const { id, ...attributes } = run
        const store = usePacbioRunCreateStore()
        store.smrtLinkVersionList.get = defaultSmrtLinkVersion

        const { success } = await store.setRun({ id })
        expect(success).toBeTruthy()
        expect(store.run).toEqual({
          id,
          ...attributes,
        })
        expect(store.smrtLinkVersion.get).toEqual(defaultSmrtLinkVersion)
      })

      it('for an existing run', async () => {
        const id = 1
        const store = usePacbioRunCreateStore()
        store.fetchRun = vi.fn().mockResolvedValue({ success: true })
        store.smrtLinkVersionList.get = defaultSmrtLinkVersion

        const { success } = await store.setRun({ id })
        expect(store.fetchRun).toHaveBeenCalledWith({ id })
        expect(store.runType).toEqual(existingRunType)
        expect(success).toBeTruthy()
      })
    })
    
    describe('updateWell', () => {
      it('updates the well', () => {
        const well = { position: 'A1', row: 'A', column: '1' }
        const store = usePacbioRunCreateStore()
        store.$state = {
          ...store.$state,
          wells: {
            [plateNumber]: {},
          },
        }
        store.updateWell({ well: well, plateNumber })
        expect(store.wells[plateNumber]['A1']).toEqual(well)
      })
    })
    describe('getPool', () => {
      it('when finding the pool is successful', async () => {
        const barcode = 'TRAC-2-1'
        const store = usePacbioRunCreateStore()
        store.findPools = vi.fn().mockResolvedValue({ success: true })
        store.$state = { ...storePools }
        const { success, pool } = await store.getPool({ barcode })
        expect(success).toBeTruthy()
        expect(pool.barcode).toEqual(barcode)
        expect(pool.id).toEqual('1')
      })

      it('when finding the pool fails', async () => {
        const barcode = 'TRAC-2-1'
        const store = usePacbioRunCreateStore()
        store.findPools = vi.fn().mockResolvedValue({ success: false, errors: ['it didnt work'] })
        const { success, errors } = await store.getPool({ barcode })
        expect(success).toBeFalsy()
        expect(errors).toEqual(['it didnt work'])
      })
    })
    describe('setInstrumentData', () => {
      it('when a key is passed', () => {
        const instrumentTypeKey = PacbioInstrumentTypes.SequelIIe.key
        const store = usePacbioRunCreateStore()
        store.$state = {
          ...store.$state,
          instrumentTypeList: PacbioInstrumentTypes,
          run: {
            ...newRun(),
            system_name: 'Sequel IIe',
          },
          runType: newRunType,
        }

        store.setInstrumentData(instrumentTypeKey)
        expect(store.instrumentType).toEqual(PacbioInstrumentTypes.SequelIIe)
      })

      it('when it is a new plate', () => {
        const store = usePacbioRunCreateStore()
        store.$state = {
          ...store.$state,
          instrumentTypeList: PacbioInstrumentTypes,
          run: {
            ...newRun(),
            system_name: 'Revio',
          },
          runType: newRunType,
        }
        store.setInstrumentData()
        expect(store.instrumentType).toEqual(PacbioInstrumentTypes.Revio)
        expect(store.plates[1]).toEqual({ ...newPlate(1) })
      })

      it('when it is an existing plate', () => {
        const store = usePacbioRunCreateStore()
        store.$state = {
          instrumentTypeList: PacbioInstrumentTypes,
          run: {
            ...newRun(),
            id: 1,
            system_name: 'Sequel IIe',
          },
        }
        store.setInstrumentData()
        expect(store.instrumentType).toEqual(PacbioInstrumentTypes.SequelIIe)
        expect(store.plates.get).toBe(undefined)
      })
    })
    describe('setSmrtLinkVersion', () => {
      it('will set the SMRT Link Version', () => {
        const store = usePacbioRunCreateStore()
        store.resources = {
          ...store.resources,
          smrtLinkVersions: {
            1: { id: '1', version: 'v1', default: true, active: true },
            2: { id: '2', version: 'v2', default: false, active: true },
          },
        }
        store.setSmrtLinkVersion('2')
        expect(store.smrtLinkVersion).toEqual(store.resources.smrtLinkVersions['2'])
      })
    })
    describe('removePool', () => {
      it('"removePool" removes the given pool id from state.pool', () => {
        const store = usePacbioRunCreateStore()
        store.$state = {
          pools: {
            1: { id: '1', type: 'pools' },
            2: { id: '2', type: 'pools' },
          },
        }
        expect(store.pools[1]).toEqual({ id: '1', type: 'pools' })
        store.removePool(1)
        expect(store.pools[1]).toBeUndefined()
      })
    })
    describe('clearRunData', () => {
      it('clears existing pool data', () => {
        const store = usePacbioRunCreateStore()
        store.$state = { ...storePools }
        store.clearRunData()
        expect(store.$state).toEqual({
          resources: {
            smrtLinkVersions: {},
          },
          run: {},
          pools: {},
          tubes: {},
          libraries: {},
          requests: {},
          tags: {},
          smrtLinkVersion: {},
          runType: {},
          defaultWellAttributes: {},
          instrumentTypeList: PacbioInstrumentTypes,
          instrumentType: PacbioInstrumentTypes.SequelIIe,
          plates: {},
          wells: {},
        })
      })
    })
  })
})
