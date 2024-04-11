import {
  newRun,
  defaultWellAttributes,
  newWell,
  RunTypeEnum,
  createRunType,
  newPlate,
  createPayload,
  createWellsPayload,
  hasPlateAttributes,
} from '@/stores/utilities/run'
import { it } from 'vitest'
import { PacbioInstrumentTypes } from '@/lib/PacbioInstrumentTypes'

const smrtLinkVersions = {
  1: {
    id: 1,
    name: 'v11',
    default: false,
    active: true,
  },
  2: {
    id: 2,
    name: 'v12_revio',
    default: false,
    active: true,
  },
  3: {
    id: 3,
    name: 'v12_sequel_iie',
    default: false,
    active: true,
  },
  4: {
    id: 4,
    name: 'v13_revio',
    default: true,
    active: true,
  },
  5: {
    id: 5,
    name: 'v13_sequel_iie',
    default: false,
    active: true,
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
  single: {
    1: { ...newPlate(1), sequencing_kit_box_barcode: '123' },
    2: { ...newPlate(2) },
  },
}

const wells = {
  new: {
    1: { A1: newWell({ position: 'A1' }), _destroy: [] },
    2: { A1: newWell({ position: 'A1' }), _destroy: [] },
  },
  existing: {
    1: {
      A1: { ...newWell({ position: 'A1' }), id: 1, pools: [1, 2], libraries: [] },
      _destroy: [],
    },
    2: { A1: { ...newWell({ position: 'A1' }), id: 2 }, _destroy: [{ id: 3, _destroy: true }] },
  },
  single: {
    1: { A1: newWell({ position: 'A1' }), _destroy: [] },
    2: { _destroy: [] },
  },
}

describe('run.js', () => {
  describe('newRun', () => {
    it('should have the correct attributes', () => {
      const run = newRun()
      expect(run.id).toEqual('new')
      expect(run.system_name).toEqual('Revio')
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
        libraries: [],
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
        libraries: [],
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
            instrumentType: PacbioInstrumentTypes.Revio,
          }),
        ).toEqual(
          createPayload({
            run: attributes,
            plates: plates.new,
            wells: wells.new,
            smrtLinkVersion: smrtLinkVersions['1'],
            instrumentType: PacbioInstrumentTypes.Revio,
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
          instrumentType: PacbioInstrumentTypes.Revio,
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
        const { id, ...attributes } = aRun

        expect(
          runType.payload({
            run: aRun,
            plates: plates.existing,
            wells: wells.existing,
            smrtLinkVersion: smrtLinkVersions['1'],
            instrumentType: PacbioInstrumentTypes.Revio,
          }),
        ).toEqual(
          createPayload({
            id,
            plates: plates.existing,
            wells: wells.existing,
            run: attributes,
            smrtLinkVersion: smrtLinkVersions['1'],
            instrumentType: PacbioInstrumentTypes.Revio,
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
          instrumentType: PacbioInstrumentTypes.Revio,
        })
        const request = { create: vi.fn(), update: vi.fn() }
        runType.promise({ payload, request })
        expect(request.update).toBeCalledWith(payload)
      })
    })
  })

  describe('hasPlateAttributes', () => {
    it('when the plate is empty', () => {
      expect(hasPlateAttributes({ ...newPlate(1), wells_attributes: [] })).toBeFalsy()
    })
    it('when the plate is not empty', () => {
      expect(
        hasPlateAttributes({
          ...newPlate(1),
          sequencing_kit_box_barcode: '123',
          wells_attributes: [],
        }),
      ).toBeTruthy()
    })
    it('when the wells_attributes are not empty', () => {
      expect(
        hasPlateAttributes({ ...newPlate(1), wells_attributes: [newWell({ position: 'A1' })] }),
      ).toBeTruthy()
    }),
      it('when the plates and wells_attributes are not empty', () => {
        expect(
          hasPlateAttributes({
            ...newPlate(1),
            sequencing_kit_box_barcode: '123',
            wells_attributes: [newWell({ position: 'A1' })],
          }),
        ).toBeTruthy()
      })
  })

  describe('createPayload', () => {
    it('will create a new run payload', () => {
      const run = { system_name: 'Sequel IIe', dna_control_complex_box_barcode: 'to keep' }

      const payload = createPayload({
        run,
        plates: plates.new,
        wells: wells.new,
        smrtLinkVersion: smrtLinkVersions['1'],
        instrumentType: PacbioInstrumentTypes.SequelIIe,
      })

      expect(payload).toEqual({
        data: {
          type: 'runs',
          attributes: {
            pacbio_smrt_link_version_id: smrtLinkVersions['1'].id,
            system_name: PacbioInstrumentTypes.SequelIIe.name,
            dna_control_complex_box_barcode: 'to keep',
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
      const aRun = { system_name: 'Revio', id: 1, dna_control_complex_box_barcode: null }
      const { id, ...attributes } = aRun
      const payload = createPayload({
        id,
        run: attributes,
        plates: plates.existing,
        wells: wells.existing,
        smrtLinkVersion: smrtLinkVersions['1'],
        instrumentType: PacbioInstrumentTypes.Revio,
      })
      expect(payload).toEqual({
        data: {
          type: 'runs',
          id: 1,
          attributes: {
            pacbio_smrt_link_version_id: smrtLinkVersions['1'].id,
            system_name: PacbioInstrumentTypes.Revio.name,
            dna_control_complex_box_barcode: null,
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

    it('will create the correct payload when there are 2 plates but 1 is empty', () => {
      const run = { system_name: 'Revio', dna_control_complex_box_barcode: null }

      const payload = createPayload({
        run,
        plates: plates.single,
        wells: wells.single,
        smrtLinkVersion: smrtLinkVersions['1'],
        instrumentType: PacbioInstrumentTypes.Revio,
      })

      expect(payload).toEqual({
        data: {
          type: 'runs',
          attributes: {
            pacbio_smrt_link_version_id: smrtLinkVersions['1'].id,
            system_name: PacbioInstrumentTypes.Revio.name,
            dna_control_complex_box_barcode: null,
            plates_attributes: [
              {
                ...plates.single[1],
                wells_attributes: createWellsPayload(wells.single[1]),
              },
            ],
          },
        },
      })
    })

    it('will sort wells by position', () => {
      const B1 = newWell({ position: 'B1' })
      const C1 = newWell({ position: 'C1' })
      const A1 = newWell({ position: 'A1' })
      const inputWells = { B1: B1, C1: C1, A1: A1 }

      // pools attribute is replaced with pool_ids in the payload
      // eslint-disable-next-line no-unused-vars
      const expected = [A1, B1, C1].map(({ pools, libraries, ...rest }) => ({
        ...rest,
        pool_ids: [],
        library_ids: [],
      }))

      const payload = createWellsPayload(inputWells)

      expect(payload).toEqual(expected)
    })

    it('will create the correct payload when SMRT Link Version is v12 Sequel IIe', () => {
      const run = { system_name: 'Sequel IIe', dna_control_complex_box_barcode: 'to keep' }

      const payload = createPayload({
        run,
        plates: plates.new,
        wells: wells.new,
        smrtLinkVersion: smrtLinkVersions['3'],
        instrumentType: PacbioInstrumentTypes.SequelIIe,
      })

      expect(payload).toEqual({
        data: {
          type: 'runs',
          attributes: {
            pacbio_smrt_link_version_id: smrtLinkVersions['3'].id,
            dna_control_complex_box_barcode: 'to keep',
            system_name: PacbioInstrumentTypes.SequelIIe.name,
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

    it('will create the correct payload when SMRT Link Version is v12 Revio', () => {
      const run = { system_name: 'Revio', dna_control_complex_box_barcode: null }

      const payload = createPayload({
        run,
        plates: plates.new,
        wells: wells.new,
        smrtLinkVersion: smrtLinkVersions['2'],
        instrumentType: PacbioInstrumentTypes.Revio,
      })

      expect(payload).toEqual({
        data: {
          type: 'runs',
          attributes: {
            pacbio_smrt_link_version_id: smrtLinkVersions['2'].id,
            dna_control_complex_box_barcode: null,
            system_name: PacbioInstrumentTypes.Revio.name,
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
  })
})
