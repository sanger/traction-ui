import { mount, localVue, store } from '@support/testHelper'
import DataFetcher from '@/components/DataFetcher'
import flushPromises from 'flush-promises'
import { expect } from 'vitest'


describe('DataFetcher.vue', () => {
  let wrapper

  it('shows a spinner when loading', async () => {
    const mockFetch = vi.fn()
    mockFetch.mockReturnValue(Promise.resolve({ success: true, data: 'success' }))

    wrapper = mount(DataFetcher, {
        localVue,
        store,
        propsData: {
          fetcher: mockFetch
        }
    })
    expect(wrapper.vm.isLoading).toBe(true)
    expect(wrapper.find('#traction-spinner')).toBeDefined()
  })

  it('updates the correct data when the fetcher is successful', async () => {
    const mockFetch = vi.fn()
    mockFetch.mockReturnValue(Promise.resolve({ success: true, data: 'success' }))

    wrapper = mount(DataFetcher, {
        localVue,
        store,
        propsData: {
          fetcher: mockFetch
        }
    })
    expect(mockFetch).toHaveBeenCalledOnce()
    await flushPromises()
    expect(wrapper.vm.isLoading).toBe(false)
    expect(wrapper.vm.isError).toBe(false)
  })

  it('shows an error message if the fetcher is unsuccessful with a retry button', async () => {
    const mockFetch = vi.fn()
    mockFetch.mockReturnValue(Promise.resolve({ success: false, data: 'error' }))

    wrapper = mount(DataFetcher, {
        localVue,
        store,
        propsData: {
          fetcher: mockFetch
        }
    })
    // Here we mock the global showAlert method to check its being called
    wrapper.vm.showAlert = vi.fn()

    expect(mockFetch).toHaveBeenCalledOnce()
    await flushPromises()
    expect(wrapper.vm.isLoading).toBe(false)
    expect(wrapper.vm.isError).toBe(true)
    expect(wrapper.find('button').text()).toBe('Retry')
    expect(wrapper.vm.showAlert).toHaveBeenCalled()
  })
})
