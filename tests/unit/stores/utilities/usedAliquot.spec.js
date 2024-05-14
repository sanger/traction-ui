import { createUsedAliquot } from '@/stores/utilities/usedAliquot.js'
import { it } from 'vitest'

describe('usedAliquot', () => {
  it('should create a usedAliquot object with default attributes when no attributes are provided', () => {
    const usedAliquot = createUsedAliquot({})
    expect(usedAliquot.source_id).toBeNull()
    expect(usedAliquot.source_type).toBeNull()
    expect(usedAliquot.template_prep_kit_box_barcode).toBeNull()
    expect(usedAliquot.tag_id).toBeNull()
    expect(usedAliquot.volume).toBeNull()
    expect(usedAliquot.concentration).toBeNull()
    expect(usedAliquot.insert_size).toBeNull()
    expect(usedAliquot.available_volume).toBeNull()
    expect(usedAliquot.used_volume).toBeNull()
    expect(usedAliquot.errors).toEqual({})
  })
  it('should create a usedAliquot object with provided attributes', () => {
    const attributes = {
      source_id: 'source1',
      template_prep_kit_box_barcode: 'barcode1',
      tag: 'tag1',
      volume: 10,
      concentration: 20,
      insert_size: 30,
      available_volume: 40,
      used_volume: 50,
    }
    const usedAliquot = createUsedAliquot(attributes)
    expect(usedAliquot.source_id).toBe('source1')
    expect(usedAliquot.template_prep_kit_box_barcode).toBe('barcode1')
    expect(usedAliquot.tag_id).toBe('tag1')
    expect(usedAliquot.volume).toBe(10)
    expect(usedAliquot.concentration).toBe(20)
    expect(usedAliquot.insert_size).toBe(30)
    expect(usedAliquot.available_volume).toBe(40)
    expect(usedAliquot.used_volume).toBe(50)
  })
  it('returns true when usedAliquot is valid and no missing fields', () => {
    const usedAliquot = createUsedAliquot({
      tag_id: 'tag1',
      volume: 10,
      concentration: 5,
      insert_size: 1000,
      template_prep_kit_box_barcode: 'barcode1',
      source_id: '1',
      source_type: 'Pacbio:Request',
    })
    expect(usedAliquot.validate(true)).toBe(true)
  })
  it('returns false when a usedAliquot is missing a required attribute', () => {
    const usedAliquot = createUsedAliquot({
      tag_id: 'tag1',
      volume: 10,
      concentration: 5,
      template_prep_kit_box_barcode: 'barcode1',
    })
    expect(usedAliquot.validate(true)).toBe(false)
    expect(usedAliquot.errors).toEqual({
      insert_size: 'must be present',
      source_id: 'must be present',
      source_type: 'must be present',
    })
  })
  it('returns false when a library volume is less than available volume', () => {
    const usedAliquot = createUsedAliquot({
      tag_id: 'tag1',
      volume: 10,
      concentration: 5,
      insert_size: 1000,
      template_prep_kit_box_barcode: 'barcode1',
      source_id: '1',
      source_type: 'Pacbio:Request',
      available_volume: 5,
    })
    expect(usedAliquot.validate(true)).toBe(false)
    expect(usedAliquot.errors).toEqual({
      volume: 'must be less or equal to available volume',
    })
  })
  it('should return an object with the specified attributes of the aliquot', () => {
    const usedAliquot = createUsedAliquot({
      source_id: '1',
      volume: 10,
      concentration: 5,
    })
    const aliquotAttributes = usedAliquot.attributes(['source_id', 'volume'])
    expect(aliquotAttributes).toEqual({ source_id: '1', volume: 10 })
  })

  it('should return an object with the payload attributes of the aliquot', () => {
    const usedAliquot = createUsedAliquot({
      source_id: '1',
      source_type: 'Pacbio:Request',
      volume: 10,
      concentration: 5,
      insert_size: 1000,
      template_prep_kit_box_barcode: 'barcode1',
      tag_id: 'tag1',
    })
    const payloadAttributes = usedAliquot.payloadAttributes()
    expect(payloadAttributes).toEqual({
      id: undefined,
      source_id: '1',
      source_type: 'Pacbio:Request',
      volume: 10,
      concentration: 5,
      insert_size: 1000,
      template_prep_kit_box_barcode: 'barcode1',
      tag_id: 'tag1',
    })
  })
  //Write test case for isValidUsedAliquot
  it('should return false when usedAliquot is not valid', () => {
    const usedAliquot = createUsedAliquot({
      tag_id: 'tag1',
      volume: 10,
      concentration: 5,
      template_prep_kit_box_barcode: 'barcode1',
    })
    expect(usedAliquot.isValidObject()).toBe(false)
  })
  it('should return true when validObject called with default field on usedAliquot that contains request ', () => {
    const usedAliquot = createUsedAliquot({
      tag_id: 'tag1',
      volume: 10,
      concentration: 5,
      template_prep_kit_box_barcode: 'barcode1',
      request: '1',
    })
    expect(usedAliquot.isValidObject()).toBe(true)
  })

  it('should return true when usedAliquot contains all fields', () => {
    const usedAliquot = createUsedAliquot({
      tag_id: 'tag1',
      volume: 10,
      concentration: 5,
      insert_size: 1000,
      template_prep_kit_box_barcode: 'barcode1',
      source_id: '1',
      request: '1',
    })
    expect(usedAliquot.isValidObject(['request', 'tag_id'])).toBe(true)
  })
  it('should return false when usedAliquot doesnt contain all fields', () => {
    const usedAliquot = createUsedAliquot({
      volume: 10,
      concentration: 5,
      insert_size: 1000,
      template_prep_kit_box_barcode: 'barcode1',
      source_id: '1',
    })
    expect(usedAliquot.isValidObject(['request', 'tag_id'])).toBe(false)
  })
})
