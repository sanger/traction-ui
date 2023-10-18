import { mount, flushPromises, router } from '@support/testHelper'
import TractionPagination from '@/components/shared/TractionPagination'
import { beforeEach, describe, expect, it } from 'vitest'

describe('TractionPagination.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionPagination, {
      props,
    })
  }

  describe('Initial page display', async () => {
    let wrapper

    beforeEach(async () => {
      await router.push({ query: { page_number: 3, page_size: 5 } })
      wrapper = buildWrapper({ totalPages: 6, maxVisibleButtons: 3 })
    })

    it('displays the given current page as selected', () => {
      expect(wrapper.findAll('[data-testid=page-button]')[1].text()).toBe('3')
      expect(wrapper.findAll('[data-testid=page-button]')[1].attributes('class')).toContain(
        'text-white bg-sdb-200 shadow-sm focus:shadow-outline-sdb hover:bg-sdb-300 active:bg-sdb-400',
      )
      expect(wrapper.vm.page_size).equals(5)
      expect(wrapper.find('[data-testid=per-page-input]').element.value).toBe('5')
    })
  })

  describe('Total number of pages are more than buttons on display', async () => {
    let wrapper

    beforeEach(async () => {
      await router.push({ query: { page_number: 1, page_size: 10 } })
      wrapper = buildWrapper({ totalPages: 100, maxVisibleButtons: 5 })
    })

    it('displays the given number of buttons to show pages', () => {
      expect(wrapper.findAll('[data-testid=page-button]').length).toEqual(5)
    })

    it('displays the first page button as selected', () => {
      expect(wrapper.findAll('[data-testid=page-button]')[0].text()).toBe('1')
      expect(wrapper.findAll('[data-testid=page-button]')[0].attributes('class')).toContain(
        'text-white bg-sdb-200 shadow-sm focus:shadow-outline-sdb hover:bg-sdb-300 active:bg-sdb-400',
      )
    })

    it('disables the first navigation button', () => {
      expect(wrapper.find('[data-testid=first-button]').element.disabled).toBe(true)
    })

    it('disables the prev navigation button', () => {
      expect(wrapper.find('[data-testid=prev-button]').element.disabled).toBe(true)
    })

    it('enables the last navigation button', () => {
      expect(wrapper.find('[data-testid=last-button]').element.disabled).toBe(false)
    })
    it('enables the prev navigation button', () => {
      expect(wrapper.find('[data-testid=next-button]').element.disabled).toBe(false)
    })
  })

  describe('Total number of pages are less than buttons on display', async () => {
    let wrapper

    beforeEach(async () => {
      await router.push({ query: { page_number: 1, page_size: 10 } })
      wrapper = buildWrapper({ totalPages: 1, maxVisibleButtons: 5 })
    })

    it('displays only as many buttons required to display pages', () => {
      expect(wrapper.findAll('[data-testid=page-button]').length).toEqual(1)
    })
    it('disables the first navigation button', () => {
      expect(wrapper.find('[data-testid=first-button]').element.disabled).toBe(true)
    })
    it('disables the prev navigation button', () => {
      expect(wrapper.find('[data-testid=prev-button]').element.disabled).toBe(true)
    })
    it('disbles the last navigation button ', () => {
      expect(wrapper.find('[data-testid=last-button]').element.disabled).toBe(true)
    })
    it('disables the next navigation button', () => {
      expect(wrapper.find('[data-testid=next-button]').element.disabled).toBe(true)
    })
  })

  describe('Invoking page buttons', () => {
    describe('displays first page', () => {
      let wrapper

      beforeEach(async () => {
        await router.push({ query: { page_number: 3, page_size: 5 } })
        wrapper = buildWrapper({ totalPages: 6, maxVisibleButtons: 5 })
        await wrapper.find('[data-testid=first-button]').trigger('click')
        await flushPromises()
      })

      it('sets the current page in model as 1', () => {
        expect(wrapper.vm.page_number).toEqual(1)
      })

      it('disables the first navigation button', () => {
        expect(wrapper.find('[data-testid=first-button]').element.disabled).toBe(true)
      })

      it('disables the prev navigation button', () => {
        expect(wrapper.find('[data-testid=prev-button]').element.disabled).toBe(true)
      })

      it('displays the first page button as selected', () => {
        expect(wrapper.findAll('[data-testid=page-button]')[0].text()).toBe('1')
        expect(wrapper.findAll('[data-testid=page-button]')[0].attributes('class')).toContain(
          'text-white bg-sdb-200 shadow-sm focus:shadow-outline-sdb hover:bg-sdb-300 active:bg-sdb-400',
        )
      })
    })

    describe('displays next page', () => {
      let wrapper

      beforeEach(async () => {
        await router.push({ query: { page_number: 1, page_size: 5 } })
        wrapper = buildWrapper({ totalPages: 6, maxVisibleButtons: 5 })
        await wrapper.find('[data-testid=next-button]').trigger('click')
        await flushPromises()
      })

      it('sets the current page in model as 2', () => {
        expect(wrapper.vm.page_number).toEqual(2)
      })

      it('enables the first navigation button', () => {
        expect(wrapper.find('[data-testid=first-button]').element.disabled).toBe(false)
      })

      it('enables the prev navigation button', () => {
        expect(wrapper.find('[data-testid=prev-button]').element.disabled).toBe(false)
      })

      it('displays the second page button as selected', () => {
        expect(wrapper.findAll('[data-testid=page-button]')[1].text()).toBe('2')
        expect(wrapper.findAll('[data-testid=page-button]')[1].attributes('class')).toContain(
          'text-white bg-sdb-200 shadow-sm focus:shadow-outline-sdb hover:bg-sdb-300 active:bg-sdb-400',
        )
      })
    })

    describe('displays last page', () => {
      let wrapper

      beforeEach(async () => {
        await router.push({ query: { page_number: 1, page_size: 5 } })
        wrapper = buildWrapper({ totalPages: 6, maxVisibleButtons: 3 })
        await wrapper.find('[data-testid=last-button]').trigger('click')
        await flushPromises()
      })

      it('sets the current page in model as 6', () => {
        expect(wrapper.vm.page_number).toEqual(6)
      })

      it('disbles the last navigation button', () => {
        expect(wrapper.find('[data-testid=last-button]').element.disabled).toBe(true)
      })

      it('disables the next navigation button', () => {
        expect(wrapper.find('[data-testid=next-button]').element.disabled).toBe(true)
      })

      it('displays the last page button as selected', () => {
        expect(wrapper.findAll('[data-testid=page-button]')[2].text()).toBe('6')
        expect(wrapper.findAll('[data-testid=page-button]')[2].attributes('class')).toContain(
          'text-white bg-sdb-200 shadow-sm focus:shadow-outline-sdb hover:bg-sdb-300 active:bg-sdb-400',
        )
      })
    })

    describe('displays prev page', () => {
      let wrapper

      beforeEach(async () => {
        await router.push({ query: { page_number: 6, page_size: 5 } })
        wrapper = buildWrapper({ totalPages: 6, maxVisibleButtons: 3 })
        await wrapper.find('[data-testid=prev-button]').trigger('click')
        await flushPromises()
      })

      it('sets the current page in model as 5', () => {
        expect(wrapper.vm.page_number).toEqual(5)
      })

      it('enables the last navigation button', () => {
        expect(wrapper.find('[data-testid=last-button]').element.disabled).toBe(false)
      })

      it('enables the next navigation button', () => {
        expect(wrapper.find('[data-testid=next-button]').element.disabled).toBe(false)
      })

      it('displays the selected page button as selected', () => {
        expect(wrapper.findAll('[data-testid=page-button]')[1].text()).toBe('5')
        expect(wrapper.findAll('[data-testid=page-button]')[1].attributes('class')).toContain(
          'text-white bg-sdb-200 shadow-sm focus:shadow-outline-sdb hover:bg-sdb-300 active:bg-sdb-400',
        )
      })
    })
  })
  describe('Changing value in per page', () => {
    // This behaviour has moved to the service where changes to per page
    // trigger a data refetch to calculate page count
    let wrapper

    beforeEach(async () => {
      await router.push({ query: { page_number: 3, page_size: 5 } })
      wrapper = buildWrapper({ totalPages: 6, maxVisibleButtons: 5 })
    })

    it('updates page size', async () => {
      const textInput = wrapper.find('[data-testid=per-page-input]')
      textInput.element.value = 10
      await textInput.trigger('input')
      await flushPromises()
      expect(wrapper.vm.page_size).toEqual(10)
    })
  })
})
