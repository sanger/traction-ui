<template>
  <fieldset>
    <traction-heading level="4" show-border>User barcode or swipecard</traction-heading>
    <traction-muted-text class="flex justify-left">{{ description }}</traction-muted-text>
    <traction-field-error data-attribute="user-code-error" :error="error">
      <traction-input
        id="userCode"
        v-model="localUserCode"
        data-attribute="user-code-input"
        class="flex w-full"
        @update:model-value="updateUserCode"
      />
    </traction-field-error>
  </fieldset>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: 'Enter user barcode/swipecard',
  },
  error: {
    type: String,
    default: '',
  },
  validateUserCode: {
    type: Function,
    default: () => {},
  },
})

const emits = defineEmits(['update:modelValue']) // Update to support v-model
const localUserCode = ref(props.modelValue)

// Sync localUserCode with prop updates from the parent
watch(
  () => props.modelValue,
  (newVal) => {
    localUserCode.value = newVal
  },
)

// Emit changes to parent and trigger validation
function updateUserCode(value) {
  emits('update:modelValue', value)
  props.validateUserCode()
}
</script>
