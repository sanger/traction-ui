<template>
  <DataFetcher :fetcher="provider">
    <FilterCard :fetcher="provider" :filter-options="state.filterOptions" />
    <div class="flex flex-col">
      <div class="clearfix">
        <printerModal
          ref="printerModal"
          class="float-left"
          :disabled="state.selected.length === 0"
          @select-printer="onPrintAction($event)"
        />
        <traction-button
          id="deleteLibraries"
          theme="delete"
          class="float-left"
          :disabled="state.selected.length === 0"
          @click="showConfirmationModal = true"
        >
          Delete Libraries
        </traction-button>
        <!-- Confirmation Modal -->
        <div
          v-if="showConfirmationModal"
          class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-1"
        >
          <div class="bg-white p-6 rounded shadow-lg">
            <p class="mb-4">Are you sure you want to delete the selected libraries?</p>
            <div class="flex justify-center space-x-4">
              <button
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                @click="(handleLibraryDelete(), (showConfirmationModal = false))"
              >
                Yes
              </button>
              <button
                class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                @click="showConfirmationModal = false"
              >
                No
              </button>
            </div>
          </div>
        </div>
        <traction-pagination class="float-right" aria-controls="library-index" />
      </div>

      <traction-table
        id="library-index"
        v-model:sort-by="sortBy"
        :items="displayedLibraries"
        :fields="state.fields"
        selectable
        select-mode="multi"
        @row-selected="(items) => (state.selected = items)"
      >
        <template #cell(volume)="row">
          <template v-if="exhausted(row)">
            <div class="relative">
              <label class="block text-center w-full">{{ row.item.volume }}</label>
              <traction-badge
                id="exhausted-badge"
                class="absolute top-0 right-0 transform -translate-y translate-x-1/2"
                colour="sanger-pink"
                >Exhausted</traction-badge
              >
            </div>
          </template>
          <template v-else>
            <label>{{ row.item.volume }}</label>
          </template>
        </template>
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
        <template #cell(show_details)="row">
          <traction-button
            :id="'edit-btn-' + row.item.id"
            size="sm"
            class="mr-2"
            :theme="row.detailsShowing ? 'paginationDefault' : 'default'"
            @click="row.toggleDetails"
          >
            {{ row.detailsShowing ? 'Cancel edit' : 'Edit' }}
          </traction-button>
        </template>
        <template #row-details="row">
          <PacbioLibraryEdit :library="getEditLibrary(row)" @edit-completed="row.toggleDetails()" />
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
import PrinterModal from '@/components/labelPrinting/PrinterModal.vue'
import FilterCard from '@/components/FilterCard.vue'
import DataFetcher from '@/components/DataFetcher.vue'
import useLocationFetcher from '@/composables/useLocationFetcher.js'
import useQueryParams from '@/composables/useQueryParams.js'
import useAlert from '@/composables/useAlert.js'
import { ref, reactive, computed } from 'vue'
import { usePacbioLibrariesStore } from '@/stores/pacbioLibraries.js'
import PacbioLibraryEdit from '@/components/pacbio/PacbioLibraryEdit.vue'
import { locationBuilder } from '@/services/labwhere/helpers.js'
import usePacbioLibraryPrint from '@/composables/usePacbioLibraryPrint.js'
import { isLibraryExhausted } from '@/stores/utilities/pacbioLibraries.js'

/**
 * Following are new Vue 3 features used in this component:
 * 
 * script setup : is a Vue 3 function that allows you to define props, reactive variables, and computed properties in the setup function.
 *
 * ref:  is a Vue 3 function that allows you to create a reactive object which is a replacement for the data option in Vue 2
 * ref() takes the argument and returns it wrapped within a ref object with a .value property:
 * e.g : ref(0) returns { value: 0 }
 * To access the value, you use the .value property in setup function, but in the template, you can use the variable directly.
 * {@link} https://v3.vuejs.org/guide/reactivity-fundamentals.html#ref
 * 
 * reactive: is a Vue 3 function that allows to define reactive variables which is a replacement for the data option in Vue 2.
 *  The limitations of this are 
 *   1) This only works for objects and arrays and not for primitive values. 
 *   2) Cannot replace entire object or array, but can replace properties of the object or array.
 * reactive() takes the argument and returns it wrapped within a reactive object.
 * {@link} https://v3.vuejs.org/guide/reactivity-fundamentals.html#reactive-variables
 
 * Composables: are a new Vue 3 feature that allows you to create reusable logic.
 * {@link} https://vuejs.org/guide/reusability/composables
 *
 * computed: is a Vue 3 function that allows you to create a computed property.
 * It is a replacement for the computed option in Vue 2.
 * {@link} https://v3.vuejs.org/guide/reactivity-computed-watchers.html#computed-properties
 *
 * defineProps: is a Vue 3 function that allows you to define props in the setup function which is a replacement for the  props option in Vue 2.
 * {@link} https://v3.vuejs.org/guide/component-props.html#prop-validation
 */

/**
 * PacbioLibraryIndex component is used to display the list of libraries.
 */

//define reactive variables
const state = reactive({
  // Define fields for the table
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
    { key: 'volume', label: 'Initial Volume' },
    { key: 'available_volume', label: 'Available Volume' },
    { key: 'concentration', label: 'Concentration', sortable: true },
    { key: 'location', label: 'Location', sortable: true },
    {
      key: 'template_prep_kit_box_barcode',
      label: 'Template Prep Kit Box Barcode',
      sortable: true,
    },
    { key: 'insert_size', label: 'Insert Size', sortable: true },
    { key: 'tag_group_id', label: 'Tag', sortable: true },
    { key: 'created_at', label: 'Created at (UTC)', sortable: true },
    { key: 'show_details', label: '' },
  ],
  // Define filter options
  filterOptions: [
    { value: '', text: '' },
    { value: 'barcode', text: 'Barcode', wildcard: true },
    { value: 'sample_name', text: 'Sample Name' },
    { value: 'source_identifier', text: 'Source' },
    // Need to specify filters in json api resources if we want more filters
  ],
  //Define selected libraries
  selected: [],
})

//Define refs
// Sort By id descending by default
const sortBy = ref('id')
const labwareLocations = ref([])
const showConfirmationModal = ref(false)


//Composables
const { showAlert } = useAlert()
const { fetchWithQueryParams } = useQueryParams()
const { printLabels } = usePacbioLibraryPrint()
const { fetchLocations } = useLocationFetcher()

//Create Pinia store
const librariesStore = usePacbioLibrariesStore()

//computed
const libraries = computed(() => librariesStore.librariesArray)


// Computed property for displayed libraries with updated location information
const displayedLibraries = computed(() => {
  return locationBuilder(libraries.value, labwareLocations.value)
})

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
        await fetchLibraries()
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

const onPrintAction = async (printerName) => {
  const { success, message = {} } = await printLabels(printerName, state.selected)
  showAlert(message, success ? 'success' : 'danger')
}

const fetchLibraries = async () => {
  return await fetchWithQueryParams(librariesStore.fetchLibraries, state.filterOptions)
}
/**
 * This function takes a row object and returns the corresponding library from the libraries list.
 * The row object is expected to have an item property which in turn should have an id property.
 * The function uses this id to find the corresponding library.
 *
 * @param {Object} row - The row object from which the library id is to be extracted.
 *
 * @returns {Object} The library object that matches the id from the row object. If no match is found, returns undefined.
 */
const getEditLibrary = (row) => {
  const value = libraries.value.find((library) => library.id === row.item.id)
  return value
}

const exhausted = (row) => {
  const value = getEditLibrary(row)
  return isLibraryExhausted(value)
}

/*Fetches the libraries from the api and adds location data
  @returns {Object} { success: Boolean, errors: Array }*/
const provider = async () => {
  const { success, errors } =  await fetchWithQueryParams(librariesStore.fetchLibraries, state.filterOptions)
  // We only want to fetch labware locations if the libraries were fetched successfully
  if (success) {
    // We don't need to fail if labware locations can't be fetched, so we don't return anything
    const librariesArray = librariesStore.librariesArray
    const barcodes = librariesArray.map(({ barcode }) => barcode)
    labwareLocations.value = await fetchLocations(barcodes)
  }
  
  return { success, errors }
}
</script>
