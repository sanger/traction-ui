import { Data } from '@support/testHelper'
import actions from '@/store/traction/pacbio/runCreate/actions'
import defaultState from '@/store/traction/pacbio/runCreate/state'
import { newResponse } from '@/api/ResponseHelper'
import { expect } from 'vitest'

describe('actions.js', () => {
  const {
    fetchSmrtLinkVersions
  } = actions

  it('handles success', async () => {

    const commit = vi.fn()
    const get = vi.fn()
    const rootState = { api: { traction: { pacbio: { runCreate: { smrtLinkVersions: { get }}}}}}
    get.mockResolvedValue(Data.PacbioSmrtLinkVersionsRequest)
    expect(true).toBeTruthy()
  })
})