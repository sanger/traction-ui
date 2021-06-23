import actions from '@/store/traction/pacbio/poolCreate/actions'

describe('actions.js', () => {
  const {
    fetchPacbioPlates,
   fetchPacbioTagSets
  } = actions

  it('fetchPacbioPlates', async () => {
    // mock commit
    const commit = jest.fn()
    // mock dependencies

    // apply action
    await fetchPacbioPlates({commit})
    // assert result (Might make sense to pull these into separate tests)
    expect(commit).toHaveBeenCalledWith('populatePlates', [])
    expect(commit).toHaveBeenCalledWith('populateWells', [])
    expect(commit).toHaveBeenCalledWith('populateRequests', [])
  })

  it('fetchPacbioTagSets', async () => {
    // mock commit
    const commit = jest.fn()
    // mock dependencies
    // apply action
    await fetchPacbioTagSets({commit})
    // assert result
    expect(commit).toHaveBeenCalledWith('populateTagSets', [])
    expect(commit).toHaveBeenCalledWith('populateTags', [])
  })
})
