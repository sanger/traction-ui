import {
  parseMultiPoolFile,
  getColumnIndexOfHeader,
  validateColumn,
  validateHeaders,
  validatePoolNumberColumn,
  validateSourceIdentifierColumn,
  formatRecord,
  requiredHeaders
} from '@/lib/csv/multiPool.js'

describe('multiPool', () => {
  describe('getColumnIndexOfHeader', () => {
    it('returns the correct column index for a given header', () => {
      const csv = 'Pool Number,Source Identifier\n1,Sample1\n2,Sample2'
      expect(getColumnIndexOfHeader(csv, 'Pool Number')).toBe(0)
      expect(getColumnIndexOfHeader(csv, 'Source Identifier')).toBe(1)
    })

    it('throws an error if the header is not found', () => {
      const csv = 'Pool Number,Source Identifier\n1,Sample1\n2,Sample2'
      expect(() => getColumnIndexOfHeader(csv, 'Invalid Header')).toThrow(
        'Header "Invalid Header" not found in CSV',
      )
    })
  })

  describe('validateHeaders', () => {
    it('returns an error for missing headers', () => {
      const csv = 'Pool Number,Source Identifier\n1,Sample1\n2,Sample2'
      const errors = validateHeaders(csv, ['Pool Number', 'Missing Header'])
      expect(errors).toContain('Header "Missing Header" not found in CSV')
    })

    it('returns no errors if all headers are present', () => {
      const csv = 'Pool Number,Source Identifier\n1,Sample1\n2,Sample2'
      const errors = validateHeaders(csv, ['Pool Number', 'Source Identifier'])
      expect(errors.length).toBe(0)
    })
  })

  describe('validatePoolNumberColumn', () => {
    it('returns an error for missing pool number', () => {
      const csv = 'Pool Number,Source Identifier\n,Sample1\n2,Sample2'
      const errors = validatePoolNumberColumn(csv)
      expect(errors).toContain('Missing pool number on line 2')
    })

    it('returns an error for non-numeric pool number', () => {
      const csv = 'Pool Number,Source Identifier\nabc,Sample1\n2,Sample2'
      const errors = validatePoolNumberColumn(csv)
      expect(errors).toContain('Invalid pool number on line 2, pool number must be a number')
    })

    it('returns an error for pool number less than 1', () => {
      const csv = 'Pool Number,Source Identifier\n0,Sample1\n2,Sample2'
      const errors = validatePoolNumberColumn(csv)
      expect(errors).toContain('Invalid pool number on line 2, pool number must be greater than 0')
    })

    it('returns an error for pool number greater than 96', () => {
      const csv = 'Pool Number,Source Identifier\n97,Sample1\n2,Sample2'
      const errors = validatePoolNumberColumn(csv)
      expect(errors).toContain(
        'Invalid pool number on line 2, pool number must be less than or equal to 96',
      )
    })

    it('returns no errors for valid pool numbers', () => {
      const csv = 'Pool Number,Source Identifier\n1,Sample1\n2,Sample2'
      const errors = validatePoolNumberColumn(csv)
      expect(errors.length).toBe(0)
    })
  })

  describe('validateSourceIdentifierColumn', () => {
    it('returns an error for missing source identifier', () => {
      const csv = 'Pool Number,Source Identifier\n1,\n2,Sample2'
      const errors = validateSourceIdentifierColumn(csv)
      expect(errors).toContain('Missing source identifier on line 2')
    })

    it('returns no errors for valid source identifiers', () => {
      const csv = 'Pool Number,Source Identifier\n1,Sample1\n2,Sample2'
      const errors = validateSourceIdentifierColumn(csv)
      expect(errors.length).toBe(0)
    })
  })

  describe('validateColumn', () => {
    const validateFn = (value, index) => {
      if (!value) return `Missing value on line ${index + 2}`
      if (isNaN(value)) return `Invalid value on line ${index + 2}, must be a number`
      return null
    }

    it('returns errors from the validation function', () => {
      const csv = 'Pool Number,Source Identifier\n,Sample1\nabc,Sample2'
      const errors = validateColumn(csv, 'Pool Number', validateFn)
      expect(errors).toContain('Missing value on line 2')
      expect(errors).toContain('Invalid value on line 3, must be a number')
    })

    it('returns no errors for valid values', () => {
      const csv = 'Pool Number,Source Identifier\n1,Sample1\n2,Sample2'
      const errors = validateColumn(csv, 'Pool Number', validateFn)
      expect(errors.length).toBe(0)
    })

    it('returns an error if the header is not found', () => {
      const csv = 'Pool Number,Source Identifier\n1,Sample1\n2,Sample2'
      const errors = validateColumn(csv, 'Invalid Header', validateFn)
      expect(errors).toContain('Header "Invalid Header" not found in CSV')
    })
  })

  describe('parseMultiPoolFile', () => {
    let csv
    beforeEach(() => {
      csv = requiredHeaders.join(',') + '\n'
    })

    it('returns an error if the CSV file is empty', async () => {
      csv = '\n\n\n,,,,\n'
      const { success, errors } = await parseMultiPoolFile(csv)
      expect(success).toBeFalsy()
      expect(errors).toEqual(['The provided csv file is empty'])
    })

    it('returns an error if required headers are missing', async () => {
      csv = 'Pool Number,Source Identifier\n1,Sample1\n2,Sample2'
      const { success, errors } = await parseMultiPoolFile(csv)
      expect(success).toBeFalsy()
      expect(errors).toStrictEqual([
        'Header "Tag Set" not found in CSV',
        'Header "Tag" not found in CSV',
        'Header "Template Prep Kit Box Barcode" not found in CSV',
        'Header "Volume (uL)" not found in CSV',
        'Header "Concentration (ng/uL)" not found in CSV',
        'Header "Insert Size" not found in CSV',
      ])
    })

    it('returns errors for invalid pool numbers and source identifiers', () => {
      // Line 2 missing pool number
      csv += ',Sample1,,,,,,\n'
      // Line 3 non-numeric pool number and missing source identifier
      csv += 'abc,,,,,,\n'
      // Line 4 pool number less than 1
      csv += '0,Sample3,,,,,,\n'
      // Line 5 pool number greater than 96
      csv += '97,Sample4,,,,,,\n'
      const { success, errors } = parseMultiPoolFile(csv)
      expect(success).toBe(false)
      expect(errors).toContain('Missing pool number on line 2')
      expect(errors).toContain('Invalid pool number on line 3, pool number must be a number')
      expect(errors).toContain('Missing source identifier on line 3')
      expect(errors).toContain('Invalid pool number on line 4, pool number must be greater than 0')
      expect(errors).toContain(
        'Invalid pool number on line 5, pool number must be less than or equal to 96',
      )
    })

    it('returns success for valid CSV', () => {
      // Ensure the pool number and source identifier (first 2) columns are valid to confirm that the file is parsed successfully
      csv += '1,Sample1,,,,,,\n'
      csv += '2,Sample2,,,,,,\n'
      const { success, errors } = parseMultiPoolFile(csv)
      expect(success).toBe(true)
      expect(errors.length).toBe(0)
    })
  })

  describe('formatRecord', () => {
    it('formats a record correctly', () => {
      const record = {
        record: {
          'volume_(ul)': 10,
          'concentration_(ng/ul)': 5,
        },
      }
      const formattedRecord = formatRecord(record)
      expect(formattedRecord.record.volume).toBe(10)
      expect(formattedRecord.record.concentration).toBe(5)
      expect(formattedRecord.record['volume_(ul)']).toBeUndefined()
      expect(formattedRecord.record['concentration_(ng/ul)']).toBeUndefined()
    })
  })
})
