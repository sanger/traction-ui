import { mount, localVue, store } from '../../testHelper'
import WellModal from '@/components/pacbio/PacbioWellModal'
import * as Run from '@/api/PacbioRun'

describe('PacbioRunInfo', () => {
  let modal, wrapper, props, storeWell, run

  beforeEach(() => {
    props = { row: 'A', column: '1', position: 'A1' }

    storeWell = Run.buildWell(props.row, props.column)
    storeWell.libraries = [{ barcode: 'TRAC-0' }]

    run = Run.build()
    run.plate.wells[0] = storeWell

    store.commit('traction/pacbio/runs/setCurrentRun', run)

    wrapper = mount(WellModal, {
      localVue,
      store,
      propsData: props
    })
    modal = wrapper.vm
  })

  it('must have a position prop', () => {
    expect(modal.position).toEqual(props.position)
  })

  it('must have movieTimeOptions data', () => {
    expect(modal.movieTimeOptions).toEqual([{ text: 'Movie Time', value: "" }, "15.0", "20.0", "24.0", "30.0"])
  })

  describe('systemNameHifiOptions', () => {
    it('returns the correct options when System Name is "Sequel I"', () => {
      expect(modal.systemNameHifiOptions["Sequel I"]).toEqual(['In SMRT Link', 'Do Not Generate'])
    })
    it('returns the correct options when System Name is "Sequel II"', () => {
      expect(modal.systemNameHifiOptions["Sequel II"]).toEqual(['In SMRT Link', 'Do Not Generate'])
    })
    it('returns the correct options when System Name is "Sequel IIe"', () => {
      run.system_name = "Sequel IIe"
      store.commit('traction/pacbio/runs/setCurrentRun', run)
      expect(modal.systemNameHifiOptions["Sequel IIe"]).toEqual(['In SMRT Link', 'Do Not Generate', 'On Instrument'])
    })
  })

  it('must have cssAnalysisOptions data', () => {
    expect(modal.ccsAnalysisOptions).toEqual([{ text: 'CCS Analysis Output', value: "" }, 'Yes', 'No'])
  })

  it('can have mapState', () => {
    expect(modal.insertSize).toBeDefined()
    expect(modal.onPlateLoadingConc).toBeDefined()
    expect(modal.movieTime).toBeDefined()
    expect(modal.wellLibraries).toBeDefined()
    expect(modal.generateHiFi).toBeDefined()
    expect(modal.ccsAnalysisOutput).toBeDefined()
    expect(modal.preExtensionTime).toBeDefined()
  })

  it('can have getters', () => {
    expect(modal.currentRun).toBeDefined()
  })

  // TODO: check below tests are they are buggy and return ErrorWrapper
  describe('form inputs', () => {
    it('has a Library Barcode input', () => {
      expect(wrapper.find('.libraryBarcode')).toBeDefined()
    })
    it('has a Movie Time input', () => {
      expect(wrapper.find('.movieTime')).toBeDefined()
    })
    it('has a On Plate Loading Concentration input', () => {
      expect(wrapper.find('.onPlateLoadingConc')).toBeDefined()
    })
    it('has a Insert Size input', () => {
      expect(wrapper.find('.insertSize')).toBeDefined()
    })
    it('has a Generate HiFi input', () => {
      expect(wrapper.find('.generateHiFi')).toBeDefined()
    })
    it('has a CCS Analysis Output input', () => {
      expect(wrapper.find('.ccsAnalysisOutput')).toBeDefined()
    })
    it('has a table of well libraries', () => {
      expect(wrapper.find('#wellLibraries')).toBeDefined()
    })
    it('has a pre-extension time input', () => {
      expect(wrapper.find('.preExtensionTime')).toBeDefined()
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

    it('updateInsertSize', () => {
      modal.updateInsertSize(123)
      expect(modal.mutateWell).toBeCalledWith({ position: props.position, property: 'insert_size', with: 123})
    })

    it('updateOnPlateLoadingConc', () => {
      modal.updateOnPlateLoadingConc(123)
      expect(modal.mutateWell).toBeCalledWith({ position: props.position, property: 'on_plate_loading_concentration', with: 123 })
    })

    it('updateMovieTime', () => {
      modal.updateMovieTime(123)
      expect(modal.mutateWell).toBeCalledWith({ position: props.position, property: 'movie_time', with: 123 })
    })

    it('updateGenerateHiFi', () => {
      modal.updateGenerateHiFi('In SMRT Link')
      expect(modal.mutateWell).toBeCalledWith({ position: props.position, property: 'generate_hifi', with: 'In SMRT Link' })
      expect(modal.mutateWell).toBeCalledWith({ position: props.position, property: 'ccs_analysis_output', with: '' })
    })

    it('updateCCSAnalysisOuput', () => {
      modal.updateCCSAnalysisOutput('Yes')
      expect(modal.mutateWell).toBeCalledWith({ position: props.position, property: 'ccs_analysis_output', with: 'Yes' })
    })

    it('updatePreExtensionTime', () => {
      modal.updatePreExtensionTime('2')
      expect(modal.mutateWell).toBeCalledWith({ position: props.position, property: 'pre_extension_time', with: '2' })
    })

    describe('updateLibraryBarcode', () => {
      let newBarcode, row, anIndex, library

      beforeEach(() => {
        newBarcode = 'TRAC-1'
        anIndex = 1
        row = { index: anIndex}
        modal.showAlert = jest.fn()
        modal.isLibraryBarcodeValid = jest.fn()
        modal.addLibraryToWell = jest.fn()
        library = { id: 1, barcode: newBarcode }
        store.commit('traction/pacbio/libraries/setLibraries', [library])
      })

      it('successful when barcode is valid', async () => {
        modal.isLibraryBarcodeValid.mockReturnValue(true)

        await modal.updateLibraryBarcode(row, newBarcode)

        expect(modal.addLibraryToWell).toBeCalledWith({ index: anIndex, position: props.position, with: { id: library.id, barcode: library.barcode } })
        expect(modal.showAlert).toBeCalledWith('Library is valid', 'success')
      })

      it('is unsuccessful when barcode is not valid', async () => {
        modal.isLibraryBarcodeValid.mockReturnValue(false)

        await modal.updateLibraryBarcode(newBarcode)
        expect(modal.addLibraryToWell).not.toBeCalled()
        expect(modal.showAlert).toBeCalledWith('Library is not valid', 'danger')
      })
    })
  })
})
