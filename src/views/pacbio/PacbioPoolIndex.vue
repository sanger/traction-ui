<template>
  <DataFetcher :fetcher="fetchPools">
    <FilterCard :fetcher="fetchPools" :filter-options="state.filterOptions" />
    <div class="flex flex-col">
      <div class="clearfix">
        <printerModal
          ref="printerModal"
          class="float-left"
          :disabled="state.selected.length === 0"
          @selectPrinter="printLabels($event)"
        >
        </printerModal>

        <traction-pagination class="float-right" aria-controls="pool-index"> </traction-pagination>
      </div>

      <traction-table
        id="pool-index"
        v-model:sort-by="sortBy"
        :items="pools"
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
          <router-link
            id="edit-pool"
            data-action="edit-pool"
            :to="{ name: 'PacbioPoolCreate', params: { id: row.item.id } }"
          >
            <traction-button :id="'editPool-' + row.item.id" size="sm" theme="edit"
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
            @click="row.toggleDetails"
          >
            {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
          </traction-button>
        </template>

        <template #row-details="row">
          <div>
            <traction-table :items="row.item.used_aliquots" :fields="field_in_details">
            </traction-table>
            <div class="flex mx-auto px-2 text-left">
              <ul v-if="!row.item.run_suitability.valid">
                <li v-for="(error, index) in row.item.run_suitability.formattedErrors" :key="index">
                  {{ error }}
                </li>
              </ul>
            </div>
          </div>
        </template>
      </traction-table>
    </div>
  </DataFetcher>
</template>

<script setup>
import PrinterModal from '@/components/PrinterModal.vue'
import FilterCard from '@/components/FilterCard.vue'
import DataFetcher from '@/components/DataFetcher.vue'
import { usePacbioPoolsStore } from '@/stores/pacbioPools.js'
import useQueryParams from '@/composables/useQueryParams.js'
import useAlert from '@/composables/useAlert.js'
import { getCurrentDate } from '@/lib/DateHelpers.js'
import { ref, reactive, computed } from 'vue'
import { useStore } from 'vuex'
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
 * PacbioPoolIndex component is used to display the list of pools.
 */

//define reactive variables
const state = reactive({
  // Define fields for the table
  fields: [
    { key: 'selected', label: '\u2713' },
    { key: 'id', label: 'Pool ID', sortable: true, tdClass: 'pool-id' },
    {
      key: 'run_suitability.ready_for_run',
      label: 'Ready',
      formatter: (obj) => (obj['run_suitability.ready_for_run'] ? '✓' : ''),
      sortable: true,
    },
    { key: 'barcode', label: 'Pool Barcode', sortable: true },
    { key: 'source_identifier', label: 'Source', sortable: true },
    { key: 'volume', label: 'Volume', sortable: true },
    { key: 'concentration', label: 'Concentration', sortable: true },
    {
      key: 'template_prep_kit_box_barcode',
      label: 'Template Prep Kit Box Barcode',
      sortable: true,
    },
    { key: 'insert_size', label: 'Insert Size', sortable: true },
    { key: 'created_at', label: 'Created at (UTC)', sortable: true },
    { key: 'actions', label: 'Actions' },
    { key: 'show_details', label: '' },
  ],
  field_in_details: [
    { key: 'sample_name', label: 'Sample(s)' },
    { key: 'group_id', label: 'Tag(s)' },
  ],
  filterOptions: [
    { value: '', text: '' },
    { value: 'barcode', text: 'Pool Barcode' },
    { value: 'sample_name', text: 'Sample Name' },
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
const poolsStore = usePacbioPoolsStore()
const pools = computed(() => poolsStore.poolsArray)

//Create VueX store
const vuexStore = useStore()

//methods
const createLabels = () => {
  const date = getCurrentDate()
  return state.selected.map(({ barcode, source_identifier }) => {
    return {
      barcode,
      first_line: 'Pacbio - Pool',
      second_line: date,
      third_line: barcode,
      fourth_line: source_identifier,
      label_name: 'main_label',
    }
  })
}

/**
 * This asynchronous function dispatches a Vuex action to create a print job and shows an alert based on the result.
 * It takes a `printerName` as a parameter, dispatches the 'printMyBarcode/createPrintJob' action with the `printerName`, labels created by the `createLabels` function, and 1 copy, and waits for the result.
 * The result is expected to be an object with a `success` property and a `message` property.
 * If the `message` property doesn't exist, it defaults to an empty object.
 * After the action is dispatched, it shows an alert with the `message` and a type based on the `success` status.
 *
 * @async
 * @param {string} printerName - The name of the printer.
 * @returns {Promise<void>} A promise that resolves when the action has been dispatched and the alert has been shown.
 */
const printLabels = async (printerName) => {
  const { success, message = {} } = await vuexStore.dispatch('printMyBarcode/createPrintJob', {
    printerName,
    labels: createLabels(),
    copies: 1,
  })
  showAlert(message, success ? 'success' : 'danger')
}

/**
 * This asynchronous function fetches pools using the `fetchPools` method from `poolsStore`.
 * It passes `state.filterOptions` as query parameters to the `fetchPools` method.
 *
 * @async
 * @returns {Promise<any>} A promise that resolves to the result of the `fetchPools` method.
 */
const fetchPools = async () => {
  return await fetchWithQueryParams(poolsStore.fetchPools, state.filterOptions)
}
</script>
