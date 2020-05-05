import mutations from '@/store/traction/pacbio/tubes/mutations'

let tubes, state

describe('mutations', () => {
  beforeEach(() => {
    tubes = [{ id: 1 }, { id: 2 }]
  })

  it('"setTubes" sets "state.tractionTubes" to the given tubes', () => {
    state = {
      tubes: []
    }
    mutations.setTubes(state, tubes)
    expect(state.tractionTubes).toEqual(tubes)
  })
})
