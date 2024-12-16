import { mount, store } from '@support/testHelper'
import Flowcell from '@/components/saphyr/SaphyrFlowcell'
import * as Run from '@/api/SaphyrRun.js'
import { TubeWithLibrary } from '@tests/unit/store/traction/saphyr/runs/actions.spec.js'
import { handleResponse } from '@/api/ResponseHelper.js'
import { dataToObjectById } from '@/api/JsonApi.js'

describe('Flowcell', () => {
  let wrapper, flowcell, props

  beforeEach(() => {
    const {
      state: {
        traction: {
          saphyr: { runs: saphyrRuns },
        },
      },
    } = store

    saphyrRuns.currentRun = Run.build()

    props = { index: 0, position: 1 }

    wrapper = mount(Flowcell, { store, props })
    flowcell = wrapper.vm
  })

  it('can have an index', () => {
    expect(flowcell.index).toEqual(props.index)
  })

  it('must have a position', () => {
    expect(flowcell.position).toEqual(props.position)
  })

  it('will display the position', () => {
    expect(wrapper.find('.position').text()).toMatch(new RegExp(props.position))
  })

  it('can have a library', () => {
    expect(wrapper.find('#libraryBarcode-0')).toBeTruthy()
  })

  describe('setBarcode', () => {
    let newBarcode

    beforeEach(() => {
      newBarcode = 'TRAC-1'
      flowcell.alert = vi.fn()
      flowcell.isLibraryBarcodeValid = vi.fn()
      flowcell.getTubeForBarcode = vi.fn()
      flowcell.setLibraryBarcode = vi.fn()
    })

    it('successful when barcode is valid', async () => {
      const successfulResponse = await handleResponse(TubeWithLibrary)
      const tube = Object.values(
        dataToObjectById({ data: successfulResponse.body.data.included }),
      )[0]

      flowcell.isLibraryBarcodeValid.mockReturnValue(true)
      flowcell.getTubeForBarcode.mockReturnValue(tube)

      await flowcell.setBarcode(newBarcode)
      const expected = {
        flowcellIndex: 0,
        library: {
          barcode: 'TRAC-2-21',
          id: '1',
        },
      }
      expect(flowcell.setLibraryBarcode).toBeCalledWith(expected)
      expect(flowcell.alert).not.toBeCalled()
    })

    it('is unsuccessful when chip is not valid', async () => {
      flowcell.isLibraryBarcodeValid.mockReturnValue(false)

      await flowcell.setBarcode(newBarcode)
      expect(flowcell.setLibraryBarcode).not.toBeCalled()
      expect(flowcell.alert).toBeCalled()
    })
  })

  describe('alert', () => {
    it('emits an event with the message', () => {
      flowcell.alert('emit this message', 'success')
      expect(wrapper.emitted().alert).toBeTruthy()
      expect(wrapper.emitted().alert[0][0]).toEqual('emit this message')
      expect(wrapper.emitted().alert[0][1]).toEqual('success')
    })
  })
})
