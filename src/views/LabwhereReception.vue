<template>
  <div class="w-3/5 mx-auto bg-gray-100 border border-gray-200 bg-gray-100 rounded-md p-4">
    <traction-form @submit="scanBarcodesToLabwhere" @reset="reset">
      <fieldset>
        <traction-heading level="4" show-border>User barcode or swipecard</traction-heading>
        <traction-muted-text class="flex justify-left"
          >Enter user barcode/swipecard</traction-muted-text
        >
        <traction-field-error data-attribute="user-code-error" :error="errors.user_code">
          <traction-input
            id="userCode"
            v-model="user_code"
            data-attribute="user-code-input"
            class="flex w-full"
            @update:model-value="validateUserCode"
          />
        </traction-field-error>
      </fieldset>

      <fieldset>
        <traction-heading level="4" show-border>Location barcode</traction-heading>
        <traction-muted-text class="flex justify-left"
          >Scan location barcode (Leave blank to scan out)</traction-muted-text
        >
        <traction-field-error
          data-attribute="location-barcode-error"
          :error="errors.location_barcode"
        >
          <traction-input id="locationBarcode" v-model="location_barcode" class="flex w-full"
        /></traction-field-error>
      </fieldset>

      <fieldset>
        <traction-heading level="4" show-border>Start position</traction-heading>
        <traction-muted-text class="flex justify-left"
          >Enter position (Only necessary for locations with coordinates)</traction-muted-text
        >
        <traction-input id="startPosition" v-model="start_position" type="number" />
      </fieldset>

      <fieldset>
        <traction-heading level="4" show-border>Barcodes</traction-heading>
        <traction-muted-text class="flex justify-left"
          >Scan barcodes to save to location</traction-muted-text
        >
        <traction-field-error data-attribute="barcodes-error" :error="errors.labware_barcodes">
          <textarea
            id="labware_barcodes"
            v-model="labware_barcodes"
            rows="10"
            max-rows="20"
            name="labware_barcodes"
            class="w-full text-base py-2 px-3 border border-gray-300 bg-white rounded-md"
            @input="validateLabwareBarcodes"
          />
        </traction-field-error>
      </fieldset>
      <div class="flex flex-col w-full">
        <traction-heading level="4" show-border>Summary</traction-heading>
        <span id="importText" class="text-left" data-attribute="preview-message">
          {{ confirmationText }}
        </span>
        <div class="flex flex-row space-x-2 mt-5">
          <traction-button id="reset-button" theme="reset" class="py-3" type="reset">
            Reset
          </traction-button>
          <traction-button id="submit-button" class="h-15 py-3" type="submit" theme="printRed">
            <span class="button-text">Scan In/Out</span>
          </traction-button>
        </div>
      </div>
    </traction-form>
  </div>
</template>

<script setup>
/**
 * LabwhereReception Component
 *
 * This component provides a form interface for users to scan labware barcodes into a specified location or to scan barcodes out of their parent location in Labwhere.
 * Scanning in requires a user barcode, location barcode, and labware barcodes.
 * For scanning out, the location barcode should be blank and it requires a user barcode and labware barcodes only.
 *
 * The form includes fields for:
 * - User barcode or swipecard
 * - Location barcode
 * - Start position (optional)
 * - Labware barcodes
 *
 * The component validates the input fields for 'User barcode', and 'Labware barcodes'
 * and displays error messages for any missing data when the form is submitted or when the input fields are updated.
 * The 'Start position' field is optional and does not require validation.
 *
 * The component also provides a preview section where users can review the action before submission.
 *
 * Upon successful validation, the form data is submitted to the Labwhere API to scan in/out the barcodes in/from the specified location.
 * It displays a success message if the barcodes are stored successfully, or an error message if the submission fails.
 */
import { ref, reactive, computed } from 'vue'
import {
  scanBarcodesInLabwhereLocation,
  exhaustLibraryVolumeIfDestroyed,
} from '@/services/labwhere/client.js'
import useAlert from '@/composables/useAlert.js'

const user_code = ref('') // User code or swipecard
const location_barcode = ref('') // Location barcode
const labware_barcodes = ref('') // Labware barcodes which are scanned
const start_position = ref(null) // Start position of the labware wwhich is optional
const errors = reactive({}) // Object to store form validation errors

const { showAlert } = useAlert()

/**
 * Validate user code
 */
const validateUserCode = () => {
  if (!user_code.value) {
    errors.user_code = 'User code is required'
  } else {
    delete errors.user_code
  }
}

/**
 * Validate labware barcodes
 */
const validateLabwareBarcodes = () => {
  if (!labware_barcodes.value) {
    errors.labware_barcodes = 'Labware barcodes are required'
  } else {
    delete errors.labware_barcodes
  }
}

/**
 * Validates the entire form.
 * @returns {boolean} True if the form is valid, false otherwise.
 */
const validateForm = () => {
  resetErrors() // Clear previous errors

  validateUserCode()
  validateLabwareBarcodes()

  return Object.keys(errors).length === 0
}

/**
 * Computed property to get the array of unique labware barcodes.
 */
const uniqueBarcodesArray = computed(() => {
  return Array.from(
    new Set(
      labware_barcodes.value
        .split('\n')
        .map((barcode) => barcode.trim())
        .filter((barcode) => barcode !== ''),
    ),
  )
})

/**
 * Scan barcodes into labwhere location
 *
 */
const scanBarcodesToLabwhere = async () => {
  if (validateForm()) {
    const response = await scanBarcodesInLabwhereLocation(
      user_code.value,
      location_barcode.value,
      uniqueBarcodesArray.value.join('\n'),
      start_position.value,
    )
    if (response.success) {
      let message = response.message
      // Check if the library volume need to be exhausted
      const { success, exhaustedLibraries } = await exhaustLibraryVolumeIfDestroyed(
        location_barcode.value,
        uniqueBarcodesArray.value,
      )
      if (success && exhaustedLibraries.length > 0) {
        const length = exhaustedLibraries.length
        message += ` and sample volumes have been exhausted for ${length} ${length === 1 ? 'library' : 'libraries'}`
      }
      showAlert(message, 'success')
    } else {
      showAlert(response.errors.join('\n'), 'danger')
    }
  }
}

/**
 * Computed property to get the confirmation text.
 */
const confirmationText = computed(() => {
  const barcodeCount = uniqueBarcodesArray.value.length
  let text = ''
  if (barcodeCount === 0) {
    text = `No barcodes to scan to location ${location_barcode.value}`
  } else {
    if (location_barcode.value) {
      text = `Scan in ${barcodeCount} barcode(s) to location ${location_barcode.value}`
    } else {
      text = `Scan out ${barcodeCount} barcode(s) from their current locations`
    }
  }
  return text
})

/**
 * Reset the form errors.
 */
const resetErrors = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
}

/**
 * Reset the form fields and errors.
 * We do not reset the user code field as it is more likely the same user will be scanning multiple times.
 */
const reset = () => {
  location_barcode.value = ''
  labware_barcodes.value = ''
  start_position.value = null
  resetErrors()
}
</script>
