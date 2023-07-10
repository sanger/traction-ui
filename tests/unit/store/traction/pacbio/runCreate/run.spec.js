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
  createPayload,
} from '@/store/traction/pacbio/runCreate/run'
import { it } from 'vitest'

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
  _destroy: [],
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
      expect(run.plates[plateNumber].wells).toEqual({ _destroy: [] })
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
      const plate = {
        ...newPlate(1),
        id: 1,
        pacbio_run_id: 2,
        wells: {
          _destroy: [{ id: 1, _destroy: true }],
        },
      }

      const platePayload = createPlatePayload(plate, plateNumber)

      expect(platePayload.id).toEqual(1)
      expect(platePayload.plate_number).toEqual(1)
      expect(platePayload.wells_attributes).toEqual([{ id: 1, _destroy: true }])
    })

    it('returns null if empty plate data is provided', () => {
      const plate = {
        ...newPlate(1),
        id: undefined,
        pacbio_run_id: 3,
        wells: {},
      }

      const platePayload = createPlatePayload(plate, plateNumber)

      expect(platePayload).toBe(null)
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

  describe.skip('createPayload', () => {
    it('will create a new run payload', () => {
      const run = { smrt_link_version_id: 1 }
      const plates = {
        1: {
          plate_number: 1,
          sequencing_kit_box_barcode: '123',
        },
        2: {
          plate_number: 2,
          sequencing_kit_box_barcode: '456',
        },
      }
      const wells = {
        1: {
          A1: newWell({ position: 'A1' }),
        },
        2: {
          A1: newWell({ position: 'A1' }),
        },
      }

      const payload = createPayload({
        run,
        plates,
        wells,
        smrtLinkVersion: smrtLinkVersions['1'],
      })
      expect(payload).toEqual({
        data: {
          type: 'runs',
          attributes: {
            pacbio_smrt_link_version_id: smrtLinkVersions['1'].id,
            plates_attributes: [
              {
                plate_number: 1,
                sequencing_kit_box_barcode: '123',
                wells_attributes: [wells[1].A1],
              },
              {
                plate_number: 2,
                sequencing_kit_box_barcode: '456',
                wells_attributes: [wells[2].A1],
              },
            ],
          },
        },
      })
    })

    it('will create an existing run payload', () => {
      const aRun = { smrt_link_version_id: 1, id: 1 }
      const { id, ...attributes } = aRun
      const plates = {
        1: {
          id: 1,
          plate_number: 1,
          sequencing_kit_box_barcode: '123',
        },
        2: {
          id: 2,
          plate_number: 2,
          sequencing_kit_box_barcode: '456',
        },
      }
      const wells = {
        1: {
          A1: { ...newWell({ position: 'A1' }), id: 1 },
        },
        2: {
          A1: { ...newWell({ position: 'A1' }), id: 2, pools: [1, 2] },
          _destroy: [{ id: 3, _destroy: true }],
        },
      }
      const payload = createPayload({
        id,
        run: attributes,
        plates,
        wells,
        smrtLinkVersion: smrtLinkVersions['1'],
      })
      expect(payload).toEqual({
        data: {
          type: 'runs',
          id: 1,
          attributes: {
            pacbio_smrt_link_version_id: smrtLinkVersions['1'].id,
            plates_attributes: [
              {
                id: 1,
                plate_number: 1,
                sequencing_kit_box_barcode: '123',
                wells_attributes: [wells[1].A1],
              },
              {
                id: 2,
                plate_number: 2,
                sequencing_kit_box_barcode: '456',
                wells_attributes: [{ ...newWell({ position: 'A1' }), id: 2, pool_ids: [1, 2] }],
              },
            ],
          },
        },
      })
    })
  })
})
