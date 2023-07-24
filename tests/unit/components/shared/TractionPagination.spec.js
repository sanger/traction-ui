import { mount } from '@support/testHelper'

import TractionPagination from '@/components/shared/TractionPagination'

import { beforeEach, describe, expect, it } from 'vitest'

describe('TractionPagination.vue', () => {
  const buildWrapper = (props = {}) => {
    return mount(TractionPagination, {
      props,
    })
  }

  describe('Initial page display', () => {
    const wrapper = mount(TractionPagination, {
      props: { vmodel: 'currentPage', totalRows: 30, perPage: 5, maxVisibleButtons: 3 },
      data() {
        return {
          currentPage: 3,
        }
      },
    })
    it('displays the given current page as selected', () => {
      expect(wrapper.findAll('[data-testid=page-button]')[1].text()).toBe('3')
      expect(wrapper.findAll('[data-testid=page-button]')[1].attributes('class')).toContain(
        'text-white bg-sdb-200 shadow-sm focus:shadow-outline-sdb hover:bg-sdb-300 active:bg-sdb-400',
      )
      expect(wrapper.vm.itemsPerPage).equals(5)
      expect(wrapper.find('[data-testid=per-page-input]').element.value).toBe('5')
    })
  })
  describe('Total number of pages are more than buttons on display', () => {
    const wrapper = buildWrapper({ totalRows: 100, perPage: 10, maxVisibleButtons: 5, value: 1 })

    it('displays the given number of buttons to show pages', () => {
      expect(wrapper.findAll('[data-testid=page-button]').length).toEqual(5)
    })

    it('displays the first page button as selected', () => {
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

  describe('Total number of pages are less than buttons on display', () => {
    const wrapper = buildWrapper({ totalRows: 10, perPage: 10, maxVisibleButtons: 5 })

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
    it('displays first page', async () => {
      const wrapper = mount(TractionPagination, {
        props: { vmodel: 'currentPage', totalRows: 30, perPage: 5, maxVisibleButtons: 5 },
        data() {
          return {
            currentPage: 3,
          }
        },
      })
      //Click first page button
      await wrapper.find('[data-testid=first-button]').trigger('click')

      it('sets the current page in model as 1'),
        () => {
          expect(wrapper.vm.currentPage).toEqual(1)
        }
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
    it('displays next page', async () => {
      const wrapper = mount(TractionPagination, {
        props: { vmodel: 'currentPage', totalRows: 30, perPage: 5, maxVisibleButtons: 5 },
        data() {
          return {
            currentPage: 1,
          }
        },
      })
      await wrapper.find('[data-testid=next-button]').trigger('click')

      it('sets the current page in model as 2'),
        () => {
          expect(wrapper.vm.currentPage).toEqual(2)
        }

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

    it('displays last page', async () => {
      const wrapper = mount(TractionPagination, {
        props: { vmodel: 'currentPage', totalRows: 30, perPage: 5, maxVisibleButtons: 3 },
        data() {
          return {
            currentPage: 1,
          }
        },
      })

      await wrapper.find('[data-testid=last-button]').trigger('click')
      it('sets the current page in model as 6'),
        () => {
          expect(wrapper.vm.currentPage).toEqual(6)
        }

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
    it('displays prev page', async () => {
      const wrapper = mount(TractionPagination, {
        props: { vmodel: 'currentPage', totalRows: 30, perPage: 5, maxVisibleButtons: 3 },
        data() {
          return {
            currentPage: 6,
          }
        },
      })

      await wrapper.find('[data-testid=prev-button]').trigger('click')

      it('sets the current page in model as 5', () => {
        expect(wrapper.vm.currentPage).toEqual(5)
      })

      it('enables the last navigation button', () => {
        expect(wrapper.find('[data-testid=last-button]').element.disabled).toBe(false)
      })
      it('enables the next navigation button', () => {
        expect(wrapper.find('[data-testid=next-button]').element.disabled).toBe(false)
      })
      it('displays the selected page button as selected', () => {
        expect(wrapper.findAll('[data-testid=page-button]')[4].text()).toBe('5')
        expect(wrapper.findAll('[data-testid=page-button]')[4].attributes('class')).toContain(
          'text-white bg-sdb-200 shadow-sm focus:shadow-outline-sdb hover:bg-sdb-300 active:bg-sdb-400',
        )
      })
    })
  })
  describe('Changing value in per page', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(TractionPagination, {
        props: { vmodel: 'currentPage', totalRows: 30, perPage: 5, maxVisibleButtons: 5 },
        data() {
          return {
            currentPage: 3,
          }
        },
      })
    })
    it('changes total number of page buttons displayed ', async () => {
      const textInput = wrapper.find('[data-testid=per-page-input]')
      textInput.element.value = 10
      await textInput.trigger('input')
      expect(wrapper.findAll('[data-testid=page-button]')).toHaveLength(3)
      textInput.element.value = 2
      await textInput.trigger('input')
      expect(wrapper.findAll('[data-testid=page-button]')).toHaveLength(5)
    })
    it('resets current page to 1 if perPage has a value greater than total rows', async () => {
      const textInput = wrapper.find('[data-testid=per-page-input]')
      textInput.element.value = 40
      await textInput.trigger('input')
      expect(wrapper.findAll('[data-testid=page-button]')).toHaveLength(1)
      expect(wrapper.findAll('[data-testid=page-button]')[0].text()).toBe('1')
    })
    it('resets current page  if total pages required is less than the curret page in display', async () => {
      const textInput = wrapper.find('[data-testid=per-page-input]')
      textInput.element.value = 3
      await textInput.trigger('input')
      await wrapper.find('[data-testid=last-button]').trigger('click')
      textInput.element.value = 15
      await textInput.trigger('input')
      expect(wrapper.findAll('[data-testid=page-button]')).toHaveLength(2)
      expect(wrapper.findAll('[data-testid=page-button]')[0].text()).toBe('1')
    })
  })
})
