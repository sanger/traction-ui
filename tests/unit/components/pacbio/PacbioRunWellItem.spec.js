import Well from '@/components/pacbio/PacbioRunWellItem'
import { localVue, mount, store } from '@support/testHelper'
import * as Run from '@/store/traction/pacbio/runCreate/run'
import storePools from '@tests/data/StorePools'

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

    const smrtLinkVersions = {
      1: { id: 1, name: 'v11', default: true },
    }

    run = Run.newRun()
    run.smrtLinkVersion = smrtLinkVersions[0]
    storeWell = {
      position: 'A1',
      pools: ['1', '2'],
      on_plate_loading_concentration: 234,
      movie_time: 15,
      generate_hifi: 'In SMRT Link',
      binding_kit_box_barcode: '12345',
    }
    // store.state.traction.pacbio.runCreate.pools = storePools.pools
    // store.state.traction.pacbio.runCreate.tubes = storePools.tubes
    // store.state.traction.pacbio.runCreate.libraries = storePools.libraries
    // store.state.traction.pacbio.runCreate.tags = storePools.tags
    // store.state.traction.pacbio.runCreate.requests = storePools.libraries
    // store.state.traction.pacbio.runCreate.wells = { A1: storeWell }
    // store.state.traction.pacbio.runCreate.run = run
    // store.state.traction.pacbio.runCreate.resources.smrtLinkVersions = smrtLinkVersions

    store.state.traction.pacbio.runCreate = {
      ...storePools,
      wells: { A1: storeWell },
      run,
      resources: { smrtLinkVersions },
    }

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
      'on_plate_loading_concentration',
      'binding_kit_box_barcode',
      'generate_hifi',
    ])
  })

  it('will have an ellipse with the correct attributes', () => {
    const ellipse = wrapper.find('ellipse')
    expect(ellipse.exists()).toBeTruthy()
    expect(ellipse.attributes('cx')).toEqual(well.cx)
    expect(ellipse.attributes('cy')).toEqual(well.cy)
    expect(ellipse.attributes('rx')).toEqual(well.rx)
    expect(ellipse.attributes('ry')).toEqual(well.ry)
  })

  describe('status', () => {
    it('will be valid if it is complete', () => {
      const ellipse = wrapper.find('ellipse')
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
      const ellipse = wrapper.find('ellipse')
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
      const ellipse = wrapper.find('ellipse')
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
      const ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toEqual('complete')
    })

    it('will be empty if there are no pools or metadata', () => {
      storeWell.pools = []
      storeWell.movie_time = ''
      storeWell.generate_hifi = ''
      storeWell.ccs_analysis_output = ''
      storeWell.on_plate_loading_concentration = ''
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

      const ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toEqual('empty')
    })
  })

  describe('updatePoolBarcode', () => {
    let expectedWell
    const newBarcode = 'TRAC-2-1'

    it('adds the pool to the well', async () => {
      wrapper.vm.updateWell = vi.fn()
      expectedWell = storeWell
      expectedWell.pools.push('1')

      await wrapper.vm.updatePoolBarcode(newBarcode)
      expect(wrapper.vm.updateWell).toBeCalledWith(expectedWell)
    })
  })

  describe('tooltip', () => {
    it('will only be visible if there are some pools', () => {
      const title = wrapper.find('title')
      // Barcodes of the tubes the store pools relate to
      const expected = 'TRAC-2-1,TRAC-2-2'
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
        preventDefault: vi.fn(),
      }
      well.updatePoolBarcode = vi.fn()
    })

    it('will update the barcode', async () => {
      well.drop(mockEvent)
      expect(well.updatePoolBarcode).toBeCalledWith(newBarcode)
    })
  })
})
