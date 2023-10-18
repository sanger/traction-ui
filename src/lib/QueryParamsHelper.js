import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default function useQueryParams() {
  const route = useRoute()
  const router = useRouter()

  function updateRouter(values = {}) {
    const router_query = { ...route.query, ...values }
    router.push({ query: router_query })
  }

  async function clearFilter() {
    const router_query = { ...route.query }
    delete router_query['filter_value']
    delete router_query['filter_input']
    delete router_query['filter_wildcard']
    await router.push({ query: router_query })
  }

  const filter_value = computed({
    get() {
      return route.query.filter_value
    },
    set(value) {
      updateRouter({ filter_value: value })
    },
  })
  const filter_input = computed({
    get() {
      return route.query.filter_input
    },
    set(value) {
      updateRouter({ filter_input: value })
    },
  })
  const filter_wildcard = computed({
    get() {
      return route.query.filter_wildcard
    },
    set(value) {
      updateRouter({ filter_wildcard: value })
    },
  })
  const page_size = computed({
    get() {
      return Number(route.query.page_size)
    },
    set(value) {
      updateRouter({ page_size: value })
    },
  })
  const page_number = computed({
    get() {
      return Number(route.query.page_number)
    },
    set(value) {
      updateRouter({ page_number: value })
    },
  })

  return { filter_value, filter_input, filter_wildcard, page_size, page_number, clearFilter }
}
