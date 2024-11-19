import useRootStore from '@/stores'
import {
  createPinia,
  setActivePinia,
  successfulResponse,
  failedResponse,
} from '@support/testHelper.js'
import { usePacbioLibraryBatchesStore } from '@/stores/pacbioLibraryBatches.js'
import { beforeEach, describe, expect, vi } from 'vitest'
import PacbioLibraryBatchFactory from '@tests/factories/PacbioLibraryBatchFactory.js'
import PacbioRequestsFactory from '@tests/factories/PacbioRequestsFactory.js'
import PacbioTagSetFactory from '@tests/factories/PacbioTagSetFactory.js'
import fs from 'fs'
import { store } from '@support/testHelper.js'

const pacbioRequestsFactory = PacbioRequestsFactory()
const pacbioLibraryBatchFactory = PacbioLibraryBatchFactory()
const pacbioTagSetFactory = PacbioTagSetFactory()

describe('usePacbioLibraryBatchesStore', () => {
  const apiGetter = store.getters.api.v2

  let rootStore, pacbioLibraryBatchStore
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
      up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
    rootStore = useRootStore()
    pacbioLibraryBatchStore = usePacbioLibraryBatchesStore()
  })

  describe('actions', () => {
    describe('createLibraryBatch', () => {
      let create, getTagSets, csvFile, csvFileTextContent, logMessage, mockSuccessResponse, tagSet

      beforeEach(() => {
        vi.spyOn(apiGetter.traction.pacbio.requests, 'get').mockResolvedValue(
          pacbioRequestsFactory.responses.fetch,
        )
        create = vi.fn()
        getTagSets = vi.fn().mockResolvedValue(pacbioTagSetFactory.responses.fetch)
        rootStore.api.v2 = {
          traction: {
            pacbio: {
              library_batches: { create },
              tag_sets: { get: getTagSets },
            },
          },
        }
        csvFile = {
          text: () => Promise.resolve(csvFileTextContent),
        }
        logMessage = vi.fn()
        rootStore.addCSVLogMessage = logMessage
        mockSuccessResponse = successfulResponse({
          data: {},
          included: [{ type: 'tubes', attributes: { barcode: 'TRAC-1' } }],
        })
        tagSet = pacbioTagSetFactory.storeData.selected.tagSet
      })

      it('returns error if input params are empty', async () => {
        const csvFile = {
          text: () => Promise.resolve(csvFileTextContent),
        }

        // Test with csvFile as null
        let result = await pacbioLibraryBatchStore.createLibraryBatch(null, tagSet)
        expect(result.success).toBeFalsy()
        expect(result.errors).toEqual(['csvFile is required'])

        // Test with tagSet as null
        result = await pacbioLibraryBatchStore.createLibraryBatch(csvFile, null)
        expect(result.success).toBeFalsy()
        expect(result.errors).toEqual(['tagSet is required'])
      })

      it('successfully creates a library batch', async () => {
        csvFileTextContent = fs.readFileSync('./tests/data/csv/pacbio_library_batch.csv', 'utf8')
        create.mockResolvedValue(mockSuccessResponse)
        const { success, barcodes } = await pacbioLibraryBatchStore.createLibraryBatch(
          csvFile,
          tagSet,
        )
        const payload = pacbioLibraryBatchFactory.createLibraryBatchPayloadData(
          csvFileTextContent,
          pacbioRequestsFactory.content.data,
        )

        expect(create).toBeCalled(payload)
        expect(success).toBeTruthy()
        expect(barcodes).toEqual(['TRAC-1'])
      })

      it('returns error when csv file contains duplicate tags', async () => {
        csvFileTextContent = fs.readFileSync(
          './tests/data/csv/pacbio_library_batch_duplicate_tags.csv',
          'utf8',
        )
        create.mockResolvedValue(mockSuccessResponse)
        const { success, errors } = await pacbioLibraryBatchStore.createLibraryBatch(
          csvFile,
          tagSet,
        )
        expect(create).not.toBeCalled()
        expect(success).toBeFalsy()
        expect(errors).toEqual(['Duplicate tag: 289'])
      })

      it('returns error when csv file contains invalid source', async () => {
        csvFileTextContent = fs.readFileSync(
          './tests/data/csv/pacbio_library_batch_invalid_source.csv',
          'utf8',
        )
        create.mockResolvedValue(mockSuccessResponse)
        const { success, errors } = await pacbioLibraryBatchStore.createLibraryBatch(
          csvFile,
          tagSet,
        )
        expect(create).not.toBeCalled()
        expect(success).toBeFalsy()
        expect(errors).toEqual(['Invalid record at line 2: source test not found'])
      })

      it('returns errors on failedResponse', async () => {
        const failureResponse = failedResponse()
        create.mockResolvedValue(failureResponse)
        csvFileTextContent = fs.readFileSync('./tests/data/csv/pacbio_library_batch.csv', 'utf8')
        const { success, errors } = await pacbioLibraryBatchStore.createLibraryBatch(
          csvFile,
          tagSet,
        )
        expect(success).toBeFalsy()
        expect(errors).toEqual(failureResponse.errorSummary)
      })
    })

    describe('#fetchLibraryBatches', () => {
      let get

      beforeEach(() => {
        get = vi.fn()
        rootStore.api.v2.traction.pacbio.library_batches.get = get
      })

      it('successfully', async () => {
        get.mockResolvedValue(pacbioLibraryBatchFactory.responses.fetch)
        const { success } = await pacbioLibraryBatchStore.fetchLibraryBatches()
        expect(success).toBeTruthy()
        expect(pacbioLibraryBatchStore.libraryBatches).toEqual(
          pacbioLibraryBatchFactory.storeData.libraryBatches,
        )
        expect(pacbioLibraryBatchStore.tubes).toEqual(pacbioLibraryBatchFactory.storeData.tubes)
        expect(pacbioLibraryBatchStore.libraries).toEqual(
          pacbioLibraryBatchFactory.storeData.libraries,
        )
      })

      it('unsuccessfully', async () => {
        const failureResponse = failedResponse()
        get.mockResolvedValue(failureResponse)
        const { success, errors } = await pacbioLibraryBatchStore.fetchLibraryBatches()
        expect(success).toBeFalsy()
        expect(errors).toEqual(failureResponse.errorSummary)
      })
    })
  })
})
