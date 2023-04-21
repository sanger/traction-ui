import Mutations from '@/store/traction/pacbio/runs/mutations'
import { Data } from '@support/testHelper'
import { expect } from 'vitest'

describe('mutate', () => {
  let runs, state

  beforeEach(() => {
    runs = Data.PacbioRuns.data.data.splice(0, 2)
    state = { runs: [] }
  })

  it('can update the mutate the state, e.g setRuns', () => {
    const expectedRuns = {
      1: {
        id: '1',
        type: 'runs',
        name: 'aname',
        state: 'pending',
        sequencing_kit_box_barcode: 'DM000110086180012311',
        dna_control_complex_box_barcode: 'Lxxxxx10171760012311',
        system_name: 'Sequel I',
        pacbio_smrt_link_version_id: 1,
        created_at: '11/09/2019 01:11',
      },
      2: {
        id: '2',
        type: 'runs',
        name: 'anothername',
        state: 'started',
        sequencing_kit_box_barcode: 'DM000110086180012312',
        dna_control_complex_box_barcode: 'Lxxxxx10171760012312',
        system_name: 'Sequel II',
        pacbio_smrt_link_version_id: 1,
        created_at: '12/09/2019 02:22',
      },
    }
    Mutations.setRuns(state, runs)
    expect(state.runs).toEqual(expectedRuns)
  })
})
