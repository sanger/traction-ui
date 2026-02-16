<template>
  <flagged-feature name="flexible_pooling">
    <template #default>
      <DataFetcher :fetcher="provider">
        <FilterCard :fetcher="provider" :filter-options="filterOptions" />
        <div class="flex flex-col">
          <div>
            <router-link
              data-action="new-flexiblepool"
              class="float-left"
              :to="{ name: 'FlexiblePool', params: { id: 'new' } }"
            >
              <traction-button id="newFlexiblePool" size="sm" theme="create"
                >Create new Flexible Pool</traction-button
              >
            </router-link>
            <traction-pagination class="float-right" aria-controls="multipools-table" />
          </div>
          <traction-table
            id="multipools-table"
            v-model:sort-by="sortBy"
            primary_key="id"
            :items="multiPoolsStore.multiPoolItems"
            :fields="fields"
            selectable
            select-mode="single"
          >
            <template #cell(actions)="row">
              <router-link
                data-action="edit-flexiblepool"
                :to="{ name: 'FlexiblePool', params: { id: row.item.id } }"
              >
                <traction-button :id="'editFlexiblePool-' + row.item.id" size="sm" theme="edit"
                  >Edit</traction-button
                >
              </router-link>
            </template>

            <template #cell(show_details)="row">
              <traction-button
                :id="'details-btn-' + row.item.id"
                size="sm"
                class="mr-2"
                theme="default"
                data-action="show-subpools"
                @click="handleToggleDetails(row)"
              >
                {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
              </traction-button>
            </template>

            <template #row-details="row">
              <div v-if="poolsWithDetails.includes(row.item.id)">
                <traction-table
                  :items="row.item.subPools"
                  :fields="field_in_details"
                  :data-list="'subpools-' + row.item.id"
                >
                </traction-table>
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
import { ref, reactive } from 'vue'
import { useMultiPoolStore } from '@/stores/multiPools.js'
import DataFetcher from '@/components/DataFetcher.vue'
import FilterCard from '@/components/FilterCard.vue'
import useQueryParams from '@/composables/useQueryParams.js'

const { fetchWithQueryParams } = useQueryParams()
const multiPoolsStore = useMultiPoolStore()
const sortBy = ref('created_at')

const fields = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'pipeline', label: 'Pipeline', sortable: true },
  { key: 'pool_method', label: 'Pool method', sortable: true },
  { key: 'number_of_pools', label: 'Number of pools', sortable: true },
  { key: 'created_at', label: 'Created At', sortable: true },
  { key: 'actions', label: 'Actions' },
  { key: 'show_details', label: '' },
]
const field_in_details = [{ key: 'barcode', label: 'Subpool Barcodes', sortable: true }]
const filterOptions = [
  { value: '', text: '' },
  { value: 'pipeline', text: 'Pipeline' },
  { value: 'pool_method', text: 'Pool method' },
  { value: 'pool_barcode', text: 'Pool barcode' },
]

const poolsWithDetails = reactive([])

// method to handle toggling details view
// if the details are not already loaded, fetch them
// and add the pool id to poolsWithDetails
// otherwise, remove the pool id from poolsWithDetails
const handleToggleDetails = async (row) => {
  if (!row.detailsShowing) {
    await multiPoolsStore.setSubPools(row.item.id)
    poolsWithDetails.push(row.item.id)
  } else {
    poolsWithDetails.splice(poolsWithDetails.indexOf(row.item.id), 1)
  }
  row.toggleDetails()
}

const provider = async () => {
  return await fetchWithQueryParams(multiPoolsStore.fetchMultiPools, filterOptions)
}
</script>
