import ONTFlowcell from '@/components/ont/runs/ONTFlowcell'
import { mount, createTestingPinia, flushPromises } from '@support/testHelper'
import { describe, expect } from 'vitest'
import { useOntRunsStore } from '@/stores/ontRuns'
import { flowCellType } from '@/stores/utilities/flowCell.js'

/**
 * Helper method for mounting a component with a mock instance of pinia, with the given props.
 * This method also returns the wrapper and the store object for further testing.
 *
 * @param {*} - params to be passed to the createTestingPinia method for creating a mock instance of pinia
 * which includes
 * props - props to pass to the component
 */
function mountWithStore(props = {}) {
  const wrapperObj = mount(ONTFlowcell, {
    global: {
      plugins: [
        createTestingPinia({
          stubActions: false,
          plugins: [],
        }),
      ],
    },
    props,
  })
  const storeObj = useOntRunsStore()
  return { wrapperObj, storeObj }
}

describe('ONTFlowcell', () => {
  let wrapper, ontFlowcell, props, store

  beforeEach(async () => {
    props = {
      position: 1,
      coordinate: 'A1',
    }
    const { wrapperObj, storeObj } = mountWithStore(props)
    store = storeObj
    store.currentRun.flowcell_attributes = [
      {
        ...flowCellType(),
        position: 1,
        tube_barcode: 'TRAC-1-A',
        flowcell_id: 'ABC123',
      },
    ]
    wrapper = wrapperObj
    ontFlowcell = wrapperObj.vm
    await flushPromises()
  })

  describe('props', () => {
    it('must have a position', () => {
      expect(ontFlowcell.position).toEqual(props.position)
    })
    it('must have a coordinate', () => {
      expect(ontFlowcell.coordinate).toEqual(props.coordinate)
    })
  })

  describe('#computed', () => {
    describe('flowcellId', () => {
      it('errors if FlowcellId is not valid', async () => {
        const flowcellIdInput = wrapper.find('#flowcell-id-1')
        await flowcellIdInput.setValue('some value')
        expect(ontFlowcell.flowCell.errors.flowcell_id).toBe(
          'Enter a valid Flowcell ID (3 letters then at least 3 numbers)',
        )
      })

      it('does not error if FlowcellId is valid', async () => {
        const flowcellIdInput = wrapper.find('#flowcell-id-1')
        await flowcellIdInput.setValue('ABC123')
        expect(ontFlowcell.flowCell.errors.flowcell_id).toBe(undefined)
      })
    })

    it('#mapState', async () => {
      expect(ontFlowcell.flowcellId).toEqual('ABC123')
      expect(ontFlowcell.barcode).toEqual('TRAC-1-A')
      expect(ontFlowcell.flowcell_id_field_colour).toEqual('border-3 border-solid border-success')
      expect(ontFlowcell.flowcell_barcode_field_colour).toEqual(
        'border-3 border-solid border-success',
      )
      expect(ontFlowcell.flowcell_bg_colour).toEqual('border border-3 border-success')
    })
  })

  describe('#methods', () => {
    describe('formatter', () => {
      it('formats the string', () => {
        expect(ontFlowcell.formatter(' a StriNG    ')).toEqual('A STRING')
      })
    })

    describe('flowcellErrorsFor', () => {
      it('returns undefined if there are no errors for a given property', async () => {
        ontFlowcell.flowCell.errors = {}

        expect(ontFlowcell.flowcellErrorsFor('flowcell_id')).toBe(undefined)
      })

      it('returns the error for a given property', async () => {
        ontFlowcell.flowCell.errors = {
          flowcell_id: 'some error',
        }

        expect(ontFlowcell.flowcellErrorsFor('flowcell_id')).toBe('some error')
      })
    })
  })
})
