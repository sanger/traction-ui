import { mount, localVue, store } from 'testHelper'
import WellEdit from '@/components/pacbio/PacbioRunWellEdit'
import storePools from '@tests/data/StorePools'
import * as Run from '@/api/PacbioRun'

describe('PacbioWellModal', () => {
  let modal, wrapper, props, storeWell, run

  beforeEach(() => {
    props = { row: 'A', column: '1', position: 'A1' }

    storeWell = Run.buildWell(props.row, props.column, 'In SMRT Link')
    storeWell.pools = [{ id: 1, barcode: 'TRAC-0' }]

    run = Run.build()
    run.plate.wells[0] = storeWell

    store.commit('traction/pacbio/runs/setCurrentRun', run)

    wrapper = mount(WellEdit, {
      localVue,
      store,
      propsData: props,
    })
    modal = wrapper.vm
  })

  it('must have a position prop', () => {
    expect(modal.position).toEqual(props.position)
  })

  it('must have movieTimeOptions data', () => {
    expect(modal.movieTimeOptions).toEqual([
      { text: 'Movie Time', value: '' },
      '15.0',
      '20.0',
      '24.0',
      '30.0',
    ])
  })

  it('must have ccsAnalysisOutputOptions data', () => {
    expect(modal.ccsAnalysisOutputOptions).toEqual(['Yes', 'No'])
  })

  describe('generateHifiOptions', () => {
    it('returns the correct options when System Name is "Sequel I"', () => {
      expect(modal.generateHifiOptions['Sequel I']).toEqual(['In SMRT Link', 'Do Not Generate'])
    })
    it('returns the correct options when System Name is "Sequel II"', () => {
      expect(modal.generateHifiOptions['Sequel II']).toEqual(['In SMRT Link', 'Do Not Generate'])
    })
    it('returns the correct options when System Name is "Sequel IIe"', () => {
      run.system_name = 'Sequel IIe'
      store.commit('traction/pacbio/runs/setCurrentRun', run)
      expect(modal.generateHifiOptions['Sequel IIe']).toEqual([
        'In SMRT Link',
        'Do Not Generate',
        'On Instrument',
      ])
    })
  })

  it('can have mapState', () => {
    expect(modal.onPlateLoadingConc).toBeDefined()
    expect(modal.movieTime).toBeDefined()
    expect(modal.wellPools).toBeDefined()
    expect(modal.generateHiFi).toBeDefined()
    expect(modal.ccsAnalysisOutput).toBeDefined()
    expect(modal.preExtensionTime).toBeDefined()
    expect(modal.ccsAnalysisOutput).toBeDefined()
    expect(modal.bindingKitBoxBarcode).toBeDefined()
  })

  it('can have getters', () => {
    expect(modal.currentRun).toBeDefined()
  })

  // TODO: check below tests are they are buggy and return ErrorWrapper
  describe('form inputs', () => {
    it('has a Pool Barcode input', () => {
      expect(wrapper.find('.poolBarcode')).toBeDefined()
    })
    it('has a Movie Time input', () => {
      expect(wrapper.find('.movieTime')).toBeDefined()
    })
    it('has a On Plate Loading Concentration input', () => {
      expect(wrapper.find('.onPlateLoadingConc')).toBeDefined()
    })
    it('has a Generate HiFi input', () => {
      expect(wrapper.find('.generateHiFi')).toBeDefined()
    })
    it('has a CCS Analysis Output input', () => {
      expect(wrapper.find('.ccsAnalysisOutput')).toBeDefined()
    })
    it('has a table of well pools', () => {
      expect(wrapper.find('#wellPools')).toBeDefined()
    })
    it('has a pre-extension time input', () => {
      expect(wrapper.find('.preExtensionTime')).toBeDefined()
    })
    it('has a bindingKitBoxBarcode', () => {
      expect(wrapper.find('.bindingKitBoxBarcode')).toBeDefined()
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
    beforeEach(() => {
      modal.mutateWell = jest.fn()
    })

    it('updateOnPlateLoadingConc', () => {
      modal.updateOnPlateLoadingConc(123)
      expect(modal.mutateWell).toBeCalledWith({
        position: props.position,
        property: 'on_plate_loading_concentration',
        with: 123,
      })
    })

    it('updateMovieTime', () => {
      modal.updateMovieTime(123)
      expect(modal.mutateWell).toBeCalledWith({
        position: props.position,
        property: 'movie_time',
        with: 123,
      })
    })

    it("updateGenerateHiFi with 'Do Not Generate'", () => {
      modal.updateGenerateHiFi('Do Not Generate')
      expect(modal.mutateWell).toBeCalledWith({
        position: props.position,
        property: 'generate_hifi',
        with: 'Do Not Generate',
      })
      expect(modal.mutateWell).toBeCalledWith({
        position: props.position,
        property: 'ccs_analysis_output',
        with: 'No',
      })
    })

    it("updateGenerateHiFi with 'In SMRT Link' or 'On Instrument'", () => {
      modal.updateGenerateHiFi('In SMRT Link')
      expect(modal.mutateWell).toBeCalledWith({
        position: props.position,
        property: 'generate_hifi',
        with: 'In SMRT Link',
      })
      expect(modal.mutateWell).toBeCalledWith({
        position: props.position,
        property: 'ccs_analysis_output',
        with: 'Yes',
      })
    })

    it('updateCCSAnalysisOuput', () => {
      modal.updateCCSAnalysisOutput('Yes')
      expect(modal.mutateWell).toBeCalledWith({
        position: props.position,
        property: 'ccs_analysis_output',
        with: 'Yes',
      })
    })

    it('updatePreExtensionTime', () => {
      modal.updatePreExtensionTime('2')
      expect(modal.mutateWell).toBeCalledWith({
        position: props.position,
        property: 'pre_extension_time',
        with: '2',
      })
    })

    it('updateBindingKitBoxBarcode', () => {
      modal.updateBindingKitBoxBarcode('12345')
      expect(modal.mutateWell).toBeCalledWith({
        position: props.position,
        property: 'binding_kit_box_barcode',
        with: '12345',
      })
    })

    describe('updatePoolBarcode', () => {
      let newBarcode, row, anIndex, poolId

      beforeEach(() => {
        newBarcode = 'TRAC-2-1'
        anIndex = 1
        row = { index: anIndex }
        modal.showAlert = jest.fn()
        modal.isPoolBarcodeValid = jest.fn()
        modal.addPoolToWell = jest.fn()
        poolId = '1'
        store.state.traction.pacbio.pools = storePools
      })

      it('successful when barcode is valid', async () => {
        modal.isPoolBarcodeValid.mockReturnValue(true)

        await modal.updatePoolBarcode(row, newBarcode)

        expect(modal.addPoolToWell).toBeCalledWith({
          index: anIndex,
          position: props.position,
          with: { id: poolId, barcode: newBarcode },
        })
        expect(modal.showAlert).toBeCalledWith('Pool is valid', 'success')
      })

      it('is unsuccessful when barcode is not valid', async () => {
        modal.isPoolBarcodeValid.mockReturnValue(false)

        await modal.updatePoolBarcode(newBarcode)
        expect(modal.addPoolToWell).not.toBeCalled()
        expect(modal.showAlert).toBeCalledWith('Pool is not valid', 'danger')
      })
    })

    describe('showCCSAnalysisOutput', () => {
      it('is true when generate_hifi_reads==="On Instrument"', () => {
        storeWell = Run.buildWell(props.row, props.column, 'On Instrument')
        run = Run.build()
        run.plate.wells[0] = storeWell

        store.commit('traction/pacbio/runs/setCurrentRun', run)
        expect(modal.showCCSAnalysisOutput).toEqual(true)
      })

      it('is true when generate_hifi_reads==="In SMRT Link"', () => {
        storeWell = Run.buildWell(props.row, props.column, 'In SMRT Link')
        run = Run.build()
        run.plate.wells[0] = storeWell

        store.commit('traction/pacbio/runs/setCurrentRun', run)
        expect(modal.showCCSAnalysisOutput).toEqual(true)
      })

      it('is false generate_hifi_reads==="Do Not Generate"', () => {
        storeWell = Run.buildWell(props.row, props.column, 'Do Not Generate')
        run = Run.build()
        run.plate.wells[0] = storeWell

        store.commit('traction/pacbio/runs/setCurrentRun', run)
        expect(modal.showCCSAnalysisOutput).toEqual(false)
      })
    })
  })
})
