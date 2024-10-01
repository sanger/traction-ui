<template>
  <div class="w-full md:w-3/4 mx-auto">
    <traction-form
      classes="flex flex-col md:flex-row px-10 gap-4"
      @submit="storeBarcodes"
      @reset="onReset"
    >
      <div class="w-full md:w-3/5 p-4 gap-4 bg-gray-100 rounded-md">
        <div class="space-y-10">
          <fieldset>
            <traction-heading level="4" show-border>User barcode or swipecard</traction-heading>
            <traction-field-error data-attribute="user-code-error" :error="errors.user_code">
              <traction-input
                id="userCode"
                v-model="user_code"
                class="flex w-full"
                @update:model-value="validateUserCode"
              />
            </traction-field-error>
          </fieldset>

          <fieldset>
            <traction-heading level="4" show-border description="Scan location barcode"
              >Location barcode</traction-heading
            >
            <traction-field-error
              data-attribute="location-barcode-error"
              :error="errors.location_barcode"
            >
              <traction-input
                id="locationBarcode"
                v-model="location_barcode"
                class="flex w-full"
                @update:model-value="validateLocationBarcode"
            /></traction-field-error>
          </fieldset>

          <fieldset>
            <traction-heading level="4" show-border>Start position</traction-heading>
            <traction-input id="startPosition" v-model="start_position" type="number" />
          </fieldset>

          <fieldset>
            <traction-heading level="4" show-border description="Scan barcodes to save to location"
              >Barcodes</traction-heading
            >
            <traction-field-error data-attribute="barcodes-error" :error="errors.labware_barcodes">
              <textarea
                id="labware_barcodes"
                v-model="labware_barcodes"
                rows="4"
                max-rows="10"
                name="labware_barcodes"
                class="w-full text-base py-2 px-3 border border-gray-300 bg-white rounded-md"
                @input="validateLabwareBarcodes"
              />
            </traction-field-error>
          </fieldset>
        </div>
      </div>
      <div class="w-full md:w-2/5 p-4 space-y-4 bg-sdb-400 rounded-md border-t-4 border-sp">
        <traction-heading level="3" class-name="text-white italic" show-border>
          Preview and submit
        </traction-heading>

        <traction-label class="flex text-white text-left" data-attribute="preview-message">
          {{ ` ${confirmationText} ` }}
        </traction-label>
        <div>
          <div class="space-x-4 pb-4 flex flex-row">
            <traction-button id="submit-button" class="grow" type="submit" theme="printRed">
              Store barcodes
            </traction-button>
            <traction-button id="reset-button" type="reset" theme="resetWhite">
              Reset
            </traction-button>
          </div>
        </div>
      </div>
    </traction-form>
  </div>
</template>

<script setup>
/**
 * LabwhereReception Component
 *
 * This component provides a form interface for users to store labware barcodes into a specified location in Labwhere.
 *
 * The form includes fields for:
 * - User barcode or swipecard
 * - Location barcode
 * - Start position (optional)
 * - Labware barcodes
 *
 * The component validates the input fields for 'User barcode', 'Location barcode' and 'Labware barcodes'
 * and displays error messages for any invalid or missing data when the form is submitted or when the input fields are updated.
 * The 'Start position' field is optional and does not require validation.
 *
 * The form also provides a reset button to clear the form fields.
 * The component also provides a preview section where users can review the barcodes to be stored before submission.
 *
 * Upon successful validation, the form data is submitted to the Labwhere API to store the barcodes in the specified location.
 * It displays a success message if the barcodes are stored successfully, or an error message if the submission fails.
 */
import { ref, reactive, computed } from 'vue'
import { storeBarcodesIntoLabwhereLocation } from '@/services/labwhere/client.js'
import useAlert from '@/composables/useAlert.js'
import TractionForm from '@/components/shared/TractionForm.vue'
import TractionHeading from '@/components/TractionHeading.vue'
import TractionFieldError from '@/components/shared/TractionFieldError.vue'
import TractionInput from '@/components/shared/TractionInput.vue'
import TractionButton from '@/components/shared/TractionButton.vue'
import TractionLabel from '@/components/shared/TractionLabel.vue'

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
 * Validate location barcode
 */
const validateLocationBarcode = () => {
  if (!location_barcode.value) {
    errors.location_barcode = 'Location barcode is required'
  } else {
    delete errors.location_barcode
  }
}

/**
 * Validate labware barcodes
 */
const validateLabwareBarcodes = () => {
  if (!labware_barcodes.value) {
    errors.labware_barcodes = 'Labware barcodes are required'
  } else {
    const uniqueBarcodes = new Set(barcodeArray.value)
    if (uniqueBarcodes.size !== barcodeArray.value.length) {
      errors.labware_barcodes = 'Labware barcodes must be unique'
    } else {
      delete errors.labware_barcodes
    }
  }
}

/**
 * Validates the entire form.
 * @returns {boolean} True if the form is valid, false otherwise.
 */
const validateForm = () => {
  resetErrors() // Clear previous errors

  validateUserCode()
  validateLocationBarcode()
  validateLabwareBarcodes()

  return Object.keys(errors).length === 0
}

/**
 * Computed property to get the array of labware barcodes.
 */
const barcodeArray = computed(() => {
  return labware_barcodes.value
    .split('\n')
    .map((barcode) => barcode.trim())
    .filter((barcode) => barcode !== '')
})

/**
 * Store barcodes into labwhere location
 *
 */
const storeBarcodes = async () => {
  if (validateForm()) {
    try {
      const response = await storeBarcodesIntoLabwhereLocation(
        user_code.value,
        location_barcode.value,
        labware_barcodes.value,
        start_position.value,
      )
      if (response.success) {
        showAlert('Barcodes stored successfully', 'success')
      } else {
        showAlert(response.errors.join('\n'), 'danger')
      }
    } catch (error) {
      showAlert('Failed to store: ' + error, 'danger')
    }
  }
}

/**
 * Computed property to get the confirmation text.
 */
const confirmationText = computed(() => {
  const barcodeCount = barcodeArray.value.length
  return barcodeCount === 0
    ? `No barcodes to store to location ${location_barcode.value}`
    : `Store ${barcodeCount} barcode(s) to location ${location_barcode.value}`
})

/**
 * Reset the form errors.
 */
const resetErrors = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
}

/**
 * Reset the form fields and errors.
 */
const onReset = () => {
  user_code.value = ''
  location_barcode.value = ''
  labware_barcodes.value = ''
  start_position.value = null
  resetErrors()
}
</script>
