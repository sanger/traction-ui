import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/*
  This is a helper function for working with query params.
  It is used in conjunction with the TractionPagination component
  and the FilterCard component.
  It is used to control the router query params in one place and to aid
  the use of query params in paginated, filterable, data fetching functions.

  Currently this function is used in 'setup' functions in components.
  Now we have moved to pinia it would be good to pass in the fetch function into this helper
  and move the page_size and page_number watchers (from FilterCard) into here so we have a central place
  for fetching data.
*/
export default function useQueryParams() {
  const route = useRoute()
  const router = useRouter()

  // Updates the router with the given values
  async function updateRouter(values = {}) {
    const router_query = { ...route.query, ...values }
    await router.push({ query: router_query })
  }

  // Clears the filter from the router query
  async function clearFilter() {
    const router_query = { ...route.query }
    delete router_query['filter_value']
    delete router_query['filter_input']
    delete router_query['filter_wildcard']
    await router.push({ query: router_query })
  }

  // Builds a filter object for use in fetchWithQueryParams
  function buildFilter(filterOptions = []) {
    if (!filter_value.value || !filter_input.value) {
      return {}
    }
    let searchValue = filter_input.value
    if (
      filterOptions.filter(({ value }) => value == filter_value.value)[0]?.wildcard &&
      filter_wildcard.value
    ) {
      // If wildcard is selected, add it to the search string
      searchValue += ',wildcard'
    }
    return { [filter_value.value]: searchValue }
  }

  // Wrapper function for a fetcher that adds the query params and returns the response
  async function fetchWithQueryParams(fetcher, filterOptions = []) {
    const page = { size: page_size.value.toString(), number: page_number.value.toString() }
    const filter = buildFilter(filterOptions)

    const { success, errors, meta } = await fetcher({ page, filter })
    page_count.value = meta?.page_count
    return { success, errors }
  }

  /*
    Computed properties for the query params
    Return the current value of the router query
    These are all contain async setters that update the router because vue-router is asynchronous
  */
  const filter_value = computed({
    get() {
      return route.query.filter_value
    },
    async set(value) {
      await updateRouter({ filter_value: value })
    },
  })
  const filter_input = computed({
    get() {
      return route.query.filter_input
    },
    async set(value) {
      await updateRouter({ filter_input: value })
    },
  })
  const filter_wildcard = computed({
    get() {
      return route.query.filter_wildcard
    },
    async set(value) {
      await updateRouter({ filter_wildcard: value })
    },
  })
  const page_size = computed({
    get() {
      return Number(route.query.page_size) || 25
    },
    async set(value) {
      // When we update page size we also want to ensure we are on page 1
      await updateRouter({ page_size: value, page_number: 1 })
    },
  })
  const page_number = computed({
    get() {
      return Number(route.query.page_number) || 1
    },
    async set(value) {
      await updateRouter({ page_number: value })
    },
  })
  const page_count = computed({
    get() {
      return Number(route.query.page_count) || 1
    },
    async set(value) {
      await updateRouter({ page_count: value })
    },
  })

  return {
    filter_value,
    filter_input,
    filter_wildcard,
    page_size,
    page_number,
    page_count,
    clearFilter,
    buildFilter,
    updateRouter,
    fetchWithQueryParams,
  }
}
