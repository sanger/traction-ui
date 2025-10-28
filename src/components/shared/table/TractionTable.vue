<!--
   TractionTable
   Renders a table component using html <table> element
  
    The overall design of this component, in particular, the scoped slot design, data structures, 
    and event handling is based on how a bootstrap table is working so as to make this compatible 
    with b-table through feature flags


  1) Renders a simple table  if 'simple' prop set to true. 
     - 'fields' props are header columns labels
        This will display any slot component with a table header. If need to displayed as a table, 
        rows and colums to be defined as slots 
        @example for simple table
        <template>
        <traction-table simple 
            :fields=[{key:column1,label:'Header Column1', key:column2,label:'Header Column2']}>
        <traction-table-row>
            <traction-table-column>Column-1 value</traction-table-column>
            <traction-table-column>Column-2 value</traction-table-column>
        </traction-table-row>
        </traction-table>
   

   2) Renders table which accepts an object array
      - 'fields' props are header columns labels
      - 'items' field represents the data to be displayed, which can be an object array or a simple string array
          If object array, the object should contain fields corresponding to header field keys

   <template>
    <traction-table  
      :fields=[{key:column1,label:'Header Column1', key:column2,label:'Header Column2']}>
      :items=[{column1:'Column 1',column2:'Column 2'}]
    />
   </template

  
   Note: 
   - #[slot]="scope"  is equivalent of v-slot:[slotName]="slotScope"
-->

<template>
  <div class="flex">
    <div class="flex w-full py-2 align-middle inline-block min-w-full">
      <div class="flex flex-col w-full sm:rounded-lg">
        <table
          v-bind="$attrs"
          class="w-full divide-y divide-gray-100 table-auto text-sm"
          :data-attribute="dataAttribute"
        >
          <thead>
            <traction-table-row>
              <th
                v-for="(field, fieldIndex) in fields"
                :key="fieldKey(field, fieldIndex)"
                class="px-2 py-4 bg-gray-50 content-center select-none"
              >
                <div class="flex justify-center font-medium text-gray-600 text-sm">
                  <div class="py-2" :data-testid="`header-div-${fieldIndex}`">
                    {{ fieldText(field) }}
                  </div>
                  <traction-button
                    v-if="field.sortable"
                    :data-testid="`${field.key}-sort-button`"
                    theme="sort"
                    :size="'sm'"
                    :classes="'bg-gray-50 items-center'"
                    @click="sortButtonClick(field.key, fieldIndex)"
                  >
                    <traction-sort-icon :direction="sortDirection(field.key)" />
                  </traction-button>
                </div>
              </th>
            </traction-table-row>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-if="simple"><slot /></template>
            <template v-else>
              <template v-for="(row, rowIndex) in rows">
                <traction-table-row
                  v-if="row"
                  :key="rowIndex"
                  :class="`${selectable ? 'hover:bg-gray-200 cursor-pointer' : ''}`"
                >
                  <template v-for="(field, fieldIndex) in fields">
                    <traction-table-column
                      v-if="field"
                      :key="`custom-${rowIndex}-${fieldIndex}`"
                      :data-attribute="field.key"
                      :classes="`border-2 border-gray-100 ${backgroundColor(row)}`"
                      @click="onRowClick(row)"
                    >
                      <slot :name="`cell(${field.key})`" v-bind="row">
                        {{ text(row.item, field) }}</slot
                      >
                    </traction-table-column>
                  </template>
                </traction-table-row>
                <traction-table-row v-if="row.detailsShowing" :key="'custom-comp' + rowIndex">
                  <traction-table-column :classes="`border-0`" :colspan="fields.length">
                    <slot :name="`row-details`" v-bind="row" />
                  </traction-table-column>
                </traction-table-row>
              </template>
            </template>
          </tbody>
        </table>
        <template v-if="rows.length == 0 && !simple">
          <div class="text-md mt-8 whitespace-nowrap" data-testid="empty-text">
            {{ emptyText }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import TractionSortIcon from '@/components/shared/icons/TractionSortIcon'
import { alphaNumericSortDefault, flattenObject } from '@/lib/DataHelpers'
import { within } from '@/lib/propValidations'

export default {
  name: 'TractionTable',
  components: { TractionSortIcon },
  inheritAttrs: false,
  props: {
    //attribute name to represent this component for testing, if given
    dataAttribute: {
      type: String,
      default: 'tractionTable',
    },
    /**
     * Header fields
     * key - Key field of header column
     * label - Text to display on header
     * formatter - Formatter function if any customization required to display the header label
     */
    fields: {
      type: Array,
      default: () => [{ key: '', label: '', formatter: () => {} }],
    },
    /**
     * Data to display in table
     * This should be either an object array having field names same as header field keys or a string array
     */
    items: {
      type: Array,
      required: false,
      default: () => [],
    },
    /**
     * current sort-by column field
     */
    sortBy: {
      type: String,
      required: false,
      default: '',
    },
    /**
     * Primary key field to uniquely identify a row.
     * This can be particularly useful in cases where table is used with 'showDetails' functionality
     * (which allows the user to display extra information),
     * This key make sure that open/close row status will not be lost while sorting data
     *
     */
    primaryKey: {
      type: String,
      required: false,
      default: 'id',
    },
    /**
     * Specifies whether the table rows are selectable
     */
    selectable: {
      type: Boolean,
      required: false,
      default: false,
    },
    /**
     * Single/multiple row selection?
     */
    selectMode: {
      type: String,
      required: false,
      default: 'single',
      validator: () => within('single', 'multiple'),
    },
    /**
     * This allows to use table header with any slot component
     * 'fields' is the only mandatory prop and 'items' doesn't have any effect in this case
     */
    simple: {
      type: Boolean,
      required: false,
    },
    /**A text to be displayed in case there is no data available for a table which is not 'simple' */
    emptyText: {
      type: String,
      required: false,
      default: '',
    },
    /**Classes to apply to a single row */
    tbodyTrClass: {
      type: [String, Function],
      required: false,
      default: () => {},
    },
  },
  emits: ['row-clicked', 'row-selected'],
  data() {
    //Create 'row' data based on initial data passed in through 'items' prop
    const rows = this.generateRowData()
    return {
      rows: rows,
      //TODO: Ascending property to be passed as a prop
      sortField: { key: this.sortBy, ascending: false },
    }
  },
  watch: {
    //Update 'row' data, whenever the data changes (passed in through 'items' prop)
    items: {
      // We need deep here because items is an array of objects
      handler() {
        this.rows = this.generateRowData()
      },
      deep: true,
    },
  },

  methods: {
    generateRowData() {
      const rows = []

      /**Initially sort the  table data based on current sort field**/
      this.sortedData().forEach((item, rowIndex) => {
        const id =
          this.primaryKey in item && item[this.primaryKey] ? item[this.primaryKey] : rowIndex
        const row = this.rows?.find((row) => row.id === id)
        //This row already exists, so only update the data associated with it
        if (row) {
          rows.push({ ...row, item: item })
        } else
          rows.push({
            /**Table data to be displayed */
            item: { ...item },

            /**Id of row*/
            id: id,

            /**Callback method when a row is toggled using the button in 'showDetails' slot
             * Design is based on how bootstrap table is expecting this feature to work, to ensure the compatibility with b-table**/
            toggleDetails: () => {
              this.handleToggleDetails(id)
            },
            /**Flag to show whether the additional row is in display or not
               This prop design is based on how bootstrap table is expecting this feature to work to ensure it is compatible with b-table***/
            detailsShowing: false,

            /**The dimension to display if there is any labware svg displayed in row
             * If not given, the svg are displaying in small dimension and the reason couldn't be found**/
            detailsDim: '20',

            /**Is row selected or not?**/
            selected: false,

            /**Index of row**/
            index: rowIndex,
          })
      })
      return rows
    },
    sortedData() {
      /**Sort table data based on sort field */
      if (!this.sortBy) return this.items
      const isAsc = this.sortField ? this.sortField.ascending : false
      const val = [...this.items].sort((a, b) => {
        const arr1 = isAsc ? a : b
        const arr2 = isAsc ? b : a
        return alphaNumericSortDefault(arr1[this.sortBy], arr2[this.sortBy], true)
      })
      return val
    },
    /**Callback when a row is toggled using the button in 'showDetails' slot*/
    handleToggleDetails(id) {
      const rowIndex = this.rows.findIndex((row) => row.id === id)
      if (rowIndex < 0) return
      this.rows.splice(rowIndex, 1, {
        ...this.rows[rowIndex],
        detailsShowing: !this.rows[rowIndex].detailsShowing,
      })
    },
    /**Emitted when the sort button is clicked */
    sortButtonClick(fieldKey) {
      this.sortField = {
        key: fieldKey,
        ascending: this.sortField.key !== fieldKey ? true : !this.sortField.ascending,
      }
      const isAsc = this.sortField.ascending
      this.rows = [...this.rows].sort((a, b) => {
        const arr1 = isAsc ? a : b
        const arr2 = isAsc ? b : a
        return alphaNumericSortDefault(
          arr1.item[this.sortField.key],
          arr2.item[this.sortField.key],
          true,
        )
      })
    },
    /**Ascending or descending sort? */
    sortDirection(fieldkey) {
      return fieldkey == this.sortField.key
        ? this.sortField.ascending
          ? 'ascend'
          : 'descend'
        : 'none'
    },

    /**Callback when a row is clicked */
    onRowClick(row) {
      /**Only listen to column clicks. This is to avoid clicks from any any embedded controls like buttons displayed within columns  */
      const srcElement = window.event.srcElement
      if (!(srcElement instanceof HTMLTableCellElement)) return
      if (this.selectable) {
        //Toggle row selection and if multiple selection allowed, retain all other existing selections,
        const rowIndex = this.rows.findIndex((elem) => elem.id === row.id)
        if (rowIndex < 0) return
        const prevSelectedRowIndx =
          this.selectMode === 'single' ? this.rows.findIndex((row) => row.selected) : -1
        this.rows[rowIndex].selected = !this.rows[rowIndex].selected
        if (prevSelectedRowIndx >= 0 && prevSelectedRowIndx !== rowIndex) {
          this.rows[prevSelectedRowIndx].selected = false
        }
        /**Emit 'row-selected' even with table data corresponding to selected rows**/
        const selectedItems = this.rows.filter((row) => row.selected).map((row) => row.item)
        this.$emit('row-selected', selectedItems)
      }
      this.$emit('row-clicked', row.item)
    },
    /**Row background colour */
    backgroundColor(row) {
      const background =
        this.tbodyTrClass && typeof this.tbodyTrClass == 'function'
          ? this.tbodyTrClass(row.item)
          : ''
      return row.selected ? 'bg-gray-400' : background
    },
    /**Text to display in table */
    text(item, field) {
      let text = ''
      /**This is agian for bootstrap table compatibility which allows to access the nested data fields in an object
       */
      if (typeof item === 'object') {
        const flattenRow = flattenObject(item)
        text = flattenRow[field.key]
      } else {
        text = String(item)
      }
      if (field && typeof field === 'object' && 'formatter' in field) {
        const arr = flattenObject(item)
        return field.formatter(arr)
      } else {
        return text
      }
    },
    /**Key field accessor for the header field*/
    fieldKey(field, indx) {
      return typeof field === 'object' && 'key' in field ? field.key : indx
    },
    /**Value field accessor for header field */
    fieldText(field) {
      return typeof field === 'object' && 'label' in field
        ? field.label
        : typeof field == 'string'
          ? field
          : ''
    },
    /**Callback when a row is clicked */
    onRowClicked(value) {
      this.$emit('row-clicked', value)
    },
  },
}
</script>
