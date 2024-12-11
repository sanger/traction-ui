import { store } from '@support/testHelper.js'
import { expect, vi } from 'vitest'
import {
  fetchLabwareFromSequencescape,
  findIncluded,
  buildLibrary,
  buildPool,
} from '@/lib/receptions/sequencescapeUtils.js'
import SequencescapeLabwareFactory from '@tests/factories/SequencescapeLabwareFactory.js'

const retAttributes = {
  plates_attributes: [
    {
      barcode: 'DN9000002A',
      wells_attributes: [
        {
          position: 'A1',
          request: {
            external_study_id: '5b173660-94c9-11ec-8c89-acde48001122',
            library_type: 'Example',
            cost_code: 'aCostCodeExample',
          },
          sample: {
            external_id: 'd5008026-94c9-11ec-a9e3-acde48001122',
            name: '2STDY1',
            species: 'Dragon',
          },
        },
        {
          position: 'B1',
          request: {
            external_study_id: '5b173660-94c9-11ec-8c89-acde48001122',
            library_type: 'Example',
            cost_code: 'aCostCodeExample',
          },
          sample: {
            external_id: 'd50bad48-94c9-11ec-a9e3-acde48001122',
            name: '2STDY2',
            species: 'Unicorn',
          },
        },
      ],
    },
  ],
  tubes_attributes: [
    {
      barcode: '3980000001795',
      request: {
        external_study_id: '5b173660-94c9-11ec-8c89-acde48001122',
        library_type: 'Example',
        cost_code: 'aCostCodeExample',
      },
      sample: {
        name: '2STDY97',
        external_id: '0db37dd8-94ca-11ec-a9e3-acde48001122',
        species: 'Gryphon',
      },
    },
  ],
}
describe('sequencescapeUtils', () => {
  describe('#fetchLabwareFromSequencescape', () => {
    const barcodes = ['DN9000002A', '3980000001795']
    const labwareRequestConfig = {
      include: 'receptacles.aliquots.sample.sample_metadata,receptacles.aliquots.study',
      fields: {
        aliquots: 'study,library_type,sample',
        plates: 'labware_barcode,receptacles',
        receptacles: 'aliquots',
        sample_metadata: 'sample_common_name',
        samples: 'sample_metadata,name,uuid',
        studies: 'uuid',
        tubes: 'labware_barcode,receptacles',
        wells: 'position,aliquots',
      },
    }
    const labwareTypes = {
      plates: {
        type: 'plates',
        attributes: 'plates_attributes',
        transformFunction: vi.fn().mockReturnValue({ ...retAttributes.plates_attributes[0] }),
        barcodeAttribute: 'machine_barcode',
      },
      tubes: {
        type: 'tubes',
        attributes: 'tubes_attributes',
        transformFunction: vi.fn().mockReturnValue({ ...retAttributes.tubes_attributes[0] }),
        barcodesAttribute: 'machine_barcode',
      },
    }

    const requests = store.getters.api.v2
    let request

    beforeEach(() => {
      request = vi.spyOn(requests.sequencescape.labware, 'get')
    })

    it('fetches successfully', async () => {
      request.mockResolvedValue(SequencescapeLabwareFactory().responses.fetch)
      const { attributes, foundBarcodes } = await fetchLabwareFromSequencescape({
        requests,
        barcodes,
        requestOptions: {
          library_type: 'Example',
          cost_code: 'aCostCodeExample',
        },
        labwareTypes,
        labwareRequestConfig,
      })
      expect(request).toHaveBeenCalledWith({
        filter: { barcode: barcodes.join(',') },
        ...labwareRequestConfig,
      })
      expect(foundBarcodes).toEqual(new Set(['DN9000002A', '3980000001795']))
      expect(attributes).toEqual({
        source: 'traction-ui.sequencescape',
        ...retAttributes,
      })
    })
    it('runs unsuccessfully', async () => {
      const failedResponse = {
        data: {},
        status: 500,
        json: () =>
          Promise.resolve({
            errors: [{ title: 'error1', detail: 'There was an error.', status: '500' }],
          }),
        ok: false,
        statusText: 'Internal Server Error',
      }
      request.mockResolvedValue(failedResponse)
      await expect(() => fetchLabwareFromSequencescape({ requests, barcodes })).rejects.toThrow(
        'There was an error',
      )
    })
  })

  describe('#findIncluded', () => {
    it('returns the included item', () => {
      const data = SequencescapeLabwareFactory().content
      const receptacle = data.data[0].relationships.receptacles.data[0]
      const res = findIncluded({ included: data.included, data: receptacle, type: 'wells' })
      const expected = data.included.find((item) => item.id === receptacle.id)
      expect(res).toEqual(expected)
    })
  })

  describe('#buildLibrary', () => {
    it('returns a library object', () => {
      const aliquot = {
        attributes: {
          tag_oligo: 'tagOligoExample',
          insert_size_to: 100,
        },
      }
      const sample_metadata = {
        attributes: {
          volume: 10,
          concentration: 10,
        },
      }
      const libraryOptions = {
        kit_barcode: 'kitBarcodeExample',
      }
      const res = buildLibrary({ aliquot, sample_metadata, libraryOptions })
      expect(res).toEqual({
        library: {
          volume: sample_metadata.attributes.volume,
          concentration: sample_metadata.attributes.concentration,
          tag_sequence: aliquot.attributes.tag_oligo,
          insert_size: aliquot.attributes.insert_size_to,
          kit_barcode: libraryOptions.kit_barcode,
        },
      })
    })
  })

  describe('#buildPool', () => {
    it('returns a pool object', () => {
      const included = [
        {
          id: '1',
          type: 'aliquots',
          attributes: {
            tag_oligo: 'tagOligoExample',
            insert_size_to: 100,
          },
        },
        {
          id: '2',
          type: 'sample_metadata',
          attributes: {
            volume: 10,
            concentration: 10,
          },
        },
      ]
      const barcodeAttribute = 'human_barcode'
      const labware = {
        attributes: {
          labware_barcode: {
            human_barcode: 'DN9000002A',
            machine_barcode: '123123123',
          },
        },
      }
      const libraryOptions = {
        kit_barcode: 'kitBarcodeExample',
      }
      const res = buildPool({ labware, included, barcodeAttribute, libraryOptions })
      expect(res).toEqual({
        barcode: labware.attributes.labware_barcode.human_barcode,
        volume: included[1].attributes.volume,
        concentration: included[1].attributes.concentration,
        insert_size: included[0].attributes.insert_size_to,
        kit_barcode: libraryOptions.kit_barcode,
      })
    })
  })
})
