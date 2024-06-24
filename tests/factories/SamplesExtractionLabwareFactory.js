import BaseFactory from './BaseFactory.js'

/*
 * Factory for creating a samples extraction tube with sample
 * @returns a base factory object with the lawbare data
 */
const SamplesExtractionLabwareFactory = () => {
  const data = {
    data: [
      {
        id: '58a33358-e8f4-11e9-9231-68b59977951e',
        type: 'assets',
        links: {
          self: 'https://samples-extraction/api/v1/assets/58a33358-e8f4-11e9-9231-68b59977951e',
        },
        attributes: {
          uuid: '58a33358-e8f4-11e9-9231-68b59977951e',
          asset_type: 'Tube',
          barcode: 'SE108532I',
          sample_uuid: '4008d13c-e8f3-11e9-9231-68b59977951e',
          study_uuid: '123456-e8f3-11e9-9231-68b59977951e',
          pipeline: 'saphyr',
          library_type: 'type',
          estimate_of_gb_required: '123',
          number_of_smrt_cells: '1',
          cost_code: 'S1234',
          fields: {
            aliquotType: 'DNA',
            a: 'Tube',
            transferredFrom: '6f800e70-e9da-11e9-9231-68b59977951e',
            is: 'Used',
            study_uuid: '"5470dfba-44ad-11e9-94c0-68b59977951e"',
            sample_uuid: '"9ad31db0-e9da-11e9-9231-68b59977951e"',
            sanger_sample_name: '5200STDY7323048',
            supplier_sample_name: '5200STDY7323048',
            sample_common_name: 'Homo sapiens',
            sample_tube: '6f800e70-e9da-11e9-9231-68b59977951e',
            study_name: 'UAT Study',
            sanger_sample_id: '5200STDY7323048',
            sample_id: '5200STDY7323048',
          },
        },
      },
    ],
  }

  return BaseFactory(data)
}

export default SamplesExtractionLabwareFactory
