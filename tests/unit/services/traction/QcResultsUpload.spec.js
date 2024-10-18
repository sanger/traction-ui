import fs from 'fs'
import { createQcResultsUploadResource } from '@/services/traction/QcResultsUpload.js'
import QcResultUploadFactory from '@tests/factories/QcResultUploadFactory.js'

const csv = fs.readFileSync('./tests/data/csv/qc-results-upload.csv', 'utf8')
const used_by = 'extraction'
const QcResultsUploadFactory = QcResultUploadFactory(csv, used_by)

describe('QcResultsUpload', () => {
  describe('#createQcResultsUploadResource', () => {
    const createQcResultsUploadRequest = vi.fn()

    it('successfully', async () => {
      createQcResultsUploadRequest.mockResolvedValue(QcResultsUploadFactory.responses.fetch)

      const response = await createQcResultsUploadResource(createQcResultsUploadRequest, {
        csv,
        usedBySelected: used_by,
      })

      expect(response).toEqual({
        success: true,
        ...QcResultsUploadFactory.content,
        errors: [],
      })
    })

    it('generates a valid payload', async () => {
      createQcResultsUploadRequest.mockResolvedValue(QcResultsUploadFactory.responses.fetch)

      await createQcResultsUploadResource(createQcResultsUploadRequest, {
        csv,
        usedBySelected: used_by,
      })

      expect(createQcResultsUploadRequest).toHaveBeenCalledWith({
        data: {
          data: {
            type: 'qc_results_uploads',
            attributes: {
              csv_data: csv,
              used_by: used_by,
            },
          },
        },
      })
    })

    it('when the QcResultsUpload could not be created', async () => {
      createQcResultsUploadRequest.mockRejectedValue('There was an error')

      expect(
        await createQcResultsUploadResource(createQcResultsUploadRequest, {
          csv,
          usedBySelected: used_by,
        }),
      ).toEqual({
        success: false,
        data: {},
        errors: 'There was an error',
      })
    })
  })
})
