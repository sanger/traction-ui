import fs from 'fs'
import BaseFactory from './BaseFactory.js'

const defaultCsv = fs.readFileSync('./tests/data/csv/qc-results-upload.csv', 'utf8')
/*
 * Factory for creating a QcResultUploadResponse object
 * @returns a base factory object with the QcResultUpload data
 */
const PrinterFactory = (csv = defaultCsv, used_by = 'extraction') => {
  const data = {
    data: {
      id: '69',
      type: 'qc_results_uploads',
      links: {
        self: 'http://localhost:3100/v1/qc_results_uploads/69',
      },
      attributes: {
        csv_data: csv,
        used_by,
      },
    },
  }

  return { ...BaseFactory(data) }
}

export default PrinterFactory
