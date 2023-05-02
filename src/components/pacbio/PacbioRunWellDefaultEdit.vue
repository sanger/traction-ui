<template>
  <div class="border border-black p-[10px]">
    <fieldset>
      <div
        v-for="field in smrtLinkWellDefaults"
        :key="field.name"
        class="grid grid-cols-2 px-2 pb-1 my-auto"
      >
        <label class="text-left">{{ field.label }}</label>
        <component
          :is="field.component"
          v-bind="handleCustomProps(field)"
          v-model="runDefaultWellAttributes[field.value]"
        />
      </div>
      <traction-muted-text>
        * Non-submitted fields, used for providing new wells with default values
      </traction-muted-text>
    </fieldset>
  </div>
</template>

<script>
// There is a lot of duplication between this component and PacbioRunWellEdit.
// A lot of it could be moved to the store
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('traction/pacbio/runCreate')
import PacbioRunWellComponents from '@/config/PacbioRunWellComponents'
export default {
  name: 'PacbioRunWellDefaultEdit',
  computed: {
    ...mapGetters(['runDefaultWellAttributes', 'runItem', 'smrtLinkVersion']),
    smrtLinkWellDefaults() {
      return PacbioRunWellComponents[this.smrtLinkVersion.name].filter(
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
