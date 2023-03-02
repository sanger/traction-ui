import * as Run from '@/api/PacbioRun'
import Well from '@/components/pacbio/PacbioRunWellItem'
import { localVue, mount, store } from '@support/testHelper'
import * as Actions from '@/store/traction/pacbio/runs/actions'
import storePools from '@tests/data/StorePools'

describe('Well.vue', () => {
  let well, wrapper, props, storeWell, run, state

  beforeEach(() => {
    props = {
      row: 'A',
      column: '1',
      cx: '60.440327',
      cy: '75.818642',
      rx: '10.906492',
      ry: '11.032985',
    }

    run = Run.build()
    run.smrt_link_version_id = 1
    state = { currentRun: run }
    storeWell = Actions.buildWell({ state }, 'A1')
    storeWell.pools = [
      { id: 1, barcode: 'TRAC-1' },
      { id: 2, barcode: 'TRAC-2' },
    ]
    storeWell.movie_time = '15'
    storeWell.on_plate_loading_concentration = 234
    storeWell.generate_hifi = 'In SMRT Link'
    storeWell.binding_kit_box_barcode = '12345'
    run.plate.wells[0] = storeWell

    const smrtLinkVersions = {
      1: { id: 1, name: 'v10', default: true },
      2: { id: 2, name: 'v11', default: false },
    }

    Object.assign(store.state.traction.pacbio.runCreate, storePools)

    store.commit('traction/pacbio/runs/setCurrentRun', run)
    store.state.traction.pacbio.runCreate.resources.smrtLinkVersions = smrtLinkVersions

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

  // TODO: same as well modal - refactor baby!
  describe('updatePoolBarcode', () => {
    let expectedWell
    const newBarcode = 'TRAC-2-1'

    it('adds the pool to the well if the well exists', async () => {
      wrapper.vm.updateWell = vi.fn()
      expectedWell = storeWell
      expectedWell.pools.push({ id: '1', barcode: 'TRAC-2-1' })

      await wrapper.vm.updatePoolBarcode(newBarcode)
      expect(wrapper.vm.updateWell).toBeCalledWith(expectedWell)
    })

    it('creates a new well if the well doesnt exist', async () => {
      props = {
        row: 'H',
        column: '12',
        cx: '60.440327',
        cy: '75.818642',
        rx: '10.906492',
        ry: '11.032985',
      }
      wrapper = mount(Well, {
        localVue,
        store,
        propsData: props,
      })
      wrapper.vm.createWell = vi.fn()
      expectedWell = Actions.buildWell({ state }, 'H12')
      expectedWell.pools.push({ id: '1', barcode: 'TRAC-2-1' })

      await wrapper.vm.updatePoolBarcode(newBarcode)

      expect(wrapper.vm.createWell).toBeCalledWith(expectedWell)
    })
  })

  describe('tooltip', () => {
    it('will only be visible if there are some pools', () => {
      const title = wrapper.find('title')
      const expected = storeWell.pools.map((p) => p.barcode).join(',')
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
