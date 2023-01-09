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
    <div>
      <div class="py-2 align-middle inline-block min-w-full">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table
            v-bind="$attrs"
            class="min-w-full divide-y divide-gray-200"
            :data-attribute="dataAttribute"
          >
            <thead>
              <tr>
                <th
                  v-for="(headerColumn, indx) in headerColumns"
                  :key="headerColumn.name"
                  className="px-6 py-3 bg-gray-50 text-left select-none"
                >
                  {{ headerColumn }}
                  <traction-button
                    v-if="headerColumn.sortRequired"
                    :data-testid="`${headerColumn}-sort-button`"
                    @click="sortButtonClick(headerColumn, indx)"
                  >
                    <traction-arrow-icon>
                      <path
                        d="m11 18-6-6 6-6 1.4 1.4L7.825 12l4.575 4.6Zm6.6 0-6-6 6-6L19 7.4 14.425 12 19 16.6Z"
                      />
                    </traction-arrow-icon>
                  </traction-button>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <slot />
            </tbody>
          </table>
        </div>
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
    headerColumns: {
      type: Array,
      required: true,
      default: () => [{ name: '', sortRequired: false }],
      validator: (columns) => {
        const columnNames = columns.map((col) => col.name)
        return columnNames.length == new Set(columnNames).size
      },
    },
  },
  data() {
    return {
      sortAscending: this.headerColumns.map(() => false),
    }
  },
  methods: {
    /**Emitted when the page changes */
    sortClick(column, index) {
      this.sortAscending[index] = !this.sortAscending[index]
      this.$emit('input', column)
    },
  },
}


