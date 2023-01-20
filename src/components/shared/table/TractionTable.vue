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
-->
<template>
  <div class="flex flex-col overflow-y-auto overflow-x-auto max-h-screen">
    <div class="py-2 align-middle inline-block min-w-full">
      <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table
          v-bind="$attrs"
          class="w-full divide-y divide-gray-200 table-fixed"
          data-attribute="dataAttribute"
        >
          <thead>
            <tr>
              <th
                v-for="(field, fieldIndex) in fields"
                :key="field.key"
                class="px-6 py-3 bg-gray-50 text-left select-none"
              >
                <div class="flex justify-center">
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
                    <traction-sort-icon
                      :direction="sortDirection(field.key)"
                      :class="text-red-100"
                    />
                  </traction-button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-for="(row, rowIndex) in rows">
              <tr :key="rowIndex">
                <template v-for="cell in row">
                  <custom-table-cell v-if="cell.item.custom" :key="'custom-' + cell.item.id">
                    <slot :name="`cell(${cell.item.column.name})`" v-bind="cell" />
                  </custom-table-cell>
                  <custom-table-cell v-else :key="cell.item.id">
                    {{ cell.item.text }}
                  </custom-table-cell>
                </template>
              </tr>
              <tr v-if="showRowDetails[rowIndex]" :key="'custom-comp' + rowIndex">
                <custom-table-cell>
                  <slot :name="`row-details`" v-bind="rows[rowIndex][0]" />
                </custom-table-cell>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import TractionArrowIcon from '@/components/shared/icons/TractionArrowIcon'
import { within } from '@/lib/propValidations'
export default {
  name: 'TractionTable',
  components: { TractionArrowIcon },
  inheritAttrs: false,
  props: {
    //attribute name to represent this component for testing, if given
    dataAttribute: {
      type: String,
      default: '',
    },
    fields: {
      type: Array,
      default: () => [{ key: '', label: '' }],
    },
    rowData: {
      type: Array,
      required: false,
      default: () => [],
    },
    customColumns: {
      type: Array,
      required: false,
      default: () => [],
    },
    sortBy: {
      type: String,
      required: false,
      default: '',
    },
  },
  data() {
    return {
      showRowDetails: this.rowData ? new Array(this.rowData.length).fill(false) : [],
      sortField: { name: this.sortBy, ascending: true },
    }
  },

  computed: {
    sortedData() {
      if (!this.sortField) return this.rowData
      const isAsc = this.sortField.ascending
      const val = [...this.rowData].sort((a, b) => {
        let arr1 = isAsc ? a : b
        let arr2 = isAsc ? b : a
        if (arr1[this.sortField] < arr2[this.sortField]) {
          return -1
        }
        if (arr1[this.sortField] > arr2[this.sortField]) {
          return 1
        }
        return 0
      })
      return val
    },
    rows() {
      return this.sortedData.map((row, rowIndx) => {
        return this.fields.map((field, colIndx) => {
          let text = ''
          if (typeof row === 'object' && field.key in row) {
            text = row[field.key]
          } else {
            text = row[colIndx]
          }
          return {
            item: {
              ...row,
              id: rowIndx + ',' + colIndx,
              rowIndx: rowIndx,
              column: { index: colIndx, name: field.key },
              text: text,
              custom: this.customColumns.some((column) => column === field.key),
            },
            toggleDetails: () => {
              if (this.showRowDetails == undefined || this.showRowDetails.length <= rowIndx) return
              this.showRowDetails = [...this.showRowDetails].map((val, index) =>
                rowIndx == index ? !val : val,
              )
            },
            detailsShowing: this.showRowDetails[rowIndx],
          }
        })
      })
    },
  },
  watch: {
    rowData: function () {
      this.showRowDetails = this.rowData ? new Array(this.rowData.length).fill(false) : []
    },
  },
  methods: {
    /**Emitted when the page changes */
    sortButtonClick(column) {
      this.sortField = {
        name: column,
        ascending: this.sortField.name !== column ? true : !this.sortField.ascending,
      }
    },
    sortDirection(name) {
      return this.sortField.name == name ? (this.sortField.ascending ? 'down' : 'up') : 'none'
    },
  },
}
</script>
