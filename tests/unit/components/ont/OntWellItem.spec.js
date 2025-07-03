import OntWellItem from '@/components/ont/OntWellItem.vue'
import { mountWithStore } from '@support/testHelper.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'

const requests = {
  1: {
    sample_name: 'Sample1',
    cost_code: '12345',
    source_identifier: 'DN1:A1',
    external_study_id: '1',
  },
}

const props = {
  row: 'A',
  column: '1',
  cx: '60.440327',
  cy: '75.818642',
  rx: '10.906492',
  ry: '11.032985',
  requests: ['1'],
}

const mountComponent = (props = {}, requests = []) => {
  const { wrapper } = mountWithStore(OntWellItem, {
    initialState: {
      ontPoolCreate: {
        resources: {
          requests,
        },
      },
    },
    props,
    createStore: () => useOntPoolCreateStore(),
  })
  return wrapper
}

describe('Well.vue', () => {
  let well, wrapper

  it('will have an ellipse with the correct attributes', () => {
    wrapper = mountComponent(props, requests)
    well = wrapper.vm
    const ellipse = wrapper.find('ellipse')
    expect(ellipse.exists()).toBeTruthy()
    expect(ellipse.attributes('cx')).toEqual(well.cx)
    expect(ellipse.attributes('cy')).toEqual(well.cy)
    expect(ellipse.attributes('rx')).toEqual(well.rx)
    expect(ellipse.attributes('ry')).toEqual(well.ry)
  })
  describe('#status', () => {
    it('will be filled if the well has a request', () => {
      wrapper = mountComponent(props, requests)
      const ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toContain('filled')
    })

    it('will be empty when the well does not have a request', () => {
      wrapper = mountComponent({ ...props, requests: [] }, requests)
      const ellipse = wrapper.find('ellipse')
      expect(ellipse.attributes('class')).toContain('empty')
    })
  })

  describe('#tooltip', () => {
    it('will display the materials requests name', () => {
      wrapper = mountComponent(props, requests)
      const title = wrapper.find('title')
      const expected = 'Sample1'
      expect(title.text()).toEqual(expected)
    })
  })

  describe('@click', () => {
    it('emits a click event', async () => {
      wrapper = mountComponent(props, requests)
      const ellipse = wrapper.find('ellipse')
      await ellipse.trigger('click')
      expect(wrapper.emitted().click).toBeTruthy()
    })
  })
})
