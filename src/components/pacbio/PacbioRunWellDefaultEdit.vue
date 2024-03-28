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
          v-model="runDefaultWellAttributes[field.value]"
        />
      </traction-field-group>
    </div>
  </traction-section>
</template>

<script>
// There is a lot of duplication between this component and PacbioRunWellEdit.
// A lot of it could be moved to the store
import { mapState } from 'pinia'
import PacbioRunWellComponents from '@/config/PacbioRunWellComponents'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
export default {
  name: 'PacbioRunWellDefaultEdit',
  computed: {
    ...mapState(usePacbioRunCreateStore, [
      'runDefaultWellAttributes',
      'runItem',
      'smrtLinkVersion',
    ]),
    smrtLinkWellDefaults() {
      return PacbioRunWellComponents[this.smrtLinkVersion.name]?.filter(
        (component) => component.default,
      )
    },
  },
  methods: {
    handleCustomProps(component) {
      return {
        ...component.props,
        // We want the data attribute to be unique for default fields
        dataAttribute: `default-${component.props.dataAttribute}`,
      }
    },
  },
}
</script>
