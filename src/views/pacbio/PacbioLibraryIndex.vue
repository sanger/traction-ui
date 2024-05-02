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
          @select-printer="printLabels($event)"
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
          <PacbioLibraryEdit :library="getEditLibrary(row)" @edit-completed="row.toggleDetails" />
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
import PacbioLibraryEdit from '@/components/pacbio/PacbioLibraryEdit.vue'

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
const sortBy = ref('created_at')

//Composables
const { showAlert } = useAlert()
const { fetchWithQueryParams } = useQueryParams()

//Create Pinia store
const librariesStore = usePacbioLibrariesStore()

//Create VueX store
const store = useStore()

//computed
const libraries = computed(() => librariesStore.librariesArray)

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
</script>
