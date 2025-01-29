import useRootStore from '@/stores'
import {
  createPinia,
  setActivePinia,
  successfulResponse,
  failedResponse,
} from '@support/testHelper.js'
import { usePacbioLibraryBatchCreateStore } from '@/stores/pacbioLibraryBatchCreate.js'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import PacbioLibraryBatchFactory from '@tests/factories/PacbioLibraryBatchFactory.js'
import PacbioRequestFactory from '@tests/factories/PacbioRequestFactory.js'
import PacbioTagSetFactory from '@tests/factories/PacbioTagSetFactory.js'
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
const pacbioRequestFactory = PacbioRequestFactory()
const pacbioTagSetFactory = PacbioTagSetFactory()
const pacbioLibraryBatchFactory = PacbioLibraryBatchFactory(pacbioTagSetFactory.storeData.tags)

describe('usePacbioLibraryBatchCreateStore', () => {
  let rootStore, pacbioLibraryBatchCreateStore, pacbioRootStore
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
      up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
    rootStore = useRootStore()
    pacbioLibraryBatchCreateStore = usePacbioLibraryBatchCreateStore()
    pacbioRootStore = usePacbioRootStore()
  })

  describe('getters', () => {
    describe('librariesInBatch', () => {
      it('returns libraries in batch', () => {
        pacbioLibraryBatchCreateStore.libraries = pacbioLibraryBatchFactory.storeData.libraries
        pacbioLibraryBatchCreateStore.tubes = pacbioLibraryBatchFactory.storeData.tubes
        pacbioRootStore.tags = pacbioTagSetFactory.storeData.tags
        expect(pacbioLibraryBatchCreateStore.librariesInBatch).toEqual(
          pacbioLibraryBatchFactory.storeData.librariesInBatch,
        )
      })
      it('returns library data in print format', () => {})
    })

    describe('librariesInfoInPrintFormat', () => {
      it('returns library data in print format', () => {
        pacbioLibraryBatchCreateStore.libraries = pacbioLibraryBatchFactory.storeData.libraries
        pacbioLibraryBatchCreateStore.tubes = pacbioLibraryBatchFactory.storeData.tubes
        expect(pacbioLibraryBatchCreateStore.librariesInfoInPrintFormat).toEqual(
          pacbioLibraryBatchFactory.storeData.librariesInBatch.map(
            ({ barcode, source: source_identifier }) => ({
              barcode,
              source_identifier,
            }),
          ),
        )
      })
    })
  })

  describe('actions', () => {
    describe('createLibraryBatch', () => {
      let create, csvFile, csvFileTextContent, logMessage, mockSuccessResponse, tagSet

      beforeEach(() => {
        create = vi.fn()
        rootStore.api = {
          traction: {
            pacbio: {
              library_batches: { create },
              tag_sets: { get: vi.fn().mockResolvedValue(pacbioTagSetFactory.responses.fetch) },
              requests: { get: vi.fn().mockResolvedValue(pacbioRequestFactory.responses.fetch) },
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
        let result = await pacbioLibraryBatchCreateStore.createLibraryBatch(null, tagSet)
        expect(result.success).toBeFalsy()
        expect(result.errors).toEqual('csvFile is required')

        // Test with tagSet as null
        result = await pacbioLibraryBatchCreateStore.createLibraryBatch(csvFile, null)
        expect(result.success).toBeFalsy()
        expect(result.errors).toEqual('tagSet is required')
      })

      it('returns error if no requests are found', async () => {
        rootStore.api.traction.pacbio.requests.get.mockResolvedValue({ data: [] })
        csvFileTextContent = pacbioLibraryBatchFactory.createCsvFromLibraryBatchData(
          pacbioTagSetFactory.storeData.tags,
        )
        const { success, errors } = await pacbioLibraryBatchCreateStore.createLibraryBatch(
          csvFile,
          tagSet,
        )
        expect(success).toBeFalsy()
        expect(errors).toEqual('None of the given sources (/samples) were found')
      })

      it('returns error if there are dupliacte sources', async () => {
        csvFileTextContent = pacbioLibraryBatchFactory.createCsvFromLibraryBatchData(
          pacbioTagSetFactory.storeData.tags,
        )
        csvFileTextContent += csvFileTextContent
        const { success, errors } = await pacbioLibraryBatchCreateStore.createLibraryBatch(
          csvFile,
          tagSet,
        )
        expect(success).toBeFalsy()
        expect(errors).toEqual(
          `Duplicate sources found in the csv: ${
            pacbioLibraryBatchFactory.storeData.librariesArray.map((batch) => batch.sample_name)
            .join(', ')}`,
        )
      })

      it('returns error if there are duplicate tags', async () => {
        csvFileTextContent = pacbioLibraryBatchFactory.createCsvFromLibraryBatchData(
          pacbioTagSetFactory.storeData.tags,
        )
        //Create duplicate tags
        let csvLines = csvFileTextContent.split('\n')
        let firstLineColumns = csvLines[1].split(',')
        let secondLineColumns = csvLines[2].split(',')
        secondLineColumns[1] = firstLineColumns[1]
        csvLines[1] = firstLineColumns.join(',')
        csvLines[2] = secondLineColumns.join(',')
        csvFileTextContent = csvLines.join('\n')
        const { success, errors } = await pacbioLibraryBatchCreateStore.createLibraryBatch(
          csvFile,
          tagSet,
        )
        expect(success).toBeFalsy()
        expect(errors).toEqual(`Duplicate tags found in the csv: ${firstLineColumns[1]}`)
      })

      it('successfully creates a library batch', async () => {
        csvFileTextContent = pacbioLibraryBatchFactory.createCsvFromLibraryBatchData(
          pacbioTagSetFactory.storeData.tags,
        )
        create.mockResolvedValue(mockSuccessResponse)
        const { success, result } = await pacbioLibraryBatchCreateStore.createLibraryBatch(
          csvFile,
          tagSet,
        )
        const payload = pacbioLibraryBatchFactory.createLibraryBatchPayloadData(
          pacbioTagSetFactory.storeData.tags,
          pacbioRequestFactory.content.data,
        )

        expect(create).toBeCalled(payload)
        expect(success).toBeTruthy()
        expect(pacbioLibraryBatchCreateStore.libraries).toEqual(
          pacbioLibraryBatchFactory.storeData.libraries,
        )
        expect(pacbioLibraryBatchCreateStore.tubes).toEqual(
          pacbioLibraryBatchFactory.storeData.tubes,
        )
        expect(result).toEqual(pacbioLibraryBatchCreateStore.librariesInBatch)
      })

      it('returns error when csv file contains errors', async () => {
        csvFileTextContent = pacbioLibraryBatchFactory.createCsvFromLibraryBatchData(
          pacbioTagSetFactory.storeData.tags,
          true,
        )

        const { success, errors } = await pacbioLibraryBatchCreateStore.createLibraryBatch(
          csvFile,
          tagSet,
        )
        expect(create).not.toBeCalled()
        expect(success).toBeFalsy()
        expect(errors).toEqual('Invalid record at line 2: source test not found')
      })

      it('returns errors on failedResponse', async () => {
        csvFileTextContent = pacbioLibraryBatchFactory.createCsvFromLibraryBatchData(
          pacbioTagSetFactory.storeData.tags,
        )
        const failureResponse = failedResponse()
        create.mockResolvedValue(failureResponse)
        const { success, errors } = await pacbioLibraryBatchCreateStore.createLibraryBatch(
          csvFile,
          tagSet,
        )
        expect(success).toBeFalsy()
        expect(errors).toEqual(failureResponse.errorSummary)
      })
    })
  })
})
