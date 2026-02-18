import {
  parseMultiPoolFile,
  getColumnIndexOfHeader,
  validateColumn,
  validatePoolNumberColumn,
  validateSourceIdentifierColumn,
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
    it('returns an error if the CSV file is empty', async () => {
      const csv = '\n\n\n,,,,\n'
      const { success, errors } = await parseMultiPoolFile(csv)
      expect(success).toBeFalsy()
      expect(errors).toEqual(['The provided csv file is empty'])
    })

    it('returns errors for invalid pool numbers and source identifiers', () => {
      const csv = 'Pool Number,Source Identifier\n,Sample1\nabc,\n0,Sample3\n97,Sample4'
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
      const csv = 'Pool Number,Source Identifier\n1,Sample1\n2,Sample2'
      const { success, errors } = parseMultiPoolFile(csv)
      expect(success).toBe(true)
      expect(errors.length).toBe(0)
    })
  })
})
