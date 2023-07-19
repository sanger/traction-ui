import {
  newRun,
  defaultWellAttributes,
  newWell,
  RunTypeEnum,
  createRunType,
  newPlate,
  createPayload,
  createWellsPayload,
} from '@/store/traction/pacbio/runCreate/run'
import { it } from 'vitest'

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

const plates = {
  new: {
    1: { ...newPlate(1), sequencing_kit_box_barcode: '123' },
    2: { ...newPlate(2), sequencing_kit_box_barcode: '456' },
  },
  existing: {
    1: { ...newPlate(1), id: 1, sequencing_kit_box_barcode: '123' },
    2: { ...newPlate(2), id: 2, sequencing_kit_box_barcode: '456' },
  },
}

const wells = {
  new: {
    1: { A1: newWell({ position: 'A1' }) },
    2: { A1: newWell({ position: 'A1' }) },
    _destroy: [],
  },
  existing: {
    1: { A1: { ...newWell({ position: 'A1' }), id: 1, pools: [1, 2] } },
    2: { A1: { ...newWell({ position: 'A1' }), id: 2 }, _destroy: [{ id: 3, _destroy: true }] },
  },
}

describe('run.js', () => {
  describe('newRun', () => {
    it('should have the correct attributes', () => {
      const run = newRun()
      expect(run.id).toEqual('new')
      expect(run.system_name).toBeTypeOf('string')
      // no longer an accepted parameter
      expect(run.sequencing_kit_box_barcode).not.toBeDefined()
      expect(run.dna_control_complex_box_barcode).toEqual(null)
      expect(run.comments).toEqual(null)
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

        expect(
          runType.payload({
            run: aRun,
            plates: plates.new,
            wells: wells.new,
            smrtLinkVersion: smrtLinkVersions['1'],
          }),
        ).toEqual(
          createPayload({
            run: attributes,
            plates: plates.new,
            wells: wells.new,
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
          plates: plates.new,
          wells: wells.new,
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

        expect(
          runType.payload({
            run: aRun,
            plates: plates.existing,
            wells: wells.existing,
            smrtLinkVersion: smrtLinkVersions['1'],
          }),
        ).toEqual(
          createPayload({
            id,
            plates: plates.existing,
            wells: wells.existing,
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
          plates: plates.existing,
          wells: wells.existing,
          smrtLinkVersion: smrtLinkVersions['1'],
        })
        const request = { create: vi.fn(), update: vi.fn() }
        runType.promise({ payload, request })
        expect(request.update).toBeCalledWith(payload)
      })
    })
  })

  describe('createPayload', () => {
    it('will create a new run payload', () => {
      const run = { system_name: 'Revio' }

      const payload = createPayload({
        run,
        plates: plates.new,
        wells: wells.new,
        smrtLinkVersion: smrtLinkVersions['1'],
      })

      expect(payload).toEqual({
        data: {
          type: 'runs',
          attributes: {
            system_name: 'Revio',
            pacbio_smrt_link_version_id: smrtLinkVersions['1'].id,
            plates_attributes: [
              {
                ...plates.new[1],
                wells_attributes: createWellsPayload(wells.new[1]),
              },
              {
                ...plates.new[2],
                wells_attributes: createWellsPayload(wells.new[2]),
              },
            ],
          },
        },
      })
    })

    it('will create an existing run payload', () => {
      const aRun = { system_name: 'Revio', id: 1 }
      const { id, ...attributes } = aRun
      const payload = createPayload({
        id,
        run: attributes,
        plates: plates.existing,
        wells: wells.existing,
        smrtLinkVersion: smrtLinkVersions['1'],
      })
      expect(payload).toEqual({
        data: {
          type: 'runs',
          id: 1,
          attributes: {
            system_name: 'Revio',
            pacbio_smrt_link_version_id: smrtLinkVersions['1'].id,
            plates_attributes: [
              {
                ...plates.existing[1],
                wells_attributes: createWellsPayload(wells.existing[1]),
              },
              {
                ...plates.existing[2],
                wells_attributes: createWellsPayload(wells.existing[2]),
              },
            ],
          },
        },
      })
    })
  })
})
