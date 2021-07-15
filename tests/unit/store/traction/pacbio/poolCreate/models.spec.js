import { newLibrary } from '@/store/traction/pacbio/poolCreate/models'

const libraryAttributes = {
  pacbio_request_id: '1',
  tag_id: '1',
  template_prep_kit_box_barcode: 'ABC1',
  volume: 1,
  concentration: 1,
  fragment_size: 100,
}

describe('Pacbio Models - newLibrary', () => {
  describe('validation', () => {
    it('when the pacbio_request_id is not present', () => {
      const library = newLibrary({ ...libraryAttributes, pacbio_request_id: '' })
      library.validate()
      expect(library.valid()).toBeFalsy()
      expect(library.errors).toEqual({ pacbio_request_id: 'must be present' })
    })

    it('when the tag id is not present', () => {
      const library = newLibrary({ ...libraryAttributes, tag_id: '' })
      library.validate()
      expect(library.valid()).toBeFalsy()
      expect(library.errors).toEqual({ tag_id: 'must be present' })
    })

    it('when the template prep kit box barcode is not present', () => {
      const library = newLibrary({ ...libraryAttributes, template_prep_kit_box_barcode: '' })
      library.validate()
      expect(library.valid()).toBeFalsy()
      expect(library.errors).toEqual({ template_prep_kit_box_barcode: 'must be present' })
    })

    it('when the volume is not present', () => {
      const library = newLibrary({ ...libraryAttributes, volume: '' })
      library.validate()
      expect(library.valid()).toBeFalsy()
      expect(library.errors).toEqual({ volume: 'must be present' })
    })

    it('when the concentration is not present', () => {
      const library = newLibrary({ ...libraryAttributes, concentration: '' })
      library.validate()
      expect(library.valid()).toBeFalsy()
      expect(library.errors).toEqual({ concentration: 'must be present' })
    })

    it('when the fragment size is not present', () => {
      const library = newLibrary({ ...libraryAttributes, fragment_size: '' })
      library.validate()
      expect(library.valid()).toBeFalsy()
      expect(library.errors).toEqual({ fragment_size: 'must be present' })
    })

    it('when multiple fields are not valid', () => {
      const library = newLibrary({
        ...libraryAttributes,
        tag_id: '',
        fragment_size: '',
        concentration: '',
      })
      library.validate()
      expect(library.valid()).toBeFalsy()
      expect(library.errors).toEqual({
        tag_id: 'must be present',
        fragment_size: 'must be present',
        concentration: 'must be present',
      })
    })

    it('when the library is valid', () => {
      const library = newLibrary({ ...libraryAttributes })
      library.validate()
      expect(library.valid()).toBeTruthy()
    })

    it('should only be valid if it has been validated', () => {
      const library = newLibrary({ ...libraryAttributes })
      expect(library.valid()).toBeFalsy()
    })

    it('revalidating should remove any errors', () => {
      const library = newLibrary({ ...libraryAttributes, pacbio_request_id: '' })
      library.validate()
      expect(library.valid()).toBeFalsy()
      library.pacbio_request_id = '1'
      library.validate()
      expect(library.valid()).toBeTruthy()
    })
  })
})
