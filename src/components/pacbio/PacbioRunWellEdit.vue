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
      id="wellPoolsAndLibraries"
      stacked
      :items="localPoolsAndLibraries"
      :fields="wellPoolsLibrariesFields"
    >
      <template #table-caption>Pools</template>

      <template #cell(barcode)="row">
        <traction-form classes="flex flex-wrap items-center">
          <traction-input
            id="poolLibraryBarcode"
            ref="poolLibraryBarcode"
            :model-value="`${row.item.barcode}`"
            placeholder="Pool/Library barcode"
            :debounce="500"
            @update:modelValue="updatePoolLibraryBarcode(row, $event)"
          ></traction-input>

          <traction-button class="button btn-xs btn-danger" @click="removeRow(row)"
            >-</traction-button
          >
        </traction-form>
      </template>
    </traction-table>

    <traction-button class="button btn-xs btn-success" @click="addRow">+</traction-button>

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
import PacbioRunWellComponents from '@/config/PacbioRunWellComponents'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import { ref, computed } from 'vue'
import useAlert from '@/composables/useAlert.js'

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
const well = ref({})
// local pools and libraries which are added to the well
const localPoolsAndLibraries = ref([])
// fields for the well pools and libraries table
const wellPoolsLibrariesFields = ref([{ key: 'barcode', label: 'Barcode' }])
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
  return PacbioRunWellComponents[store.smrtLinkVersion.name]
})

// Define a computed property to determine if the well is new
const newWell = computed(() => {
  return !store.getWell(plateNumber.value, position.value)
})

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

/* `addRow` is a function that adds a new row to the `localPoolsAndLibraries` array.
  Each row is an object with an `id` and `barcode`, both initialized as empty strings.*/
const addRow = () => {
  localPoolsAndLibraries.value.push({ id: '', barcode: '' })
}

/* `removeRow` is a function that removes a row from the `localPoolsAndLibraries` array.*/
const removeRow = (row) => {
  localPoolsAndLibraries.value.splice(row.index, 1)
}

/* `idsByType` is a function that returns an array of ids based on the type (pools or libraries).*/
const idsByType = (type) => {
  return localPoolsAndLibraries.value.filter((item) => item.type === type).map((item) => item.id)
}

/* `wellPayload` is a computed property that returns the well object with the pools and libraries ids.*/
const wellPayload = computed(() => {
  return {
    ...well.value,
    pools: idsByType('pools'),
    libraries: idsByType('libraries'),
  }
})

/* `removeInvalidPools` is a function that removes invalid pools from the `localPoolsAndLibraries` array.*/
const removeInvalidPools = () => {
  localPoolsAndLibraries.value = localPoolsAndLibraries.value.filter(
    (item) => item.id && item.barcode,
  )
}

/* `formatLoadingTargetValue` is a function that formats the loading target value.*/
const formatLoadingTargetValue = (val) => {
  if (val) {
    if (decimalPercentageRegex.test(val)) {
      return val
    } else {
      return isNaN(well.value.loading_target_p1_plus_p2) ? 0 : well.value.loading_target_p1_plus_p2
    }
  }
}
/* `disableAdaptiveLoadingInput` is a function that disables the adaptive loading input.*/
const disableAdaptiveLoadingInput = () => {
  well.value.loading_target_p1_plus_p2 = ''
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
const update = () => {
  removeInvalidPools()
  store.updateWell({ well: wellPayload.value, plateNumber: plateNumber.value })
  showAlert('Well created', 'success')
  hide()
}
//removeWell function is used to remove the well
const removeWell = () => {
  store.deleteWell({ well: wellPayload.value, plateNumber: plateNumber.value })
  showAlert('Well successfully deleted', 'success')
  hide()
}
//updatePoolLibraryBarcode function is used to update the pool or library barcode
const updatePoolLibraryBarcode = async (row, barcode) => {
  const index = row.index
  await store.findPoolsOrLibrariesByTube({ barcode })
  const tubeContent = await store.tubeContentByBarcode(barcode)
  if (tubeContent) {
    tubeContent.type === 'libraries'
      ? (localPoolsAndLibraries.value[index] = { id: tubeContent.id, barcode, type: 'libraries' })
      : tubeContent.type === 'pools'
        ? (localPoolsAndLibraries.value[index] = { id: tubeContent.id, barcode, type: 'pools' })
        : null
  } else {
    showAlert('Pool is not valid', 'danger')
  }
}

/**
 * setupWell function is used to setup the well by fetching the well object from the store
 * and populating the localPoolsAndLibraries array with the pools and libraries associated with the well.
 * This function is called when the modal is shown for a specific position and plate number.
 */
const setupWell = async () => {
  well.value = await store.getOrCreateWell(position.value, plateNumber.value)
  localPoolsAndLibraries.value = []
  well.value.pools?.forEach((id) => {
    const pool = store.tubeContents.find((tubeContent) => tubeContent.id == id)
    pool ? localPoolsAndLibraries.value.push({ id, barcode: pool.barcode, type: 'pools' }) : null
  })
  well.value.libraries?.forEach((id) => {
    const library = store.tubeContents.find((tubeContent) => tubeContent.id == id)
    library
      ? localPoolsAndLibraries.value.push({ id, barcode: library.barcode, type: 'libraries' })
      : null
  })
}

//handleCustomProps function is used to handle custom props for the component
const handleCustomProps = (component) => {
  if (component.name == 'loading_target_p1_plus_p2') {
    return {
      ...component.props,
      formatter: formatLoadingTargetValue,
    }
  }
  return component.props
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
</script>
