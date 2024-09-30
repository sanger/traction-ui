import BaseFactory from './BaseFactory.js'

/**
 * Factory function to create LabWhere locations data.
 *
 * @returns {Object} An object containing the base factory data.
 */

const LabwhereLocationsFactory = () => {
  const data = [
    {
      id: 433,
      name: 'box-test-2',
      parent: '/api/locations/lw-test-430',
      container: true,
      status: 'active',
      location_type_id: 13,
      audits: '/api/locations/lw-box-test-2-433/audits',
      barcode: 'lw-box-test-2-433',
      rows: 2,
      columns: 2,
      parentage: 'test',
      created_at: 'Friday September 27 2024 15:23',
      updated_at: 'Friday September 27 2024 15:23',
      coordinates: [
        {
          id: 2,
          position: 1,
          row: 1,
          column: 1,
          labware: 'box-1',
          location: 'lw-box-test-2-433',
        },
        {
          id: 3,
          position: 2,
          row: 1,
          column: 2,
          labware: 'box-2',
          location: 'lw-box-test-2-433',
        },
        {
          id: 4,
          position: 3,
          row: 2,
          column: 1,
          labware: 'Empty',
          location: 'lw-box-test-2-433',
        },
        {
          id: 5,
          position: 4,
          row: 2,
          column: 2,
          labware: 'Empty',
          location: 'lw-box-test-2-433',
        },
      ],
    },
    {
      id: 434,
      name: 'fridge-test-2',
      parent: '/api/locations/lw-test-430',
      container: true,
      status: 'active',
      location_type_id: 13,
      audits: '/api/locations/lw-fridge-test-2-433/audits',
      barcode: 'lw-fridge-test-2-433',
      rows: 0,
      columns: 0,
      parentage: 'test',
      created_at: 'Friday September 27 2024 15:23',
      updated_at: 'Friday September 27 2024 15:23',
    },
  ]

  return BaseFactory(data)
}

export default LabwhereLocationsFactory
