import { mount, localVue, store } from '@support/testHelper'
import LabwareFinder from '@/components/LabwareFinder'
import { expect } from 'vitest'
import flushPromises from 'flush-promises'


describe('LabwareFinder.vue', () => {
  let wrapper

  it('contains and shows the correct information', async () => {
    const mockFetch = vi.fn()
    mockFetch.mockReturnValue(Promise.resolve({ success: true, errors: [] }))

    wrapper = mount(LabwareFinder, {
        localVue,
        store,
        propsData: {
          fetcher: mockFetch,
          filter: 'barcode'
        }
    })

    expect(wrapper.vm.searchValue).toBe('')
    expect(wrapper.find('#labware-finder-input')).toBeDefined()
    expect(wrapper.find('button').text()).toBe('Search')
  })

  it('calls the fetch function with the correct data', async () => {
    const mockFetch = vi.fn()
    mockFetch.mockReturnValue(Promise.resolve({ success: true, errors: [] }))

    wrapper = mount(LabwareFinder, {
        localVue,
        store,
        propsData: {
          fetcher: mockFetch,
          filter: 'barcode'
        },
        data: function() {
          return {
            searchValue: 'test-barcode',
          }
        }
    })
    // search button
    wrapper.find('button').trigger('click')
    await flushPromises()
    expect(wrapper.vm.fetcher).toBeCalledWith({'barcode': 'test-barcode'})
    // It clears the search value after successful search
    expect(wrapper.vm.searchValue).toBe('')
  })
})
