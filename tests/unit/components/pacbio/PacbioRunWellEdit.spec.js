import { mount, localVue, store } from '@support/testHelper'
import WellEdit from '@/components/pacbio/PacbioRunWellEdit'
import storePools from '@tests/data/StorePools'
import * as Run from '@/api/PacbioRun'
import * as Actions from '@/store/traction/pacbio/runs/actions'

// They are like the following in the store; not an array.
const smrtLinkVersions = {
  1: {
    id: 1,
    name: 'v10',
    default: true,
  },
  2: {
    id: 2,
    name: 'v11',
    default: false,
  },
}

describe('PacbioWellModal', () => {
  let modal, wrapper, props, storeWell, run, state

  beforeEach(() => {
    // set isStatic is true so modal is visible.
    props = { position: 'A1', isStatic: true }

    run = Run.build()
    run.smrt_link_version_id = 1
    state = { currentRun: run }
    store.state.traction.pacbio.runCreate.resources.smrtLinkVersions = smrtLinkVersions
    storeWell = Actions.buildWell({ state }, props.position)
    storeWell.pools = [{ id: 1, barcode: 'TRAC-0' }]
    run.plate.wells[0] = storeWell
    store.commit('traction/pacbio/runs/setCurrentRun', run)

    wrapper = mount(WellEdit, {
      localVue,
      store,
      propsData: props,
    })

    modal = wrapper.vm
    modal.currentWell = storeWell
  })

  it('must have a position prop', () => {
    expect(modal.position).toEqual(props.position)
  })

  it('must have movieTimeOptions data', () => {
    expect(modal.movieTimeOptions).toEqual([
      { text: 'Movie Time', value: '', disabled: true },
      '10.0',
      '15.0',
      '20.0',
      '24.0',
      '30.0',
    ])
  })

  it('must have ccsAnalysisOutputOptions data', () => {
    expect(modal.ccsAnalysisOutputOptions).toEqual(['Yes', 'No'])
  })

  it('will have a selected smrt link version', () => {
    expect(modal.selectedSmrtLinkVersion).toEqual(smrtLinkVersions[1])
  })

  describe('generateHifiOptions', () => {
    it('returns the correct options when System Name is "Sequel I"', () => {
      expect(modal.generateHifiOptions['Sequel I']).toEqual([
        { text: 'Please select a value', value: '', disabled: true },
        'In SMRT Link',
        'Do Not Generate',
      ])
    })
    it('returns the correct options when System Name is "Sequel II"', () => {
      expect(modal.generateHifiOptions['Sequel II']).toEqual([
        { text: 'Please select a value', value: '', disabled: true },
        'In SMRT Link',
        'Do Not Generate',
      ])
    })
    it('returns the correct options when System Name is "Sequel IIe"', () => {
      run.system_name = 'Sequel IIe'
      store.commit('traction/pacbio/runs/setCurrentRun', run)
      expect(modal.generateHifiOptions['Sequel IIe']).toEqual([
        { text: 'Please select a value', value: '', disabled: true },
        'In SMRT Link',
        'Do Not Generate',
        'On Instrument',
      ])
    })
  })

  it('can have getters', () => {
    expect(modal.currentRun).toBeDefined()
    expect(modal.well).toBeDefined()
    expect(modal.poolByBarcode).toBeDefined()
  })

  //["ccs_analysis_output", "generate_hifi", "on_plate_loading_concentration", "binding_kit_box_barcode", "pre_extension_time", "loading_target_p1_plus_p2", "movie_time"]
  describe('if the SMRT Link version is v10', () => {
    it('has a movie time input', () => {
      expect(wrapper.find('[data-attribute="movie-time"]').exists()).toBeTruthy()
    })

    it('has a generate hifi input', () => {
      expect(wrapper.find('[data-attribute="generate-hifi"]').exists()).toBeTruthy()
    })

    it('has a binding kit box barcode input', () => {
      expect(wrapper.find('[data-attribute="binding-kit-box-barcode"]').exists()).toBeTruthy()
    })

    it('has a pre extension time input', () => {
      expect(wrapper.find('[data-attribute="pre-extension-time"]').exists()).toBeTruthy()
    })

    it('has a loading target p1 plus p2 input', () => {
      expect(wrapper.find('[data-attribute="loading-target-p1-plus-p2"]').exists()).toBeTruthy()
    })

    it('has a CCS analysis output input', () => {
      expect(wrapper.find('[data-attribute="ccs-analysis-output"]').exists()).toBeTruthy()
    })

    it('does not have a CCS analysis output include kinetics information input', () => {
      expect(
        wrapper
          .find('[data-attribute="ccs-analysis-output-include-kinetics-information"]')
          .exists(),
      ).toBeFalsy()
    })

    it('does not have a CCS analysis output include low quality reads input', () => {
      expect(
        wrapper.find('[data-attribute="ccs-analysis-output-include-low-quality-reads"]').exists(),
      ).toBeFalsy()
    })

    it('does not have a fivemc calls in cpg motifs input', () => {
      expect(
        wrapper.find('[data-attribute="include-fivemc-calls-in-cpg-motifs"]').exists(),
      ).toBeFalsy()
    })

    it('does not have a demultiplex barcodes input', () => {
      expect(wrapper.find('[data-attribute="demultiplex-barcodes"]').exists()).toBeFalsy()
    })
  })

  /*["ccs_analysis_output_include_kinetics_information",
    "ccs_analysis_output_include_low_quality_reads",
    "include_fivemc_calls_in_cpg_motifs",
    "demultiplex_barcodes",
    "on_plate_loading_concentration",
    "binding_kit_box_barcode",
    "pre_extension_time",
    "loading_target_p1_plus_p2",
    "movie_time"]
  */
  describe('if the SMRT Link version is v11', () => {
    beforeEach(() => {
      run.smrt_link_version_id = 2
      store.state.traction.pacbio.runCreate.resources.smrtLinkVersions = smrtLinkVersions
    })

    it('will have the correct smrt link version', () => {
      expect(modal.selectedSmrtLinkVersion.name).toEqual('v11')
    })

    it('has a movie time default input', () => {
      expect(wrapper.find('[data-attribute="movie-time"]').exists()).toBeTruthy()
    })

    it('has a binding kit box barcode input', () => {
      expect(wrapper.find('[data-attribute="binding-kit-box-barcode"]').exists()).toBeTruthy()
    })

    it('has a pre extension time input', () => {
      expect(wrapper.find('[data-attribute="pre-extension-time"]').exists()).toBeTruthy()
    })

    it('has a loading target p1 plus p2 input', () => {
      expect(wrapper.find('[data-attribute="loading-target-p1-plus-p2"]').exists()).toBeTruthy()
    })

    it('has a CCS analysis output include kinetics information input', () => {
      expect(
        wrapper
          .find('[data-attribute="ccs-analysis-output-include-kinetics-information"]')
          .exists(),
      ).toBeTruthy()
    })

    it('has a CCS analysis output include low quality reads input', () => {
      expect(
        wrapper.find('[data-attribute="ccs-analysis-output-include-low-quality-reads"]').exists(),
      ).toBeTruthy()
    })

    it('has a fivemc calls in cpg motifs input', () => {
      expect(
        wrapper.find('[data-attribute="include-fivemc-calls-in-cpg-motifs"]').exists(),
      ).toBeTruthy()
    })

    it('has a demultiplex barcodes input', () => {
      expect(wrapper.find('[data-attribute="demultiplex-barcodes"]').exists()).toBeTruthy()
    })

    it('does not have a CCS analysis output input', () => {
      expect(wrapper.find('[data-attribute="ccs-analysis-output"]').exists()).toBeFalsy()
    })

    it('does not have a generate hifi input', () => {
      expect(wrapper.find('[data-attribute="generate-hifi"]').exists()).toBeFalsy()
    })
  })

  describe('alert', () => {
    it('emits an event with the message', () => {
      modal.alert('emit this message', 'success')
      expect(wrapper.emitted().alert).toBeTruthy()
      expect(wrapper.emitted().alert[0][0]).toEqual('emit this message')
      expect(wrapper.emitted().alert[0][1]).toEqual('success')
    })
  })

  describe('methods', () => {
    describe('updatePoolBarcode', () => {
      let newBarcode, row, poolId, poolObject

      beforeEach(() => {
        newBarcode = 'TRAC-2-1'
        poolId = '1'
        row = { index: 0 }
        poolObject = { id: 10, barcode: 'oldBarcode' }
        modal.currentWell.pools[0] = poolObject
        modal.showAlert = vi.fn()
        store.state.traction.pacbio.pools = storePools
      })

      it('successful when barcode is valid', async () => {
        await modal.updatePoolBarcode(row, newBarcode)

        expect(modal.currentWell.pools[0]).toEqual({ id: poolId, barcode: newBarcode })
      })

      it('is unsuccessful when barcode is not valid', async () => {
        await modal.updatePoolBarcode(row, 'invalidBarcode')

        expect(modal.currentWell.pools[0]).toEqual(poolObject) // Make sure the targeted row has not changed
        expect(modal.showAlert).toBeCalledWith('Pool is not valid', 'danger')
      })
    })

    describe('addRow', () => {
      it('adds an empty pool to the currentWell', () => {
        const expectedPools = [...modal.currentWell.pools, { id: '', barcode: '' }]
        modal.addRow()
        expect(modal.currentWell.pools).toEqual(expectedPools)
      })
    })

    describe('removeRow', () => {
      it('removes an pool from the currentWell', () => {
        storeWell.pools = [
          { id: '1', barcode: 'TRAC-1' },
          { id: '2', barcode: 'TRAC-2' },
          { id: '3', barcode: 'TRAC-3' },
        ]
        wrapper.setData({ currentWell: storeWell })
        modal.removeRow(0)
        expect(modal.currentWell.pools).toEqual([
          { id: '2', barcode: 'TRAC-2' },
          { id: '3', barcode: 'TRAC-3' },
        ])
      })
    })

    describe('showModalForPosition', () => {
      it('creates a well object if its a new well', () => {
        props = { position: 'H12' }
        wrapper = mount(WellEdit, {
          localVue,
          store,
          propsData: props,
        })
        modal = wrapper.vm
        modal.buildWell = vi.fn()
        modal.buildWell.mockReturnValue({})

        modal.showModalForPosition()

        expect(modal.buildWell).toBeCalled()
      })

      it('gets the well if its an existing well', () => {
        const well = modal.well(props.position)

        modal.showModalForPosition()

        expect(modal.currentWell).toEqual(well)
      })
    })

    describe('update', () => {
      beforeEach(() => {
        modal.checkPools = vi.fn()
        modal.createWell = vi.fn()
        modal.updateWell = vi.fn()
        modal.showAlert = vi.fn()
        modal.alert = vi.fn()
      })

      it('calls createWell when and shows success alert when action is create', async () => {
        wrapper.setData({ action: { id: 'createBtn', variant: 'success', label: 'Create' } })
        modal.checkPools.mockReturnValue(true)

        await modal.update()

        expect(modal.createWell).toBeCalled()
        expect(modal.alert).toBeCalledWith('Well created', 'success')
      })

      it('calls updateWell when and shows success alert when action is update', async () => {
        wrapper.setData({ action: { id: 'updateBtn', variant: 'success', label: 'Update' } })
        modal.checkPools.mockReturnValue(true)

        await modal.update()

        expect(modal.updateWell).toBeCalled()
        expect(modal.alert).toBeCalledWith('Well updated', 'success')
      })

      it('shows failure alert when pools are not valid', async () => {
        wrapper.setData({ action: { id: 'updateBtn', variant: 'success', label: 'Update' } })
        modal.checkPools.mockReturnValue(false)

        await modal.update()

        expect(modal.showAlert).toBeCalledWith('Pool is not valid', 'danger')
      })
    })

    describe('removeWell', () => {
      it('deletes the well at the given position', () => {
        modal.deleteWell = vi.fn()
        modal.alert = vi.fn()

        modal.removeWell()

        expect(modal.deleteWell).toBeCalledWith(modal.currentWell)
        expect(modal.alert).toBeCalledWith('Well successfully deleted', 'success')
      })
    })

    describe('checkPools', () => {
      it('returns true if all the pools exist', async () => {
        store.state.traction.pacbio.pools = storePools
        storeWell.pools = [
          { id: '1', barcode: 'TRAC-2-1' },
          { id: '2', barcode: 'TRAC-2-2' },
        ]
        wrapper.setData({ currentWell: storeWell })

        expect(await modal.checkPools()).toEqual(true)
      })

      it('returns false if one or more pools do not exist', async () => {
        store.state.traction.pacbio.pools = storePools
        storeWell.pools = [
          { id: '1', barcode: 'TRAC-2-0' },
          { id: '2', barcode: 'TRAC-2-2' },
        ]
        wrapper.setData({ currentWell: storeWell })

        expect(await modal.checkPools()).toEqual(false)
      })
    })

    describe('updateCCSAnalysisOutput', () => {
      it('sets ccs_analysis_ouput to "No" when generate_hifi is set to "Do Not Generate"', () => {
        storeWell.generate_hifi = 'Do Not Generate'
        storeWell.ccs_analysis_output = 'Yes'
        wrapper.setData({ currentWell: storeWell })

        modal.updateCCSAnalysisOutput()

        expect(modal.currentWell.ccs_analysis_output).toEqual('No')
      })

      it('does not change ccs_analysis_ouput when generate_hifi is set to other values', () => {
        storeWell.generate_hifi = 'On Instrument'
        storeWell.ccs_analysis_output = 'Yes'
        wrapper.setData({ currentWell: storeWell })

        modal.updateCCSAnalysisOutput()

        expect(modal.currentWell.ccs_analysis_output).toEqual('Yes')
      })
    })
  })
})
