import defaultState from '@/store/traction/pacbio/poolCreate/state'
import {
  newRun,
  validate,
  valid,
  defaultWellAttributes,
  newWell,
  createRunPayload,
  RunTypeEnum,
  createRunType,
  createPlatePayload,
  newPlate,
} from '@/store/traction/pacbio/runCreate/run'

const existingRun = {
  id: 1,
  sequencing_kit_box_barcode: 'sleaford',
  dna_control_complex_box_barcode: 'mods',
  comments: 'blah, blah, blah',
  smrt_link_version_id: 1,
}

const smrtLinkVersions = {
  1: {
    id: 1,
    name: 'v11',
    default: false,
  },
  2: {
    id: 2,
    name: 'v12_revio',
    default: false,
  },
}

const wells = {
  1: { ...newWell({ position: 'A1' }) },
  2: { ...newWell({ position: 'A2' }), pools: [1, 2] },
}

const wellValues = Object.values(wells)
const plateValues = { 1: { plate_number: '1', wells: wellValues } }

const plateNumber = 1

describe('run.js', () => {
  describe('newRun', () => {
    it('should have the correct attributes', () => {
      const run = newRun()
      expect(run.id).toEqual('new')
      expect(run.system_name).toBeTypeOf('string')
      expect(run.sequencing_kit_box_barcode).toEqual(null)
      expect(run.dna_control_complex_box_barcode).toEqual(null)
      expect(run.comments).toEqual(null)
      expect(run.plates[plateNumber].sequencing_kit_box_barcode).toEqual('')
      expect(run.plates[plateNumber].wells).toEqual({})
    })
  })

  describe('newWell', () => {
    it('will have the default well attributes if nothing is changed', () => {
      expect(newWell({ position: 'A1' })).toEqual({
        ...defaultWellAttributes(),
        position: 'A1',
        row: 'A',
        column: '1',
        pools: [],
      })
    })

    it('will have the correct attributes if any are passed', () => {
      const attributes = {
        movie_time: 15.0,
        binding_kit_box_barcode: 'boxboxbox',
        on_plate_loading_concentration: 3.5,
      }
      expect(newWell({ position: 'A1', ...attributes })).toEqual({
        ...defaultWellAttributes(),
        ...attributes,
        position: 'A1',
        row: 'A',
        column: '1',
        pools: [],
      })
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

  describe('createPlatePayload', () => {
    it('returns the plate data', () => {
      const well = { ...newWell({ position: 'A2' }), pools: [1, 2] }
      const plate = {
        ...newPlate(1),
        id: 1,
        pacbio_run_id: 2,
        wells: {
          A1: well,
        },
      }

      const platePayload = createPlatePayload(plate, plateNumber)

      expect(platePayload.id).toEqual(1)
      expect(platePayload.plate_number).toEqual(1)
      expect(platePayload.wells_attributes).toEqual([{ ...well, pool_ids: [1, 2] }])
    })

    it('returns the plate data, including wells to be destroyed', () => {
      const well = { ...newWell({ position: 'A2' }), pools: [1, 2] }
      const plate = {
        ...newPlate(1),
        id: 1,
        pacbio_run_id: 2,
        wells: {
          A1_destroy: well,
        },
      }

      const platePayload = createPlatePayload(plate, plateNumber)

      expect(platePayload.id).toEqual(1)
      expect(platePayload.plate_number).toEqual(1)
      expect(platePayload.wells_attributes).toEqual([{ ...well, pool_ids: [1, 2], _destroy: true }])
    })
  })

  describe('createRunPayload', () => {
    it('for a new run', () => {
      const aRun = newRun()
      // eslint-disable-next-line no-unused-vars
      const { id, ...attributes } = aRun
      attributes.plates = plateValues
      const payload = createRunPayload({
        run: attributes,
        smrtLinkVersion: smrtLinkVersions['1'],
      })

      const platesAttributes = Object.values(plateValues).map((plate) => {
        return createPlatePayload(plate, plate.plate_number)
      })

      expect(payload).toEqual({
        data: {
          type: 'runs',
          attributes: {
            pacbio_smrt_link_version_id: smrtLinkVersions['1'].id,
            plates_attributes: platesAttributes,
            ...attributes,
          },
        },
      })
    })

    it('for an existing run', () => {
      const aRun = newRun()
      const { id, ...attributes } = aRun
      attributes.plates = plateValues
      const payload = createRunPayload({
        id,
        run: attributes,
        smrtLinkVersion: smrtLinkVersions['1'],
      })

      const platesAttributes = Object.values(plateValues).map((plate) => {
        return createPlatePayload(plate, plate.plate_number)
      })

      expect(payload).toEqual({
        data: {
          type: 'runs',
          id,
          attributes: {
            pacbio_smrt_link_version_id: smrtLinkVersions['1'].id,
            plates_attributes: platesAttributes,
            ...attributes,
          },
        },
      })
    })
  })

  describe('runType', () => {
    describe('new', () => {
      it('will have the correct attributes', () => {
        const runType = createRunType({ id: 'new' })
        expect(runType.type).toEqual(RunTypeEnum.New)
        expect(Object.keys(runType)).toEqual([
          'type',
          'id',
          'theme',
          'action',
          'label',
          'payload',
          'promise',
        ])
      })

      it('will create the correct payload', () => {
        const runType = createRunType({ id: 'new' })
        const aRun = newRun()
        // eslint-disable-next-line no-unused-vars
        const { id, ...attributes } = aRun

        expect(runType.payload({ run: aRun, smrtLinkVersion: smrtLinkVersions['1'] })).toEqual(
          createRunPayload({
            run: attributes,
            smrtLinkVersion: smrtLinkVersions['1'],
          }),
        )
      })

      it('will create the correct promise', () => {
        const runType = createRunType({ id: 'new' })
        const aRun = newRun()
        // eslint-disable-next-line no-unused-vars
        const { id, ...attributes } = aRun
        const payload = runType.payload({
          run: attributes,
          wells,
          smrtLinkVersion: smrtLinkVersions['1'],
        })
        const request = { create: vi.fn(), update: vi.fn() }
        runType.promise({ payload, request })
        expect(request.create).toBeCalledWith({ data: payload })
      })
    })

    describe('existing', () => {
      it('will have the correct attributes', () => {
        const runType = createRunType({ id: 1 })
        expect(runType.type).toEqual(RunTypeEnum.Existing)
        expect(Object.keys(runType)).toEqual([
          'type',
          'id',
          'theme',
          'action',
          'label',
          'payload',
          'promise',
        ])
      })

      it('will create the correct payload', () => {
        const runType = createRunType({ id: 1 })
        const aRun = newRun()
        // eslint-disable-next-line no-unused-vars
        const { id, ...attributes } = aRun

        expect(runType.payload({ run: aRun, smrtLinkVersion: smrtLinkVersions['1'] })).toEqual(
          createRunPayload({
            id,
            run: attributes,
            smrtLinkVersion: smrtLinkVersions['1'],
          }),
        )
      })

      it('will create the correct promise', () => {
        const runType = createRunType({ id: 1 })
        const aRun = newRun()
        // eslint-disable-next-line no-unused-vars
        const { id, ...attributes } = aRun
        const payload = runType.payload({
          run: attributes,
          wells,
          smrtLinkVersion: smrtLinkVersions['1'],
        })
        const request = { create: vi.fn(), update: vi.fn() }
        runType.promise({ payload, request })
        expect(request.update).toBeCalledWith(payload)
      })
    })
  })
})
