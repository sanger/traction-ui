import * as Actions from '@/store/traction/ont/runs/actions'
import { Data } from '@support/testHelper'
import { describe, expect, vi } from 'vitest'

describe('actions.js', () => {
  let failedResponse, rootGetters, commit

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

    rootGetters = {
      'traction/ont/pools/pools': [{ id: 1, barcode: 'TRAC-A-1' }],
      'traction/ont/instruments': [{ id: 1, name: 'GXB02004' }],
    }

    commit = vi.fn()
  })

  describe('#newRun', () => {
    it('successfully', () => {
      Actions.newRun({
        commit,
      })
      const newRun = {
        id: 'new',
        instrument_name: null,
        state: null,
        flowcell_attributes: [],
      }
      expect(commit).toHaveBeenCalledWith('setCurrentRun', newRun)
    })
  })

  describe('#createRun', () => {
    let create, getters

    beforeEach(() => {
      create = vi.fn()
      getters = {
        currentRun: {
          instrument_name: 'GXB02004',
          state: 'pending',
          flowcell_attributes: [{ tube_barcode: 'TRAC-A-1' }],
        },
        runRequest: {
          create: create,
        },
      }
    })

    it('successfully', async () => {
      const promise = Promise.resolve(Data.OntRun)
      create.mockReturnValue(promise)
      const response = await Actions.createRun({
        getters,
        rootGetters,
      })

      const payload = {
        data: {
          data: {
            type: 'runs',
            attributes: {
              ont_instrument_id: 1,
              state: 'pending',
              flowcell_attributes: [],
            },
          },
        },
      }
      expect(create).toBeCalledWith(payload)

      expect(response.success).toBeTruthy()
    })

    it('unsuccessfully', async () => {
      const promise = Promise.reject(failedResponse)
      create.mockReturnValue(promise)
      const response = await Actions.createRun({
        getters,
        rootGetters,
      })

      expect(response.success).toBeFalsy()
      expect(response.errors).toEqual(failedResponse)
    })
  })

  describe('#updateRun', () => {
    let update, getters, run, payload

    beforeEach(() => {
      run = {
        id: '16',
        state: 'pending',
        instrument_name: 'GXB02004',
        flowcell_attributes: [],
      }

      update = vi.fn()

      getters = {
        currentRun: run,
        runRequest: { update: update },
      }

      payload = {
        data: {
          type: 'runs',
          id: '16',
          attributes: {
            state: 'pending',
            ont_instrument_id: 1,
            flowcell_attributes: [],
          },
        },
      }
    })

    it('successfully', async () => {
      const promise = Promise.resolve(Data.OntRun)
      update.mockReturnValue(promise)

      const response = await Actions.updateRun({ getters, rootGetters })

      expect(update).toBeCalledWith(payload)
      expect(response.success).toBeTruthy()
    })

    it('unsuccessfully', async () => {
      const promise = Promise.reject(failedResponse)
      update.mockReturnValue(promise)

      const response = await Actions.updateRun({ getters, rootGetters })
      expect(update).toBeCalledWith(payload)

      expect(response.success).toBeFalsy()
      expect(response.errors).toEqual(failedResponse)
    })
  })

  describe('#fetchRun', () => {
    let getters, mockRun, find, mockedReturnValue

    beforeEach(() => {
      mockRun = {
        id: 1,
        instrument_name: 'GXB02004',
        state: 'pending',
        flowcell_attributes: [],
      }

      find = vi.fn()
      // commit = vi.fn()

      getters = {
        runRequest: { find: find },
      }

      mockedReturnValue = {
        success: true,
        data: {
          data: {
            id: mockRun.id,
            attributes: {
              state: mockRun.state,
              ont_instrument_id: 1,
            },
          },
          flowcell_attributes: mockRun.flowcell_attributes,
        },
        errors: [],
      }
    })

    it('successfully', async () => {
      find.mockReturnValue(mockedReturnValue)
      const response = await Actions.fetchRun({ commit, getters, rootGetters }, mockRun.id)
      expect(commit).toHaveBeenCalledWith('setCurrentRun', mockRun)

      expect(response.success).toBeTruthy()
    })
  })
})
