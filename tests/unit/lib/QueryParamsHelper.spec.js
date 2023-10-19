import useQueryParams from '@/lib/QueryParamsHelper'
import { router } from '@support/testHelper'
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

describe('QueryParamsHelper', () => {
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
        query: { page_size: 10, page_number: 1, filter_input: 'test' },
      })
      const { updateRouter } = useQueryParams()
      await updateRouter({ page_size: 11 })

      expect(router.currentRoute.value.query).toEqual({
        page_size: '11',
        page_number: '1',
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

  describe('Query properties', () => {
    it('should return the correct query param value', async () => {
      const filterQueryParams = {
        filter_value: 'test1',
        filter_input: 'test2',
        filter_wildcard: 'test3',
        page_size: '10',
        page_number: '1',
      }
      await router.push({ query: filterQueryParams })
      const { filter_value, filter_input, filter_wildcard, page_size, page_number } =
        useQueryParams()

      expect(filter_value.value).toEqual('test1')
      expect(filter_input.value).toEqual('test2')
      expect(filter_wildcard.value).toEqual('test3')
      expect(page_size.value).toEqual(10)
      expect(page_number.value).toEqual(1)
    })

    it('should have the correct values when no query params are supplied', async () => {
      await router.push({ query: {} })
      const { filter_value, filter_input, filter_wildcard, page_size, page_number } =
        useQueryParams()

      expect(filter_value.value).toEqual(undefined)
      expect(filter_input.value).toEqual(undefined)
      expect(filter_wildcard.value).toEqual(undefined)
      expect(page_size.value).toEqual(0)
      expect(page_number.value).toEqual(0)
    })
  })
})
