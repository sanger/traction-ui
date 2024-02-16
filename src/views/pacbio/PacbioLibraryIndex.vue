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
          <traction-button
            :id="`editPool-${row.item.pool?.id}`"
            size="sm"
            theme="edit"
            :to="{ name: 'PacbioPoolCreate', params: { id: row.item.pool?.id } }"
            >Edit</traction-button
          >
        </template>
      </traction-table>
    </div>
  </DataFetcher>
</template>

<script setup>
/*
 * PacbioLibraryIndex is a component that displays a table of Pacbio libraries.
 * script setup is a new Vue 3 function that allows you to define props, reactive variables, and computed properties in the setup function.
 * The following code defines the reactive variables, computed properties, and methods for the PacbioLibraryIndex component.
 */
import PrinterModal from '@/components/PrinterModal.vue'
import FilterCard from '@/components/FilterCard.vue'
import DataFetcher from '@/components/DataFetcher.vue'
import { getCurrentDate } from '@/lib/DateHelpers.js'
import useQueryParams from '@/composables/useQueryParams.js'
import useAlert from '@/composables/useAlert.js'
import { ref, reactive, computed } from 'vue'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries'
import { useStore } from 'vuex'

/**
 * reactive is a Vue 3 function that allows you to create a reactive object.
 * It is a replacement for the data option in Vue 2.
 * reactive (unlike a ref which wraps the inner value in a special object) makes an object itself reactive
 */
/*
 * state is a reactive variable that contains the fields and filterOptions for the PacbioLibraryIndex component.
 */
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

/**
 * sortBy is a ref that contains the default sorting field for the PacbioLibraryIndex component.
 * ref is a Vue 3 function that allows you to create a ref. It is a replacement for the data option in Vue 2.
 */
const sortBy = ref('created_at')

/**
 * Composables are a new Vue 3 feature that allows you to create reusable logic.
 * useAlert is a composable function that provides a way to display alerts.
 */
const { showAlert } = useAlert()
/**
 * useQueryParams is a composable function that provides a way to fetch data with query parameters.
 */
const { fetchWithQueryParams } = useQueryParams()

/**
 * usePacbioLibrariesStore is a composable function that is used to access the pacbio libraries store.
 * This creates a new instance of the pacbio libraries store.
 * It is used to fetch the tag sets and create a new library.
 */
const librariesStore = usePacbioLibrariesStore()

/**
 * useStore is a composable function that is used to access the Vuex store.
 */
const store = useStore()

/**
 *
 * It is used to create a computed property for the libraries.
 */
const libraries = computed(() => librariesStore.librariesArray)

/**
 * handleLibraryDelete is a method that is used to delete the selected libraries.
 */
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

/**
 * createLabels is a method that is used to create labels for the selected libraries.
 */
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

/**
 * printLabels is a method that is used to print labels for the selected libraries.
 * @param {*} printerName name of the printer
 */
const printLabels = async (printerName) => {
  const { success, message = {} } = await store.dispatch('printMyBarcode/createPrintJob', {
    printerName,
    labels: createLabels(),
    copies: 1,
  })
  showAlert(message, success ? 'success' : 'danger')
}

/**
 * fetchLibraries is an async function that is used to fetch the libraries with query parameters.
 */
const fetchLibraries = async () => {
  return await fetchWithQueryParams(librariesStore.fetchLibraries, state.filterOptions)
}
</script>
