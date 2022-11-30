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
      Contracts.requests.populateRequestsParameters, //what is this for?
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
    Contracts.tagSets.populateTagSetParameters, // info added to contract for tagset parameters
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
  it('applies a single tag when autoTag is false', async () => {

  })

  it('applies tags to wells on the same plate with a higher column index when autoTag is true', async () => {

  })

  it('applies tags to tubes with a higher index when autoTag is true', async () => {
    
  })
})

describe('updateLibraryFromCsvRecord', () => {
  const state = Data.AutoTagStore
  const info = {
    lines: 3,
    records: 2
  }
  const getters = {
    selectedTagSet: {
      id: '',
      type: '',
      name: '',
      uuid: '',
      pipeline: '',
      tags: [
        { id: '', type: '', oligo: '', group_id: ''},
        { id: '', type: '', oligo: '', group_id: ''},
        { id: '', type: '', oligo: '', group_id: ''},
        { id: '', type: '', oligo: '', group_id: ''},
        { id: '', type: '', oligo: '', group_id: ''},
        { id: '', type: '', oligo: '', group_id: ''},
      ],
    },
  }

  it('updates the corresponding library', async () => {
    const commit = vi.fn()
    const record = {
      // source: '',
      // tag: '',
      // genome_size: ,
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

  it('updates the corresponsing library for tubes', async () => {
    const commit = vi.fn()
    const record = {
      // source: '',
      // tag: '',
      // // genome_size: ,
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
      // genome_size: ,
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
        // genome_size: ,
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
      // genome_size: ,
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
})
})