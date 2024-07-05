import BaseFactory from '@tests/factories/BaseFactory.js'

const PacbioSamplesFactory = () => {
  const data = {
    data: {
      data: [
        {
          id: "1",
          type: "requests",
          attributes: {
            library_type: "library_type_1",
            estimate_of_gb_required: 100,
            number_of_smrt_cells: 3,
            cost_code: "PSD1234",
            external_study_id: "mockStudy-ID",
            sample_name: "mockName3",
            barcode: "TRAC-82",
            sample_species: "mockSpecies",
            source_identifier: "NT127Q",
            created_at: "10/14/2019 10:56"
          }
        },
        {
          id: "2",
          type: "requests",
          attributes: {
            library_type: "library_type_1",
            estimate_of_gb_required: 100,
            number_of_smrt_cells: 3,
            cost_code: "PSD1234",
            external_study_id: "mockStudy-ID",
            sample_name: "mockName3",
            barcode: "TRAC-83",
            sample_species: "mockSpecies",
            source_identifier: "NT127Q",
            created_at: "10/14/2019 10:56"
          }
        },
        {
          id: "3",
          type: "requests",
          attributes: {
            library_type: "library_type_1",
            estimate_of_gb_required: 100,
            number_of_smrt_cells: 3,
            cost_code: "PSD1234",
            external_study_id: "mockStudy-ID",
            sample_name: "mockName3",
            barcode: "TRAC-84",
            sample_species: "mockSpecies",
            source_identifier: "NT127Q",
            created_at: "10/14/2019 11:01"
          }
        },
        {
          id: "4",
          type: "requests",
          attributes: {
            library_type: "null mock",
            estimate_of_gb_required: 0,
            number_of_smrt_cells: 0,
            cost_code: "nullmock",
            external_study_id: "nullmock",
            sample_name: "5200STDY7322947mock1",
            barcode: "TRAC-85",
            sample_species: "mock sample_common_name",
            source_identifier: "NT127Q",
            created_at: "10/14/2019 11:06"
          }
        },
        {
          id: "5",
          type: "requests",
          attributes: {
            library_type: "null mock",
            estimate_of_gb_required: 0,
            number_of_smrt_cells: 0,
            cost_code: "nullmock",
            external_study_id: "null-mock",
            sample_name: "5200STDY7322947mock11",
            barcode: "TRAC-87",
            sample_species: "mock sample_common_name",
            source_identifier: "NT127Q",
            created_at: "10/14/2019 02:24"
          }
        },
        {
          id: "6",
          type: "requests",
          attributes: {
            library_type: "null mock",
            estimate_of_gb_required: 0,
            number_of_smrt_cells: 0,
            cost_code: "nullmock",
            external_study_id: "5470dfba-44ad-11e9-94c0-68b59977951e-mock",
            sample_name: "5200STDY7323048mock",
            barcode: "TRAC-89",
            sample_species: "mock sample_common_name",
            source_identifier: "NT127Q",
            created_at: "10/16/2019 09:38"
          }
        },
        {
          id: "7",
          type: "requests",
          attributes: {
            library_type: "null mock",
            estimate_of_gb_required: 0,
            number_of_smrt_cells: 0,
            cost_code: "nullmock",
            external_study_id: "5470dfba-44ad-11e9-94c0-68b59977951e-mock",
            sample_name: "5200STDY7323048mock",
            barcode: "TRAC-91",
            sample_species: "mock sample_common_name",
            source_identifier: "NT127Q",
            created_at: "10/16/2019 10:00"
          }
        },
        {
          id: "8",
          type: "requests",
          attributes: {
            library_type: "null mock",
            estimate_of_gb_required: 0,
            number_of_smrt_cells: 0,
            cost_code: "nullmock",
            external_study_id: "5470dfba-44ad-11e9-94c0-68b59977951e-mock",
            sample_name: "5200STDY7323048mock",
            barcode: "TRAC-92",
            sample_species: "mock sample_common_name",
            source_identifier: "NT127Q",
            created_at: "10/16/2019 10:00"
          }
        },
        {
          id: "9",
          type: "requests",
          attributes: {
            library_type: "null mock",
            estimate_of_gb_required: 0,
            number_of_smrt_cells: 0,
            cost_code: "nullmock",
            external_study_id: "5470dfba-44ad-11e9-94c0-68b59977951e-mock",
            sample_name: "5200STDY7323048mock",
            barcode: "TRAC-93",
            sample_species: "mock sample_common_name",
            source_identifier: "NT127Q",
            created_at: "10/16/2019 10:01"
          }
        },
        {
          id: "10",
          type: "requests",
          attributes: {
            library_type: "null mock",
            estimate_of_gb_required: 0,
            number_of_smrt_cells: 0,
            cost_code: "nullmock",
            external_study_id: "5470dfba-44ad-11e9-94c0-68b59977951e-mock",
            sample_name: "5200STDY7323048mock",
            barcode: "TRAC-94",
            sample_species: "mock sample_common_name",
            source_identifier: "NT127Q",
            created_at: "10/16/2019 10:03"
          }
        },
        {
          id: "11",
          type: "requests",
          attributes: {
            library_type: "null mock",
            estimate_of_gb_required: 0,
            number_of_smrt_cells: 0,
            cost_code: "nullmock",
            external_study_id: "5470dfba-44ad-11e9-94c0-68b59977951e-mock",
            sample_name: "5200STDY7323048mock",
            barcode: "TRAC-95",
            sample_species: "mock sample_common_name",
            source_identifier: "NT127Q",
            created_at: "10/16/2019 10:04"
          }
        },
        {
          id: "12",
          type: "requests",
          attributes: {
            library_type: "null1x",
            estimate_of_gb_required: 0,
            number_of_smrt_cells: 0,
            cost_code: "null1x",
            external_study_id: "5470dfba-44ad-11e9-94c0-68b59977951e",
            sample_name: "5200STDY73230482x",
            barcode: "TRAC-96",
            sample_species: "Homo sapiens",
            source_identifier: "NT127Q",
            created_at: "10/16/2019 10:10"
          }
        }
      ]
    },
    status: 200,
    statusText: "Success"
  }

  return BaseFactory(data)
}

export default PacbioSamplesFactory