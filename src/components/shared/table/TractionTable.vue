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
  <div>
    <flagged-feature name="enable_custom_table">
      <template #disabled>
        <b-table-wrapper :fields="fields" :items="items">
          <template v-for="(_, slot) of $scopedSlots" #[slot]="scope"
            ><slot :name="slot" v-bind="scope" /></template
        ></b-table-wrapper>
      </template>
      <div class="flex flex-col overflow-x-auto">
        <div class="py-2 align-middle inline-block min-w-full">
          <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
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
                    class="px-6 py-3 bg-gray-50 content-center select-none"
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
                    @click="onRowClick(row, $event)"
                  >
                    <template v-for="cell in row">
                      <custom-table-cell
                        v-if="cell"
                        :key="'custom-' + rowIndex + '-' + cell.item.column.name"
                        :classes="backgroundColor(row)"
                      >
                        <slot :name="`cell(${cell.item.column.name})`" v-bind="cell">
                          {{ cell.item.text }}</slot
                        >
                      </custom-table-cell>
                    </template>
                  </tr>
                  <tr v-if="rows[rowIndex][0].detailsShowing" :key="'custom-comp' + rowIndex">
                    <custom-table-cell :classes="`border-0`">
                      <slot :name="`row-details`" v-bind="rows[rowIndex][0]" />
                    </custom-table-cell>
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
import { alphaNumericSortDefault } from '@/lib/DateHelpers'
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
      default: () => [{ key: '', label: '' }],
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
    dataIdField: {
      type: String,
      required: false,
      default: 'id',
    },
    selectable: {
      type: Boolean,
      required: false,
      default: false,
    },
    selectMode: {
      type: String,
      required: false,
      default: 'single',
      validator: () => within('single', 'multiple'),
    },
  },
  data() {
    return {
      rowDetails: [],
      sortField: { key: this.sortBy, ascending: true },
    }
  },

  computed: {
    sortedData() {
      if (!this.sortField) return this.items
      const isAsc = this.sortField.ascending
      const val = [...this.items].sort((a, b) => {
        let arr1 = isAsc ? a : b
        let arr2 = isAsc ? b : a
        return alphaNumericSortDefault(arr1[this.sortField.key], arr2[this.sortField.key], true)
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
              id:
                this.dataIdField in row && row[this.dataIdField]
                  ? row[this.dataIdField]
                  : rowIndx + ',' + colIndx,
              column: { index: colIndx, name: field.key },
              text: text,
            },
            toggleDetails: () => {
              if (this.rowDetails == undefined || this.rowDetails.length <= rowIndx) return
              this.rowDetails = [...this.rowDetails].map((rowDetail) => {
                return rowDetail.id == this.rowID(row)
                  ? { ...rowDetail, show: !rowDetail.show }
                  : rowDetail
              })
            },
            detailsShowing: this.isShowDetails(row),
            detailsDim: '100',
            rowSelected: this.isRowSelected(row),
            rowIndx: rowIndx,
          }
        })
      })
    },
  },
  watch: {
    items: function () {
      this.rowDetails = this.items
        ? this.items.map((data) => {
            return {
              id: this.dataIdField in data ? data[this.dataIdField] : '',
              show: false,
              selected: false,
            }
          })
        : []
    },
  },
  methods: {
    rowID(item) {
      return item && this.dataIdField in item && item[this.dataIdField]
        ? item[this.dataIdField]
        : -1
    },
    isShowDetails(row) {
      const rowIdVal = this.rowID(row)
      if (!rowIdVal) return false
      const details = this.rowDetails.find((rowd) => rowd.id === rowIdVal)
      return details ? details.show : false
    },
    isRowSelected(item) {
      const rowIdVal = this.rowID(item)
      if (!rowIdVal) return false
      const details = this.rowDetails.find((rowd) => rowd.id === rowIdVal)
      return details ? details.selected : false
    },
    /**Emitted when the page changes */
    sortButtonClick(fieldKey) {
      this.sortField = {
        key: fieldKey,
        ascending: this.sortField.key !== fieldKey ? true : !this.sortField.ascending,
      }
    },
    sortDirection(fieldkey) {
      return fieldkey == this.sortField.key
        ? this.sortField.ascending
          ? 'ascend'
          : 'descend'
        : 'none'
    },
    scoped() {
      return ['show_details']
    },
    onRowClick(row, e) {
      if (!this.selectable) return
      if (this.rowDetails == undefined || this.rowDetails.length <= row[0].item.rowIndx) {
        return
      }
      this.rowDetails = [...this.rowDetails].map((rowDetail) => {
        return rowDetail.id == this.rowID(row[0].item)
          ? { ...rowDetail, selected: !rowDetail.selected }
          : {
              ...rowDetail,
              selected:
                this.selectMode == 'single' ? false : e.shiftKey ? rowDetail.selected : false,
            }
      })
    },
    backgroundColor(row) {
      return this.isRowSelected(row[0].item) ? 'bg-gray-400' : ''
    },
  },
}
</script>
