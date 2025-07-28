import { expect, it } from 'vitest'
import actions from '@/store/traction/ont/actions.js'
import OntRunFactory from '@tests/factories/OntRunFactory.js'
import { groupIncludedByResource } from '@/api/JsonApi.js'
import { failedResponse } from '@tests/support/testHelper.js'

const ontRunFactory = OntRunFactory()

describe('fetchOntRuns', () => {
  it('handles success', async () => {
    // mock commit
    const commit = vi.fn()
    // mock dependencies
    const get = vi.fn()
    const rootState = { api: { traction: { ont: { runs: { get } } } } }
    get.mockResolvedValue(ontRunFactory.responses.fetch)
    // apply action
    const { success } = await actions.fetchOntRuns({ commit, rootState })
    expect(commit).toHaveBeenCalledWith('setRuns', ontRunFactory.content.data)
    expect(commit).toHaveBeenCalledWith(
      'populateInstruments',
      groupIncludedByResource(ontRunFactory.content.included).instruments,
    )
    expect(success).toEqual(true)
  })

  it('handles failure', async () => {
    // mock commit
    const commit = vi.fn()
    // mock dependencies
    const get = vi.fn()
    const rootState = { api: { traction: { ont: { runs: { get } } } } }
    get.mockResolvedValue(failedResponse())
    // apply action
    const { success } = await actions.fetchOntRuns({ commit, rootState })
    // assert result (Might make sense to pull these into separate tests)
    expect(commit).not.toHaveBeenCalled()
    expect(success).toEqual(false)
  })
})
