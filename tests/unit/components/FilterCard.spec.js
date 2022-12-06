import { mount, localVue, store } from '@support/testHelper'
import FilterCard from '@/components/FilterCard'
import { expect } from 'vitest'


describe('FilterCard.vue', () => {
  let wrapper

  it('contains and shows the correct information', async () => {
    const mockFetch = vi.fn()
    mockFetch.mockReturnValue(Promise.resolve({ success: true, errors: [] }))

    wrapper = mount(FilterCard, {
        localVue,
        store,
        propsData: {
          fetcher: mockFetch,
          filterOptions: [
            { value: '1', text: 'Filter 1' },
            { value: '2', text: 'Filter 2' },
            { value: '3', text: 'Filter 3' }
          ]
        }
    })

    expect(wrapper.vm.filterInput).toBe('')
    expect(wrapper.vm.filterValue).toBe('')
    expect(wrapper.find('#filterInput')).toBeDefined()
    expect(wrapper.find('#filterValue')).toBeDefined()
    let options = wrapper.find('#filterValue').findAll('option')
    expect(options.at(0).text()).toBe('Filter 1')
    expect(options.at(1).text()).toBe('Filter 2')
    expect(options.at(2).text()).toBe('Filter 3')
    expect(wrapper.findAll('button').at(0).text()).toBe('Reset')
    expect(wrapper.findAll('button').at(1).text()).toBe('Search')
  })

  it('calls the fetch function with the correct data', async () => {
    const mockFetch = vi.fn()
    mockFetch.mockReturnValue(Promise.resolve({ success: true, errors: [] }))

    wrapper = mount(FilterCard, {
        localVue,
        store,
        propsData: {
          fetcher: mockFetch,
          filterOptions: [
            { value: '1', text: 'Filter 1' },
            { value: '2', text: 'Filter 2' },
            { value: '3', text: 'Filter 3' }
          ]
        },
        data: function() {
            return {
                filterInput: 'Search value',
                filterValue: '1'
            }
        }
    })
    // search button
    wrapper.findAll('button').at(1).trigger('click')
    expect(wrapper.vm.fetcher).toBeCalledWith({'1': 'Search value'})
  })

  it('clears the data when reset is clicked', async () => {
    const mockFetch = vi.fn()
    mockFetch.mockReturnValue(Promise.resolve({ success: true, errors: [] }))

    wrapper = mount(FilterCard, {
        localVue,
        store,
        propsData: {
          fetcher: mockFetch,
          filterOptions: [
            { value: '1', text: 'Filter 1' },
            { value: '2', text: 'Filter 2' },
            { value: '3', text: 'Filter 3' }
          ]
        },
        data: function() {
            return {
                filterInput: 'Search value',
                filterValue: '1'
            }
        }
    })
    // reset button
    wrapper.findAll('button').at(0).trigger('click')
    expect(wrapper.vm.fetcher).toBeCalledWith()
    expect(wrapper.vm.filterInput).toBe('')
    expect(wrapper.vm.filterValue).toBe('')
  })
})
