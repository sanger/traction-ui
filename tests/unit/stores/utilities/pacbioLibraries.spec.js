import useRootStore from '@/stores'
import {
  createPinia,
  setActivePinia,
  failedResponse,
  successfulResponse,
} from '@support/testHelper.js'
import {
  fetchLibraries,
  formatAndTransformLibraries,
  updateLibrary,
  exhaustLibrayVolume,
} from '@/stores/utilities/pacbioLibraries.js'
import PacbioLibraryFactory from '@tests/factories/PacbioLibraryFactory.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { libraryPayload } from '../../../../src/stores/utilities/pacbioLibraries'

const pacbioLibraryFactory = PacbioLibraryFactory()

describe('pacbioLibraries', () => {
  let rootStore
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
        up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })
  describe('fecthLibraries', () => {
    let get

    beforeEach(() => {
      rootStore = useRootStore()
      get = vi.fn()
      rootStore.api.traction.pacbio.libraries.get = get
    })

    it('calls the api to fetch libraries with default includea', async () => {
      const fetchOptions = { filter: { source_identifier: 'sample1' } }
      await fetchLibraries(fetchOptions)
      expect(get).toHaveBeenCalledWith({ ...fetchOptions, include: 'request,tag,tube' })
    })

    it('calls the api to fetch libraries with custom includes along with default includes', async () => {
      const fetchOptions = { include: 'test' }
      await fetchLibraries(fetchOptions)
      expect(get).toHaveBeenCalledWith({ ...fetchOptions, include: 'test,request,tag,tube' })
    })
    it('calls api to fetch libraries with joined includes if custom includes includes default values', async () => {
      const fetchOptions = { include: 'request,tag,tube,test' }
      await fetchLibraries(fetchOptions)
      expect(get).toHaveBeenCalledWith({ ...fetchOptions, include: 'request,tag,tube,test' })
    })

    it('calls api successfully', async () => {
      get.mockResolvedValue(pacbioLibraryFactory.responses.fetch)
      const { success, errors, libraries, tubes, requests } = await fetchLibraries()
      expect(success).toEqual(true)
      expect(errors).toEqual([])
      expect(libraries).toEqual(pacbioLibraryFactory.storeData.libraries)
      expect(tubes).toEqual(pacbioLibraryFactory.storeData.tubes)
      expect(requests).toEqual(pacbioLibraryFactory.storeData.requests)
    })

    it('unsuccessfully', async () => {
      const failureResponse = failedResponse()
      get.mockResolvedValue(failureResponse)
      const { success, errors } = await fetchLibraries()
      expect(success).toEqual(false)
      expect(errors).toEqual(failureResponse.errorSummary)
    })
  })
  describe('formatAndTransformLibraries', () => {
    it('formats and transforms libraries', () => {
      const libraries = {
        1: {
          id: 1,
          request: 1,
          tag_id: 1,
          tube: 1,
          concentration: 1,
          volume: 1,
          insert_size: 1,
        },
      }
      const tubes = {
        1: {
          id: 1,
          barcode: 'tube1',
        },
      }
      const tags = {
        1: {
          id: 1,
          name: 'tag1',
          group_id: 'group1',
        },
      }
      const requests = {
        1: {
          id: 1,
          sample_name: 'request1',
        },
      }
      const formattedLibraries = formatAndTransformLibraries(libraries, tubes, tags, requests)
      expect(formattedLibraries).toEqual([
        {
          id: 1,
          tag_id: '1',
          tube: 1,
          concentration: 1,
          volume: 1,
          insert_size: 1,
          tag_group_id: 'group1',
          sample_name: 'request1',
          barcode: 'tube1',
        },
      ])
    })
  })
  describe('updateLibrary', () => {
    let update
    beforeEach(() => {
      rootStore = useRootStore()
      update = vi.fn()
      rootStore.api.traction.pacbio.libraries.update = update
    })
    it('doesnt call update if required library fields are empty', async () => {
      const libraryFields = {
        id: 1,
        tag_id: 1,
        tube: 1,
        concentration: 1,
        volume: 1,
        insert_size: '',
      }
      const { success, errors } = await updateLibrary(libraryFields)
      expect(success).toBeFalsy()
      expect(errors).toEqual('Missing required field(s)')
      expect(update).not.toHaveBeenCalled()
    })
    it('validates successfully if any of the value is zero', async () => {
      const libraryFields = {
        id: 1,
        tag_id: 1,
        tube: 1,
        concentration: 1,
        volume: 0,
        insert_size: 1,
      }
      await updateLibrary(libraryFields)
      expect(update).toBeCalled()
    })

    it('calls the api to update the library for library with valid field values', async () => {
      const libraryFields = {
        id: 1,
        tag_id: 1,
        tube: 1,
        concentration: 1,
        volume: 1,
        insert_size: 1,
      }
      const mockResponse = successfulResponse()
      update.mockResolvedValue(mockResponse)
      const { success } = await updateLibrary(libraryFields)
      expect(update).toHaveBeenCalledWith(libraryPayload(libraryFields))
      expect(success).toBeTruthy()
    })
    it('should not return error if optional attributes are empty', async () => {
      const libraryFields = {
        id: 1,
        tag_id: null,
        tube: 1,
        concentration: 1,
        volume: 1,
        insert_size: 1,
      }
      const mockResponse = successfulResponse()
      update.mockResolvedValue(mockResponse)
      const { success } = await updateLibrary(libraryFields)
      expect(success).toBeTruthy()
    })
    it('unsuccessfully', async () => {
      const libraryFields = {
        id: 1,
        tag_id: 1,
        tube: 1,
        concentration: 1,
        volume: 1,
        insert_size: 1,
      }
      const mockResponse = failedResponse()
      update.mockResolvedValue(mockResponse)
      const { success, errors } = await updateLibrary(libraryFields)
      expect(success).toBeFalsy()
      expect(errors).toEqual(mockResponse.errorSummary)
    })
  })

  describe('exhaustLibraryVolume', () => {
    let update
    beforeEach(() => {
      rootStore = useRootStore()
      update = vi.fn()
      rootStore.api.traction.pacbio.libraries.update = update
    })
    it('exhausts library volume', async () => {
      const library = {
        id: 1,
        volume: 15,
        used_volume: 10,
      }
      const mockResponse = successfulResponse()
      update.mockResolvedValue(mockResponse)
      const { success } = await exhaustLibrayVolume(library)
      expect(library.volume).toEqual(library.used_volume)
      expect(update).toHaveBeenCalled()
      expect(success).toBeTruthy()
    })
  })
})
