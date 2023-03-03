import defaultState from '@/store/traction/pacbio/poolCreate/state'
import {
  newRun,
  validate,
  valid,
  defaultWellAttributes,
  newWell,
  createPayload,
} from '@/store/traction/pacbio/runCreate/run'

const existingRun = {
  id: 1,
  sequencing_kit_box_barcode: 'sleaford',
  dna_control_complex_box_barcode: 'mods',
  comments: 'blah, blah, blah',
  smrt_link_version_id: 1,
}

const wells = {
  1: { ...newWell() },
  2: { ...newWell(), pools: [1, 2] },
}

describe('run.js', () => {
  describe('newRun', () => {
    it('should have the correct attributes', () => {
      const run = newRun()
      expect(run.id).toEqual('new')
      expect(run.system_name).toBeTypeOf('string')
    })
  })

  describe('newWell', () => {
    it('will have the default well attributes if nothing is changed', () => {
      expect(newWell()).toEqual(defaultWellAttributes())
    })

    it('will have the correct attributes if any are passed', () => {
      const attributes = {
        movie_time: 15.0,
        binding_kit_box_barcode: 'boxboxbox',
        on_plate_loading_concentration: 3.5,
      }
      expect(newWell(attributes)).toEqual({ ...defaultWellAttributes(), ...attributes })
    })
  })

  describe('validate', () => {
    it('when there is no sequencing kit barcode', () => {
      const state = defaultState()
      state.run = { ...existingRun, sequencing_kit_box_barcode: '' }
      validate(state)
      expect(state.run.errors).toEqual({ sequencing_kit_box_barcode: 'must be present' })
    })

    it('when there is no dna control complex barcode', () => {
      const state = defaultState()
      state.run = { ...existingRun, dna_control_complex_box_barcode: '' }
      validate(state)
      expect(state.run.errors).toEqual({ dna_control_complex_box_barcode: 'must be present' })
    })
  })

  describe('valid', () => {
    it('when there are no errors', () => {
      expect(valid({ run: existingRun })).toBeTruthy()
    })

    it('when there are errors', () => {
      expect(valid({ run: { ...existingRun, errors: { a: 1, b: 2 } } })).toBeFalsy()
    })
  })

  describe('createPayload', () => {
    const wellValues = Object.values(wells)

    it('for a new run', () => {
      const aRun = newRun()
      // eslint-disable-next-line no-unused-vars
      const { id, ...attributes } = aRun
      const payload = createPayload({ run: attributes, wells: wellValues })
      expect(payload).toEqual({
        data: {
          type: 'runs',
          attributes: {
            wells_attributes: wellValues,
            ...attributes,
          },
        },
      })
    })

    it('for an existing run', () => {
      const aRun = newRun()
      const { id, ...attributes } = aRun
      const wellValues = Object.values(wells)
      const payload = createPayload({ id, run: attributes, wells: wellValues })
      expect(payload).toEqual({
        data: {
          type: 'runs',
          id,
          attributes: {
            wells_attributes: wellValues,
            ...attributes,
          },
        },
      })
    })
  })
})
