import defaultState from '@/store/traction/pacbio/poolCreate/state'
import { validate, valid, payload } from '@/store/traction/pacbio/poolCreate/pool'
import { checkFeatureFlag } from '@/api/FeatureFlag'

vi.mock('@/api/FeatureFlag', () => ({
  checkFeatureFlag: vi.fn().mockReturnValue(false),
}))

const library1 = () => ({
  pacbio_request_id: '1',
  tag_id: '1',
  template_prep_kit_box_barcode: 'ABC1',
  volume: 1,
  concentration: 1,
  insert_size: 100,
})

const library2 = () => ({
  pacbio_request_id: '2',
  tag_id: '2',
  template_prep_kit_box_barcode: 'ABC1',
  volume: 1,
  concentration: 1,
  insert_size: 100,
})

const library3 = () => ({
  pacbio_request_id: '3',
  tag_id: '3',
  template_prep_kit_box_barcode: 'ABC1',
  volume: 1,
  concentration: 1,
  insert_size: 100,
})

describe('libraries.js', () => {
  describe('validate', () => {
    it('when the tag id is not present and there is one library', () => {
      const libraries = { _1: { ...library1(), tag_id: '' } }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(state.libraries['_1'].errors).toEqual({})
    })

    it('when the tag id is not present and there are multiple libraries', () => {
      const libraries = { _1: library1(), _2: library2(), _3: { ...library3(), tag_id: '' } }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(state.libraries['_3'].errors).toEqual({ tag_id: 'must be present' })
    })

    it('when the template prep kit box barcode is not present', () => {
      const libraries = {
        _1: library1(),
        _2: library2(),
        _3: { ...library3(), template_prep_kit_box_barcode: '' },
      }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(valid({ libraries: state.libraries })).toBeTruthy()
    })

    it('when the volume is not present', () => {
      const libraries = { _1: library1(), _2: library2(), _3: { ...library3(), volume: '' } }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(state.libraries['_3'].errors).toEqual({ volume: 'must be present' })
    })

    it('when the concentration is not present', () => {
      const libraries = { _1: library1(), _2: library2(), _3: { ...library3(), concentration: '' } }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(state.libraries['_3'].errors).toEqual({ concentration: 'must be present' })
    })

    it('when the insert size is not present', () => {
      const libraries = { _1: library1(), _2: library2(), _3: { ...library3(), insert_size: '' } }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(state.libraries['_3'].errors).toEqual({ insert_size: 'must be present' })
    })

    it('when multiple fields are not valid', () => {
      const libraries = {
        _1: library1(),
        _2: library2(),
        _3: { ...library3(), insert_size: '', concentration: '', volume: '' },
      }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(state.libraries['_3'].errors).toEqual({
        insert_size: 'must be present',
        concentration: 'must be present',
        volume: 'must be present',
      })
    })

    it('when multiple records are not valid', () => {
      const libraries = {
        _1: library1(),
        _2: { ...library2(), concentration: '' },
        _3: { ...library3(), insert_size: '' },
      }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(state.libraries['_3'].errors).toEqual({ insert_size: 'must be present' })
      expect(state.libraries['_2'].errors).toEqual({ concentration: 'must be present' })
    })

    it('tag clashes', () => {
      const libraries = {
        _1: library1(),
        _2: library2(),
        _3: { ...library3(), tag_id: library1().tag_id },
      }
      const state = defaultState()
      state.libraries = { ...libraries }
      validate(state)
      expect(state.libraries['_1'].errors).toEqual({ tag_id: 'duplicated' })
      expect(state.libraries['_3'].errors).toEqual({ tag_id: 'duplicated' })
    })

    it('when all of the libraries are valid', () => {
      const libraries = { _1: library1(), _2: library2(), _3: library3() }
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
      const libraries = { _1: library1(), _2: library2(), _3: library3() }
      expect(valid({ libraries })).toBeTruthy()
    })

    it('with errors', () => {
      const libraries = {
        _1: library1(),
        _2: library2(),
        _3: { ...library3(), errors: { a: 'error', b: 'error' } },
      }
      expect(valid({ libraries })).toBeFalsy()
    })
  })

  describe('payload', () => {
    it('handles unpersisted data', async () => {
      const libraries = { _1: library1(), _2: library2(), _3: library3() }
      const pool = {
        template_prep_kit_box_barcode: 'ABC1',
        volume: '10',
        concentration: '10',
        insert_size: 100,
      }

      const payload_data = await payload({ libraries, pool })
      expect(payload_data).toEqual({
        data: {
          type: 'pools',
          attributes: {
            library_attributes: [library1(), library2(), library3()],
            ...pool,
          },
        },
      })
    })

    it('handles persisted data', async () => {
      const libraries = {
        _1: { id: '10', ...library1() },
        _2: { id: '20', ...library2() },
        _3: library3(),
      }
      const pool = {
        template_prep_kit_box_barcode: 'ABC1',
        volume: '10',
        concentration: '10',
        insert_size: 100,
        source_identifier: 'Should not post back',
      }

      const payload_data = await payload({ libraries, pool: { id: '1', ...pool } })
      expect(payload_data).toEqual({
        data: {
          type: 'pools',
          id: '1',
          attributes: {
            library_attributes: [libraries['_1'], libraries['_2'], library3()],
            template_prep_kit_box_barcode: 'ABC1',
            volume: '10',
            concentration: '10',
            insert_size: 100,
          },
        },
      })
    })

    it('includes primary aliquot attributes if feature flag is enabled', async () => {
      checkFeatureFlag.mockReturnValue(true)

      const libraries = {
        _1: { id: '10', ...library1() },
        _2: { id: '20', ...library2() },
        _3: library3(),
      }
      const pool = {
        template_prep_kit_box_barcode: 'ABC1',
        volume: '10',
        concentration: '10',
        insert_size: 100,
        source_identifier: 'Should not post back',
      }

      const payload_data = await payload({ libraries, pool: { id: '1', ...pool } })
      expect(payload_data).toEqual({
        data: {
          type: 'pools',
          id: '1',
          attributes: {
            library_attributes: [libraries['_1'], libraries['_2'], library3()],
            primary_aliquot_attributes: {
              template_prep_kit_box_barcode: 'ABC1',
              volume: '10',
              concentration: '10',
              insert_size: 100,
            },
            template_prep_kit_box_barcode: 'ABC1',
            volume: '10',
            concentration: '10',
            insert_size: 100,
          },
        },
      })
    })
  })
})
