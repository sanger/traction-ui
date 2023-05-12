<template>
  <flagged-feature name="enable_custom_alert">
    <template #disabled>
      <div>
        <b-alert :variant="variant" :data-type="dataType" dismissible show @dismissed="dismiss()">{{
          message
        }}</b-alert>
      </div></template
    >
    <div
      :class="[
        'flex flex-row border-b-2 border-gray-200 px-4 pb-4 sm:p-6 sm:pb-4 space-x-4', //border and padding
        `text-lg leading-6 font-medium`, // text style
        `${color}`, // font color, background color
      ]"
    >
      <div class="w-full">
        <label>{{ message }}</label>
      </div>
      <div class="flex justify-end">
        <button data-attribute="close" @click="dismiss"><traction-close-icon /></button>
      </div>
    </div>
  </flagged-feature>
</template>

<script>
import { BAlert } from 'bootstrap-vue'
export default {
  name: 'TractionMessage',
  components: { BAlert },
  props: {
    dataType: {
      // Used primarily by the e2e tests to identify the correct error message
      type: String,
      default() {
        return 'error-message'
      },
    },
    type: {
      type: String,
      default: 'primary',
    },
    message: {
      type: String,
      required: true,
    },
  },
  computed: {
    /**
     * This can be removed once enable_custom_alert feature flag is removed
     */
    variant() {
      return (
        {
          error: 'danger',
        }[this.type] || this.type
      )
    },
    color() {
      let value = 'bg-gray-300 text-gray-400'
      if (this.type === 'success') {
        value = 'bg-green-300 text-green-400'
      }
      if (this.type === 'error' || this.type === 'danger') {
        value = 'bg-red-200 text-red-400'
      }

      return value
    },
  },
  methods: {
    dismiss() {
      this.$emit('dismissed')
    },
  },
}
</script>
