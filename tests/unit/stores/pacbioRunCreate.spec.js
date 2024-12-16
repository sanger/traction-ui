import { createPinia, setActivePinia } from 'pinia'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import useRootStore from '@/stores'
import * as jsonapi from '@/api/JsonApi'
import {
  newRun,
  newPlate,
  newWell,
  createRunType,
  newRunType,
  existingRunType,
} from '@/stores/utilities/run'
import { beforeEach, expect, it, vi } from 'vitest'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes'
import PacbioRunWellSmrtLinkOptions from '@/config/PacbioRunWellSmrtLinkOptions.json'
import PacbioSmrtLinkVersionFactory from '@tests/factories/PacbioSmrtLinkVersionFactory.js'
import PacbioRunFactory from '@tests/factories/PacbioRunFactory'
import PacbioTubeFactory from '@tests/factories/PacbioTubeFactory'
import { successfulResponse, failedResponse } from '@support/testHelper'

const pacbioSmrtLinkVersionFactory = PacbioSmrtLinkVersionFactory()
const pacbioRunFactory = PacbioRunFactory({ count: 1 })
const pacbioTubeFactory = PacbioTubeFactory()

describe('usePacbioRunCreateStore', () => {
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })
  describe('getters', () => {
    describe('smrtLinkVersionList', () => {
      it('returns a list of smrt link version resources', () => {
        const store = usePacbioRunCreateStore()
        store.resources.smrtLinkVersions = pacbioSmrtLinkVersionFactory.storeData
        expect(store.smrtLinkVersionList).toEqual(pacbioSmrtLinkVersionFactory.storeData)
      })
    })
    describe('defaultSmrtLinkVersion', () => {
      it('returns the default SMRT Link Version', () => {
        const store = usePacbioRunCreateStore()
        store.resources.smrtLinkVersions = pacbioSmrtLinkVersionFactory.storeData
        expect(store.defaultSmrtLinkVersion).toEqual(
          pacbioSmrtLinkVersionFactory.defaultSmrtLinkVersion,
        )
      })
    })
    describe('tubeContents', () => {
      it('"tubeContents" returns denormalized pools from "state.pools and state.libraries"', () => {
        const store = usePacbioRunCreateStore()
        store.$state = {
          ...pacbioRunFactory.storeData,
          resources: { smrtLinkVersions: pacbioSmrtLinkVersionFactory.storeData },
        }
        const tubeContents = store.tubeContents
        expect(tubeContents.length).toEqual(Object.values(pacbioRunFactory.storeData.tubes).length)
      })

      // needs refactoring. I am recreating some of the methods in pacbioRunCreate.
      it('"tubeContentByBarcode" returns the library data with the specified tube barcode', () => {
        const store = usePacbioRunCreateStore()
        store.$state = {
          ...pacbioRunFactory.storeData,
          resources: { smrtLinkVersions: pacbioSmrtLinkVersionFactory.storeData },
        }
        const tube = Object.values(pacbioRunFactory.storeData.tubes).find((tube) => tube.libraries)
        const library = pacbioRunFactory.storeData.libraries[tube.libraries]
        const { request, tag } = library
        const { sample_name } = pacbioRunFactory.storeData.requests[request]
        const { group_id = '' } = pacbioRunFactory.storeData.tags[tag] || {}
        const actual = store.tubeContentByBarcode(tube.barcode)
        expect(actual).toEqual({
          barcode: tube.barcode,
          ...pacbioRunFactory.storeData.libraries[tube.libraries],
          samples: [`${sample_name}:${group_id}`],
        })
      })

      // need to get run with pools which is the second run
      it('"tubeContentByBarcode" returns the pool data with the specified tube barcode', () => {
        const store = usePacbioRunCreateStore()
        const pacbioRunFactoryWithPools = PacbioRunFactory({ findBy: 'Sequel IIe' })
        store.$state = {
          ...pacbioRunFactoryWithPools.storeData,
          resources: { smrtLinkVersions: pacbioSmrtLinkVersionFactory.storeData },
        }
        const tube = Object.values(pacbioRunFactoryWithPools.storeData.tubes).find(
          (tube) => tube.pools,
        )
        const actual = store.tubeContentByBarcode(tube.barcode)
        const pool = pacbioRunFactoryWithPools.storeData.pools[tube.pools]
        // this is a bit of palava we are practically rewriting the method.
        const samples = pool.libraries.map((library) => {
          const { pacbio_request_id, tag_id } =
            pacbioRunFactoryWithPools.storeData.libraries[library]
          const { sample_name } = pacbioRunFactoryWithPools.storeData.requests[pacbio_request_id]
          const { group_id = '' } = pacbioRunFactoryWithPools.storeData.tags[tag_id] || {}
          return `${sample_name}:${group_id}`
        })
        expect(actual).toEqual({
          barcode: tube.barcode,
          ...pool,
          // ugh!
          samples: samples.reverse(),
        })
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
          defaultWellAttributes: { ...PacbioRunWellSmrtLinkOptions.defaultAttributes },
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
          defaultWellAttributes: { ...PacbioRunWellSmrtLinkOptions.defaultAttributes },
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
          defaultWellAttributes: { ...PacbioRunWellSmrtLinkOptions.defaultAttributes },
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
          defaultWellAttributes: { ...PacbioRunWellSmrtLinkOptions.defaultAttributes },
        }
        const gottenWell = store.getWell(plateNumber, position)
        expect(gottenWell).toBeUndefined()
      })
    })
  })
  describe('actions', () => {
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
        get.mockResolvedValue(pacbioSmrtLinkVersionFactory.responses.fetch)
        rootStore.api = { traction: { pacbio: { smrt_link_versions: { get } } } }

        const store = usePacbioRunCreateStore()

        const { success } = await store.fetchSmrtLinkVersions()

        expect(store.resources.smrtLinkVersions).toEqual(pacbioSmrtLinkVersionFactory.storeData)
        expect(success).toBeTruthy()
        expect(get).toHaveBeenCalled()
      })

      it('handles failure', async () => {
        //Mock useroot store
        const rootStore = useRootStore()
        const get = vi.fn()
        get.mockRejectedValue(failedResponse())
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
        find.mockResolvedValue(pacbioRunFactory.responses.fetch)
        rootStore.api = { traction: { pacbio: { runs: { find } } } }

        //Mock splitDataByParent
        const mockApiSplitData = vi.spyOn(jsonapi, 'splitDataByParent')
        mockApiSplitData.mockImplementation = vi.fn()

        const store = usePacbioRunCreateStore()
        const { success } = await store.fetchRun({ id: 1 })

        expect(store.run).toEqual(pacbioRunFactory.storeData.run)

        expect(store.plates).toEqual(pacbioRunFactory.storeData.plates)

        expect(mockApiSplitData).toHaveBeenCalledWith({
          data: pacbioRunFactory.storeData.resources.wells,
          fn: jsonapi.dataToObjectByPosition,
          includeRelationships: true,
          parent: {
            parentData: pacbioRunFactory.storeData.resources.plates,
            children: 'wells',
            key: 'plate_number',
          },
        })

        expect(store.aliquots).toEqual(pacbioRunFactory.storeData.aliquots)
        expect(store.libraries).toEqual(pacbioRunFactory.storeData.libraries)
        expect(store.tubes).toEqual(pacbioRunFactory.storeData.tubes)
        expect(store.pools).toEqual(pacbioRunFactory.storeData.pools)
        expect(store.smrtLinkVersion).toEqual(pacbioRunFactory.storeData.smrtLinkVersion)
        expect(store.tags).toEqual(pacbioRunFactory.storeData.tags)
        expect(success).toBeTruthy()
      })

      it('handles failure', async () => {
        //Mock useRootStore
        const rootStore = useRootStore()
        const find = vi.fn()
        find.mockRejectedValue(failedResponse())
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
        // Mock stores
        const rootStore = useRootStore()
        const get = vi.fn()
        get.mockResolvedValue(pacbioTubeFactory.responses.fetch)
        rootStore.api = { traction: { pacbio: { tubes: { get } } } }

        const store = usePacbioRunCreateStore()

        // apply action
        const { success } = await store.findPoolsOrLibrariesByTube({
          barcode: pacbioTubeFactory.storeData.tubeBarcodes.join(),
        })
        expect(success).toBeTruthy()

        expect(store.tubes).toEqual(pacbioTubeFactory.storeData.tubes)
        expect(store.pools).toEqual(pacbioTubeFactory.storeData.pools)
        expect(store.libraries).toEqual(pacbioTubeFactory.storeData.libraries)
        expect(store.requests).toEqual(pacbioTubeFactory.storeData.requests)
        expect(store.tags).toEqual(pacbioTubeFactory.storeData.tags)
        expect(store.aliquots).toEqual(pacbioTubeFactory.storeData.aliquots)
      })
    })

    describe('saveRun', async () => {
      describe('create', () => {
        const run = newRun()
        const runType = createRunType({ id: run.id })

        it('success', async () => {
          const mockResponse = successfulResponse()
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
          create.mockRejectedValue(failedResponse())
          rootStore.api.v2 = { traction: { pacbio: { runs: { create } } } }
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
          const mockResponse = successfulResponse()
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
          update.mockRejectedValue(failedResponse())
          rootStore.api.v2 = { traction: { pacbio: { runs: { update } } } }

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
        store.$state = {
          ...pacbioRunFactory.storeData,
          resources: { smrtLinkVersions: pacbioSmrtLinkVersionFactory.storeData },
        }
        store.clearRunData()
        expect(store.$state).toEqual({
          resources: {
            smrtLinkVersions: pacbioSmrtLinkVersionFactory.storeData,
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
    describe('getAvailableVolumeForAliquot', () => {
      it('returns null if no source id is provided', () => {
        const store = usePacbioRunCreateStore()
        const available_volume = store.getAvailableVolumeForAliquot({
          source_id: null,
          source_type: 'Pacbio::Library',
        })
        expect(available_volume).toBeNull()
      })

      it('returns null if no source type is provided', () => {
        const store = usePacbioRunCreateStore()
        const available_volume = store.getAvailableVolumeForAliquot({
          source_id: 1,
          source_type: null,
        })
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
          const available_volume = store.getAvailableVolumeForAliquot({
            sourceId: '1',
            sourceType: 'Pacbio::Library',
            volume: 5,
          })
          expect(available_volume).toEqual(library.available_volume)
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
                    {
                      id: '',
                      type: 'aliquots',
                      volume: 5,
                      source_type: 'Pacbio::Pool',
                      source_id: '1', // This has the same source_id but different source_type so we ignore its volume
                    },
                  ],
                },
              },
            },
            aliquots: {},
          }
          // Minus 5 because there are two aliquots with volume 5
          // But one is the aliquot we are calculating the available volume for so we ignore its volume
          const expected_available_volume = library.available_volume - 5
          const available_volume = store.getAvailableVolumeForAliquot({
            sourceId: '1',
            sourceType: 'Pacbio::Library',
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
                used_by_type: 'Pacbio::Well',
              },
            },
          }
          const expected_volume = library.available_volume + 5
          const available_volume = store.getAvailableVolumeForAliquot({
            sourceId: '1',
            sourceType: 'Pacbio::Library',
            volume: 5,
          })
          expect(available_volume).toEqual(expected_volume)
        })

        it('returns the pool available volume plus the volume of the existing aliquot', () => {
          const store = usePacbioRunCreateStore()
          const pool = {
            id: '1',
            type: 'pools',
            available_volume: 10,
          }
          store.$state = {
            pools: {
              1: pool,
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
                      source_type: 'Pacbio::Pool',
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
                source_type: 'Pacbio::Pool',
                source_id: '1',
                used_by_type: 'Pacbio::Well',
              },
            },
          }
          const expected_volume = pool.available_volume + 5
          const available_volume = store.getAvailableVolumeForAliquot({
            sourceId: '1',
            sourceType: 'Pacbio::Pool',
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
                used_by_type: 'Pacbio::Well',
              },
            },
          }
          const expected_available_volume = library.available_volume + 5
          const available_volume = store.getAvailableVolumeForAliquot({
            sourceId: '1',
            sourceType: 'Pacbio::Library',
            volume: 10,
          })
          expect(available_volume).toEqual(expected_available_volume)
        })
      })
    })
  })
})
