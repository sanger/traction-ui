import { fetchPlatesFunction, fetchTubesFunction, fetchCompoundSampleTubesFunction } from '@/lib/receptions/MockReception'

describe('MockReception', () => {
  describe('#fetchPlatesFunction', () => {
    it('returns a reception object with mocked data', async () => {
      const barcodes = ['test-plate1', 'test-plate2']
      const { attributes, foundBarcodes } = await fetchPlatesFunction({
        barcodes,
        requestOptions: {
          library_type: 'Example',
          cost_code: 'aCostCodeExample',
        },
      })

      expect(foundBarcodes).toEqual(new Set(barcodes))
      expect(attributes.source).toBe('traction-ui.mock-reception')
      expect(attributes.plates_attributes).toHaveLength(2)
      attributes.plates_attributes.forEach((plate, index) => {
        expect(plate.type).toBe('plates')
        expect(plate.barcode).toBe(barcodes[index])
        expect(plate.wells_attributes).toHaveLength(48)
        plate.wells_attributes.forEach((well, index) => {
          expect(well.type).toBe('wells')
          expect(well.position).toBeDefined()
          expect(well.sample.name).toEqual(`${plate.barcode}-sample-${index}`)
          expect(well.sample.species).toBe('Human')
          expect(well.sample.retention_instruction).toBe('long_term_storage')
          expect(well.sample.external_id).toBeDefined()
          expect(well.request.external_study_id).toBeDefined()
          expect(well.request.library_type).toBe('Example')
          expect(well.request.cost_code).toBe('aCostCodeExample')
        })
      })
    })
  })

  describe('#fetchTubesFunction', () => {
    it('returns a reception object with mocked data', async () => {
      const barcodes = ['test-tube1', 'test-tube2']
      const { attributes, foundBarcodes } = await fetchTubesFunction({
        barcodes,
        requestOptions: {
          library_type: 'Example',
          cost_code: 'aCostCodeExample',
        },
      })

      expect(foundBarcodes).toEqual(new Set(barcodes))
      expect(attributes.source).toBe('traction-ui.mock-reception')
      expect(attributes.tubes_attributes).toHaveLength(2)
      attributes.tubes_attributes.forEach((tube, index) => {
        expect(tube.type).toBe('tubes')
        expect(tube.barcode).toBe(barcodes[index])
        expect(tube.sample.name).toEqual(`${tube.barcode}-sample-${index}`)
        expect(tube.sample.species).toBe('Human')
        expect(tube.sample.retention_instruction).toBe('long_term_storage')
        expect(tube.sample.external_id).toBeDefined()
        expect(tube.request.external_study_id).toBeDefined()
        expect(tube.request.library_type).toBe('Example')
        expect(tube.request.cost_code).toBe('aCostCodeExample')
      })
    })
  })

  describe('#fetchCompoundSampleTubesFunction', () => {
    it('returns a reception object with mocked compound sample tubes data', async () => {
      const barcodes = ['test-compound-tube1', 'test-compound-tube2']
      const { attributes, foundBarcodes } = await fetchCompoundSampleTubesFunction({
        barcodes,
        requestOptions: {
          library_type: 'Example',
          cost_code: 'aCostCodeExample',
        },
      })

      expect(foundBarcodes).toEqual(new Set(barcodes))
      expect(attributes.source).toBe('traction-ui.mock-reception')
      expect(attributes.compound_sample_tubes_attributes).toHaveLength(2)
      attributes.compound_sample_tubes_attributes.forEach((tube, tubeIndex) => {
        expect(tube.type).toBe('tubes')
        expect(tube.barcode).toBe(barcodes[tubeIndex])
        expect(tube.samples).toHaveLength(3)
        tube.samples.forEach((sampleObj, sampleIndex) => {
          expect(sampleObj.sample.name).toBe(`${tube.barcode}-sample-${sampleIndex + 1}-${tubeIndex}`)
          expect(sampleObj.sample.species).toBe('Human')
          expect(sampleObj.sample.retention_instruction).toBe('long_term_storage')
          expect(sampleObj.sample.external_id).toBeDefined()
          expect(sampleObj.request.external_study_id).toBeDefined()
          expect(sampleObj.request.library_type).toBe('Example')
          expect(sampleObj.request.cost_code).toBe('aCostCodeExample')
        })
      })
    })
  })
})
