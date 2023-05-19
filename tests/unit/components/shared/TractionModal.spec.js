import { localVue, mount } from '@support/testHelper'

import TractionModal from '@/components/shared/TractionModal'

import TractionButton from '@/components/shared/TractionButton'
/**
 * Note:- Modal dialog is a teleported Vue component, which doesn't appear in the actual DOM, so testing
 * the HTML content returns nothing. So we need to use findComponent method to check in virtual DOM
 * which will only return Vue components, not regular html elements
 */

describe('TractionModal.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionModal, {
      localVue,
      propsData: props,
      slots: {
        default: 'Modal Content',
      },
    })
  }

  it('displays the dialog and content', () => {
    const wrapper = buildWrapper({ visible: true })
    const modal = wrapper.findComponent(TractionModal)
    expect(modal).not.toBeNull()
    expect(modal.text()).toContain('Modal Content')
  })
  it('displays the title prop', () => {
    const wrapper = buildWrapper({ visible: true, title: 'Heading' })
    const modal = wrapper.findComponent(TractionModal)
    expect(modal).not.toBeNull()
    expect(modal.text()).toContain('Heading')
  })
  it('displays close button', async () => {
    const wrapper = buildWrapper({ visible: true, title: 'Heading' })
    const modal = wrapper.findComponent(TractionModal)
    expect(wrapper.vm.display).toBe(true)
    const closebutton = modal.findComponent('[data-attribute=close]')
    expect(closebutton.exists()).toBe(true)
    await closebutton.trigger('click')
    expect(wrapper.emitted()).toBeTruthy()
    expect(wrapper.vm.display).toBe(false)
  })
  it(' displays header component using modal-header slot', () => {
    const buildModalWrapper = (props = {}) => {
      return mount(TractionModal, {
        localVue,
        propsData: { ...props, visible: true },
        components: { 'traction-button': TractionButton },
        slots: {
          'modal-header': '<div data-testid="header-div">Heading</div>',
        },
      })
    }
    const modalWrapper = buildModalWrapper()
    const modal = modalWrapper.findComponent(TractionModal)
    expect(modal.exists()).toBe(true)
    const headingComp = modal.findComponent('[data-testid=header-div]')
    expect(headingComp.exists()).toBe(true)
  })
  it(' displays title component using "modal-title" slot', () => {
    const buildModalWrapper = (props = {}) => {
      return mount(TractionModal, {
        localVue,
        propsData: { ...props, visible: true },
        slots: {
          'modal-title': '<div data-testid="title-div"/>',
        },
      })
    }
    const modalWrapper = buildModalWrapper()
    const modal = modalWrapper.findComponent(TractionModal)
    expect(modal.findComponent('[data-testid=title-div]').exists()).toBe(true)
  })
  it(' displays footer component using "modal-footer" slot', () => {
    const buildModalWrapper = (props = {}) => {
      return mount(TractionModal, {
        localVue,
        propsData: { ...props, visible: true },
        slots: {
          'modal-footer': '<div data-testid="footer-div"/>',
        },
      })
    }
    const modalWrapper = buildModalWrapper()
    const modal = modalWrapper.findComponent(TractionModal)
    expect(modal.findComponent('[data-testid=footer-div]').exists()).toBe(true)
  })

  describe('Ok, cancel buttons in footer', () => {
    let modalWrapper
    const buildModalWrapper = (props = {}) => {
      return mount(TractionModal, {
        localVue,
        propsData: { ...props, visible: true },
        slots: {
          'modal-footer': `<div data-testid="footer-div"> 
            <button data-testid="ok-btn"> OK </button>
            <button data-testid="cancel-btn"> Cancel </button>
            </div>`,
        },
      })
    }
    beforeEach(() => {
      modalWrapper = buildModalWrapper()
    })

    it('displays ok,cancel  actions from footer', async () => {
      const modalComp = modalWrapper.findComponent(TractionModal)
      expect(modalComp.findComponent('[data-testid=ok-btn]').exists()).toBe(true)
      expect(modalComp.findComponent('[data-testid=cancel-btn]').exists()).toBe(true)
    })

    it('emits ok event on ok button press', async () => {
      const modalComp = modalWrapper.findComponent(TractionModal)
      const okButton = modalComp.findComponent('[data-testid=ok-btn]')
      await okButton.trigger('click')
      expect(modalWrapper.emitted()).toBeTruthy()
    })
    it('emits ok event on ok button press', async () => {
      const modalComp = modalWrapper.findComponent(TractionModal)
      const cancelButton = modalComp.findComponent('[data-testid=cancel-btn]')
      await cancelButton.trigger('click')
      expect(modalWrapper.emitted()).toBeTruthy()
    })
  })
})
