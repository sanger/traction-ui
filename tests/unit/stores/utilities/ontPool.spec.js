import { describe, it, expect } from 'vitest'
import {
  validate,
  valid,
  payload,
  autoTagPlate,
  tubeFor,
  autoTagTube,
  buildTagAttributes,
  findRequestsForSource,
  populatePoolingLibraries,
  newLibrary,
  populateById,
} from '@/stores/utilities/ontPool.js'
import { dataToObjectById } from '@/api/JsonApi.js'
import PacbioRunFactory from '@tests/factories/PacbioRunFactory.js'

const pacbioRunFactory = PacbioRunFactory({ count: 1 })

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

  describe('autoTagPlate', () => {
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
        1: { plate: 1, position: 'A1', requests: ['1'] },
        2: { plate: 1, position: 'B1', requests: ['2'] },
        3: { plate: 1, position: 'C1', requests: ['3'] },
      }

      const result = autoTagPlate({ wells, tagSets, library, selectedTagSet, libraries })
      expect(result[2].tag_id).toBe(102)
      expect(result[3].tag_id).toBe(103)
    })

    it('skips libraries not on the same plate', () => {
      const wells = {
        1: { plate: 1, position: 'A1', requests: ['1'] },
        2: { plate: 2, position: 'B1', requests: ['2'] },
      }

      const result = autoTagPlate({ wells, tagSets, library, selectedTagSet, libraries })

      expect(result[2].tag_id).toBeUndefined()
    })

    it('does not assign tags to libraries with negative or zero offset', () => {
      const wells = {
        1: { plate: 1, position: 'A1', requests: ['1'] },
        2: { plate: 1, position: 'A1', requests: ['2'] },
      }

      const result = autoTagPlate({ wells, tagSets, library, selectedTagSet, libraries })

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

describe('buildTagAttributes', () => {
  const selectedTagSet = {
    tags: [
      { id: '1', group_id: 'NB01' },
      { id: '2', group_id: 'NB02' },
    ],
  }

  it('returns the tag_id when a matching tag is found', () => {
    const tag = 'NB01'

    const result = buildTagAttributes(selectedTagSet, tag)

    expect(result).toEqual({ tag_id: '1' })
  })

  it('returns an empty object when no tag is provided', () => {
    const tag = null

    const result = buildTagAttributes(selectedTagSet, tag)

    expect(result).toEqual({})
  })

  it('returns an error object when the tag is not found', () => {
    const tag = 'NB03'

    const result = buildTagAttributes(selectedTagSet, tag)

    expect(result).toEqual({
      error: 'Could not find a tag named NB03 in selected tag group',
    })
  })
})

describe('findRequestsForSource', () => {
  const plates = {
    plate1: { barcode: 'PLATE123', wells: ['well1', 'well2'] },
  }

  const wells = {
    well1: { position: 'A1', requests: ['req1'] },
    well2: { position: 'B1', requests: ['req2'] },
  }

  const tubes = {
    tube1: { barcode: 'TUBE123', requests: ['req3'] },
  }

  it('returns request IDs for a valid plate and well', () => {
    const sourceData = { barcode: 'PLATE123', wellName: 'A1' }
    const resources = { plates, wells, tubes }

    const result = findRequestsForSource({ sourceData, resources })

    expect(result).toEqual({ success: true, requestIds: ['req1'], plate: plates.plate1 })
  })

  it('returns an error if the plate barcode is not found', () => {
    const sourceData = { barcode: 'INVALID_PLATE', wellName: 'A1' }
    const resources = { plates, wells, tubes }

    const result = findRequestsForSource({ sourceData, resources })

    expect(result).toEqual({
      success: false,
      errors:
        'INVALID_PLATE could not be found. Barcode should be in the format barcode:well for plates (eg. DN123S:A1) or just barcode for tubes.',
    })
  })

  it('returns an error if the well name is not found on the plate', () => {
    const sourceData = { barcode: 'PLATE123', wellName: 'C1' }
    const resources = { plates, wells, tubes }

    const result = findRequestsForSource({ sourceData, resources })

    expect(result).toEqual({
      success: false,
      errors: 'A well named C1 could not be found on PLATE123',
    })
  })

  it('returns request IDs for a valid tube', () => {
    const sourceData = { barcode: 'TUBE123' }
    const resources = { plates, wells, tubes }

    const result = findRequestsForSource({ sourceData, resources })

    expect(result).toEqual({ success: true, requestIds: ['req3'], tube: tubes.tube1 })
  })

  it('returns an error if the tube barcode is not found', () => {
    const sourceData = { barcode: 'INVALID_TUBE' }
    const resources = { plates, wells, tubes }

    const result = findRequestsForSource({ sourceData, resources })

    expect(result).toEqual({
      success: false,
      errors:
        'INVALID_TUBE could not be found. Barcode should be in the format barcode:well for plates (eg. DN123S:A1) or just barcode for tubes.',
    })
  })
})

describe('populatePoolingLibraries', () => {
  it('transforms libraries into a structured format', () => {
    const libraries = {
      1: { request: 'req1', tag: 'tag1', volume: 10 },
      2: { request: 'req2', tag: 'tag2', volume: 15 },
    }

    const result = populatePoolingLibraries(libraries)

    expect(result).toEqual({
      req1: { ...newLibrary(), ont_request_id: 'req1', tag_id: 'tag1', ...libraries[1] },
      req2: { ...newLibrary(), ont_request_id: 'req2', tag_id: 'tag2', ...libraries[2] },
    })
  })

  it('handles an empty libraries object', () => {
    const libraries = {}

    const result = populatePoolingLibraries(libraries)

    expect(result).toEqual({})
  })

  it('includes default attributes for each library', () => {
    const libraries = {
      1: { request: 'req1', tag: 'tag1', volume: 10 },
    }

    const result = populatePoolingLibraries(libraries)

    expect(result).toEqual({
      req1: { ...newLibrary(), ont_request_id: 'req1', tag_id: 'tag1', ...libraries[1] },
    })
  })

  it('overrides default attributes with provided library data', () => {
    const libraries = {
      1: { request: 'req1', tag: 'tag1', volume: 10, concentration: 20 },
    }

    const result = populatePoolingLibraries(libraries)

    expect(result).toEqual({
      req1: { ...newLibrary(), ont_request_id: 'req1', tag_id: 'tag1', ...libraries[1] },
    })
  })
})

describe('populateById', () => {
  it('with resources', () => {
    const state = { resources: {} }
    const wells = pacbioRunFactory.storeData.resources.wells
    populateById('wells')(state, wells)
    expect(state.resources.wells).toEqual(dataToObjectById({ data: wells }))
  })

  it('without resources', () => {
    const state = {}
    const wells = pacbioRunFactory.storeData.resources.wells
    populateById('wells', { populateResources: false })(state, wells)
    expect(state.wells).toEqual(dataToObjectById({ data: wells }))
  })

  it('with relationships', () => {
    const state = { resources: {} }
    const wells = pacbioRunFactory.storeData.resources.wells
    populateById('wells', { includeRelationships: true })(state, wells)
    expect(state.resources.wells).toEqual(
      dataToObjectById({ data: wells, includeRelationships: true }),
    )
  })
})
