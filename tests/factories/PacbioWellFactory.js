import BaseFactory from './BaseFactory.js'

const PacbioWellFactory = () => {
  const data = {
    data: [
      {
        id: '1',
        type: 'wells',
        links: {
          self: 'http://localhost:3100/v1/pacbio/wells/1',
        },
        attributes: {
          movie_time: '10.0',
          on_plate_loading_concentration: 10.1,
          row: 'A',
          column: '1',
          pacbio_plate_id: 1,
          comment: 'comment1',
          generate_hifi: 'In SMRT Link',
          pre_extension_time: '2',
          position: 'A1',
          ccs_analysis_output: 'No',
          bindng_kit_box_barcode: 'BKB1',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/wells/1/relationships/pools',
              related: 'http://localhost:3100/v1/pacbio/wells/1/pools',
            },
          },
        },
      },
      {
        id: '4',
        type: 'wells',
        links: {
          self: 'http://localhost:3100/v1/pacbio/wells/4',
        },
        attributes: {
          movie_time: '10.0',
          on_plate_loading_concentration: 10.1,
          row: 'A',
          column: '2',
          pacbio_plate_id: 5,
          comment: null,
          generate_hifi: 'In SMRT Link',
          pre_extension_time: '2',
          position: 'A2',
          ccs_analysis_output: 'No',
          bindng_kit_box_barcode: 'BKB1',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/wells/4/relationships/pools',
              related: 'http://localhost:3100/v1/pacbio/wells/4/pools',
            },
          },
        },
      },
    ],
  }

  return BaseFactory(data)
}

export default PacbioWellFactory
