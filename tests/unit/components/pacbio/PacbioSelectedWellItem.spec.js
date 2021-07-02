import Well from '@/components/pacbio/PacbioSelectedWellItem'
import { mount, store } from '../../testHelper'

describe('Well.vue', () => {
  let well, wrapper, props, mockWells, mockRequests

  beforeEach(() => {
    props = {
      row: 'A',
      column: '1',
      cx: '60.440327',
      cy: '75.818642',
      rx: '10.906492',
      ry: '11.032985',
      wellId: '1',
    }

    mockWells = [
      {
        attributes: {
          position: 'A1',
        },
        id: '1',
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '1',
              },
            ],
          },
        },
        type: 'wells',
      },
      {
        attributes: {
          position: 'A2',
        },
        id: '2',
        type: 'wells',
      },
    ]
    mockRequests = [
      {
        attributes: {
          sample_name: 'Sample1',
          cost_code: '12345',
          source_identifier: 'DN1:A1',
          external_study_id: '1',
        },
        id: '1',
        type: 'requests',
      },
    ]

    store.commit('traction/pacbio/poolCreate/populateWells', mockWells)
    store.commit('traction/pacbio/poolCreate/populateRequests', mockRequests)

    wrapper = mount(Well, {
      propsData: props,
      store,
    })

    well = wrapper.vm
  })

  describe('props', () => {
    it('must have a row', () => {
      expect(well.row).toEqual(props.row)
    })

    it('must have a column', () => {
      expect(well.column).toEqual(props.column)
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

    it('will have a wellId', () => {
      expect(well.wellId).toEqual(props.wellId)
    })
  })

  it('will have an ellipse with the correct attributes', () => {
    let ellipse = wrapper.find('ellipse')
    expect(ellipse.exists()).toBeTruthy()
    expect(ellipse.attributes('cx')).toEqual(well.cx)
    expect(ellipse.attributes('cy')).toEqual(well.cy)
    expect(ellipse.attributes('rx')).toEqual(well.rx)
    expect(ellipse.attributes('ry')).toEqual(well.ry)
  })

  describe('#status', () => {
    it('will be filled if the well has a request', () => {
      let ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toContain('filled')
    })

    it('will be empty when the well does not have a request', () => {
      props['wellId'] = '2'

      wrapper = mount(Well, {
        propsData: props,
        store,
      })

      let ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toContain('empty')
    })
  })

  describe('#tooltip', () => {
    it('will display the materials requests name', () => {
      let title = wrapper.find('title')
      let expected = 'Sample1'
      expect(title.text()).toEqual(expected)
    })
  })
})
