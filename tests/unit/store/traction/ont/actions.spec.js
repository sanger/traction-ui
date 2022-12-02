import { Data } from '@support/testHelper'
import actions from '@/store/traction/ont/actions'
import { describe, expect, it } from 'vitest'
import Contracts from './contracts'
import defaultState from '@/store/traction/ont/state'
import { payload } from '@/store/traction/ont/pool'
import { newResponse } from '@/api/ResponseHelper'

describe('actions.js', () => {
  const {
    fetchOntTagSets,
    selectWellRequests,
    deselectPlateAndContents,
    createPool,
    updatePool,
    applyTags,
    updateLibraryFromCsvRecord
  } = actions

describe('fetchOntRequests', () => {
  it('handles success', async () => {
    // mock commit
    const commit = vi.fn()
    // mock dependencies
    const get = vi.fn()
    const rootState = { api: { traction: { ont: { requests: { get } } } } }
    get.mockResolvedValue(Data.TractionOntRequests)
    // apply action
    const { success } = await actions.fetchOntRequests({ commit, rootState })
    // assert result (Might make sense to pull these into separate tests)
    expect(commit).toHaveBeenCalledWith(
      'populateRequests',
      Contracts.requests.populateRequestsParameters,
    )
    expect(success).toEqual(true)
  })

  it('handles failure', async () => {
    // mock commit
    const commit = vi.fn()
    // mock dependencies
    const get = vi.fn()
    const rootState = { api: { traction: { ont: { requests: { get } } } } }
    get.mockRejectedValue({
      data: { data: [] },
      status: 500,
      statusText: 'Internal Server Error',
    })
    // apply action
    const { success } = await actions.fetchOntRequests({ commit, rootState })
    // assert result (Might make sense to pull these into separate tests)
    expect(commit).not.toHaveBeenCalled()
    expect(success).toEqual(false)
  })
})

describe('fetchOntTagSets', () => {
  it('handles success', async () => {
    // mock commit
    const commit = vi.fn()
    // mock dependencies
    const get = vi.fn()
    const rootState = { api: { traction: { ont: {tag_sets: { get } } } } }
    get.mockResolvedValue(Data.TractionOntTagSets)
    // apply action
    const { success } = await fetchOntTagSets( { commit, rootState})
    // assert result
    expect(commit).toHaveBeenCalledWith('populateTagSets',
    Contracts.tagSets.populateTagSetParameters,
    )
    expect(commit).toHaveBeenNthCalledWith('populateTags',
    Contracts.tags.populateTagParameters,
    )
    expect(success).toEqual(true)
  })

  it ('handles failure', async () => {
    // mock commit
    const commit = vi.fn()
    // mock dependencies
    const get = vi.fn()
    const rootState = { api: { traction: { ont: { tag_sets: { get } } } } }
    get.mockRejectedValue({
      data: { data: [] },
      status: 500,
      statusText: 'Internal Server Error',
    })
    // apply action
    const { success } = await fetchOntTagSets({ commit, rootState })
    // assert result
    expect(commit).not.toHaveBeenCalled()
    expect(success).toEqual(false)
  })
})

describe('selectWellRequests', () => {
  it('selects requests if unselected', async() => {
    // mock commit
    const commit = vi.fn()
    // mock dependencies
    const defaultStateObject = defaultState()
    const state = {
      ...defaultStateObject, 
      resources: {
        ...defaultStateObject.resources,
        wells: {
          //what data is this populated with?
          1: { id: '1', type: 'wells', position: 'A1', requests: ['2'] 
        },
      },
    },
  }
  // apply action
  await selectWellRequests({ commit, state}, '1')
  // assert result
  // is this the data corresponding to the above?
  expect(commit).toHaveBeenCalledWith('selectRequest', { id: '2', selected: true })
    })

it ('deselects requests if selected', async () => {
  // mock commit
  const commit = vi.fn()
  // mock dependencies
  const defaultStateObject = defaultState()
  const state = {
    ...defaultStateObject,
    resources: {
    ...defaultStateObject.resources,
    wells: {
      1: { id: '1', type: 'wells', position: 'A1', requests: ['2'] },
    },
  },
  libraries: {
    _2: { ont_request_id: '2' },
  },
}
// apply action
await selectWellRequests({ commit, state }, '1')
// assert result
expect(commit).toHaveBeenCalledWith('selectRequest', { id: '2', selected: false })
  })
})

describe('deselectPlateAndContents', () => {
  it('selects requests if unselected', async () => {
    // mock commit
    const commit = vi.fn()
    // mock dependencies
    const defaultStateObject = defaultState()
    const state = {
      ...defaultStateObject,
      resources: {
        ...defaultStateObject.resources,
        plates: { // what is the data added?
          1: { id: 1, wells: ['10', '20'] },
        },
        wells: {
          10: { id: '1', type: 'wells', position: 'A1', requests: ['100', '300'] },
          20: { id: '1', type: 'wells', position: 'A1', requests: ['200', '400'] },
        },
      },
      selected: {
        ...defaultStateObject.selected,
        requests: {
          _100: { id: '100', selected: true },
          _300: { id: '300', selected: true },
        },
      },
    }
    // apply action
    await deselectPlateAndContents({ commit, state }, '1') // what is this 1?
    // assert result
    expect(commit).toHaveBeenCalledWith('selectPlate', { id: '1', selected: false })
    expect(commit).toHaveBeenCalledWith('selectRequest', { id: '100', selected: false })
    expect(commit).toHaveBeenCalledWith('selectRequest', { id: '300', selected: false })
    // we don't want to select any unselected requests
    expect(commit).not.toHaveBeenCalledWith('selectRequest', { id: '200', selected: true })
  })
})

describe('createPool', () => {
  const library1 = {
    ont_request_id: '1',
    tag_id: '1',
    kit_barcode: 'ABC1',
    volume: 1,
    concentration: 1,
    insert_size: 100
  }

  const library2 = {
    ont_request_id: '2',
    tag_id: '2',
    kit_barcode: 'ABC1',
    volume: 1,
    concentration: 1,
    insert_size: 100
  }

  const pool = {
    kit_barcode: 'ABC1',
    volume: 1,
    concentration: 1, 
    insert_size: 100,
    //final_library_amount: 100
  }

  // pool should be successfully created
  it('when the pool is valid', async () => {
    // mock response
    const mockResponse = {
      status: '201',
      data: { data: {}, included: [{ type: 'tubes', attributes: { barcode: 'TRAC-1'} }] },
    }
    // mock dependencies
    const create = vi.fn()
    const rootState = { api: { traction: { ont: { pools: { create } } } } } //cannot access - is this because of the flipper?
    const libraries = { _1: library1, _2: library2 }
    create.mockResolvedValue(mockResponse)
    const { success, barcode } = await createPool({ rootState, state: { libraries, pool } })
    expect(create).toHaveBeenCalledWith({
      data: payload({ libraries, pool }),
      include: expect.anything()
    })
    expect(success).toBeTruthy()
    expect(barcode).toEqual('TRAC-1')
  })

it('when there is an error', async() => {
  // mock response
  const mockResponse = {
    status: '422',
    data: { data: { errors: {error1: ['There was an error'] } } },
  }
  // mock dependencies
  const update = vi.fn(() => Promise.reject({ response: mockResponse }))
  const rootState = { api: { traction: { ont: { pools: { update } } } } }
  const libraries = { _1: library1, _2: library2 }
  const expectedResponse = newResponse({...mockResponse, success: false })
  const { success, errors } = await updatePool({ rootState, state: { libraries, pool } })
  expect(success).toBeFalsy
  expect(errors).toEqual(expectedResponse.errors)
  })

  // validate libraries fails
  // request is not sent
  // commit is not called
  it('when the pool is invalid', async () => {
    // mock commit
    const commit = vi.fn()
    // mock dependencies
    const create = vi.fn()
    const rootState = { api: { traction: { ont: { pools: { create } } } } }
    const libraries = { _1: library1, _2: { ...library2, concentration: '' } }
    const { success, errors } = await createPool({
      commit,
      rootState,
      state: { libraries, pool }
    })
    expect(create).not.toHaveBeenCalled()
    expect(success).toBeFalsy()
    expect(errors).toEqual('The pool is invalid')
  })
})

describe('updatePool', () => {
  const library1 = { // why does this have the extra attribute for id?
    id: '10',
    ont_request_id: '1', 
    tag_id: '1',
    kit_barcode: 'ABC1',
    volume: 1,
    concentration: 1, 
    insert_size: 100
  }

  const library2 = { 
    id: '20',
    ont_request_id: '2', 
    tag_id: '2',
    kit_barcode: 'ABC1',
    volume: 1,
    concentration: 1, 
    insert_size: 100
  }

  const pool = {
    id: '1',
    kit_barcode: 'ABC1',
    volume: 1,
    concentration: 1,
    insert_size: 100
  }

  // pool should be successfully created
  it('when the pool is valid', async () => {
    // mock response
    const mockResponse = {
      status: '201',
      data: { data: {}, included: [{ type: 'tubes', attributes: { barcode: 'TRAC-1' } }] }
    }
    // mock dependencies
    const update = vi.fn()
    const rootState = { api: { traction: { ont: { pools: { update } } } } }
    const libraries = { _1: library1, _2: library2 }
    update.mockResolvedValue(mockResponse)
    const { success } = await updatePool({ rootState, state: { libraries, pool } })
    expect(update).toHaveBeenCalledWith(payload({ libraries, pool }))
    expect(success).toBeTruthy()
  })

  it('when there is an error', async () => {
    // mock response
    const mockResponse = {
      status: '422',
      data: { data: { errors: { error1: ['There was an error'] } } }
    }
    // mock dependencies
    const update = vi.fn(() => Promise.reject({ response: mockResponse }))
    const rootState = { api: { traction: { ont: { pools: { update } } } } }
    const libraries = { _1: library1, _2: library2 }
    const expectedResponse = newResponse({ ...mockResponse, success: false })
    const { success, errors } = await updatePool({ rootState, state: { libraries, pool } })
    expect(success).toBeFalsy
    expect(errors).toEqual(expectedResponse.errors)
  })

  // validate libraries fails
  // request is not sent
  // commit is not called
  it('when the pool is invalid', async () => {
    // mock commit
    const commit = vi.fn()
    // mock dependencies
    const update = vi.fn()
    const rootState = { api: { traction: { ont: { pools: { update } } } } }
    const libraries = { _1: library1, _2: {...library2, concentration: '' } }
    const { success, errors } = await updatePool({
      commit,
      rootState,
      state: { libraries, pool }
    })
    expect(update).not.toHaveBeenCalled()
    expect(success).toBeFalsy()
    expect(errors).toEqual('The pool is invalid')
  })
})

describe('applyTags', () => {
  const state = Data.OntAutoTagStore
  const library = { ont_request_id: '13', tag_id: '130'} // Starting in B1

  it('applies a single tag when autoTag is false', async () => {
    const commit = vi.fn()
    const autoTag = false

    await applyTags({ commit, state}, { library, autoTag })
    // Update the changed well
    expect(commit).toHaveBeenCalledWith('updateLibrary', {
      ont_request_id: '13',
      tag_id: '130',
    })
    // But nothing else
    expect(commit).toHaveBeenCalledTimes(1)

    // We don't update earlier wells
    expect(commit).not.toHaveBeenCalledWith(
      'updateLibrary',
      expect.objectContaining({ ont_request_id: '1' }),
    )
  })

  it('applies tags to wells on the same plate with a higher column index when autoTag is true', async () => {
    const commit = vi.fn()
    const autoTag = true

    // are the first two tests needed as they have already been tested before?
    await applyTags( { commit, state }, { library, autoTag})

    // Update the changed well
    expect(commit).toHaveBeenCalledWith('updateLibrary', {
      ont_request_id: '13',
      tag_id: '130',
    })

    // We don't update earlier wells
    expect(commit).not.toHaveBeenCalledWith(
      'updateLibrary', 
      expect.objectContaining({ 
        ont_request_id: '1',
      })
    )

    // How is this one and the next one different - where did we indicate selected wells
    // We don't update unselected wells
    expect(commit).not.toHaveBeenCalledWith(
      'updateLibrary',
      expect.objectContaining({
        ont_request_id: '25', // C1
      })
    )

    // We update wells further down the plate
    expect(commit).toHaveBeenCalledWith(
      'updateLibrary',
      expect.objectContaining({ 
        ont_request_id: '37', //D1
        tag_id: '132'
      })
    )

    // We update wells in the next column
    expect(commit).toHaveBeenCalledWith(
      'updateLibrary',
      expect.objectContaining({
        ont_request_id: '2', // A2
        tag_id: '137'
      })
    )

    // But not another plate
    expect(commit).not.toHaveBeenCalledWith(
      'updateLibrary',
      expect.objectContaining({
        ont_request_id: '61', //B1
      })
    )

    expect(commit).not.toHaveBeenCalledWith(
      'updateLibrary',
      expect.objectContaining({
        ont_request_id: '73', // C1
      }),
    )

    // or a tube
    expect(commit).not.toHaveBeenCalledWith(
      'updateLibrary',
      expect.objectContaining({
        ont_request_id: '96', // is this not a plate? 
      }),
    )
    expect(commit).not.toHaveBeenCalledWith(
      'updateLibrary',
      expect.objectContaining({
        ont_request_id: '97', // a tube
      }),
    )

    // In total we expect ot update8 wells in this case
    expect(commit).toHaveBeenCalledTimes(6)
  })

  // uncomment if tube functionality is added
  /* it('applies tags to tubes with a higher index when autoTag is true', async () => {
    const commit = vi.fn()
    const autoTag = true
    const library = { ont_request_id: '98', tag_id: '130'}

    const selectedRequests = Object.values(state.libraries).map(
      ({ ont_request_id }) => state.resources.requests[ont_request_id],
    )

    await applyTags({ commit, state, getters: {selectedRequests} }, { library, autoTag })

    // Update the changed well
    expect(commit).toHaveBeenCalledWith(
      'updateLibrary', {
        ont_request_id: '98',
        tag_id: '130'
    })

    // We don't update earlier wells
    expect(commit).not.toHaveBeenCalledWith(
      'updateLibrary', 
        expect.objectContaining({
          ont_request_id: '1',
        })
      )

      // We don't update earlier tubes
      expect(commit).not.toHaveBeenCalledWith(
        'updateLibrary',
        expect.objectContaining({ 
          ont_request_id: '97',
        })
      )

      // We don't update unselected wells
      expect(commit).not.toHaveBeenCalledWith(
        'updateLibrary',
        expect.objectContaining({
          ont_request_id: '25' // C1
        })
      )

      // We do update tubes with higher ids
      expect(commit).toHaveBeenCalledWith(
        'updateLibrary',
        expect.objectContaining({
          ont_request_id: '99', // D1
          tag_id: '131'
        })
      )

      // In total we expect to update 2 tubes in this case
      expect(commit).toHaveBeenCalledWith(2)
  }) */
})

describe('updateLibraryFromCsvRecord', () => {
  const state = Data.OntAutoTagStore
  const info = {
    lines: 3,
    records: 2
  }
  const getters = {
    selectedTagSet: {
      id: '8',
      type: 'tags',
      name: 'ont_native',
      pipeline: 'ont',
      tags: [
        { id: '385', type: 'tags', oligo: 'CACAAAGACACCGACAACTTTCTT', group_id: 'NB01'},
        { id: '386', type: 'tags', oligo: 'ACAGACGACTACAAACGGAATCGA', group_id: 'NB02'},
        { id: '387', type: 'tags', oligo: 'CCTGGTAACTGGGACACAAGACTC', group_id: 'NB03'},
        { id: '388', type: 'tags', oligo: 'TAGGGAAACACGATAGAATCCGAA', group_id: 'NB04'},
        { id: '389', type: 'tags', oligo: 'AAGGTTACACAAACCCTGGACAAG', group_id: 'NB05'},
        { id: '390', type: 'tags', oligo: 'GACTACTTTCTGCCTTTGCGAGAA', group_id: 'NB06'},
      ],
    },
  }

  it('updates the corresponding library', async () => {
    const commit = vi.fn()
    const record = { // are these library attributes
      // source: '', // eg NB02
      // tag: '',
      // insert_size: ,
      // concentration: ,
      // volume: 
    }

    updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

    expect(commit).toHaveBeenCalledWith(
      'updateLibrary',
      expect.objectContaining({ // does not match attributes above?
        // ont_request_id: '',
        // tag_id: '', // eg 387
        // insert_size: ,
        // concentration: ,
        // volume: 
      }),
    )
  })

  it('updates the corresponsing library for tubes', async () => {
    const commit = vi.fn()
    const record = {
      // source: '',
      // tag: '',
      // insert_size: ,
      // concentration: ,
      // volume: 
    }

    updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

    expect(commit).toHaveBeenCalledWith(
      'updateLibrary',
      expect.objectContaining({
        // ont_request_id: '',
        // tag_id: '',
        // insert_size: ,
        // concentration: ,
        // volume: 
      }),
    )
  })

  it('records an error when source is missing', async () => {
    const commit = vi.fn()
    const record = {
      // tag: '',
      // insert_size: ,
      // concentration: ,
      // volume: 
    }

    updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

    expect(commit).toHaveBeenCalledWith(
      'traction/addMessage',
      {
        type: 'danger',
        message: 'Library 2 on line 3: has no source',
      },
      { root: true }
    )
  })

  it('records an error when the plate cant be found', async () => {
    const commit = vi.fn()
    const record = {
      // source: '',
    }

    updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

    expect(commit).toHaveBeenCalledWith(
      'traction/addMessage',
      {
        type: 'danger',
        message:
        'Library 2 on line 3: ... could not be found. Barcode should be in the format barcode-well for plates (eg. DN1235-A1) or just barcode for tubes.',
      },
      { root: true },
    )
  })

  it('records an error when the well cant be found', async () => {
    const commit = vi.fn()
    const record = {
      // source: ,
    }

    updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

    expect(commit).toHaveBeenCalledWith(
      'traction/addMessage',
      {
        type: 'danger',
        message: 'Library 2 on line 3: A well named ... could not be found on ...'
      },
      { root: true }
    )
  })

  it('records and error when the tag cant be found', async () => {
    const commit = vi.fn()
    const record = {
      // source: '',
      // tag: ''
    }

    updateLibraryFromCsvRecord({ state, commit, getters}, { record, info })

    expect(commit).toHaveBeenCalledWith(
      'traction/addMessage',
      {
        type: 'danger',
        message: 'Library 2 on line 3. Could not find a tag named ... in selected tag group.'
      },
      { root: true },
    )
  })

  it('flags the plate as selected', async () => {
    const commit = vi.fn()
    const record = {
      // source: '',
      // tag: ''
    }

    updateLibraryFromCsvRecord( { state, commit, getters }, { record, info })
    
    expect(commit).toHaveBeenCalledWith('selectPlate', {
      id: '',
      selected: 'true'
    })
  })

  it('notifies of request addition', async () => {
    const commit = vi.fn()
      const record = {
        // source: '',
        // tag: '',
        // insert_size: ,
        // concentration: ,
        // volume: 
      }

      updateLibraryFromCsvRecord({ state, commit, getters }, {record, info} )

      expect(commit).toHaveBeenCalledWith(
        'traction/addMessage',
        {
          type: 'info',
          message: 'Library 2 on line 3: Added ... to pool.'
        },
        { root: true},
      )
  })

  it('does not notify of request updates', async () => {
    const commit = vi.fn()
    const record = {
      // source: '',
      // insert_size: ,
      // concentration: ,
      // volume: ,
  }

  updateLibraryFromCsvRecord({ state, commit, getters }, { record, info })

  expect(commit).not.toHaveBeenCalledWith(
    'traction/addMessage',
    {
      type: 'info',
      message: 'Library 2 on line 3: Added ... to pool.',
    },
    { root: true }
  )
})

describe('setPoolData', () => {
  // TODO
})

describe('findOntPlate', () => {
  // TODO
})

})
})