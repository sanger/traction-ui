import { mount, localVue, store } from 'testHelper'
import WellEdit from '@/components/pacbio/PacbioRunWellEdit'
import storePools from '@tests/data/StorePools'
import * as Run from '@/api/PacbioRun'
import * as Actions from '@/store/traction/pacbio/runs/actions'

describe('PacbioWellModal', () => {
  let modal, wrapper, props, storeWell, run, state

  beforeEach(() => {
    props = { position: 'A1' }

    run = Run.build()
    state = { currentRun: run }
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

  describe('form elements', () => {
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
    it('has a updateBtn', () => {
      expect(wrapper.find('#updateBtn')).toBeDefined()
    })
    it('has a removeWellBtn', () => {
      expect(wrapper.find('#removeWellBtn')).toBeDefined()
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
        modal.showAlert = jest.fn()
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
        let expectedPools = [...modal.currentWell.pools, { id: '', barcode: '' }]
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
        modal.buildWell = jest.fn()
        modal.buildWell.mockReturnValue({})

        modal.showModalForPosition()

        expect(modal.buildWell).toBeCalled()
      })

      it('gets the well if its an existing well', () => {
        let well = modal.well(props.position)

        modal.showModalForPosition()

        expect(modal.currentWell).toEqual(well)
      })
    })

    describe('update', () => {
      beforeEach(() => {
        modal.checkPools = jest.fn()
        modal.createWell = jest.fn()
        modal.updateWell = jest.fn()
        modal.showAlert = jest.fn()
        modal.alert = jest.fn()
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
        modal.deleteWell = jest.fn()
        modal.alert = jest.fn()

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
