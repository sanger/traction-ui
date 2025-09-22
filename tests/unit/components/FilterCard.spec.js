import { mount, flushPromises, router } from '@support/testHelper.js'
import FilterCard from '@/components/FilterCard.vue'
import { expect } from 'vitest'

describe('FilterCard.vue', () => {
  let wrapper

  beforeEach(() => {
    const mockFetch = vi.fn()
    mockFetch.mockReturnValue(Promise.resolve({ success: true, errors: [] }))

    wrapper = mount(FilterCard, {
      props: {
        fetcher: mockFetch,
        filterOptions: [
          { value: '1', text: 'Filter 1', wildcard: true },
          { value: '2', text: 'Filter 2' },
          { value: '3', text: 'Filter 3' },
        ],
      },
    })
  })

  it('contains and shows the correct information', () => {
    // Query params are undefined so these values should be
    expect(wrapper.vm.filter_input).toBe(undefined)
    expect(wrapper.vm.filter_value).toBe(undefined)
    expect(wrapper.vm.filter_wildcard).toBe(undefined)

    expect(wrapper.find('#filterInput')).toBeDefined()
    expect(wrapper.find('#filterValue')).toBeDefined()
    expect(wrapper.find('#filterWildcard')).toBeDefined()
    const options = wrapper.find('#filterValue').findAll('option')
    expect(options[0].text()).toBe('Filter 1')
    expect(options[1].text()).toBe('Filter 2')
    expect(options[2].text()).toBe('Filter 3')
    expect(wrapper.findAll('button')[0].text()).toBe('Reset')
    expect(wrapper.findAll('button')[1].text()).toBe('Search')
  })

  it('filter input updates query params correctly', async () => {
    const filterInput = wrapper.find('#filterInput')
    filterInput.element.value = 10
    await filterInput.trigger('input')
    await flushPromises()
    expect(wrapper.vm.filter_input).toBe('10')
  })

  it('filter value updates query params correctly', async () => {
    const filterValue = wrapper.find('#filterValue').findAll('option')
    expect(filterValue[0].text()).toBe('Filter 1')
    expect(filterValue[1].text()).toBe('Filter 2')
    expect(filterValue[2].text()).toBe('Filter 3')
    filterValue[0].setSelected()
    await flushPromises()
    // 1 since the selected value of Filter 1 is 1
    expect(wrapper.vm.filter_value).toBe('1')
  })

  describe('filter wildcard', () => {
    it('is visible if the filter value can wildcard', async () => {
      const filterValue = wrapper.find('#filterValue').findAll('option')
      filterValue[0].setSelected()
      await flushPromises()
      expect(wrapper.find('#filterWildcard').exists()).toBe(true)
    })

    it('is not visible if the filter value cannot wildcard', async () => {
      const filterValue = wrapper.find('#filterValue').findAll('option')
      filterValue[1].setSelected()
      await flushPromises()
      expect(wrapper.find('#filterWildcard').exists()).toBe(false)
    })

    it('updates query params correctly', async () => {
      // Ensure the filter has a wilcard option
      const filterValue = wrapper.find('#filterValue').findAll('option')
      filterValue[0].setSelected()
      await flushPromises()

      const filterWildcard = wrapper.find('#filterWildcard')
      filterWildcard.setChecked()
      await flushPromises()
      expect(wrapper.vm.filter_wildcard).toBe('true')
    })
  })

  it('clears the filter query params when reset is clicked', async () => {
    await router.push({
      query: {
        page_number: 3,
        page_size: 5,
        filter_input: '123',
        filter_value: 'Filter 1',
        filter_wildcard: 'true',
      },
    })
    // reset button
    wrapper.findAll('button')[0].trigger('click')
    await flushPromises()
    // removes filter query params and sets page back to 1
    expect(wrapper.vm.page_number).toEqual(1)
    expect(wrapper.vm.page_size).toEqual(5)
  })
})
