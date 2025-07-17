<template>
  <traction-modal ref="well-modal" :static="isStatic" size="lg" :visible="isShow" @cancel="hide">
    <template #modal-title>Add Pool or Library to Well: {{ position }}</template>

    <fieldset>
      <traction-form v-for="field in smrtLinkWellDefaults" :key="field.name">
        <div class="pb-2">
          <label>{{ field.label }}</label>
          <component
            :is="field.component"
            v-model="well[field.value]"
            v-bind="handleCustomProps(field)"
            v-on="handleCustomEvents(field)"
          />
        </div>
      </traction-form>
    </fieldset>

    <traction-table
      id="wellUsedAliquots"
      :items="validLocalUsedAliquots"
      :fields="wellUsedAliquotsFields"
    >
      <template #cell(barcode)="row">
        <traction-input
          id="usedAliquotSourceBarcode"
          :model-value="`${row.item.barcode}`"
          placeholder="Pool/Library barcode"
          :debounce="500"
          @update:model-value="updateUsedAliquotSource(row, $event)"
        ></traction-input>
      </template>
      <template #cell(volume)="row">
        <traction-field-error
          data-attribute="volume-error"
          :error="errorsFor(row.item, 'volume')"
          :with-icon="true"
        >
          <traction-input
            id="usedAliquotVolume"
            class="grow"
            data-attribute="aliquot-volume"
            :model-value="`${row.item.volume}`"
            placeholder="Pool/Library volume"
            @update:model-value="updateUsedAliquotVolume(row, $event)"
          ></traction-input>
          <div class="flex items-center" data-attribute="available-volume-div">
            <traction-tooltip
              :tooltip-text="'Available volume is ' + row.item.available_volume"
              class="flex max-w-xs"
            >
              <traction-badge data-attribute="available-volume-badge" colour="sanger-yellow"
                ><TractionInfoIcon class="mr-1" />{{ row.item.available_volume }}</traction-badge
              >
            </traction-tooltip>
          </div>
        </traction-field-error>
      </template>
      <template #cell(actions)="row">
        <traction-button data-action="remove-row" theme="delete" @click="removeRow(row)"
          >-</traction-button
        >
      </template>
    </traction-table>

    <traction-button data-action="add-row" theme="create" @click="addRow">+</traction-button>

    <div>
      <div>
        <div class="flex flex-row w-full w-1/2 space-x-2 justify-end px-2">
          <traction-button
            data-action="show-annotations"
            theme="default"
            @click="showAnnotations()"
          >
            {{ annotationsVisible ? 'Hide Annotations' : 'Show Annotations' }}
          </traction-button>
        </div>
        <div
          v-if="annotationsVisible"
          class="p-4 ml-4 mb-4 mt-4 rounded-md text-left items-center border-2 border-gray-200 shadow-sm"
        >
          <annotation-list
            :parent="store.wells[plateNumber][position]"
            :annotation-types="annotationTypes"
          />
        </div>
      </div>
    </div>
    <template #modal-footer="{}">
      <traction-button
        v-if="!newWell"
        id="delete-well"
        data-action="delete-well"
        theme="delete"
        @click="removeWell()"
        >Delete well</traction-button
      >
      <traction-button
        :id="action.id"
        :data-action="action.dataAction"
        :theme="action.theme"
        @click="update()"
        >{{ action.label }}</traction-button
      >
    </template>
  </traction-modal>
</template>

<script setup>
import { PacbioRunWellSmrtLinkOptions } from '@/config/PacbioRunWellSmrtLinkOptions.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import { ref, computed, reactive } from 'vue'
import useAlert from '@/composables/useAlert.js'
import { createUsedAliquot } from '@/stores/utilities/usedAliquot.js'
import AnnotationList from '@/components/AnnotationList.vue'

// Create a store instance of the pacbioRunCreateStore
const store = usePacbioRunCreateStore()
// Create a composable instance of the useAlert composable
const { showAlert } = useAlert()

// Define props for the component
defineProps({
  // Define the isStatic prop which is used to determine if the modal is static
  isStatic: {
    type: Boolean,
    default: false,
  },
})

// Define refs for the component
// well object
const well = reactive({ used_aliquots: [] })
// local pools and libraries which are added to the well
const localUsedAliquots = reactive([])
// fields for the well pools and libraries table
const wellUsedAliquotsFields = ref([
  { key: 'barcode', label: 'Barcode' },
  { key: 'volume', label: 'Volume' },
  { key: 'actions', label: 'Actions' },
])
// isShow ref to determine if the modal is visible
const isShow = ref(false)
// position ref to store the position of the well
const position = ref('')
// plateNumber ref to store the plate number of the well
const plateNumber = ref('')

/* Define a regex to validate the loading target value for the well
 * The regex validates the loading target value to be a decimal percentage with a maximum of 2 decimal places
 */
const decimalPercentageRegex = /^(?:1(?:\.0{0,2})?|0?(?:\.\d{0,2})?)$/

// Get the default well components for the current SMRT Link version
const smrtLinkWellDefaults = computed(() => {
  return PacbioRunWellSmrtLinkOptions[store.smrtLinkVersion.name]
})

// Define a computed property to determine if the well is new
const newWell = computed(() => {
  return !store.getWell(plateNumber.value, position.value)
})

// A computed property to only return the non-destroyed aliquots from the localUsedAliquots array
const validLocalUsedAliquots = computed(() => {
  return localUsedAliquots.filter((aliquot) => !aliquot['_destroy'])
})

// Computed property to show the available volume badge unless the aliquot is a pool and the feature flag is disabled

// Define a computed property to determine the action for the modal which is either create or update
const action = computed(() => {
  return newWell.value
    ? {
        id: 'create',
        dataAction: 'create-well',
        theme: 'create',
        label: 'Create',
      }
    : {
        id: 'update',
        dataAction: 'update-well',
        theme: 'update',
        label: 'Update',
      }
})

/* `addRow` is a function that adds a new row to the `localUsedAliquots` array.
  Each row is an object with an `id`, and `barcode`, both initialized as empty strings.*/
const addRow = () => {
  localUsedAliquots.push(createUsedAliquot({ id: '', barcode: '', volume: 0 }))
}

/* `removeRow` is a function that adds a destroy key to the a given aliquot in the`localUsedAliquots` array.
  or removes the aliquot from the array if it does not have an existing id */
const removeRow = (row) => {
  if (row.item.id) {
    localUsedAliquots[row.index]['_destroy'] = true
  } else {
    localUsedAliquots.splice(row.index, 1)
  }
}

/* `filteredAliquots` is a function that returns a list of valid aliquots from the `localUsedAliquots` array.*/
const filteredAliquots = () => {
  return localUsedAliquots.filter((item) => item.barcode)
}

/* `formatLoadingTargetValue` is a function that formats the loading target value.*/
const formatLoadingTargetValue = (val) => {
  if (val) {
    if (decimalPercentageRegex.test(val)) {
      return val
    } else {
      return isNaN(well.loading_target_p1_plus_p2) ? 0 : well.loading_target_p1_plus_p2
    }
  } else {
    return 0
  }
}

/* `disableAdaptiveLoadingInput` is a function that disables the adaptive loading input.*/
const disableAdaptiveLoadingInput = () => {
  well.loading_target_p1_plus_p2 = ''
}

/*showModalForPositionAndPlate function is used to show the modal for a specific position and plate number*/
const showModalForPositionAndPlate = async (positionValue, plateNumberValue) => {
  positionValue && (position.value = positionValue)
  plateNumberValue && (plateNumber.value = plateNumberValue)
  await setupWell()
  isShow.value = true
}

/**Expose the showModalForPositionAndPlate function to the parent component
 * By using `defineExpose`, we're telling Vue that `showModalForPositionAndPlate` is a public method that can be accessed by other components.
 ***/
defineExpose({
  showModalForPositionAndPlate,
})

//hide function is used to hide the modal
const hide = () => {
  isShow.value = false
}

//update function is used to update the well
const update = async () => {
  well.used_aliquots = filteredAliquots()

  const aliquot_errors = well.used_aliquots.some(
    (aliquot) => Object.values(aliquot.errors).length > 0,
  )
  if (aliquot_errors) {
    // We can assume the errors are related to volume as thats the only thing we validate
    showAlert('Insufficient volume available', 'danger')
    return
  }
  store.updateWell({ well: { ...well }, plateNumber: plateNumber.value })
  showAlert('Well created', 'success')
  hide()
}

//removeWell function is used to remove the well
const removeWell = () => {
  store.deleteWell({ well, plateNumber: plateNumber.value })
  showAlert('Well successfully deleted', 'success')
  hide()
}

//updateUsedAliquotVolume function is used to update the volume of the pool or library
const updateUsedAliquotVolume = (row, volume) => {
  const aliquot = localUsedAliquots[row.index]
  aliquot.volume = volume
}

//updateUsedAliquotSource function is used to update the pool or library barcode
const updateUsedAliquotSource = async (row, barcode) => {
  const index = row.index
  await store.findPoolsOrLibrariesByTube({ barcode })
  const source = await store.sourceByBarcode(barcode)
  if (source) {
    const type = source.type === 'pools' ? 'Pacbio::Pool' : 'Pacbio::Library'
    const available_volume = store.getAvailableVolumeForAliquot({
      sourceId: source.id,
      sourceType: type,
      volume: 0,
    })
    const used_aliquot = createUsedAliquot({
      id: row.item.id || '',
      source_id: source.id,
      source_type: type,
      barcode,
      volume: available_volume,
      available_volume,
      concentration: source.concentration,
      insert_size: source.insert_size,
      template_prep_kit_box_barcode: source.template_prep_kit_box_barcode,
    })
    localUsedAliquots[index] = used_aliquot
  } else {
    showAlert('Pool is not valid', 'danger')
  }
}

/**
 * setupWell function is used to setup the well by fetching the well object from the store
 * and populating the localUsedAliquots array with the used_aliquots associated with the well.
 * This function is called when the modal is shown for a specific position and plate number.
 */
const setupWell = async () => {
  // We clone the well as it gets binded to the form and we don't want to change the original object
  // without a confirmation action like the 'update' button
  Object.assign(well, await store.getOrCreateWell(position.value, plateNumber.value))
  localUsedAliquots.splice(0)
  well.used_aliquots.forEach((aliquot) => {
    const type = aliquot.source_type === 'Pacbio::Pool' ? 'pools' : 'libraries'
    const poolOrLibrary = store.sourceItems.find(
      (item) => item.id == aliquot.source_id && item.type == type,
    )
    if (poolOrLibrary) {
      const available_volume = store.getAvailableVolumeForAliquot({
        sourceId: poolOrLibrary.id,
        sourceType: aliquot.source_type,
        volume: aliquot.volume,
      })
      const used_aliquot = createUsedAliquot({
        ...aliquot,
        available_volume,
        barcode: poolOrLibrary.barcode,
      })
      localUsedAliquots.push(used_aliquot)
    }
  })
}

/**
 * The errors for an attribute
 */
const errorsFor = (aliquot, attribute) => {
  if (aliquot && attribute) {
    // If we aren't showing available volume we also don't need to validate the volume
    aliquot.validateField(attribute, aliquot[attribute])
    return aliquot.errors?.[attribute]
  }
}

//handleCustomProps function is used to handle custom props for the component
const handleCustomProps = (component) => {
  if (component.name == 'loading_target_p1_plus_p2') {
    return {
      ...component.props,
      formatter: formatLoadingTargetValue,
    }
  }
  return { ...component.props, ...component.wellProps }
}

//handleCustomEvents function is used to handle custom events for the component
const handleCustomEvents = (component) => {
  if (component.name == 'disableAdaptiveLoadingBtn') {
    return {
      ...component.events,
      click: disableAdaptiveLoadingInput,
    }
  }
  return { ...component.events }
}

const annotationsVisible = ref(false)

const toggleAnnotations = () => {
  annotationsVisible.value = !annotationsVisible.value
}

const annotationTypes = computed(() => Object.values(store.resources.annotationTypes))

const showAnnotations = () => {
  store.setAnnotations({
    parent: store.wells[plateNumber.value][position.value],
    annotatableType: 'Pacbio::Well',
  })
  toggleAnnotations()
}
</script>
