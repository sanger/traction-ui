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
          v-on="handleCustomEvents(field)"
        />
      </traction-field-group>
    </div>
  </traction-section>
</template>

<script setup>
/**
 * PacbioRunWellDefaultEdit component
 * This component displays a list of default well components for the current SMRT Link version.
 * It uses the PacbioRunWellSmrtLinkOptions config to get the default well components.
 * It uses the usePacbioRunCreateStore store to get the SMRT Link version and default well attributes.
 */
import { PacbioRunWellSmrtLinkOptions } from '@/config/PacbioRunWellSmrtLinkOptions.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import { computed } from 'vue'

// Create a store instance of the pacbioRunCreateStore
const store = usePacbioRunCreateStore()

// Get the default well components for the current SMRT Link version
const smrtLinkWellDefaults = computed(() => {
  return PacbioRunWellSmrtLinkOptions[store.smrtLinkVersion.name]?.filter(
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

//handleCustomEvents function is used to handle custom events for the component
const handleCustomEvents = (component) => {
  // This is a special case for the use_adaptive_loading component
  // We may need to make this SMRTLink version specific in the future
  // It would be nice to move this to the component config
  if (component.name == 'use_adaptive_loading') {
    return {
      ...component.events,
      change: (e) => store.setAdaptiveLoading(e.target.value),
    }
  }
  return { ...component.events }
}
</script>
