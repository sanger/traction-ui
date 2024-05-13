import { createPinia, setActivePinia } from 'pinia'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
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
import { beforeEach, expect, it, vi } from 'vitest'
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
    // prettier-ignore-start
    const mockPoolsAndLibraries = [
      {
        barcode: 'TRAC-2-20',
        id: '30',
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
        state: 'pending',
        volume: 1,
        concentration: 1,
        template_prep_kit_box_barcode: '029979102141700063023',
        insert_size: null,
        created_at: '2024/03/18 15:03',
        deactivated_at: null,
        source_identifier: 'GEN-1710774222-1:F4',
        pacbio_request_id: 30,
        tag_id: null,
        request: '30',
        tag: null,
        tube: '20',
        source_well: null,
        source_plate: null,
        primary_aliquot: '314',
        used_aliquots: ['315'],
        samples: ['GENSAMPLE-1710774222-30'],
      },
      {
        barcode: 'TRAC-2-22',
        id: '12',
        type: 'pools',
        run_suitability: { ready_for_run: true, errors: [] },
        volume: 1,
        concentration: 1,
        template_prep_kit_box_barcode: '029979102141700063023',
        insert_size: 100,
        created_at: '2024/03/18 15:03',
        updated_at: '2024/03/18 15:03',
        source_identifier: 'GEN-1710774222-1:H4-C5',
        tube: '22',
        libraries: null,
        used_aliquots: ['319', '320', '321', '322'],
        primary_aliquot: null,
        samples: [
          'GENSAMPLE-1710774222-32:bc1001_BAK8A_OA',
          'GENSAMPLE-1710774222-33:bc1002_BAK8A_OA',
          'GENSAMPLE-1710774222-34:bc1003_BAK8A_OA',
          'GENSAMPLE-1710774222-35:bc1008_BAK8A_OA',
        ],
      },
      {
        barcode: 'TRAC-2-24',
        id: '14',
        type: 'pools',
        run_suitability: { ready_for_run: true, errors: [] },
        volume: 1,
        concentration: 1,
        template_prep_kit_box_barcode: '029979102141700063023',
        insert_size: 100,
        created_at: '2024/03/18 15:03',
        updated_at: '2024/03/18 15:03',
        source_identifier: 'GEN-1710774222-1:E5-H5',
        tube: '24',
        libraries: null,
        used_aliquots: ['331', '332', '333', '334'],
        primary_aliquot: null,
        samples: [
          'GENSAMPLE-1710774222-37:bc1001_BAK8A_OA',
          'GENSAMPLE-1710774222-38:bc1002_BAK8A_OA',
          'GENSAMPLE-1710774222-39:bc1003_BAK8A_OA',
          'GENSAMPLE-1710774222-40:bc1008_BAK8A_OA',
        ],
      },
    ]
    // prettier-ignore-end

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
        expect(store.tubeContents).toEqual(mockPoolsAndLibraries)
      })

      it('"tubeContentByBarcode" returns the pool data with the specified tube barcode', () => {
        const store = usePacbioRunCreateStore()
        store.$state = { ...storePools }
        const actual = store.tubeContentByBarcode('TRAC-2-20')
        expect(actual).toEqual(mockPoolsAndLibraries[0])
      })

      it('"tubeContentByBarcode" returns the library data with the specified tube barcode', () => {
        const store = usePacbioRunCreateStore()
        store.$state = { ...storePools }
        const actual = store.tubeContentByBarcode('TRAC-2-24')
        expect(actual).toEqual(mockPoolsAndLibraries[2])
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

    describe('getWell', () => {
      const plateNumber = 1
      const position = 'A1'

      it('if it exists', () => {
        const well = newWell({
          position,
          used_aliquots: [
            { id: '1', type: 'aliquots', source_type: 'Pacbio::Pool', source_id: '1' },
            { id: '2', type: 'aliquots', source_type: 'Pacbio::Pool', source_id: '2' },
          ],
        })
        const store = usePacbioRunCreateStore()
        store.$state = {
          ...store.$state,
          wells: { 1: { [position]: well } },
          defaultWellAttributes: { ...defaultWellAttributes() },
          aliquots: {
            1: { id: '1', type: 'aliquots', source_type: 'Pacbio::Pool', source_id: '1' },
            2: { id: '2', type: 'aliquots', source_type: 'Pacbio::Pool', source_id: '2' },
          },
          pools: {
            1: { id: '1', type: 'pools' },
            2: { id: '2', type: 'pools' },
          },
        }
        const gottenWell = store.getWell(plateNumber, position)
        expect(gottenWell.position).toEqual(position)
        expect(gottenWell.used_aliquots).toEqual([
          { id: '1', type: 'aliquots', source_type: 'Pacbio::Pool', source_id: '1' },
          { id: '2', type: 'aliquots', source_type: 'Pacbio::Pool', source_id: '2' },
        ])
      })

      it('if the well does not exist', () => {
        const store = usePacbioRunCreateStore()
        store.$state = {
          ...store.$state,
          wells: { 1: {} },
          defaultWellAttributes: { ...defaultWellAttributes() },
        }
        const gottenWell = store.getWell(plateNumber, position)
        expect(gottenWell).toBeUndefined()
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
        A2: { ...newWell({ position: 'A2' }) },
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
        find.mockResolvedValue(Data.PacbioRun)
        rootStore.api = { traction: { pacbio: { runs: { find } } } }

        //Mock splitDataByParent
        const mockApiSplitData = vi.spyOn(jsonapi, 'splitDataByParent')
        mockApiSplitData.mockImplementation = vi.fn()

        const store = usePacbioRunCreateStore()
        const { success } = await store.fetchRun({ id: 1 })

        const smartLinkVersion = Data.PacbioRun.data.included.slice(19)[0]
        const plates = Data.PacbioRun.data.included.slice(0, 2)
        const wells = Data.PacbioRun.data.included.slice(2, 5)
        const aliquots = Data.PacbioRun.data.included.slice(5, 10)
        const libraries = Data.PacbioRun.data.included.slice(10, 13)
        const tubes = Data.PacbioRun.data.included.slice(13, 17)
        const pools = Data.PacbioRun.data.included.slice(17, 19)
        const tags = Data.PacbioRun.data.included.slice(20, 25)

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

        //aliquots
        expect(store.aliquots).toEqual(
          jsonapi.dataToObjectById({ data: aliquots, includeRelationships: true }),
        )

        expect(store.libraries).toEqual(
          jsonapi.dataToObjectById({ data: libraries, includeRelationships: true }),
        )

        expect(store.tubes).toEqual(
          jsonapi.dataToObjectById({ data: tubes, includeRelationships: true }),
        )

        //pools
        expect(store.pools).toEqual(
          jsonapi.dataToObjectById({ data: pools, includeRelationships: true }),
        )

        expect(store.smrtLinkVersion).toEqual(smrtLinkVersion)

        //tags
        expect(store.tags).toEqual(
          jsonapi.dataToObjectById({ data: tags, includeRelationships: true }),
        )
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
        expect(store.libraries).toEqual({})
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
      it('returns the tubes pools, libraries, aliquots, requests and tags when given valid tube barcodes', async () => {
        const response = Data.PacbioTubesWithPoolsAndLibraries
        const { data, included } = response.data

        const tubes = data.slice(0, 3)
        const pools = included.slice(0, 2)
        const aliquots = included.slice(2, 11)
        const libraries = included.slice(11, 20)
        const requests = included.slice(20, 29)
        const tags = included.slice(29, 33)

        // Mock stores
        const rootStore = useRootStore()
        const get = vi.fn()
        get.mockResolvedValue(response)
        rootStore.api = { traction: { pacbio: { tubes: { get } } } }

        const store = usePacbioRunCreateStore()

        // apply action
        const { success } = await store.findPoolsOrLibrariesByTube({
          barcode: 'TRAC-2-20,TRAC-2-22,TRAC-2-24',
        })
        expect(success).toBeTruthy()

        expect(store.tubes).toEqual(
          jsonapi.dataToObjectById({ data: tubes, includeRelationships: true }),
        )

        expect(store.pools).toEqual(
          jsonapi.dataToObjectById({ data: pools, includeRelationships: true }),
        )

        expect(store.aliquots).toEqual(
          jsonapi.dataToObjectById({ data: aliquots, includeRelationships: true }),
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
        const tubes = {
          1: { barcode: 'TRAC-2-1' },
          2: { barcode: 'TRAC-2-2' },
          3: { barcode: 'TRAC-2-3' },
        }
        const store = usePacbioRunCreateStore()
        store.smrtLinkVersionList.get = defaultSmrtLinkVersion
        store.tubes = tubes
        store.fetchRun = vi.fn().mockResolvedValue({ success: true })

        const { success } = await store.setRun({ id })
        expect(store.fetchRun).toHaveBeenCalledWith({ id })
        expect(store.runType).toEqual(existingRunType)
        expect(success).toBeTruthy()
      })

      it('for an existing run when fetchRun fails', async () => {
        const id = 1
        const tubes = {
          1: { barcode: 'TRAC-2-1' },
          2: { barcode: 'TRAC-2-2' },
          3: { barcode: 'TRAC-2-3' },
        }
        const store = usePacbioRunCreateStore()
        store.smrtLinkVersionList.get = defaultSmrtLinkVersion
        store.tubes = tubes
        store.fetchRun = vi.fn().mockResolvedValue({ success: false })

        const { success } = await store.setRun({ id })
        expect(store.fetchRun).toHaveBeenCalledWith({ id })
        expect(success).toBeFalsy()
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
      it('"removePool" removes the given pool id from state.pool and its associated tube', () => {
        const store = usePacbioRunCreateStore()
        store.$state = {
          tubes: {
            3: { id: '3', type: 'tubes' },
            4: { id: '4', type: 'tubes' },
          },
          pools: {
            1: { id: '1', type: 'pools', tube: '3' },
            2: { id: '2', type: 'pools', tube: '4' },
          },
        }
        expect(store.pools[1]).toEqual({ id: '1', type: 'pools', tube: '3' })
        store.removePool(1)
        expect(store.pools[1]).toBeUndefined()
        expect(store.tubes[3]).toBeUndefined()
      })
    })
    describe('removeLibrary', () => {
      it('"removeLibrary" removes the given library id from state.library and its assoicated tube', () => {
        const store = usePacbioRunCreateStore()
        store.$state = {
          tubes: {
            3: { id: '3', type: 'tubes' },
            4: { id: '4', type: 'tubes' },
          },
          libraries: {
            1: { id: '1', type: 'libraries', tube: '3' },
            2: { id: '2', type: 'libraries', tube: '4' },
          },
        }
        expect(store.libraries[1]).toEqual({ id: '1', type: 'libraries', tube: '3' })
        store.removeLibrary(1)
        expect(store.libraries[1]).toBeUndefined()
        expect(store.tubes[3]).toBeUndefined()
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
          instrumentType: PacbioInstrumentTypes.Revio,
          plates: {},
          wells: {},
          aliquots: {},
        })
      })
    })
    describe('getAvailableVolumeForLibraryAliquot', () => {
      it('returns null if no library id is provided', () => {
        const store = usePacbioRunCreateStore()
        const available_volume = store.getAvailableVolumeForLibraryAliquot({})
        expect(available_volume).toBeNull()
      })

      describe('new aliquots', () => {
        it('returns the library available volume if there are no other aliquots from the same library', () => {
          const store = usePacbioRunCreateStore()
          const library = {
            id: '1',
            type: 'libraries',
            available_volume: 10,
          }
          store.$state = {
            libraries: {
              1: library,
            },
            wells: {
              1: {
                A1: {
                  id: '1',
                  type: 'wells',
                  position: 'A1',
                  used_aliquots: [
                    {
                      id: '',
                      type: 'aliquots',
                      volume: 5,
                      source_type: 'Pacbio::Library',
                      source_id: '1',
                    },
                  ],
                },
              },
            },
            aliquots: {},
          }
          const available_volume = store.getAvailableVolumeForLibraryAliquot({
            libraryId: '1',
            aliquotId: '',
            volume: 5,
          })
          expect(available_volume).toEqual(library.available_volume.toFixed(2))
        })

        it('returns the library available volume minus the sum of the volumes of the other aliquots from the same library', () => {
          const store = usePacbioRunCreateStore()
          const library = {
            id: '1',
            type: 'libraries',
            available_volume: 10,
          }
          store.$state = {
            libraries: {
              1: library,
            },
            wells: {
              1: {
                A1: {
                  id: '1',
                  type: 'wells',
                  position: 'A1',
                  used_aliquots: [
                    {
                      id: '',
                      type: 'aliquots',
                      volume: 5,
                      source_type: 'Pacbio::Library',
                      source_id: '1',
                    },
                    {
                      id: '',
                      type: 'aliquots',
                      volume: 5,
                      source_type: 'Pacbio::Library',
                      source_id: '1',
                    },
                    {
                      id: '',
                      type: 'aliquots',
                      volume: 5,
                      source_type: 'Pacbio::Library',
                      source_id: '2', // This is not the library we are calculating the available volume for so we ignore its volume
                    },
                  ],
                },
              },
            },
            aliquots: {},
          }
          // Minus 5 because there are two aliquots with volume 5
          // But one is the aliquot we are calculating the available volume for so we ignore its volume
          const expected_available_volume = (library.available_volume - 5).toFixed(2)
          const available_volume = store.getAvailableVolumeForLibraryAliquot({
            libraryId: '1',
            aliquotId: '',
            volume: 5,
          })
          expect(available_volume).toEqual(expected_available_volume)
        })
      })

      describe('existing aliquots', () => {
        it('returns the library available volume plus the volume of the existing aliquot', () => {
          const store = usePacbioRunCreateStore()
          const library = {
            id: '1',
            type: 'libraries',
            available_volume: 10,
          }
          store.$state = {
            libraries: {
              1: library,
            },
            wells: {
              1: {
                A1: {
                  id: '1',
                  type: 'wells',
                  position: 'A1',
                  used_aliquots: [
                    {
                      id: '1',
                      type: 'aliquots',
                      volume: 5,
                      source_type: 'Pacbio::Library',
                      source_id: '1',
                    },
                  ],
                },
              },
            },
            aliquots: {
              1: {
                id: '1',
                type: 'aliquots',
                volume: 5,
                source_type: 'Pacbio::Library',
                source_id: '1',
              },
            },
          }
          const expected_volume = (library.available_volume + 5).toFixed(2)
          const available_volume = store.getAvailableVolumeForLibraryAliquot({
            libraryId: '1',
            aliquotId: 1,
            volume: 5,
          })
          expect(available_volume).toEqual(expected_volume)
        })

        it('returns the correct value when an existing aliquot volume is updated', () => {
          const store = usePacbioRunCreateStore()
          const library = {
            id: '1',
            type: 'libraries',
            available_volume: 10,
          }
          store.$state = {
            libraries: {
              1: library,
            },
            wells: {
              1: {
                A1: {
                  id: '1',
                  type: 'wells',
                  position: 'A1',
                  used_aliquots: [
                    {
                      id: '1',
                      type: 'aliquots',
                      volume: 10,
                      source_type: 'Pacbio::Library',
                      source_id: '1',
                    },
                  ],
                },
              },
            },
            aliquots: {
              1: {
                id: '1',
                type: 'aliquots',
                volume: 5,
                source_type: 'Pacbio::Library',
                source_id: '1',
              },
            },
          }
          const expected_available_volume = (library.available_volume + 5).toFixed(2)
          const available_volume = store.getAvailableVolumeForLibraryAliquot({
            libraryId: '1',
            aliquotId: '1',
            volume: 5,
          })
          expect(available_volume).toEqual(expected_available_volume)
        })
      })
    })
  })
})
