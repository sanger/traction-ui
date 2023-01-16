import * as Actions from '@/store/traction/ont/runs/actions'
import { Data } from '@support/testHelper'
import { expect, vi } from 'vitest'

describe('actions.js', () => {
  let failedResponse

  beforeEach(() => {
    failedResponse = {
      errors: [
        {
          title: 'Invalid field value',
          detail: 'started is not a valid value for state.',
          code: '103',
          status: '400',
        },
      ],
    }
  })

  describe('#setRuns', () => {
    let commit, get, getters

    beforeEach(() => {
      commit = vi.fn()
      get = vi.fn()
      getters = { runRequest: { get: get } }
    })

    it('successfully', async () => {
      const promise = Promise.resolve(Data.OntRuns)
      get.mockReturnValue(promise)
      await Actions.setRuns({ commit, getters })

      let expected = [
        {
          created_at: '2023-01-11T15:45:25.034Z',
          experiment_name: 'ONTRUN-1',
          id: '1',
          instrument_name: 'GXB02004 (GridION)',
          ont_instrument_id: 1,
          state: 'pending',
        },
        {
          created_at: '2023-01-11T15:51:13.691Z',
          experiment_name: 'ONTRUN-2',
          id: '2',
          instrument_name: 'PC24B148 (PromethION)',
          ont_instrument_id: 2,
          state: 'started',
        },
      ]
      expect(commit).toHaveBeenCalledWith('setRuns', expected)
    })

    it('unsuccessfully', async () => {
      const promise = Promise.reject(failedResponse)
      get.mockReturnValue(promise)
      const response = await Actions.setRuns({ commit, getters })

      expect(response.success).toBeFalsy()
      expect(response.errors).toEqual(failedResponse.errors)
      expect(commit).not.toHaveBeenCalled()
    })
  })

  describe('#createRun', () => {
    let create, getters

    beforeEach(() => {
      create = vi.fn()
      getters = {
        currentRun: { instrument_name: 'bob', state: 'pending', flowcell_attributes: [] },
        runRequest: { create: create },
        instruments: [{ id: 1, name: 'bob' }],
      }
    })

    it('successfully', async () => {
      const promise = Promise.resolve(Data.OntRun)
      create.mockReturnValue(promise)
      let response = await Actions.createRun({ getters })

      expect(response.success).toBeTruthy()
    })

    it('unsuccessfully', async () => {
      const promise = Promise.reject(failedResponse)
      create.mockReturnValue(promise)
      const response = await Actions.createRun({ getters })

      expect(response.success).toBeFalsy()
      expect(response.errors).toEqual(failedResponse)
    })
  })

  describe('#setInstruments', () => {
    let commit, get, getters

    beforeEach(() => {
      commit = vi.fn()
      get = vi.fn()
      getters = { instrumentRequest: { get: get } }
    })

    it('successfully', async () => {
      const promise = Promise.resolve(Data.OntInstruments)
      get.mockReturnValue(promise)
      await Actions.setInstruments({ commit, getters })

      let expected = [
        {
          name: 'GXB02004',
          instrument_type: 'GridION',
          max_number_of_flowcells: 5,
          id: '1',
        },
        {
          name: 'PC24B148',
          instrument_type: 'PromethION',
          max_number_of_flowcells: 24,
          id: '2',
        },
      ]
      expect(commit).toHaveBeenCalledWith('setInstruments', expected)
    })

    it('unsuccessfully', async () => {
      const promise = Promise.reject(failedResponse)
      get.mockReturnValue(promise)
      const response = await Actions.setInstruments({ commit, getters })

      expect(response.success).toBeFalsy()
      expect(response.errors).toEqual(failedResponse.errors)
      expect(commit).not.toHaveBeenCalled()
    })
  })
})
