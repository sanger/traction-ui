import mutations from '@/store/traction/pacbio/plates/mutations'

let plates

describe('mutations', () => {
  beforeEach(() => {
    plates = [
      {
        barcode: 'DN814327C',
        created_at: '2021/06/03 06:59',
        id: '61',
        wells: [
          {
            position: 'A1',
            requests: [
              {
                barcode: null,
                id: '40',
              },
            ],
          },
          {
            position: 'A2',
            requests: [
              {
                barcode: null,
                id: '41',
              },
            ],
          },
        ],
      },
      {
        barcode: 'DN814567Q',
        created_at: '2021/06/03 14:57',
        id: '62',
        wells: [],
      },
    ]
  })

  it('"setPlates" sets "state.plates" to the given plates', () => {
    const state = {
      plates: {},
    }
    mutations.setPlates(state, plates)
    expect(state.plates).toEqual(plates)
  })
})
