import fs from 'fs'
import { createQcResultsUploadResource } from '@/services/traction/QcResultsUpload'

describe('QcResultsUpload', () => {
  describe('#createQcResultsUploadResource', () => {
    const csv = fs.readFileSync('./tests/data/v1/csv/pacbio-missing-source.csv', 'utf8')

    const usedBySelected = 'extraction'

    const createdReceptionResponse = {
      status: 201,
      statusText: 'Created',
      data: {
        id: '69',
        type: 'qc_results_uploads',
        links: {
          self: 'http://localhost:3100/v1/qc_results_uploads/69',
        },
        attributes: {
          csv_data: csv,
          used_by: usedBySelected,
        },
      },
    }

    const createQcResultsUploadRequest = vi.fn()

    it('successfully', async () => {
      createQcResultsUploadRequest.mockResolvedValue(createdReceptionResponse)

      const response = await createQcResultsUploadResource(createQcResultsUploadRequest, {
        csv,
        usedBySelected,
      })

      expect(response).toEqual(createdReceptionResponse.data)
    })

    it('generates a valid payload', async () => {
      createQcResultsUploadRequest.mockResolvedValue(createdReceptionResponse)

      await createQcResultsUploadResource(createQcResultsUploadRequest, { csv, usedBySelected })

      expect(createQcResultsUploadRequest).toHaveBeenCalledWith({
        data: {
          data: {
            type: 'qc_results_uploads',
            attributes: {
              csv_data: csv,
              used_by: usedBySelected,
            },
          },
        },
      })
    })

    it('when the QcResultsUpload could not be created', async () => {
      const failedResponse = {
        status: 422,
        statusText: 'Record not found',
        data: {
          errors: [{ title: 'error1', detail: 'There was an error.' }],
        },
      }

      createQcResultsUploadRequest.mockRejectedValue({ response: failedResponse })

      expect(
        createQcResultsUploadResource(createQcResultsUploadRequest, { csv, usedBySelected }),
      ).rejects.toThrow('error1 There was an error.')
    })
  })
})
