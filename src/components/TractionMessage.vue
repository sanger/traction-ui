<!--/**
   * # TractionMessage
   * Tailwind component to display an alert message. This component uses  html component (based on tailwind styles) 
   * The alert message includes message and a close button 
   * 
   */
   -->
<template>
  <div
    data-attribute="message"
    :data-type="dataType"
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
</template>

<script>
const colorStyles = {
  success: {
    message: 'bg-green-100 text-green-700',
    icon: 'text-green-400 hover:text-green-700',
  },
  danger: {
    message: 'bg-red-200 text-red-600',
    icon: 'text-red-400 hover:text-red-600',
  },
  error: {
    message: 'bg-red-200 text-red-600',
    icon: 'text-red-400 hover:text-red-600',
  },
}

export default {
  name: 'TractionMessage',
  props: {
    dataType: {
      // Used primarily by the e2e tests to identify the correct error message
      type: String,
      default() {
        return 'error-message'
      },
    },
    /**Property to specify alert type - 'success', 'error' and 'danger' are the variants supported which are bootstrap compatible*/
    type: {
      type: String,
      default: 'primary',
    },
    /**Message to display */
    message: {
      type: String,
      required: true,
    },
  },
  computed: {
    /**
     * Returns tailwind colors based on 'type' property with default being grey.
     *  The supported values for 'type' property are as follows
     * 'success' -  will be displayed in green color
     * 'error'  -  will be displayed in red color
     */
    color() {
      return colorStyles[this.type] ?? { message: 'bg-gray-300 text-gray-500', icon: '' }
    },
  },
  methods: {
    dismiss() {
      this.$emit('dismissed')
    },
  },
}
</script>
