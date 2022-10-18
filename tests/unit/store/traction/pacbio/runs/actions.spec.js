import Response from '@/api/Response'
import * as Actions from '@/store/traction/pacbio/runs/actions'
import { Data } from '@support/testHelper'
import * as Run from '@/api/PacbioRun'

describe('#setRuns', () => {
  let commit, get, getters, failedResponse

  beforeEach(() => {
    commit = vi.fn()
    get = vi.fn()
    getters = { runRequest: { get: get } }

    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  it('successfully', async () => {
    get.mockReturnValue(Data.PacbioRuns)

    let expectedResponse = new Response(Data.PacbioRuns)
    let expectedRuns = expectedResponse.deserialize.runs

    let response = await Actions.setRuns({ commit, getters })

    expect(commit).toHaveBeenCalledWith('setRuns', expectedRuns)
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully', async () => {
    get.mockReturnValue(failedResponse)

    let expectedResponse = new Response(failedResponse)

    let response = await Actions.setRuns({ commit, getters })

    expect(commit).not.toHaveBeenCalled()
    expect(response).toEqual(expectedResponse)
  })
})

describe('#newRun', () => {
  let commit

  beforeEach(() => {
    commit = vi.fn()
  })

  it('successfully', async () => {
    let newRun = Run.build()
    vi.spyOn(Run, 'build')
    Run.build.mockReturnValue(newRun)

    Actions.newRun({ commit })
    expect(commit).toHaveBeenCalledWith('setCurrentRun', newRun)
  })
})

describe('#createRun', () => {
  let getters, pacbioRequests, mockRun

  beforeEach(() => {
    mockRun = new Response(Data.PacbioRun).deserialize.runs[0]
    pacbioRequests = vi.fn()
    getters = { currentRun: mockRun, pacbioRequests: pacbioRequests }
    vi.spyOn(Run, 'create').mockImplementation(() => {})
  })

  it('successfully', async () => {
    Actions.createRun({ getters })
    expect(Run.create).toHaveBeenCalledWith(mockRun, pacbioRequests)
  })
})

describe('#editRun', () => {
  let getters, commit, mockRun, find

  beforeEach(() => {
    mockRun = new Response(Data.PacbioRun).deserialize.runs[0]

    find = vi.fn()
    getters = { runRequest: { find: find } }
    commit = vi.fn()
  })

  it('sets the well pools to have a barcode attribute', async () => {
    mockRun.plate.wells.forEach((well) => {
      well.pools.forEach((pool) => (pool.barcode = pool.tube.barcode))
    })
    mockRun.plate.wellsToDelete = []
    find.mockReturnValue(Data.PacbioRun)
    await Actions.editRun({ commit, getters }, mockRun.id)
    expect(commit).toHaveBeenCalledWith('setCurrentRun', mockRun)
  })

  it('successfully creates and adds wellsToDelete attribute', async () => {
    find.mockReturnValue(Data.PacbioRun)
    await Actions.editRun({ commit, getters }, mockRun.id)
    expect(commit).toHaveBeenCalled()
  })
})

describe('#updateRun', () => {
  let getters, pacbioRequests, mockRun, dispatch, update

  beforeEach(() => {
    mockRun = new Response(Data.PacbioRun).deserialize.runs[0]
    pacbioRequests = vi.fn()
    getters = { currentRun: mockRun, pacbioRequests: pacbioRequests }
    dispatch = vi.fn()

    update = vi.spyOn(Run, 'update')
  })

  afterEach(() => {
    update.mockRestore()
  })

  it('when successful, it doesnt rollback', async () => {
    update.mockResolvedValue([])
    let resp = await Actions.updateRun({ getters, dispatch })

    expect(update).toHaveBeenCalledWith(mockRun, pacbioRequests)
    expect(update).toHaveBeenCalledTimes(1)
    expect(resp).toEqual([])
  })

  it('when unsuccessful, it does rollback', async () => {
    update.mockResolvedValue([{ error: 'this is an error' }])
    let resp = await Actions.updateRun({ getters, dispatch })

    expect(update).toHaveBeenCalledWith(mockRun, pacbioRequests)
    expect(update).toHaveBeenCalledTimes(2)
    expect(resp).toEqual([{ error: 'this is an error' }])
  })
})

describe('#getRun', () => {
  let find, getters

  beforeEach(() => {
    find = vi.fn()
    getters = { runRequest: { find: find } }
  })

  it('successfully', async () => {
    find.mockReturnValue(Data.PacbioRun)

    let expectedResponse = new Response(Data.PacbioRun)
    let expectedRun = expectedResponse.deserialize.runs[0]

    let response = await Actions.getRun({ getters })

    expect(response).toEqual(expectedRun)
  })
})

describe('#buildWell', () => {
  let run, state

  beforeEach(() => {
    run = Run.build()
    run.plate.wells = []
    run.system_name = 'Sequel IIe'
    state = { currentRun: run }
  })

  it('builds a wellObject as expected', async () => {
    let position = 'A10'
    let expectedWellObject = {
      row: 'A',
      column: '10',
      movie_time: '',
      position,
      on_plate_loading_concentration: '',
      generate_hifi: 'On Instrument',
      ccs_analysis_output: 'Yes',
      binding_kit_box_barcode: '',
      pools: [],
      pre_extension_time: 2,
      loading_target_p1_plus_p2: 0.85,
      ccs_analysis_output_include_kinetics_information: 'Yes',
      ccs_analysis_output_include_low_quality_reads: 'Yes',
      demultiplex_barcodes: 'In SMRT Link',
      fivemc_calls_in_cpg_motifs: 'Yes',
    }

    let wellObject = await Actions.buildWell({ state }, position)

    expect(wellObject).toEqual(expectedWellObject)
  })

  it('sets binding kit box barcode to "" if no default value is given', async () => {
    let position = 'A10'
    let expectedWellObject = {
      row: 'A',
      column: '10',
      movie_time: '',
      position,
      on_plate_loading_concentration: '',
      generate_hifi: 'On Instrument',
      ccs_analysis_output: 'Yes',
      binding_kit_box_barcode: '',
      pools: [],
      pre_extension_time: 2,
      loading_target_p1_plus_p2: 0.85,
      ccs_analysis_output_include_kinetics_information: 'Yes',
      ccs_analysis_output_include_low_quality_reads: 'Yes',
      demultiplex_barcodes: 'In SMRT Link',
      fivemc_calls_in_cpg_motifs: 'Yes',
    }

    delete state.currentRun.default_binding_kit_box_barcode
    let wellObject = await Actions.buildWell({ state }, position)

    expect(wellObject).toEqual(expectedWellObject)
  })
})
