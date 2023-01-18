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
          class="w-full divide-y divide-gray-200"
          data-attribute="dataAttribute"
        >
          <thead>
            <tr>
              <th
                v-for="field in fields"
                :key="field.key"
                className="px-6 py-3 bg-gray-50 text-left select-none"
              >
                {{ field.label }}
                <traction-button
                  v-if="field.sortable"
                  :data-testid="`${field.key}-sort-button`"
                  theme="navigation"
                  @click="sortButtonClick(field.key, indx)"
                >
                  <traction-arrow-icon direction="up">
                    <path
                      d="m11 18-6-6 6-6 1.4 1.4L7.825 12l4.575 4.6Zm6.6 0-6-6 6-6L19 7.4 14.425 12 19 16.6Z"
                    />
                  </traction-arrow-icon>
                </traction-button>
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
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import TractionArrowIcon from '@/components/shared/icons/TractionArrowIcon'

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
  },
  data() {
    return {
      details: new Array(10).fill(false),
    }
  },
  computed: {
    rows() {
      const val = this.rowData.map((row, rowIndx) => {
        return this.fields.map((field, colIndx) => {
          let text = ''
          if (typeof this.rowData[rowIndx] === 'object' && field.key in this.rowData[rowIndx]) {
            text = row[field.key]
          } else {
            text = row[colIndx]
          }
          return {
            item: {
              id: rowIndx + ',' + colIndx,
              rowIndx: rowIndx,
              column: { index: colIndx, name: field.key },
              text: text,
              custom: this.customColumns.some((column) => column === field.key),
            },
            toggleDetails: () => {
              if (this.details == undefined || this.details.length <= rowIndx) return
              const newDetails = [...this.details]
              newDetails[rowIndx] = !newDetails[rowIndx]
              this.details = newDetails
            },
            detailsShowing: this.details[rowIndx],
          }
        })
      })
      return val
    },
  },
  methods: {
    /**Emitted when the page changes */
    sortClick(column, index) {
      this.sortFields[index] = !this.sortFields[index]
      this.$emit('input', column)
    },
    
  },
}
</script>
