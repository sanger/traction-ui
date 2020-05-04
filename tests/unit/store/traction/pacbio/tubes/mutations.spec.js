import Response from '@/api/Response'
import { Data } from '../../../../testHelper'
import mutations from '@/store/traction/pacbio/tubes/mutations'

let tubes, state

describe('mutations', () => {
  beforeEach(() => {
    tubes = new Response(Data.TractionPacbioTubesWithRequest).deserialize
  })

  it('"setTubes" sets "state.tractionTubes" to the given tubes', () => {
    state = {
      tubes: []
    }
    mutations.setTubes(state, tubes)
    expect(state.tractionTubes).toEqual(tubes)
  })
})
