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
      data-attribute="message"
      :class="[
        'flex flex-row border-b-2 border-gray-200 rounded rounded-md px-5 py-3 space-x-4 mb-4', //border and padding
        `text-base leading-6`, // text style
        `${color.message}`, // font color, background color
      ]"
    >
      <div class="w-full">
        {{ message }}
      </div>
      <div class="flex justify-end">
        <button data-attribute="close" @click="dismiss">
          <traction-close-icon :class-names="`${color.icon}`" />
        </button>
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
      let value = { message: 'bg-gray-300 text-gray-400', icon: '' }
      if (this.type === 'success') {
        value = {
          message: 'bg-green-100 text-green-700',
          icon: 'text-green-300 hover:text-green-700',
        }
      }
      if (this.type === 'error' || this.type === 'danger') {
        value = { message: 'bg-red-200 text-red-400', icon: 'text-red-300 hover:text-red-400' }
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
