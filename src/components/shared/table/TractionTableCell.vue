<!--/**
   * # TractionTableCell
   *
   * This component provides a wrapper for a table cell  to display in traction-table
   *
   * @example
   * <template>
   * <traction-table>
   *  <tr>
   *      <traction-table-cell>STAN-123</traction-table-cell>
   *      <traction-table-cell>Proviasette</traction-table-cell>
   *    </tr>
   * </traction-table>
   * </template>
   */
-->
<template>
  <td v-bind="$attrs" :class="`text-sm text-center px-1 py-1 border-2 border-gray-200  ${classes}`">
    <slot />
  </td>
</template>
<script>
export default {
  name: 'TractionTableCell',
  props: {
    id: {
      type: String,
      default: '',
    },
    classes: {
      type: String,
      required: false,
      default: '',
    },
  },
}
</script>
