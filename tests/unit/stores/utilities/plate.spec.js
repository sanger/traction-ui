import { extractPlatefromData } from '@/stores/utilities/plate.js'

const data = {
  data: [
    {
      id: '1',
      type: 'plates',
      attributes: {
        barcode: 'GEN-1680611780-1',
      },
      relationships: {
        wells: {
          data: [
            {
              type: 'wells',
              id: '1',
            },
            {
              type: 'wells',
              id: '2',
            },
          ],
        },
      },
    },
  ],
  included: [
    {
      id: '1',
      type: 'wells',
      attributes: {
        position: 'A1',
      },
      relationships: {
        requests: {
          data: [
            {
              type: 'requests',
              id: '1',
            },
          ],
        },
      },
    },
    {
      id: '1',
      type: 'requests',
      attributes: {
        library_type: 'Pacbio_HiFi',
        sample_name: 'GENSAMPLE-1680611780-1',
        source_identifier: 'GEN-1680611780-1:A1',
      },
    },
    {
      id: '2',
      type: 'wells',
      attributes: {
        position: 'B1',
      },
      relationships: {
        requests: {
          data: [
            {
              type: 'requests',
              id: '2',
            },
          ],
        },
      },
    },
    {
      id: '2',
      type: 'requests',
      attributes: {
        library_type: 'Pacbio_HiFi',
        sample_name: 'GENSAMPLE-1680611780-2',
        source_identifier: 'GEN-1680611780-1:B1',
      },
    },
  ],
}

const expected = {
  id: '1',
  type: 'plates',
  barcode: 'GEN-1680611780-1',
  wells: [
    {
      id: '1',
      type: 'wells',
      position: 'A1',
      requests: [
        {
          id: '1',
          type: 'requests',
          library_type: 'Pacbio_HiFi',
          sample_name: 'GENSAMPLE-1680611780-1',
          source_identifier: 'GEN-1680611780-1:A1',
        },
      ],
    },
    {
      id: '2',
      type: 'wells',
      position: 'B1',
      requests: [
        {
          id: '2',
          type: 'requests',
          library_type: 'Pacbio_HiFi',
          sample_name: 'GENSAMPLE-1680611780-2',
          source_identifier: 'GEN-1680611780-1:B1',
        },
      ],
    },
  ],
}

describe('plate.js', () => {
  describe('extractPlatefromData', () => {
    it('should return something', () => {
      expect(extractPlatefromData(data)).not.toBeNull()
    })

    it('should return an empty object if no data is passed', () => {
      expect(extractPlatefromData(undefined)).toEqual({})
    })

    it('should return the data for the plate', () => {
      expect(extractPlatefromData(data)).toEqual(expected)
    })
  })
})
