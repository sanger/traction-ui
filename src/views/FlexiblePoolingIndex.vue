<template>
  <flagged-feature name="flexible_pooling">
    <template #default>
      <DataFetcher :fetcher="provider">
        <FilterCard :fetcher="provider" :filter-options="state.filterOptions" />
        <div class="flex flex-col">
          <div>
            <traction-button class="float-left" theme="create" href="#/flexible-pooling/new">
              Create New Multi-Pool
            </traction-button>
            <traction-pagination class="float-right" aria-controls="multipools-table" />
          </div>
          <traction-table
            id="multipools-table"
            v-model:sort-by="state.sortBy"
            primary_key="id"
            :items="multiPoolsStore.multiPoolItems"
            :fields="state.fields"
            selectable
            select-mode="single"
          >
            <template #cell(actions)>
              <div>
                <!-- Placeholder for future actions, e.g., Edit, Delete -->
                <span class="text-muted">No actions available</span>
              </div>
            </template>
          </traction-table>
        </div>
      </DataFetcher>
    </template>
    <template #disabled>
      <div>This content is not available.</div>
    </template>
  </flagged-feature>
</template>

<script setup>
import FlaggedFeature from '@/components/shared/FlaggedFeature.vue'
import { reactive } from 'vue'
import { useMultiPoolStore } from '@/stores/multiPools.js'
import DataFetcher from '@/components/DataFetcher.vue'
import FilterCard from '@/components/FilterCard.vue'
import useQueryParams from '@/composables/useQueryParams.js'

const { fetchWithQueryParams } = useQueryParams()
const multiPoolsStore = useMultiPoolStore()

const state = reactive({
  fields: [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'pipeline', label: 'Pipeline', sortable: true },
    { key: 'pool_method', label: 'Pool method', sortable: true },
    { key: 'number_of_pools', label: 'Number of pools', sortable: true },
    { key: 'created_at', label: 'Created At', sortable: true },
    { key: 'actions', label: 'Actions' },
  ],
  filterOptions: [
    { value: '', text: '' },
    { value: 'pipeline', text: 'Pipeline' },
    { value: 'pool_method', text: 'Pool method' },
  ],
})

const provider = async () => {
  return await fetchWithQueryParams(multiPoolsStore.fetchMultiPools, state.filterOptions)
}
</script>
