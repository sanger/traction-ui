import defaultState from '@/store/traction/pacbio/poolCreate/state'
import { validate, valid, payload } from '@/store/traction/pacbio/poolCreate/libraries'

const library1 = {
  pacbio_request_id: '1',
  tag_id: '1',
  template_prep_kit_box_barcode: 'ABC1',
  volume: 1,
  concentration: 1,
  fragment_size: 100,
}

const library2 = {
  pacbio_request_id: '2',
  tag_id: '2',
  template_prep_kit_box_barcode: 'ABC1',
  volume: 1,
  concentration: 1,
  fragment_size: 100,
}

const library3 = {
  pacbio_request_id: '3',
  tag_id: '3',
  template_prep_kit_box_barcode: 'ABC1',
  volume: 1,
  concentration: 1,
  fragment_size: 100,
}

describe('libraries.js', () => {
  describe('validate', () => {
    it('when the tag id is not present', () => {
      const libraries = { _1: library1, _2: library2, _3: { ...library3, tag_id: '' } }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(state.libraries['_3'].errors).toEqual({ tag_id: 'must be present' })
    })

    it('when the template prep kit box barcode is not present', () => {
      const libraries = {
        _1: library1,
        _2: library2,
        _3: { ...library3, template_prep_kit_box_barcode: '' },
      }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(state.libraries['_3'].errors).toEqual({
        template_prep_kit_box_barcode: 'must be present',
      })
    })

    it('when the volume is not present', () => {
      const libraries = { _1: library1, _2: library2, _3: { ...library3, volume: '' } }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(state.libraries['_3'].errors).toEqual({ volume: 'must be present' })
    })

    it('when the concentration is not present', () => {
      const libraries = { _1: library1, _2: library2, _3: { ...library3, concentration: '' } }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(state.libraries['_3'].errors).toEqual({ concentration: 'must be present' })
    })

    it('when the fragment size is not present', () => {
      const libraries = { _1: library1, _2: library2, _3: { ...library3, fragment_size: '' } }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(state.libraries['_3'].errors).toEqual({ fragment_size: 'must be present' })
    })

    it('when multiple fields are not valid', () => {
      const libraries = {
        _1: library1,
        _2: library2,
        _3: { ...library3, fragment_size: '', concentration: '', volume: '' },
      }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(state.libraries['_3'].errors).toEqual({
        fragment_size: 'must be present',
        concentration: 'must be present',
        volume: 'must be present',
      })
    })

    it('when multiple records are not valid', () => {
      const libraries = {
        _1: library1,
        _2: { ...library2, concentration: '' },
        _3: { ...library3, fragment_size: '' },
      }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(state.libraries['_3'].errors).toEqual({ fragment_size: 'must be present' })
      expect(state.libraries['_2'].errors).toEqual({ concentration: 'must be present' })
    })

    it('tag clashes', () => {
      const libraries = { _1: library1, _2: library2, _3: { ...library3, tag_id: library1.tag_id } }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(state.libraries['_1'].errors).toEqual({ tag_id: 'duplicated' })
      expect(state.libraries['_3'].errors).toEqual({ tag_id: 'duplicated' })
    })

    it('when all of the libraries are valid', () => {
      const libraries = { _1: library1, _2: library2, _3: library3 }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(
        Object.values(state.libraries).every((library) => Object.keys(library.errors).length === 0),
      ).toBeTruthy()
    })
  })

  describe('valid', () => {
    it('no errors', () => {
      const libraries = { _1: library1, _2: library2, _3: library3 }
      expect(valid({ libraries })).toBeTruthy()
    })

    it('with errors', () => {
      const libraries = {
        _1: library1,
        _2: library2,
        _3: { ...library3, errors: { a: 'error', b: 'error' } },
      }
      expect(valid({ libraries })).toBeFalsy()
    })
  })

  it('payload', () => {
    const libraries = { _1: library1, _2: library2, _3: library3 }
    expect(payload({ libraries })).toEqual({
      data: { attributes: { library_attributes: [library1, library2, library3] } },
    })
  })
})
