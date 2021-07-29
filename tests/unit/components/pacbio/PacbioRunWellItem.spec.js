import * as Run from '@/api/PacbioRun'
import Well from '@/components/pacbio/PacbioRunWellItem'
import { localVue, mount, store } from 'testHelper'

describe('Well.vue', () => {
  let well, wrapper, props, storeWell, run

  beforeEach(() => {
    props = {
      row: 'A',
      column: '1',
      cx: '60.440327',
      cy: '75.818642',
      rx: '10.906492',
      ry: '11.032985',
    }

    storeWell = Run.buildWell(props.row, props.column, 'In SMRT Link', '2', '')
    storeWell.pools = [
      { id: 1, barcode: 'TRAC-1' },
      { id: 2, barcode: 'TRAC-2' },
    ]
    storeWell.movie_time = '15'
    storeWell.insert_size = 123
    storeWell.on_plate_loading_concentration = 234
    storeWell.generate_hifi = 'In SMRT Link'
    storeWell.binding_kit_box_barcode = '12345'

    run = Run.build()
    run.plate.wells[0] = storeWell

    store.commit('traction/pacbio/runs/setCurrentRun', run)

    wrapper = mount(Well, {
      localVue,
      store,
      propsData: props,
      stubs: {
        WellModal: true,
      },
    })

    well = wrapper.vm
  })

  it('will be defined', () => {
    expect(well).toBeDefined()
  })

  it('must have a row', () => {
    expect(well.row).toEqual(props.row)
  })

  it('must have a column', () => {
    expect(well.column).toEqual(props.column)
  })

  it('will have position', () => {
    expect(well.position).toEqual('A1')
  })

  it('must have a cx', () => {
    expect(well.cx).toEqual(props.cx)
  })

  it('must have a cy', () => {
    expect(well.cy).toEqual(props.cy)
  })

  it('must have a rx', () => {
    expect(well.rx).toEqual(props.rx)
  })

  it('must have a ry', () => {
    expect(well.ry).toEqual(props.ry)
  })

  it('must have a ry', () => {
    expect(well.required_metadata_fields).toEqual([
      'movie_time',
      'insert_size',
      'on_plate_loading_concentration',
      'binding_kit_box_barcode',
    ])
  })

  it('will have an ellipse with the correct attributes', () => {
    let ellipse = wrapper.find('ellipse')
    expect(ellipse.exists()).toBeTruthy()
    expect(ellipse.attributes('cx')).toEqual(well.cx)
    expect(ellipse.attributes('cy')).toEqual(well.cy)
    expect(ellipse.attributes('rx')).toEqual(well.rx)
    expect(ellipse.attributes('ry')).toEqual(well.ry)
  })

  describe('status', () => {
    it('will be valid if it is complete', () => {
      let ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toContain('complete')
    })

    it('will be invalid if there is any missing meta data', () => {
      storeWell.movie_time = ''
      wrapper = mount(Well, {
        localVue,
        store,
        propsData: props,
        stubs: {
          WellModal: true,
        },
      })
      let ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toEqual('filled')
    })

    it('will be invalid if there are no pools in the store', () => {
      storeWell.pools = []
      wrapper = mount(Well, {
        localVue,
        store,
        propsData: props,
        stubs: {
          WellModal: true,
        },
      })
      let ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toEqual('filled')
    })

    it('will be valid if pre extension time is present', () => {
      wrapper = mount(Well, {
        localVue,
        store,
        propsData: props,
        stubs: {
          WellModal: true,
        },
      })
      let ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toEqual('complete')
    })

    it('will be empty if there are no pools or metadata', () => {
      storeWell.pools = []
      storeWell.movie_time = ''
      storeWell.generate_hifi = ''
      storeWell.ccs_analysis_output = ''
      storeWell.on_plate_loading_concentration = ''
      storeWell.insert_size = ''
      storeWell.pre_extension_time = ''
      storeWell.binding_kit_box_barcode = ''

      wrapper = mount(Well, {
        localVue,
        store,
        propsData: props,
        stubs: {
          WellModal: true,
        },
      })

      let ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toEqual('empty')
    })
  })

  // TODO: same as well modal - refactor baby!
  describe('updatePoolBarcode', () => {
    let newBarcode, pool1, pool2, tubes

    beforeEach(() => {
      newBarcode = 'TRAC-1'
      well.addPoolToWell = jest.fn()
      pool1 = { id: '1', libraries: [], tube: '1', barcode: 'TRAC-1', type: 'pools' }
      pool2 = { id: '2', libraries: [], tube: '2', barcode: 'TRAC-2', type: 'pools' }
      tubes = {
        '1': { barcode: 'TRAC-1', id: '1', type: 'tubes' },
        '2': { barcode: 'TRAC-2', id: '2', type: 'tubes' },
      }

      store.state.traction.pacbio.pools.pools = { '1': pool1, '2': pool2 }
      store.state.traction.pacbio.pools.tubes = tubes
    })

    it('adds the pool to the well', async () => {
      await well.updatePoolBarcode(newBarcode)
      expect(well.addPoolToWell).toBeCalledWith({
        position: well.position,
        with: { id: pool1.id, barcode: pool1.barcode },
      })
    })
  })

  describe('tooltip', () => {
    it('will only be visible if there are some pools', () => {
      let title = wrapper.find('title')
      let expected = storeWell.pools.map((p) => p.barcode).join(',')
      expect(title.text()).toEqual(expected)
    })
  })

  describe('drag and drop', () => {
    let mockEvent, newBarcode

    beforeEach(() => {
      newBarcode = 'TRAC-1'
      mockEvent = {
        dataTransfer: {
          getData() {
            return newBarcode
          },
        },
        preventDefault: jest.fn(),
      }
      well.updatePoolBarcode = jest.fn()
    })

    it('will update the barcode', async () => {
      well.drop(mockEvent)
      expect(well.updatePoolBarcode).toBeCalledWith(newBarcode)
    })
  })
})
