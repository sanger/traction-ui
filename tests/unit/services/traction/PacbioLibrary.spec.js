import useRootStore from '@/stores'
import PacbioLibraryFactory from '@tests/factories/PacbioLibraryFactory.js'
import {
  getPacbioLibraryResources,
  updatePacbioLibraryResource,
  buildLibraryResourcePayload,
} from '@/services/traction/PacbioLibrary.js'
import { failedResponse, successfulResponse } from '@support/testHelper.js'

const pacbioLibraryFactory = PacbioLibraryFactory()

describe('PacbioLibrary', () => {
  let rootStore

  describe('getPacbioLibraryResources', () => {
    let get

    beforeEach(() => {
      rootStore = useRootStore()
      get = vi.fn()
      rootStore.api.traction.pacbio.libraries.get = get
    })

    it('calls the api to fetch libraries with default includea', async () => {
      const fetchOptions = { filter: { source_identifier: 'sample1' } }
      await getPacbioLibraryResources(fetchOptions)
      expect(get).toHaveBeenCalledWith({ ...fetchOptions, include: 'request,tag' })
    })

    it('calls the api to fetch libraries with custom includes along with default includes', async () => {
      const fetchOptions = { include: 'test' }
      await getPacbioLibraryResources(fetchOptions)
      expect(get).toHaveBeenCalledWith({ ...fetchOptions, include: 'test,request,tag' })
    })
    it('calls api to fetch libraries with joined includes if custom includes includes default values', async () => {
      const fetchOptions = { include: 'request,tag,test' }
      await getPacbioLibraryResources(fetchOptions)
      expect(get).toHaveBeenCalledWith({ ...fetchOptions, include: 'request,tag,test' })
    })

    it('calls api successfully', async () => {
      get.mockResolvedValue(pacbioLibraryFactory.responses.fetch)
      const { success, errors, libraries, requests } = await getPacbioLibraryResources()
      expect(success).toEqual(true)
      expect(errors).toEqual([])
      expect(libraries).toEqual(pacbioLibraryFactory.storeData.libraries)
      expect(requests).toEqual(pacbioLibraryFactory.storeData.requests)
    })

    it('unsuccessfully', async () => {
      const failureResponse = failedResponse()
      get.mockResolvedValue(failureResponse)
      const { success, errors } = await getPacbioLibraryResources()
      expect(success).toEqual(false)
      expect(errors).toEqual(failureResponse.errorSummary)
    })
  })

  describe('updatePacbioLibraryResource', () => {
    let update
    beforeEach(() => {
      rootStore = useRootStore()
      update = vi.fn()
      rootStore.api.traction.pacbio.libraries.update = update
    })
    it('calls the api successfully', async () => {
      const libraryFields = {
        id: 1,
        tag_id: 1,
        concentration: 1,
        volume: 1,
        insert_size: 1,
      }
      const mockResponse = successfulResponse()
      update.mockResolvedValue(mockResponse)
      const { success } = await updatePacbioLibraryResource(libraryFields)
      expect(update).toHaveBeenCalledWith(buildLibraryResourcePayload(libraryFields))
      expect(success).toBeTruthy()
    })
    it('unsuccessfully', async () => {
      const libraryFields = {
        id: 1,
        tag_id: 1,
        concentration: 1,
        volume: 1,
        insert_size: 1,
      }
      const mockResponse = failedResponse()
      update.mockResolvedValue(mockResponse)
      const { success, errors } = await updatePacbioLibraryResource(libraryFields)
      expect(success).toBeFalsy()
      expect(errors).toEqual(mockResponse.errorSummary)
    })
  })
})
