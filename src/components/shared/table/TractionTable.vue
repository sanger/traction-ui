<!--
   TractionTable
   Renders a table component using html <table> element
  * @example
   * <template>
   * <traction-table>
   *  <tr>
   *      <traction-table-cell>STAN-123</traction-table-cell>
   *      <traction-table-cell>Proviasette</traction-table-cell>
   * </tr>
   * </traction-table>
   */
   #[slot]="scope"  is equivalent of v-slot:[slotName]="slotScope"
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
      <div class="py-2 align-middle inline-block min-w-full">
        <div class="sm:rounded-lg">
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
                  <div class="flex justify-center font-medium text-gray-600 text-xs">
                    <div class="py-2">
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
                      :key="'custom-' + rowIndex + '-' + fieldIndex"
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
    id: {
      type: String,
      default: '',
    },
    fields: {
      type: Array,
      default: () => [{ key: '', label: '', formatter: () => {} }],
    },
    items: {
      type: Array,
      required: false,
      default: () => [],
    },
    sortBy: {
      type: String,
      required: false,
      default: '',
    },
    primaryKey: {
      type: String,
      required: false,
      default: 'id',
    },
    selectable: {
      type: Boolean,
      required: false,
      default: true,
    },
    selectMode: {
      type: String,
      required: false,
      default: 'single',
      validator: () => within('single', 'multiple'),
    },
    simple: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    const rows = this.sortedData().map((row, rowIndx) => {
      const id = this.primaryKey in row && row[this.primaryKey] ? row[this.primaryKey] : rowIndx
      return {
        item: { ...row },
        id: id,
        toggleDetails: () => {
          this.handleToggleDetails(id)
        },
        detailsShowing: false,
        rowSelected: false,
        rowIndx: rowIndx,
        detailsDim: '60',
      }
    })
    return {
      rows: rows,
      sortField: { key: this.sortBy, ascending: true },
    }
  },
  watch: {
    items: function () {
      const rows = []
      this.sortedData().forEach((item, rowIndx) => {
        const id =
          this.primaryKey in item && item[this.primaryKey] ? item[this.primaryKey] : rowIndx
        const row = this.rows.find((row) => row.id === id)
        if (row) {
          rows.push({ ...row, item: item })
        } else
          rows.push({
            item: { ...item },
            id: id,
            toggleDetails: () => {
              this.handleToggleDetails(id)
            },
            detailsShowing: false,
            rowSelected: false,
            rowIndx: rowIndx,
            detailsDim: '60',
          })
      })
      this.rows = rows
    },
  },

  methods: {
    sortedData() {
      if (!this.sortField) return this.items
      const isAsc = this.sortField.ascending
      const val = [...this.items].sort((a, b) => {
        const arr1 = isAsc ? a : b
        const arr2 = isAsc ? b : a
        return alphaNumericSortDefault(arr1[this.sortField.key], arr2[this.sortField.key], true)
      })
      return val
    },
    handleToggleDetails(id) {
      const rowIndex = this.rows.findIndex((row) => row.id === id)
      if (rowIndex < 0) return
      this.rows.splice(rowIndex, 1, {
        ...this.rows[rowIndex],
        detailsShowing: !this.rows[rowIndex].detailsShowing,
      })
    },
    /**Emitted when the page changes */
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
    sortDirection(fieldkey) {
      return fieldkey == this.sortField.key
        ? this.sortField.ascending
          ? 'ascend'
          : 'descend'
        : 'none'
    },
    onRowClick(id, row) {
      const srcElement = window.event.srcElement
      if (!(srcElement instanceof HTMLTableCellElement)) return
      if (!this.selectable) return
      const rowIndex = this.rows.findIndex((elem) => elem.id === row.id)
      const prevSelectedRowIndx =
        this.selectMode === 'single' ? this.rows.findIndex((row) => row.rowSelected) : -1
      if (rowIndex < 0) return
      this.rows.splice(rowIndex, 1, {
        ...this.rows[rowIndex],
        rowSelected: !this.rows[rowIndex].rowSelected,
      })
      if (prevSelectedRowIndx >= 0 && prevSelectedRowIndx !== rowIndex) {
        this.rows.splice(prevSelectedRowIndx, 1, {
          ...this.rows[prevSelectedRowIndx],
          rowSelected: false,
        })
      }
      const selectedRows = this.rows.filter((row) => row.rowSelected)
      const selectedItems = selectedRows.map((row) => row.item)
      this.$emit('row-selected', selectedItems)
    },
    backgroundColor(row) {
      return row.rowSelected ? 'bg-gray-400' : ''
    },
    text(item, field) {
      let text = ''
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
    fieldKey(field, indx) {
      return typeof field === 'object' && 'key' in field ? field.key : indx
    },
    fieldText(field) {
      return typeof field === 'object' && 'label' in field
        ? field.label
        : typeof field == 'string'
        ? field
        : ''
    },
    onRowSelection(value) {
      this.$emit('row-selected', value)
    },
  },
}
</script>
