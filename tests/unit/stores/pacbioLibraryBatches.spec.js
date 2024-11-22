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
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
import fs from 'fs'
const pacbioRequestsFactory = PacbioRequestsFactory()
const pacbioTagSetFactory = PacbioTagSetFactory()
const pacbioLibraryBatchFactory = PacbioLibraryBatchFactory(pacbioTagSetFactory.storeData.tags)

describe('usePacbioLibraryBatchesStore', () => {
  let rootStore, pacbioLibraryBatchStore, pacbioRootStore
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
      up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
    rootStore = useRootStore()
    pacbioLibraryBatchStore = usePacbioLibraryBatchesStore()
    pacbioRootStore = usePacbioRootStore()
  })

  describe('librariesInBatch', () => {
    it('returns libraries in batch', () => {
      pacbioLibraryBatchStore.libraries = pacbioLibraryBatchFactory.storeData.libraries
      pacbioLibraryBatchStore.tubes = pacbioLibraryBatchFactory.storeData.tubes
      pacbioRootStore.tags = pacbioTagSetFactory.storeData.tags
      expect(pacbioLibraryBatchStore.librariesInBatch).toEqual(
        pacbioLibraryBatchFactory.storeData.librariesInBatch,
      )
    })
  })

  describe('actions', () => {
    describe('createLibraryBatch', () => {
      let create, csvFile, csvFileTextContent, logMessage, mockSuccessResponse, tagSet

      beforeEach(() => {
        create = vi.fn()
        rootStore.api.v2 = {
          traction: {
            pacbio: {
              library_batches: { create },
              tag_sets: { get: vi.fn().mockResolvedValue(pacbioTagSetFactory.responses.fetch) },
              requests: { get: vi.fn().mockResolvedValue(pacbioRequestsFactory.responses.fetch) },
            },
          },
        }
        csvFile = {
          text: () => Promise.resolve(csvFileTextContent),
        }
        logMessage = vi.fn()
        rootStore.addCSVLogMessage = logMessage
        mockSuccessResponse = successfulResponse(pacbioLibraryBatchFactory.content)
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
        const { success, result } = await pacbioLibraryBatchStore.createLibraryBatch(
          csvFile,
          tagSet,
        )
        const payload = pacbioLibraryBatchFactory.createLibraryBatchPayloadData(
          csvFileTextContent,
          pacbioRequestsFactory.content.data,
        )

        expect(create).toBeCalled(payload)
        expect(success).toBeTruthy()
        expect(pacbioLibraryBatchStore.libraries).toEqual(
          pacbioLibraryBatchFactory.storeData.libraries,
        )
        expect(pacbioLibraryBatchStore.tubes).toEqual(pacbioLibraryBatchFactory.storeData.tubes)
        expect(result).toEqual(pacbioLibraryBatchStore.librariesInBatch)
      })

      it('returns error when csv file contains errors', async () => {
        csvFileTextContent = fs.readFileSync(
          './tests/data/csv/pacbio_library_batch_invalid_source.csv',
          'utf8',
        )
        const { success, errors } = await pacbioLibraryBatchStore.createLibraryBatch(
          csvFile,
          tagSet,
        )
        expect(create).not.toBeCalled()
        expect(success).toBeFalsy()
        expect(errors).toEqual(['Invalid record at line 3: source test not found'])
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
  })
})
