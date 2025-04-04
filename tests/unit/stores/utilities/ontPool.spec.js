import { describe, it, expect } from 'vitest'
import {
  validate,
  valid,
  payload,
  autoTagPlate,
  tubeFor,
  autoTagTube,
} from '@/stores/utilities/ontPool.js'

describe('ontPool.js', () => {
  describe('validate', () => {
    it('validates libraries and adds errors if required fields are missing', () => {
      const libraries = {
        lib1: { ont_request_id: 1, volume: 10, concentration: 20, insert_size: 300 },
        lib2: { ont_request_id: 2, volume: 15, concentration: 25, insert_size: 350, tag_id: 1 },
      }
      validate({ libraries })
      expect(libraries.lib1.errors).toEqual({ tag_id: 'must be present' })
      expect(libraries.lib2.errors).toEqual({})
    })

    it('validates libraries and adds errors if tags are duplicated', () => {
      const libraries = {
        lib1: { ont_request_id: 1, volume: 10, concentration: 20, insert_size: 300, tag_id: 1 },
        lib2: { ont_request_id: 2, volume: 15, concentration: 25, insert_size: 350, tag_id: 1 },
      }
      validate({ libraries })
      expect(libraries.lib1.errors).toEqual({ tag_id: 'duplicated' })
      expect(libraries.lib2.errors).toEqual({ tag_id: 'duplicated' })
    })
  })

  describe('valid', () => {
    it('returns true if all libraries are valid', () => {
      const libraries = {
        lib1: { errors: {} },
        lib2: { errors: {} },
      }
      expect(valid({ libraries })).toBe(true)
    })

    it('returns false if any library has errors', () => {
      const libraries = {
        lib1: { errors: {} },
        lib2: { errors: { tag_id: 'duplicated' } },
      }
      expect(valid({ libraries })).toBe(false)
    })
  })

  describe('payload', () => {
    it('creates a JSON API compliant payload', () => {
      const libraries = {
        lib1: {
          id: 1,
          ont_request_id: 2,
          kit_barcode: 'ABC123',
          tag_id: 3,
          volume: 10,
          concentration: 20,
          insert_size: 300,
        },
        lib2: {
          id: 2,
          ont_request_id: 3,
          kit_barcode: 'DEF456',
          tag_id: 4,
          volume: 15,
          concentration: 25,
          insert_size: 350,
        },
      }
      const pool = {
        id: 1,
        kit_barcode: 'XYZ789',
        volume: 20,
        concentration: 30,
        insert_size: 400,
      }
      const result = payload({ libraries, pool })
      expect(result).toEqual({
        data: {
          type: 'pools',
          id: 1,
          attributes: {
            library_attributes: [
              {
                id: 1,
                ont_request_id: 2,
                kit_barcode: 'ABC123',
                tag_id: 3,
                volume: 10,
                concentration: 20,
                insert_size: 300,
              },
              {
                id: 2,
                ont_request_id: 3,
                kit_barcode: 'DEF456',
                tag_id: 4,
                volume: 15,
                concentration: 25,
                insert_size: 350,
              },
            ],
            kit_barcode: 'XYZ789',
            volume: 20,
            concentration: 30,
            insert_size: 400,
          },
        },
      })
    })
  })

  describe.skip('autoTagPlate', () => {
    const requests = {
      1: { id: 1, well: 1 },
      2: { id: 2, well: 2 },
      3: { id: 3, well: 3 },
    }
    const tagSets = {
      1: { tags: [101, 102, 103] },
    }
    const selectedTagSet = { id: 1 }
    const library = { ont_request_id: 1, tag_id: 101 }
    const libraries = {
      1: { ont_request_id: 1, tag_id: 101 },
      2: { ont_request_id: 2 },
      3: { ont_request_id: 3 },
    }

    it('assigns unique tags to libraries on the same plate based on their positions', () => {
      const wells = {
        1: { plate: 1, position: 'A1' },
        2: { plate: 1, position: 'B1' },
        3: { plate: 1, position: 'C1' },
      }

      const result = autoTagPlate({ wells, requests, tagSets, library, selectedTagSet, libraries })
      expect(result[2].tag_id).toBe(102)
      expect(result[3].tag_id).toBe(103)
    })

    it('skips libraries not on the same plate', () => {
      const wells = {
        1: { plate: 1, position: 'A1' },
        2: { plate: 2, position: 'A2' },
      }

      const result = autoTagPlate({ wells, requests, tagSets, library, selectedTagSet, libraries })

      expect(result[2].tag_id).toBeUndefined()
    })

    it('does not assign tags to libraries with negative or zero offset', () => {
      const wells = {
        1: { plate: 1, position: 'A1' },
        2: { plate: 1, position: 'A1' },
      }

      const result = autoTagPlate({ wells, requests, tagSets, library, selectedTagSet, libraries })

      expect(result[2].tag_id).toBeUndefined()
    })
  })
})

describe('tubeFor', () => {
  it('returns the correct tube when the request ID matches', () => {
    const tubes = {
      1: { id: 1, requests: ['req1'] },
      2: { id: 2, requests: ['req2'] },
      3: { id: 3, requests: ['req3'] },
    }
    const requestId = 'req2'

    const result = tubeFor(tubes, requestId)

    expect(result).toEqual({ id: 2, requests: ['req2'] })
  })

  it('returns undefined when no tube matches the request ID', () => {
    const tubes = {
      1: { id: 1, requests: ['req1'] },
      2: { id: 2, requests: ['req2'] },
    }
    const requestId = 'req3'

    const result = tubeFor(tubes, requestId)

    expect(result).toBeUndefined()
  })

  it('returns undefined when the tubes object is empty', () => {
    const tubes = {}
    const requestId = 'req1'

    const result = tubeFor(tubes, requestId)

    expect(result).toBeUndefined()
  })

  it('returns undefined when the request ID is not provided', () => {
    const tubes = {
      1: { id: 1, requests: ['req1'] },
      2: { id: 2, requests: ['req2'] },
    }

    const result = tubeFor(tubes, undefined)

    expect(result).toBeUndefined()
  })

  it('returns undefined when the requests array in a tube is empty', () => {
    const tubes = {
      1: { id: 1, requests: [] },
      2: { id: 2, requests: ['req2'] },
    }
    const requestId = 'req1'

    const result = tubeFor(tubes, requestId)

    expect(result).toBeUndefined()
  })
})

describe('autoTagTube', () => {
  const tagSets = {
    1: { tags: ['tag1', 'tag2', 'tag3'] },
  }

  const tubes = {
    1: { id: '1', requests: ['req1'] },
    2: { id: '2', requests: ['req2'] },
    3: { id: '3', requests: ['req3'] },
  }

  const selectedTagSet = { id: 1 }
  const selectedRequests = {
    req1: { id: 'req1' },
    req2: { id: 'req2' },
    req3: { id: 'req3' },
  }

  const libraries = {
    req1: { ont_request_id: 'req1', tag_id: 'tag1' },
    req2: { ont_request_id: 'req2', tag_id: null },
    req3: { ont_request_id: 'req3', tag_id: null },
  }

  it('assigns tags to libraries based on their associated tubes', () => {
    const library = { ont_request_id: 'req1', tag_id: 'tag1' }

    const result = autoTagTube({
      tagSets,
      tubes,
      selectedTagSet,
      selectedRequests,
      libraries,
      library,
    })

    expect(result).toEqual({
      req2: { ont_request_id: 'req2', tag_id: 'tag2' },
      req3: { ont_request_id: 'req3', tag_id: 'tag3' },
    })
  })

  it('skips libraries associated with tubes that have a lower or equal ID', () => {
    const library = { ont_request_id: 'req2', tag_id: 'tag2' }

    const result = autoTagTube({
      tagSets,
      tubes,
      selectedTagSet,
      selectedRequests,
      libraries,
      library,
    })

    expect(result).toEqual({
      req3: { ont_request_id: 'req3', tag_id: 'tag3' },
    })
  })

  it('returns an empty object if no matching tubes are found', () => {
    const library = { ont_request_id: 'req4', tag_id: 'tag1' }

    const result = autoTagTube({
      tagSets,
      tubes,
      selectedTagSet,
      selectedRequests,
      libraries,
      library,
    })

    expect(result).toEqual({})
  })
})
