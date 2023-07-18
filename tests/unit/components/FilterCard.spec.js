import { mount } from '@support/testHelper'
import FilterCard from '@/components/FilterCard'
import { expect } from 'vitest'

describe('FilterCard.vue', () => {
  let wrapper

  it('contains and shows the correct information', async () => {
    const mockFetch = vi.fn()
    mockFetch.mockReturnValue(Promise.resolve({ success: true, errors: [] }))

    wrapper = mount(FilterCard, {
      props: {
        fetcher: mockFetch,
        filterOptions: [
          { value: '1', text: 'Filter 1' },
          { value: '2', text: 'Filter 2' },
          { value: '3', text: 'Filter 3' },
        ],
      },
    })

    expect(wrapper.vm.filter.input).toBe('')
    expect(wrapper.vm.filter.value).toBe('')
    expect(wrapper.vm.filter.wildcard).toBe(true)
    expect(wrapper.find('#filterInput')).toBeDefined()
    expect(wrapper.find('#filterValue')).toBeDefined()
    const options = wrapper.find('#filterValue').findAll('option')
    expect(options[0].text()).toBe('Filter 1')
    expect(options[1].text()).toBe('Filter 2')
    expect(options[2].text()).toBe('Filter 3')
    expect(wrapper.findAll('button')[0].text()).toBe('Reset')
    expect(wrapper.findAll('button')[1].text()).toBe('Search')
  })

  it.each([
    // Wildcard filterOption and wildcard filter
    [{ input: 'Search value 1', value: '1', wildcard: true }, { 1: 'Search value 1,wildcard' }],
    // No wildcard filterOption and wildcard filter
    [{ input: 'Search value 2', value: '2', wildcard: true }, { 2: 'Search value 2' }],
    // No wildcard filterOption and no wildcard filter
    [{ input: 'Search value 3', value: '3', wildcard: false }, { 3: 'Search value 3' }],
  ])('calls the fetch function with the correct data', async (filter, expectedSearch) => {
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
      data: function () {
        return {
          filter,
        }
      },
    })
    // search button
    wrapper.findAll('button')[1].trigger('click')
    expect(wrapper.vm.fetcher).toBeCalledWith(expectedSearch)
  })

  it('clears the data when reset is clicked', async () => {
    const mockFetch = vi.fn()
    mockFetch.mockReturnValue(Promise.resolve({ success: true, errors: [] }))

    wrapper = mount(FilterCard, {
      props: {
        fetcher: mockFetch,
        filterOptions: [
          { value: '1', text: 'Filter 1' },
          { value: '2', text: 'Filter 2' },
          { value: '3', text: 'Filter 3' },
        ],
      },
      data: function () {
        return {
          filter: {
            input: 'Search value',
            value: '1',
            wildcard: false,
          },
        }
      },
    })
    // reset button
    wrapper.findAll('button')[0].trigger('click')
    expect(wrapper.vm.fetcher).toBeCalledWith()
    expect(wrapper.vm.filter.input).toBe('')
    expect(wrapper.vm.filter.value).toBe('')
    expect(wrapper.vm.filter.wildcard).toBe(true)
  })
})
