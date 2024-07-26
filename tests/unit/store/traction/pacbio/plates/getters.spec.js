import getters from '@/store/traction/pacbio/plates/getters'

let plates

describe('getters', () => {
  beforeEach(() => {
    plates = {
      61: {
        barcode: 'DN814327C',
        created_at: '2021/06/03 06:59',
        id: '61',
      },
      62: {
        barcode: 'DN814567Q',
        created_at: '2021/06/03 14:57',
        id: '62',
      },
    }
  })

  it('"plates" returns "state.plates"', () => {
    const state = {
      plates: plates,
    }
    expect(getters.plates(state)).toStrictEqual(Object.values(plates))
  })
})
