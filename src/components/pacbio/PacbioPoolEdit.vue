<template>
  <div data-type="pool">
    <traction-section
      number="4"
      title="Pooled Samples"
      :tag="`${poolType}`"
      data-attribute="pool-type"
      :description="'Click on Sample Name/Source to highlight associated labware'"
    >
      <div class="pt-2">
        <div>
          <label class="flex text-left" for="qcFileInput">Select file</label>
          <div :class="['w-full', `${border}`]">
            <input
              id="qcFileInput"
              class="block w-full rounded border file:border-0"
              type="file"
              accept="text/csv, .csv"
              @change="uploadFile"
            />
          </div>
        </div>

        <div>
          <traction-sub-section title="Pool information" class="mt-2 py-6">
            <div class="flex flex-row gap-x-4" data-type="pool-edit">
              <fieldset class="flex flex-col items-center gap-y-4">
                <traction-label>Auto tagging</traction-label>
                <traction-toggle v-model="autoTag" data-attribute="check-box" />
              </fieldset>
              <fieldset v-if="!!tubeItem.barcode" class="flex flex-col">
                <traction-label class="h-full">Pool Barcode</traction-label>
                <traction-label
                  v-if="!!tubeItem.barcode"
                  data-attribute="barcode"
                  class="font-bold text-nowrap"
                >
                  {{ tubeItem.barcode }}
                </traction-label>
              </fieldset>
              <fieldset class="flex flex-col">
                <traction-label class="h-full">Template Prep Kit Box Barcode</traction-label>
                <traction-field-error
                  data-attribute="pool-template-prep-kit-box-barcode-error"
                  :error="poolErrorsFor('template_prep_kit_box_barcode')"
                  :with-icon="!!pool.errors?.template_prep_kit_box_barcode"
                >
                  <traction-input
                    v-model="pool.template_prep_kit_box_barcode"
                    data-attribute="template-prep-kit-box-barcode"
                  />
                </traction-field-error>
              </fieldset>
              <fieldset class="flex flex-col">
                <traction-label class="h-full">Volume</traction-label>
                <traction-field-error
                  data-attribute="pool-volume-error"
                  :error="poolErrorsFor('volume')"
                  :with-icon="!!pool.errors?.volume"
                >
                  <traction-input v-model="pool.volume" data-attribute="volume" />
                </traction-field-error>
              </fieldset>
              <fieldset class="flex flex-col">
                <traction-label class="h-full">Concentration</traction-label>
                <traction-field-error
                  data-attribute="pool-concentration-error"
                  :error="poolErrorsFor('concentration')"
                  :with-icon="!!pool.errors?.concentration"
                >
                  <traction-input v-model="pool.concentration" data-attribute="concentration" />
                </traction-field-error>
              </fieldset>
              <fieldset class="flex flex-col">
                <traction-label class="h-full">Insert Size</traction-label>
                <traction-field-error
                  data-attribute="pool-insert_size-error"
                  :error="poolErrorsFor('insert_size')"
                  :with-icon="!!pool.errors?.insert_size"
                >
                  <traction-input v-model="pool.insert_size" data-attribute="insert-size" />
                </traction-field-error>
              </fieldset>
            </div>
          </traction-sub-section>
        </div>
      </div>
    </traction-section>
    <PacbioPoolAliquotList
      :auto-tag="autoTag"
      :validated="validated"
      :notify="onFieldUpdate"
      @aliquot-selected="notifyAliquotSelection"
    />
    <div class="text-right py-8">
      <traction-button
        v-if="!persisted"
        data-action="create-pool"
        theme="create"
        :disabled="busy"
        @click="create()"
      >
        <span class="button-text">Create Pool </span>
        <traction-spinner v-show="busy"></traction-spinner>
      </traction-button>
      <traction-button
        v-if="persisted"
        data-action="update-pool"
        theme="update"
        :disabled="busy"
        @click="update()"
      >
        <span class="button-text">Update Pool </span>
        <traction-spinner v-show="busy"></traction-spinner>
      </traction-button>
    </div>
  </div>
</template>

<script setup>
/**
 * @name PacbioPoolEdit
 * @description Edit form for a pool
 */
import PacbioPoolAliquotList from '@/components/pacbio/PacbioPoolAliquotList.vue'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import useAlert from '@/composables/useAlert.js'
import { ref, computed } from 'vue'
import { eachRecord } from '@/lib/csv/pacbio.js'

//refs
const busy = ref(false) // Flag to indicate if the form is busy processing a request
const autoTag = ref(false) //  Flag to indicate if auto-tagging is enabled
const parsedFile = ref(null) // Holds the data of the parsed file
const validated = ref(true) // Flag to indicate if the form data is valid

const { pool, tubeItem, selectedUsedAliquots, createPool, updatePool, updateUsedAliquotFromCsvRecord } =
  usePacbioPoolCreateStore()
const { showAlert } = useAlert()
const persisted = computed(() => !!pool.id)
const poolType = computed(() => {
  switch (selectedUsedAliquots.length) {
    case 0:
      return 'Empty'
    default:
      return 'Pool'
  }
})
const emit = defineEmits(['aliquot-selected'])

const border = computed(() => {
  if (parsedFile.value === null) return 'border-0'
  else {
    const borderColour = parsedFile.value ? 'border-success' : 'border-failure'
    return `rounded border ${borderColour}`
  }
})
// Checks if the pool attribute should be displayed with an error
const poolErrorsFor = (attribute) => {
  if (pool?.[attribute]?.length) {
    delete pool?.errors?.[attribute]
    return ''
  }
  return pool?.errors?.[attribute]
}

const create = () => {
  busy.value = true
  createPool().then(({ success, barcode, errors }) => {
    success
      ? showAlert(
          `Pool successfully created with barcode ${barcode}`,
          'success',
          'pool-create-message',
        )
      : showAlert(errors, 'danger', 'pool-create-message')
    busy.value = false
  })
}

const update = () => {
  busy.value = true
  validated.value = true
  updatePool().then(({ success, errors }) => {
    success
      ? showAlert(`Pool successfully updated`, 'success', 'pool-create-message')
      : showAlert(errors, 'danger', 'pool-create-message')
    busy.value = false
  })
}
// Allows users to upload a file to autopopulate the pool's selected libraries
const uploadFile = async (evt) => {
  if (evt?.target?.files?.length) {
    const file = evt.target.files[0]
    try {
      const csv = await file.text()
      eachRecord(csv, updateUsedAliquotFromCsvRecord)
      parsedFile.value = true
    } catch (error) {
      console.error(error)
      showAlert(error, 'danger', 'pool-create-message')
      parsedFile.value = false
    }
  } else {
    parsedFile.value = null
    return
  }
}

// Function passed to child components in notify prop, to be used when any attribute
// in the child component is changed. The validated flag is reset to true when the user
// clicks the update button and the changed values are checked and saved.
const onFieldUpdate = () => {
  validated.value = false
}

const notifyAliquotSelection = (aliquot) => {
  emit('aliquot-selected', aliquot)
}
</script>
