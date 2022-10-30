import Response from '@/api/Response'
import actions from '@/store/traction/pacbio/runs/actions'
import { Data } from '@support/testHelper'
import * as Run from '@/api/PacbioRun'

describe('js', () => {
  const {
    setRuns,
    newRun,
    createRun,
    editRun,
    updateRun,
    getRun,
    buildWell,
    fetchSmrtLinkVersions,
  } = actions

  describe('#setRuns', () => {
    let commit, get, getters, failedResponse

    beforeEach(() => {
      commit = vi.fn()
      get = vi.fn()
      getters = { runRequest: { get: get } }

      failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
    })

    it('successfully', async () => {
      const response = Data.PacbioRuns
      const { data: runs } = response.data
      get.mockResolvedValue(response)

      await setRuns({ commit, getters })
      expect(commit).toHaveBeenCalledWith('setRuns', runs)
    })

    it('unsuccessfully', async () => {
      get.mockRejectedValue(failedResponse)

      await setRuns({ commit, getters })

      expect(commit).not.toHaveBeenCalled()
    })
  })

  describe('#newRun', () => {
    let commit

    beforeEach(() => {
      commit = vi.fn()
    })

    it('successfully', async () => {
      const run = Run.build()
      vi.spyOn(Run, 'build')

      // defaultSmrtLinkVersion mock getter to return the default version
      // this needs refactoring we should be adding to state so that methods
      // are not being rewritten
      const version = { id: 1, name: 'v10', default: true }
      const defaultSmrtLinkVersion = () => version
      const getters = { defaultSmrtLinkVersion }
      Run.build.mockReturnValue(run)

      newRun({ commit, getters })
      // The run will be updated in the action before calling setCurrentRun
      expect(newRun.smrt_link_version_id).toBeDefined
      expect(newRun.smrt_link_version_id, version.id)
      expect(commit).toHaveBeenCalledWith('setCurrentRun', run)
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
      createRun({ getters })
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
      await editRun({ commit, getters }, mockRun.id)

      // The run created in the action will be updated before calling setCurrentRun.
      mockRun.smrt_link_version_id = mockRun.pacbio_smrt_link_version_id
      expect(commit).toHaveBeenCalledWith('setCurrentRun', mockRun)
    })

    it('successfully creates and adds wellsToDelete attribute', async () => {
      find.mockReturnValue(Data.PacbioRun)
      await editRun({ commit, getters }, mockRun.id)
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
      let resp = await updateRun({ getters, dispatch })

      expect(update).toHaveBeenCalledWith(mockRun, pacbioRequests)
      expect(update).toHaveBeenCalledTimes(1)
      expect(resp).toEqual([])
    })

    it('when unsuccessful, it does rollback', async () => {
      update.mockResolvedValue([{ error: 'this is an error' }])
      let resp = await updateRun({ getters, dispatch })

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

      let response = await getRun({ getters })

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
        ccs_analysis_output_include_low_quality_reads: 'No',
        demultiplex_barcodes: 'On Instrument',
        include_fivemc_calls_in_cpg_motifs: 'Yes',
      }

      let wellObject = await buildWell({ state }, position)

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
        ccs_analysis_output_include_low_quality_reads: 'No',
        demultiplex_barcodes: 'On Instrument',
        include_fivemc_calls_in_cpg_motifs: 'Yes',
      }

      delete state.currentRun.default_binding_kit_box_barcode
      let wellObject = await buildWell({ state }, position)

      expect(wellObject).toEqual(expectedWellObject)
    })
  })

  describe('fetchSmrtLinkVersions', () => {
    it('handles success', async () => {
      const commit = vi.fn()
      const get = vi.fn()
      const rootState = { api: { traction: { pacbio: { smrt_link_versions: { get } } } } }
      get.mockResolvedValue(Data.TractionPacbioSmrtLinkVersions)
      const { success } = await fetchSmrtLinkVersions({ commit, rootState })
      expect(commit).toHaveBeenCalledWith(
        'populateSmrtLinkVersions',
        Data.TractionPacbioSmrtLinkVersions.data.data,
      )
      expect(success).toBeTruthy()
    })

    it('handles failure', async () => {
      const commit = vi.fn()
      const get = vi.fn()
      const rootState = { api: { traction: { pacbio: { smrt_link_versions: { get } } } } }
      get.mockRejectedValue({
        data: { data: [] },
        status: 500,
        statusText: 'Internal Server Error',
      })
      // apply action
      const { success } = await fetchSmrtLinkVersions({ commit, rootState })
      // assert result (Might make sense to pull these into separate tests)
      expect(commit).not.toHaveBeenCalled()
      expect(success).toBeFalsy()
    })
  })
})
