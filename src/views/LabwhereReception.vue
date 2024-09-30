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
              <traction-input id="userCode" v-model="user_code" class="flex w-full" />
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
              <traction-input id="locationBarcode" v-model="location_barcode" class="flex w-full"
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
              />
            </traction-field-error>
          </fieldset>
        </div>
      </div>
      <div class="w-full md:w-2/5 p-4 space-y-4 bg-sdb-400 rounded-md border-t-4 border-sp">
        <traction-heading level="3" class-name="text-white italic" show-border>
          Preview of barcodes to store
        </traction-heading>

        <traction-label class="text-white">
          5 Barcodes to be scanned to store to location</traction-label
        >
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
import { ref, reactive, computed } from 'vue'
import { storeBarcodesIntoLabwhereLocation } from '@/services/labwhere/client.js'
import useAlert from '@/composables/useAlert.js'

const user_code = ref('')
const location_barcode = ref('')
const labware_barcodes = ref('')
const start_position = ref(null)
const errors = reactive({}) // Object to store form validation errors

const { showAlert } = useAlert()

const validateForm = () => {
  // Clear previous errors
  resetErrors()

  if (!user_code.value) {
    errors.user_code = 'User barcode is required'
  }

  if (!location_barcode.value) {
    errors.location_barcode = 'Location barcode is required'
  }

  if (!labware_barcodes.value) {
    errors.labware_barcodes = 'Barcodes are required'
  } else {
    const barcodeArray = labware_barcodes.value
      .split('\n')
      .map((barcode) => barcode.trim())
      .filter((barcode) => barcode !== '')
    const uniqueBarcodes = new Set(barcodeArray)
    if (uniqueBarcodes.size !== barcodeArray.length) {
      errors.labware_barcodes = 'Duplicate barcodes are not allowed'
    }
  }

  return Object.keys(errors).length === 0
}

const isFormValid = computed(() => {
  return validateForm()
})

const barcodeCount = computed(() => {
  return labware_barcodes.value.split('\n').filter((barcode) => barcode.trim() !== '').length
})

const storeBarcodes = async () => {
  if (validateForm()) {
    try {
      const params = {
        'scan[user_code]': user_code.value,
        'scan[labware_barcodes]': labware_barcodes.value,
        'scan[location_barcode]': location_barcode.value,
      }

      debugger
      if (start_position.value !== null) {
        params['scan[start_position]'] = start_position.value
      }

      const response = await storeBarcodesIntoLabwhereLocation(params)
      debugger
      if (response.success) {
        showAlert('Barcodes stored successfully', 'success')
      } else {
        showAlert(response.errors.join('\n'), 'danger')
      }
    } catch (error) {
      showAlert('Failed to store: ' + error, 'danger')
    }
  } else {
    console.log('Form is invalid, not submitting...')
  }
}

const resetErrors = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
}
const onReset = () => {
  user_id.value = ''
  location_barcode.value = ''
  barcodes.value = ''
  start_position.value = null
  resetErrors()
}
</script>
