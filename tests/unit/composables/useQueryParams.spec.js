import useQueryParams from '@/composables/useQueryParams.js'
import { router } from '@support/testHelper.js'
import { flushPromises } from '@vue/test-utils'
import { describe } from 'vitest'
import { useRoute } from 'vue-router'

// Need to reset each time because the router is a singleton
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRoute: vi.fn(() => router.currentRoute.value),
    useRouter: vi.fn(() => router),
  }
})

describe('useQueryParams', () => {
  beforeEach(() => {
    // Clear query params before each test
    router.push({ query: {} })
  })

  describe('updateRouter', () => {
    it('should add the router query params if they do not already exist', async () => {
      const { updateRouter } = useQueryParams()
      await updateRouter({ page_size: 10 })

      expect(router.currentRoute.value.query).toEqual({ page_size: '10' })
    })

    it('should update any existing query params if they already exist', async () => {
      // This simulates the useRoute method returning a route with query params
      vi.mocked(useRoute).mockReturnValueOnce({ query: { page_size: 10 } })
      const { updateRouter } = useQueryParams()
      await updateRouter({ page_size: 11 })

      expect(router.currentRoute.value.query).toEqual({ page_size: '11' })
    })

    it('should not update any existing query params that are not passed in', async () => {
      vi.mocked(useRoute).mockReturnValueOnce({
        query: { page_size: 10, page_number: 1, page_count: 5, filter_input: 'test' },
      })
      const { updateRouter } = useQueryParams()
      await updateRouter({ page_size: 11 })

      expect(router.currentRoute.value.query).toEqual({
        page_size: '11',
        page_number: '1',
        page_count: '5',
        filter_input: 'test',
      })
    })
  })

  describe('clearFilter', () => {
    it('should remove the filter_value, filter_input, and filter_wildcard query params', async () => {
      const filterQueryParams = {
        filter_value: 'test',
        filter_input: 'test',
        filter_wildcard: 'test',
      }
      await router.push({ query: filterQueryParams })
      expect(router.currentRoute.value.query).toEqual(filterQueryParams)

      const { clearFilter } = useQueryParams()
      await clearFilter()
      expect(router.currentRoute.value.query).toEqual({})
    })

    it('should not remove any other query params', async () => {
      const filterQueryParams = {
        filter_value: 'test',
        filter_input: 'test',
        filter_wildcard: 'test',
        page_size: '10',
        page_number: '1',
      }
      await router.push({ query: filterQueryParams })
      expect(router.currentRoute.value.query).toEqual(filterQueryParams)

      const { clearFilter } = useQueryParams()
      await clearFilter()
      expect(router.currentRoute.value.query).toEqual({ page_size: '10', page_number: '1' })
    })
  })

  describe('buildFilter', () => {
    it('builds a filter object with the correct values when filterOptions are given', async () => {
      const filterOptions = [
        { value: '', text: '' },
        { value: 'barcode', text: 'Barcode', wildcard: true },
        { value: 'sample_name', text: 'Sample Name' },
        { value: 'source_identifier', text: 'Source' },
        // Need to specify filters in json api resources if we want more filters
      ]
      const filterQueryParams = {
        filter_value: 'barcode',
        filter_input: 'test',
        filter_wildcard: 'true',
      }
      await router.push({ query: filterQueryParams })
      expect(router.currentRoute.value.query).toEqual(filterQueryParams)

      const { buildFilter } = useQueryParams()
      const filter = await buildFilter(filterOptions)
      expect(filter).toEqual({ barcode: 'test,wildcard' })
    })

    it('builds a filter object with the correct values when filterOptions are not given', async () => {
      const filterQueryParams = {
        filter_value: 'barcode',
        filter_input: 'test',
        filter_wildcard: 'true',
      }
      await router.push({ query: filterQueryParams })
      expect(router.currentRoute.value.query).toEqual(filterQueryParams)

      const { buildFilter } = useQueryParams()
      const filter = await buildFilter()
      expect(filter).toEqual({ barcode: 'test' })
    })

    it('returns an empty object when no filter is present', async () => {
      await router.push({ query: {} })
      expect(router.currentRoute.value.query).toEqual({})
      const { buildFilter } = useQueryParams()
      const filter = await buildFilter()
      expect(filter).toEqual({})
    })
  })

  describe('fetchWithQueryParams', () => {
    it('should call the fetch function with no default page params when none are present', async () => {
      const fetch = vi.fn().mockReturnValue({ success: true, errors: [], meta: {} })
      const { fetchWithQueryParams } = useQueryParams()
      await fetchWithQueryParams(fetch)

      expect(fetch).toHaveBeenCalledWith({ page: { number: '1', size: '25' }, filter: {} })
    })

    it('should call the fetch function with the correct params when filter params are present', async () => {
      const fetch = vi.fn().mockReturnValue({ success: true, errors: [], meta: { page_count: 1 } })
      const queryParams = {
        filter_value: 'barcode',
        filter_input: 'test',
        filter_wildcard: 'true',
        page_number: '1',
        page_size: '10',
      }
      await router.push({ query: queryParams })
      expect(router.currentRoute.value.query).toEqual(queryParams)

      const { fetchWithQueryParams } = useQueryParams()
      await fetchWithQueryParams(fetch)

      await flushPromises()
      expect(fetch).toHaveBeenCalledWith({
        page: { size: '10', number: '1' },
        filter: { barcode: 'test' },
      })
      // It should also update the page_count
      expect(router.currentRoute.value.query.page_count).toEqual('1')
    })
  })

  describe('Query properties', () => {
    it('should return the correct query param value', async () => {
      const filterQueryParams = {
        filter_value: 'test1',
        filter_input: 'test2',
        filter_wildcard: 'test3',
        page_size: '10',
        page_number: '1',
        page_count: '1',
      }
      await router.push({ query: filterQueryParams })
      const { filter_value, filter_input, filter_wildcard, page_size, page_number, page_count } =
        useQueryParams()

      expect(filter_value.value).toEqual('test1')
      expect(filter_input.value).toEqual('test2')
      expect(filter_wildcard.value).toEqual('test3')
      expect(page_size.value).toEqual(10)
      expect(page_number.value).toEqual(1)
      expect(page_count.value).toEqual(1)
    })

    it('should have the correct values when no query params are supplied', async () => {
      await router.push({ query: {} })
      const { filter_value, filter_input, filter_wildcard, page_size, page_number, page_count } =
        useQueryParams()

      expect(filter_value.value).toEqual(undefined)
      expect(filter_input.value).toEqual(undefined)
      expect(filter_wildcard.value).toEqual(undefined)
      expect(page_size.value).toEqual(25)
      expect(page_number.value).toEqual(1)
      expect(page_count.value).toEqual(1)
    })
  })
})
