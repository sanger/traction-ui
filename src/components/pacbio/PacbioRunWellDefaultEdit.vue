<template>
  <traction-section title="Well Defaults">
    <traction-muted-text classes="text-left mb-2">
      Non-submitted fields, used for providing new wells with default values
    </traction-muted-text>

    <div v-for="field in smrtLinkWellDefaults" :key="field.name">
      <traction-field-group :label="field.label" :for="field.name" :description="field.description">
        <component
          :is="field.component"
          v-bind="handleCustomProps(field)"
          v-model="store.runDefaultWellAttributes[field.value]"
        />
      </traction-field-group>
    </div>
  </traction-section>
</template>

<script setup>
/**
 * PacbioRunWellDefaultEdit component
 * This component displays a list of default well components for the current SMRT Link version.
 * It uses the PacbioRunWellComponents config to get the default well components.
 * It uses the usePacbioRunCreateStore store to get the SMRT Link version and default well attributes.
 */
import PacbioRunWellComponents from '@/config/PacbioRunWellComponents'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import { computed } from 'vue'

// Create a store instance of the pacbioRunCreateStore
const store = usePacbioRunCreateStore()

// Get the default well components for the current SMRT Link version
const smrtLinkWellDefaults = computed(() => {
  return PacbioRunWellComponents[store.smrtLinkVersion.name]?.filter(
    (component) => component.default,
  )
})

// Handle custom props for the component
const handleCustomProps = (component) => {
  return {
    ...component.props,
    // We want the data attribute to be unique for default fields
    dataAttribute: `default-${component.props.dataAttribute}`,
  }
}
</script>
