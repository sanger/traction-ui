import BaseFactory from './BaseFactory.js'

/*
 * Factory for creating a list of runs
 * @returns a base factory object with the runs data
 */
const PacbioRunFactory = () => {
  const data = {
    // it would be better to pass the smrt link versions from the smrt link factory
    // so that the factory is more self-contained and is not so brittle
    data: [
      {
        id: '1',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/1',
        },
        attributes: {
          name: 'aname',
          state: 'pending',
          dna_control_complex_box_barcode: 'Lxxxxx10171760012311',
          system_name: 'Sequel IIe',
          pacbio_smrt_link_version_id: 2,
          created_at: '11/09/2019 01:11',
        },
        relationships: {
          plates: {
            data: [
              {
                type: 'plates',
                id: '1',
              },
            ],
          },
        },
      },
      {
        id: '2',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/2',
        },
        attributes: {
          name: 'anothername',
          state: 'started',
          dna_control_complex_box_barcode: 'Lxxxxx10171760012312',
          system_name: 'Sequel IIe',
          pacbio_smrt_link_version_id: 2,
          created_at: '12/09/2019 02:22',
        },
        relationships: {
          plates: {
            data: [
              {
                type: 'plates',
                id: '2',
              },
            ],
          },
        },
      },
      {
        id: '3',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/3',
        },
        attributes: {
          name: 'anothername1',
          state: 'completed',
          dna_control_complex_box_barcode: 'Lxxxxx10171760012312',
          system_name: 'Sequel IIe',
          pacbio_smrt_link_version_id: 2,
          created_at: '10/09/2019 02:22',
        },
        relationships: {
          plates: {
            data: [
              {
                type: 'plates',
                id: '3',
              },
            ],
          },
        },
      },
      {
        id: '4',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/4',
        },
        attributes: {
          name: 'anothername2',
          state: 'cancelled',
          dna_control_complex_box_barcode: 'Lxxxxx10171760012312',
          system_name: 'Revio',
          pacbio_smrt_link_version_id: 3,
          created_at: '10/09/2019 02:22',
        },
        relationships: {
          plates: {
            data: [
              {
                type: 'plates',
                id: '5',
              },
            ],
          },
        },
      },
      {
        id: '5',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/5',
        },
        attributes: {
          name: 'anothername3',
          state: 'completed',
          dna_control_complex_box_barcode: 'Lxxxxx10171760012312',
          system_name: 'Revio',
          pacbio_smrt_link_version_id: 3,
          created_at: '10/09/2019 02:22',
        },
        relationships: {
          plates: {
            data: [
              {
                type: 'plates',
                id: '5',
              },
            ],
          },
        },
      },
      {
        id: '6',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/6',
        },
        attributes: {
          name: 'anothername4',
          state: 'started',
          dna_control_complex_box_barcode: 'Lxxxxx10171760012312',
          system_name: 'Revio',
          pacbio_smrt_link_version_id: 5,
          created_at: '10/09/2019 02:22',
        },
        relationships: {
          plates: {
            data: [
              {
                type: 'plates',
                id: '6',
              },
              {
                type: 'plates',
                id: '7',
              },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '1',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/plates/1',
        },
        attributes: {
          pacbio_run_id: 2,
          plate_number: 1,
          sequencing_kit_box_barcode: 'SKBB 1',
        },
      },
      {
        id: '2',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/plates/2',
        },
        attributes: {
          pacbio_run_id: 3,
          plate_number: 1,
          sequencing_kit_box_barcode: 'SKBB 2',
        },
      },
      {
        id: '3',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/plates/3',
        },
        attributes: {
          pacbio_run_id: 4,
          plate_number: 1,
          sequencing_kit_box_barcode: 'SKBB 3',
        },
      },
      {
        id: '4',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/plates/4',
        },
        attributes: {
          pacbio_run_id: 4,
          plate_number: 1,
          sequencing_kit_box_barcode: 'SKBB 4',
        },
      },
      {
        id: '5',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/plates/5',
        },
        attributes: {
          pacbio_run_id: 5,
          plate_number: 1,
          sequencing_kit_box_barcode: 'SKBB 5',
        },
      },
      {
        id: '6',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/plates/6',
        },
        attributes: {
          pacbio_run_id: 6,
          plate_number: 1,
          sequencing_kit_box_barcode: 'SKBB 6',
        },
      },
      {
        id: '7',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/plates/7',
        },
        attributes: {
          pacbio_run_id: 6,
          plate_number: 2,
          sequencing_kit_box_barcode: 'SKBB 7',
        },
      },
    ],
    meta: {
      page_count: 1,
    },
  }

  return BaseFactory(data)
}

export default PacbioRunFactory
