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
      'flex flex-col rounded rounded-md px-4 py-3 space-x-4 mb-2', // padding
      `text-base leading-0`, // text style
      `${color.message}`, // font color, background color
    ]"
  >
    <div class="flex justify-end items-center">
      <button data-attribute="dismiss" @click="dismiss">
        <traction-close-icon :class-names="`${color.icon}`" />
      </button>
    </div>
    <div class="inline-block flex-grow text-end mb-[3px]">
      {{ message }}
      <div class="text-xs text-gray-500 text-end border-t-2 border-gray-300">
        {{ origin }} - {{ time }}
      </div>
    </div>
  </div>
</template>

<script>
const colorStyles = {
  success: {
    message: 'success-message',
    icon: 'success-icon',
  },
  danger: {
    message: 'failure-message',
    icon: 'failure-icon',
  },
  warning: {
    message: 'warning-message',
    icon: 'warning-icon',
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
    /**Property to specify alert type - 'success' and 'danger' are the variants supported which are bootstrap compatible*/
    type: {
      type: String,
      default: 'primary',
    },
    /**Message to display */
    message: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: false,
      default: 'Unknown Origin',
    },
    time: {
      type: String,
      required: false,
      default: new Date().toLocaleTimeString(),
    },
  },
  emits: ['dismissed'],
  computed: {
    /**
     * Returns tailwind colors based on 'type' property with default being grey.
     *  The supported values for 'type' property are as follows
     * 'success' -  will be displayed in green color
     * 'danger'  -  will be displayed in red color
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
