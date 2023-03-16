<!--
   TractionTable
   Renders a table component using html <table> element
  
  The design of this component is based on how a b-table is working inorder to make it compatible
   with b-table through feature flags

  1) Renders a simple table  if 'simple' prop set to true. 
     - 'fields' props are header columns labels
     - rows and colums to be defined as slots 
    @example for simple table
    <template>
    <traction-table simple 
        :fields=[{key:column1,label:'Header Column1', key:column2,label:'Header Column2']}>
     <traction-table-row>
         <traction-table-column>Column-1 value</traction-table-column>
         <traction-table-column>Column-2 value</traction-table-column>
    </traction-table-row>
    </traction-table>
   

   2)Renders table which accepts a object array
   - 'fields' props are header columns labels
   - 'items' is the data to be displayed, which can be objects array or a simple string array
      if object array, the object should contain fields corresponding to header field keys
   <template>
    <traction-table  
      :fields=[{key:column1,label:'Header Column1', key:column2,label:'Header Column2']}>
      :items=[{column1:'Column 1',column2:'Column 2'}]
    />
   </template

  
   Note: #[slot]="scope"  is equivalent of v-slot:[slotName]="slotScope"
-->
<template>
  <flagged-feature name="enable_custom_table">
    <template #disabled>
      <b-table-wrapper
        :fields="fields"
        :items="items"
        :selectable="selectable"
        :select-mode="selectMode"
        :primary-key="primaryKey"
        :simple="simple"
        @row-selected="onRowSelection"
      >
        <template v-for="(_, slot) of $scopedSlots" #[slot]="scope"
          ><slot :name="slot" v-bind="scope" /></template
      ></b-table-wrapper>
    </template>
    <div class="flex">
      <div class="flex w-full py-2 align-middle inline-block min-w-full">
        <div class="flex w-full sm:rounded-lg">
          <table
            v-bind="$attrs"
            class="w-full divide-y divide-gray-100 table-auto text-sm"
            data-attribute="dataAttribute"
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
                      :classes="'bg-gray-50'"
                      @click="sortButtonClick(field.key, fieldIndex)"
                    >
                      <traction-sort-icon :direction="sortDirection(field.key)" />
                    </traction-button>
                  </div>
                </th>
              </traction-table-row>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <template v-if="simple"><slot /> </template>
              <template v-for="(row, rowIndex) in rows" v-else>
                <traction-table-row
                  v-if="row"
                  :key="rowIndex"
                  :class="`${selectable ? 'hover:bg-gray-200 cursor-pointer' : ''}`"
                >
                  <template v-for="(field, fieldIndex) in fields">
                    <traction-table-column
                      v-if="field"
                      :id="field.key"
                      :key="`custom-${rowIndex}-${fieldIndex}`"
                      :classes="`border-2 border-gray-100 ${backgroundColor(row)}`"
                      @click="onRowClick($event, row)"
                    >
                      <slot :name="`cell(${field.key})`" v-bind="row">
                        {{ text(row.item, field) }}</slot
                      >
                    </traction-table-column>
                  </template>
                </traction-table-row>
                <traction-table-row v-if="row.detailsShowing" :key="'custom-comp' + rowIndex">
                  <traction-table-column :classes="`border-0`">
                    <slot :name="`row-details`" v-bind="row" />
                  </traction-table-column>
                </traction-table-row>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </flagged-feature>
</template>
<script>
import TractionSortIcon from '@/components/shared/icons/TractionSortIcon'
import BTableWrapper from '@/components/shared/table/BTableWrapper'
import { alphaNumericSortDefault, flattenObject } from '@/lib/DateHelpers'
import { within } from '@/lib/propValidations'

export default {
  name: 'TractionTable',
  components: { TractionSortIcon, BTableWrapper },
  inheritAttrs: false,
  props: {
    //attribute name to represent this component for testing, if given
    dataAttribute: {
      type: String,
      default: '',
    },
    /**
     * Header fields
     * key - key field to the header column
     * label - label to display on header
     * formatter - Formatter function if any customization required to display the header label
     */
    fields: {
      type: Array,
      default: () => [{ key: '', label: '', formatter: () => {} }],
    },
    /**
     * Data to display in table
     * This should be an object data having field names same as header field keys
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
     * For table which has got a 'showDetails' functionality (which allows the user to display extra information),
     * it is required to provide a primaryKey. This allows to keep the state internally, so that
     * open/close row status will not be lost while sorting data
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
     * 'fields' is the only mandatory props and 'items' doesn't have any effect in this case
     */
    simple: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    //Create 'row' data based on initial data passed in through 'items' prop
    const rows = this.generateRowData()
    return {
      rows: rows,
      sortField: { key: this.sortBy, ascending: true },
    }
  },
  watch: {
    //Update 'row' data, whenever the data changes (passed in through 'items' prop)
    items: function () {
      this.rows = this.generateRowData()
    },
  },

  methods: {
    generateRowData() {
      const rows = []

      /**Initially sort the  table data based on current sort field**/
      this.sortedData().forEach((item, rowIndx) => {
        const id =
          this.primaryKey in item && item[this.primaryKey] ? item[this.primaryKey] : rowIndx
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

            /**The dimension to display if there is any labware svg displayed in row**/
            detailsDim: '60',

            /**Is row is selected or not?**/
            rowSelected: false,

            /**Index of row**/
            rowIndx: rowIndx,
          })
      })
      return rows
    },
    sortedData() {
      /**Sort table data based on sort field */
      if (!this.sortField) return this.items
      const isAsc = this.sortField.ascending
      const val = [...this.items].sort((a, b) => {
        const arr1 = isAsc ? a : b
        const arr2 = isAsc ? b : a
        return alphaNumericSortDefault(arr1[this.sortField.key], arr2[this.sortField.key], true)
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
    onRowClick(id, row) {
      /**Only listen to column clicks. This is to avoid clicks from any any embedded controls like buttons displayed within columns  */
      const srcElement = window.event.srcElement
      if (!(srcElement instanceof HTMLTableCellElement)) return
      if (!this.selectable) return
      //Toggle row selection

      const rowIndex = this.rows.findIndex((elem) => elem.id === row.id)
      if (rowIndex < 0) return

      const prevSelectedRowIndx =
        this.selectMode === 'single' ? this.rows.findIndex((row) => row.rowSelected) : -1
      this.rows[rowIndex].rowSelected = !this.rows[rowIndex].rowSelected
      if (prevSelectedRowIndx >= 0 && prevSelectedRowIndx !== rowIndex) {
        this.rows[prevSelectedRowIndx].rowSelected = false
      }
      const selectedItems = this.rows.filter((row) => row.rowSelected).map((row) => row.item)
      /**Emit 'row-selected' even with table data corresponding to selected rows**/
      this.$emit('row-selected', selectedItems)
    },
    /**Row background colour */
    backgroundColor(row) {
      return row.rowSelected ? 'bg-gray-400' : ''
    },
    /**Text to display in table */
    text(item, field) {
      let text = ''
      /**This is agian for bootstrap table compatibility which allows to access the nested data fields in an object
       * The only contradiction from b-table is - if there are multiple fields with same name in nested hierarchy,
       * this will always returns the last field matching
       */
      if (typeof item === 'object') {
        const flattenRow = flattenObject(item)
        text = flattenRow[field.key]
      } else {
        text = String(item)
      }
      if (field && 'formatter' in field) {
        const arr = flattenObject(item)
        return field.formatter(arr)
      } else {
        return text
      }
    },
    /**Key value accessor for the header fiels */
    fieldKey(field, indx) {
      return typeof field === 'object' && 'key' in field ? field.key : indx
    },
    /**Value accessor for header field */
    fieldText(field) {
      return typeof field === 'object' && 'label' in field
        ? field.label
        : typeof field == 'string'
        ? field
        : ''
    },
    /**This is for Bootstrap row selection which needs a re-emission which failed to work otherwise  */
    onRowSelection(value) {
      this.$emit('row-selected', value)
    },
  },
}
</script>