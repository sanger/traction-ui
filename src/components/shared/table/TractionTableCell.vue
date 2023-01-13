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
  <td v-bind="$attrs" className="px-6 py-4 whitespace-nowrap"><slot /></td>
</template>
<script>
export default {
  name: 'TractionTableCell',
  props:{
    id:{
      type:String,
      default:""
    }
  }
}
</script>
