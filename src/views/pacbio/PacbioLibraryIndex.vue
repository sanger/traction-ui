<template>
  <DataFetcher :fetcher="fetchLibraries">
    <FilterCard :fetcher="fetchLibraries" :filter-options="state.filterOptions" />
    <div class="flex flex-col">
      <div class="clearfix">
        <traction-button
          id="deleteLibraries"
          theme="delete"
          class="float-left"
          :disabled="state.selected.length === 0"
          @click="handleLibraryDelete"
        >
          Delete Libraries
        </traction-button>
        <printerModal
          ref="printerModal"
          class="float-left"
          :disabled="state.selected.length === 0"
          @selectPrinter="printLabels($event)"
        >
        </printerModal>

        <traction-pagination class="float-right" aria-controls="library-index" />
      </div>

      <traction-table
        id="library-index"
        v-model:sort-by="sortBy"
        :items="libraries"
        :fields="state.fields"
        selectable
        select-mode="multi"
        @row-selected="(items) => (state.selected = items)"
      >
        <template #cell(selected)="selectedCell">
          <template v-if="selectedCell.selected">
            <span>&check;</span>
            <span class="sr-only">Selected</span>
          </template>
          <template v-else>
            <span>&nbsp;</span>
            <span class="sr-only">Not selected</span>
          </template>
        </template>

        <template #cell(actions)="row">
          <PacbioLibraryEdit :library="row.item" class="float-left" />
        </template>
      </traction-table>
    </div>
  </DataFetcher>
</template>

<script setup>
import PrinterModal from '@/components/PrinterModal.vue'
import FilterCard from '@/components/FilterCard.vue'
import DataFetcher from '@/components/DataFetcher.vue'
import { getCurrentDate } from '@/lib/DateHelpers.js'
import useQueryParams from '@/lib/QueryParamsHelper.js'
import useAlert from '@/composables/useAlert.js'
import { ref, reactive, computed } from 'vue'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries'
import { useStore } from 'vuex'
import PacbioLibraryEdit from '@/components/pacbio/PacbioLibraryEdit.vue'

//Define reactive variables
const state = reactive({
  fields: [
    { key: 'selected', label: '\u2713' },
    { key: 'id', label: 'Library ID', sortable: true },
    {
      key: 'run_suitability.ready_for_run',
      label: 'Ready',
      formatter: (obj) => (obj['run_suitability.ready_for_run'] ? '✓' : ''),
      sortable: true,
    },
    { key: 'sample_name', label: 'Sample Name', sortable: true },
    { key: 'barcode', label: 'Barcode', sortable: true },
    { key: 'source_identifier', label: 'Source', sortable: true },
    { key: 'volume', label: 'Volume', sortable: true },
    { key: 'concentration', label: 'Concentration', sortable: true },
    {
      key: 'template_prep_kit_box_barcode',
      label: 'Template Prep Kit Box Barcode',
      sortable: true,
    },
    { key: 'insert_size', label: 'Insert Size', sortable: true },
    { key: 'tag_group_id', label: 'Tag', sortable: true },
    { key: 'created_at', label: 'Created at (UTC)', sortable: true },
    { key: 'actions', label: 'Actions' },
  ],
  filterOptions: [
    { value: '', text: '' },
    { value: 'barcode', text: 'Barcode', wildcard: true },
    { value: 'sample_name', text: 'Sample Name' },
    { value: 'source_identifier', text: 'Source' },
    // Need to specify filters in json api resources if we want more filters
  ],
  selected: [],
})

//Define refs
const sortBy = ref('created_at')

//Composables
const { showAlert } = useAlert()
const { fetchWithQueryParams } = useQueryParams()

//Create Pinia store
const librariesStore = usePacbioLibrariesStore()

//Create VueX store
const store = useStore()

//computed
const libraries = computed(() => [...librariesStore.librariesArray])

//methods
const handleLibraryDelete = async () => {
  try {
    const selectedIds = state.selected.map((s) => s.id)
    const responses = await librariesStore.deleteLibraries(selectedIds)

    if (responses.every((r) => r.success)) {
      const keyword = selectedIds.length > 1 ? 'Libraries' : 'Library'
      showAlert(`${keyword} ${selectedIds.join(', ')} successfully deleted`, 'success')
      // Refetch the updated libraries
      try {
        await librariesStore.fetchLibraries()
      } catch (error) {
        showAlert('Failed to get libraries: ' + error.message, 'danger')
      }
    } else {
      throw Error(responses.map((r) => r.errors).join(','))
    }
  } catch (error) {
    showAlert('Failed to delete: ' + error, 'danger')
  }
}

const createLabels = () => {
  const date = getCurrentDate()
  return state.selected.map(({ barcode, source_identifier }) => {
    return {
      barcode,
      first_line: 'Pacbio - Library',
      second_line: date,
      third_line: barcode,
      fourth_line: source_identifier,
      label_name: 'main_label',
    }
  })
}

const printLabels = async (printerName) => {
  const { success, message = {} } = await store.dispatch('printMyBarcode/createPrintJob', {
    printerName,
    labels: createLabels(),
    copies: 1,
  })
  showAlert(message, success ? 'success' : 'danger')
}

const fetchLibraries = async () => {
  return await fetchWithQueryParams(librariesStore.fetchLibraries, state.filterOptions)
}
</script>
