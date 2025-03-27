import useRootStore from '@/stores'
import { createPinia, setActivePinia, successfulResponse } from '@support/testHelper.js'
import {
  formatAndTransformLibraries,
  validateAndUpdateLibrary,
  exhaustLibrayVolume,
  isLibraryExhausted,
} from '@/stores/utilities/pacbioLibraries.js'
import { beforeEach, describe, expect, it } from 'vitest'

describe('pacbioLibraries', () => {
  let rootStore
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
        up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })
  describe('formatAndTransformLibraries', () => {
    it('formats and transforms libraries', () => {
      const libraries = {
        1: {
          id: 1,
          request: 1,
          tag_id: 1,
          concentration: 1,
          volume: 1,
          insert_size: 1,
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
      const formattedLibraries = formatAndTransformLibraries(libraries, tags, requests)
      expect(formattedLibraries).toEqual([
        {
          id: 1,
          tag_id: '1',
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
  describe('validateAndUpdateLibrary', () => {
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
        concentration: 1,
        volume: 1,
        insert_size: '',
      }
      const { success, errors } = await validateAndUpdateLibrary(libraryFields)
      expect(success).toBeFalsy()
      expect(errors).toEqual('Missing required field(s)')
      expect(update).not.toHaveBeenCalled()
    })
    it('validates successfully if any of the value is zero', async () => {
      const libraryFields = {
        id: 1,
        tag_id: 1,
        concentration: 1,
        volume: 0,
        insert_size: 1,
      }
      await validateAndUpdateLibrary(libraryFields)
      expect(update).toBeCalled()
    })

    it('calls the api to update the library for library with valid field values', async () => {
      const libraryFields = {
        id: 1,
        tag_id: 1,
        concentration: 1,
        volume: 1,
        insert_size: 1,
      }
      const mockResponse = successfulResponse()
      update.mockResolvedValue(mockResponse)
      const { success } = await validateAndUpdateLibrary(libraryFields)
      expect(success).toBeTruthy()
    })
    it('should not return error if optional attributes are empty', async () => {
      const libraryFields = {
        id: 1,
        tag_id: null,
        concentration: 1,
        volume: 1,
        insert_size: 1,
      }
      const mockResponse = successfulResponse()
      update.mockResolvedValue(mockResponse)
      const { success } = await validateAndUpdateLibrary(libraryFields)
      expect(success).toBeTruthy()
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

  describe('isLibraryExhausted', () => {
    let update
    beforeEach(() => {
      rootStore = useRootStore()
      update = vi.fn()
      rootStore.api.traction.pacbio.libraries.update = update
    })
    it('returns true if volume is equal to used_volume', async () => {
      const library = {
        id: 1,
        volume: 15,
        used_volume: 15,
      }
      const isExhausted = isLibraryExhausted(library)
      expect(isExhausted).toBeTruthy()
    })
    it('returns false if volume is not equal to used_volume', async () => {
      const library = {
        id: 1,
        volume: 15,
        used_volume: 10,
      }
      const isExhausted = isLibraryExhausted(library)
      expect(isExhausted).toBeFalsy()
    })
  })
})
