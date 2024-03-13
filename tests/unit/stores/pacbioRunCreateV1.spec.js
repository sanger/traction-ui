import { createPinia, setActivePinia } from 'pinia'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreateV1.js'
import useRootStore from '@/stores'
import storePools from '@tests/data/StoreRunPools.json'
import { Data } from '@support/testHelper.js'
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
            type: 'library_pools',
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
            type: 'library_pools',
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

    const mockLibraries = [
      {
        id: '3',
        type: 'libraries',
        barcode: 'TRAC-2-3',
        tube: '3',
        request: '1',
        group_id: 'bc1019',
        tag: '26',
        sample_name: 'Sample48',
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
    describe('tubeContents', () => {
      it('"tubeContents" returns denormalized pools from "state.pools and state.libraries"', () => {
        const store = usePacbioRunCreateStore()
        store.$state = { ...storePools }
        expect(store.tubeContents).toEqual(mockPools.concat(mockLibraries))
      })

      it('"tubeContentByBarcode" returns the pool data with the specified tube barcode', () => {
        const store = usePacbioRunCreateStore()
        store.$state = { ...storePools }
        const actual = store.tubeContentByBarcode('TRAC-2-1')
        expect(actual).toEqual(mockPools[0])
      })

      it('"tubeContentByBarcode" returns the library data with the specified tube barcode', () => {
        const store = usePacbioRunCreateStore()
        store.$state = { ...storePools }
        const actual = store.tubeContentByBarcode('TRAC-2-3')
        expect(actual).toEqual(mockLibraries[0])
      })

      it('"tubeContents" returns pools successfully and with an empty library group_id if that library has no tag', () => {
        const store = usePacbioRunCreateStore()
        store.$state = { ...storePools }
        store.library_pools[1] = {
          id: '1',
          request: '1',
          tag: '',
          type: 'library_pools',
          run_suitability: { ready_for_run: true, errors: [] },
        }
        expect(store.tubeContents[0].libraries[0].group_id).toEqual(undefined)
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
        const well = store.getOrCreateWell(position, plateNumber)
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

        const { success } = await store.fetchSmrtLinkVersions()

        expect(store.resources.smrtLinkVersions).toEqual(
          jsonapi.dataToObjectById({ data: Data.TractionPacbioSmrtLinkVersions.data.data }),
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

        // apply action
        const { success } = await store.fetchSmrtLinkVersions()
        expect(store.resources.smrtLinkVersions).toEqual({})
        expect(success).toBeFalsy()
      })
    })

    describe('fetchRun', () => {
      it('handles success', async () => {
        //Mock useRootStore
        const rootStore = useRootStore()
        const find = vi.fn()
        find.mockResolvedValue(Data.PacbioRunV1)
        rootStore.api = { traction: { pacbio: { runs: { find } } } }

        //Mock splitDataByParent
        const mockApiSplitData = vi.spyOn(jsonapi, 'splitDataByParent')
        mockApiSplitData.mockImplementation = vi.fn()

        const store = usePacbioRunCreateStore()
        const { success } = await store.fetchRun({ id: 1 })

        const smartLinkVersion = Data.PacbioRunV1.data.included.slice(10)[0]
        const plates = Data.PacbioRunV1.data.included.slice(0, 2)
        const wells = Data.PacbioRunV1.data.included.slice(2, 5)
        const pools = Data.PacbioRunV1.data.included.slice(5, 6)
        const tubes = Data.PacbioRunV1.data.included.slice(6, 7)
        const library_pools = Data.PacbioRunV1.data.included.slice(7, 8)
        const tags = Data.PacbioRunV1.data.included.slice(8, 9)
        const requests = Data.PacbioRunV1.data.included.slice(9, 10)

        const smrtLinkVersion = {
          id: smartLinkVersion.id,
          type: smartLinkVersion.type,
          ...smartLinkVersion.attributes,
        }

        //runs
        expect(store.run).toEqual({
          id: Data.PacbioRunV1.data.data.id,
          ...Data.PacbioRunV1.data.data.attributes,
        })

        //plates
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
        expect(store.library_pools).toEqual(
          jsonapi.dataToObjectById({ data: library_pools, includeRelationships: true }),
        )
        expect(store.tags).toEqual(jsonapi.dataToObjectById({ data: tags }))
        expect(store.requests).toEqual(jsonapi.dataToObjectById({ data: requests }))
        expect(store.tubes).toEqual(
          jsonapi.dataToObjectById({ data: tubes, includeRelationships: true }),
        )
        expect(store.smrtLinkVersion).toEqual(smrtLinkVersion)
        expect(success).toBeTruthy()
      })

      it('handles failure', async () => {
        //Mock useRootStore
        const rootStore = useRootStore()
        const find = vi.fn()
        find.mockRejectedValue(failedResponse)
        rootStore.api = { traction: { pacbio: { runs: { find } } } }

        //Mock splitDataByParent
        const mockApiSplitData = vi.spyOn(jsonapi, 'splitDataByParent')
        mockApiSplitData.mockImplementation = vi.fn()

        const store = usePacbioRunCreateStore()
        const { success } = await store.fetchRun({ id: 1 })
        expect(mockApiSplitData).not.toHaveBeenCalled()
        expect(success).toBeFalsy()
        expect(store.pools).toEqual({})
        expect(store.library_pools).toEqual({})
        expect(store.tags).toEqual(jsonapi.dataToObjectById({}))
        expect(store.requests).toEqual(jsonapi.dataToObjectById({}))
        expect(store.tubes).toEqual(jsonapi.dataToObjectById({}))
        expect(store.smrtLinkVersion).toEqual({})
        expect(store.run).toEqual({})
        expect(store.plates).toEqual({})
        expect(store.wells).toEqual({})
      })
    })

    describe('findPoolsOrLibrariesByTube', () => {
      it('returns the pool when given a valid tube barcode', async () => {
        const response = Data.PacbioTubeWithPool
        const { data, included } = response.data

        const tubes = data.slice(0, 1)
        const pools = included.slice(0, 1)
        const library_pools = included.slice(1, 5)
        const tags = included.slice(5, 9)
        const requests = included.slice(9, 13)

        // Mock stores
        const rootStore = useRootStore()
        const get = vi.fn()
        get.mockResolvedValue(response)
        rootStore.api = { traction: { pacbio: { tubes: { get } } } }

        const store = usePacbioRunCreateStore()

        // apply action
        const { success } = await store.findPoolsOrLibrariesByTube({ barcode: 'TRAC-2-1' })
        expect(success).toBeTruthy()

        expect(store.pools).toEqual(
          jsonapi.dataToObjectById({ data: pools, includeRelationships: true }),
        )
        expect(store.tubes).toEqual(
          jsonapi.dataToObjectById({ data: tubes, includeRelationships: true }),
        )
        expect(store.library_pools).toEqual(
          jsonapi.dataToObjectById({ data: library_pools, includeRelationships: true }),
        )
        expect(store.libraries).toEqual({})
        expect(store.requests).toEqual(jsonapi.dataToObjectById({ data: requests }))
        expect(store.tags).toEqual(jsonapi.dataToObjectById({ data: tags }))
      })

      it('returns the pool when given a valid tube barcode', async () => {
        const response = Data.PacbioTubeWithLibrary
        const { data, included } = response.data

        const tubes = data.slice(0, 1)
        const libraries = included.slice(0, 1)
        const tags = included.slice(1, 2)
        const requests = included.slice(2, 3)

        // Mock stores
        const rootStore = useRootStore()
        const get = vi.fn()
        get.mockResolvedValue(response)
        rootStore.api = { traction: { pacbio: { tubes: { get } } } }

        const store = usePacbioRunCreateStore()

        // apply action
        const { success } = await store.findPoolsOrLibrariesByTube({ barcode: 'TRAC-2-1' })
        expect(success).toBeTruthy()

        expect(store.pools).toEqual({})
        expect(store.library_pools).toEqual({})
        expect(store.tubes).toEqual(
          jsonapi.dataToObjectById({ data: tubes, includeRelationships: true }),
        )
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
        expect(store.smrtLinkVersion).toEqual(defaultSmrtLinkVersion)
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
            dna_control_complex_box_barcode: 'Lxxxxx10171760012311',
          },
          runType: newRunType,
        }
        store.setInstrumentData()
        expect(store.instrumentType).toEqual(PacbioInstrumentTypes.Revio)
        expect(store.plates[1]).toEqual({ ...newPlate(1) })
        expect(store.run.dna_control_complex_box_barcode).toBe(null)
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
    describe('removeLibrary', () => {
      it('"removeLibrary" removes the given library id from state.library', () => {
        const store = usePacbioRunCreateStore()
        store.$state = {
          libraries: {
            1: { id: '1', type: 'libraries' },
            2: { id: '2', type: 'libraries' },
          },
        }
        expect(store.libraries[1]).toEqual({ id: '1', type: 'libraries' })
        store.removeLibrary(1)
        expect(store.libraries[1]).toBeUndefined()
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
          library_pools: {},
          requests: {},
          tags: {},
          smrtLinkVersion: {},
          runType: {},
          defaultWellAttributes: {},
          instrumentTypeList: PacbioInstrumentTypes,
          instrumentType: PacbioInstrumentTypes.Revio,
          plates: {},
          wells: {},
        })
      })
    })
  })
})
