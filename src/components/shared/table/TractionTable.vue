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
  <div>
    <flagged-feature name="enable_custom_table">
      <template #disabled>
        <b-table-wrapper
          :fields="fields"
          :items="items"
          :selectable="selectable"
          :select-mode="selectMode"
          :primary-key="primaryKey"
          
        >
          <template v-for="(_, slot) of $scopedSlots" #[slot]="scope"
            ><slot :name="slot" v-bind="scope" /></template
        ></b-table-wrapper>
      </template>
      <div class="flex">
        <div class="py-2 align-middle inline-block min-w-full">
          <div class="shadow border-b border-gray-200 sm:rounded-lg">
            <table
              v-bind="$attrs"
              class="w-full divide-y divide-gray-200 table-auto text-sm"
              data-attribute="dataAttribute"
            >
              <thead>
                <tr>
                  <th
                    v-for="(field, fieldIndex) in fields"
                    :key="field.key"
                    class="px-2 py-4 bg-gray-50 content-center select-none"
                  >
                    <div class="flex justify-center font-medium text-gray-600 text-xs">
                      <div class="py-2">
                        {{ field.label }}
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
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <template v-for="(row, rowIndex) in rows">
                  <tr
                    v-if="row"
                    :key="rowIndex"
                    :class="`${selectable ? 'hover:bg-gray-200 cursor-pointer' : ''}`"
                  >
                    <template v-for="(field, fieldIndex) in fields">
                      <traction-table-cell
                        v-if="field"
                        :id="field.key"
                        :key="'custom-' + rowIndex + '-' + fieldIndex"
                        :classes="`${backgroundColor(row)}`"
                        @click="onRowClick($event, row)"
                      >
                        <slot :name="`cell(${field.key})`" v-bind="row">
                          {{ text(row.item, field) }}</slot
                        >
                      </traction-table-cell>
                    </template>
                  </tr>
                  <tr v-if="row.detailsShowing" :key="'custom-comp' + rowIndex">
                    <traction-table-cell :classes="`border-0`">
                      <slot :name="`row-details`" v-bind="row" />
                    </traction-table-cell>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </flagged-feature>
  </div>
</template>
<script>
import TractionSortIcon from '@/components/shared/icons/TractionSortIcon'
import BTableWrapper from '@/components/shared/table/BTableWrapper'
import TractionTableCell from '@/components/shared/table/TractionTableCell'
import { alphaNumericSortDefault, flattenObject } from '@/lib/DateHelpers'
import { within } from '@/lib/propValidations'

export default {
  name: 'TractionTable',
  components: { TractionSortIcon, BTableWrapper, TractionTableCell },
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
  },
  data() {
    const rows = this.sortedData().map((row, rowIndx) => {
      const id = this.primaryKey in row && row[this.primaryKey] ? row[this.primaryKey] : rowIndx
      return {
        item: { ...row },
        id: this.primaryKey in row && row[this.primaryKey] ? row[this.primaryKey] : rowIndx,
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
      if (!this.selectable) return
      const rowIndex = this.rows.findIndex((elem) => elem.id === row.id)
      const prevSelectedRowIndx =
        this.selectMode === 'single' ? this.rows.findIndex((row) => row.rowSelected) : -1
      if (rowIndex < 0) return
      this.rows.splice(rowIndex, 1, {
        ...this.rows[rowIndex],
        rowSelected: !this.rows[rowIndex].rowSelected,
      })
      if (prevSelectedRowIndx >= 0) {
        this.rows.splice(prevSelectedRowIndx, 1, {
          ...this.rows[prevSelectedRowIndx],
          rowSelected: !this.rows[prevSelectedRowIndx].rowSelected,
        })
      }
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
  },
}
</script>
