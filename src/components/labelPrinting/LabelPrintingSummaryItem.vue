<!--
  Usage:
    <label-printing-summary-item label="Key">
      Value
    </label-printing-summary-item>
 -->

<template>
  <div class="w-full flex flex-row justify-between">
    <span class="font-light">{{ label }}:</span>
    <span class="font-medium"><slot /></span>
  </div>
</template>

<script>
export default {
  name: 'LabelPrintingSummaryItem',
  components: {},
  props: {
    label: {
      type: String,
      required: true,
    },
  },
}
</script>
