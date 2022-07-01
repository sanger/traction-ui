import { mount, localVue, store } from '@support/testHelper'
import GeneralReception from '@/views/GeneralReception.vue'
import { expect } from 'vitest'

const receptionComponent = {
  name: 'ExampleComponent',
  props: ['title'],
  render(h) {
    return h('div', `Rendering ${this.title} Component`)
  },
}

const Receptions = [
  {
    name: 'Sequencescape',
    component: receptionComponent,
    props: {
      title: 'Sequencescape',
    },
  },
  {
    name: 'Samples Extraction',
    component: receptionComponent,
    props: {
      title: 'Samples Extraction',
    },
  },
]

describe('GeneralReception', () => {
  const buildWrapper = (props = { receptions: Receptions }) => {
    return mount(GeneralReception, {
      localVue,
      propsData: props,
      store,
    })
  }

  it('generates a wrapper', () => {
    const wrapper = buildWrapper()
    expect(wrapper).toBeTruthy()
  })

  it('lists receptions', () => {
    const wrapper = buildWrapper()
    expect(wrapper.text()).toContain('Sequencescape')
    expect(wrapper.text()).toContain('Samples Extraction')
  })

  it('shows the first reception by default', () => {
    const wrapper = buildWrapper()
    expect(wrapper.text()).toContain('Rendering Sequencescape Component')
  })

  it('lets you switch betweeen components', async () => {
    const wrapper = buildWrapper()
    await wrapper.get('menu').findAll('li').at(1).trigger('click')
    expect(wrapper.text()).toContain('Rendering Samples Extraction Component')
  })

  it('communicates the state of child components', async () => {
    const wrapper = buildWrapper()
    await wrapper
      .findComponent(receptionComponent)
      .vm.$emit('importStarted', { message: 'Starting import' })

    expect(wrapper.text()).toContain('Starting import')
  })

  it('handles a failed import', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = buildWrapper()
    // We've begun the import
    await wrapper
      .findComponent(receptionComponent)
      .vm.$emit('importStarted', { message: 'Starting import' })
    // But it fails
    await wrapper
      .findComponent(receptionComponent)
      .vm.$emit('importFailed', { message: 'Failed import' })

    expect(wrapper.text()).not.toContain('Starting import')
    expect(Object.values(store.state.traction.messages)).toContainEqual({
      type: 'danger',
      message: 'Failed import',
    })
  })

  it('handles a successful import', async () => {
    const wrapper = buildWrapper()
    // We've begun the import
    await wrapper
      .findComponent(receptionComponent)
      .vm.$emit('importStarted', { message: 'Starting import' })
    // But it fails
    await wrapper
      .findComponent(receptionComponent)
      .vm.$emit('importLoaded', { requestAttributes: [], source: 'sequencescape' })

    expect(wrapper.text()).not.toContain('Starting import')
  })
})
