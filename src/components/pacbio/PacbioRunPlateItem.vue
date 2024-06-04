<template>
  <!-- I have added a v-if as we are having render errors. I suspect we will need to fix this properly. -->
  <div v-if="storePlate">
    <div class="text-left mx-5 mb-5 flex flex-col">
      <traction-label classes="text-left my-2">Plate number: {{ plateNumber }}</traction-label>
      <traction-label classes="text-left">
        Sequencing Kit Box Barcode:
        <traction-field-error
          v-if="storePlate"
          :data-attribute="`sequencing-kit-box-barcode-${plateNumber}-error`"
          :error="validateSequencingKitBoxBarcode.error"
          :with-icon="validateSequencingKitBoxBarcode.valid"
        >
          <traction-input
            :id="`sequencing-kit-box-barcode-${plateNumber}`"
            v-model="storePlate.sequencing_kit_box_barcode"
            placeholder="Sequencing Kit Box Barcode"
            type="text"
            :data-attribute="`sequencing-kit-box-barcode-${plateNumber}`"
            class="w-full"
          />
        </traction-field-error>
      </traction-label>
      <traction-label v-if="isRevio" data-attribute="serial-number" classes="text-left"
        >Serial Number: {{ serialNumber }}</traction-label
      >
    </div>
    <div :class="store.instrumentType.plateClasses">
      <LabwareMap
        v-slot="{ position }"
        :labware-type="store.instrumentType.labwareType"
        :name="store.instrumentType.labwareType.name"
        :data-attribute="`pacbio-run-plate-${plateNumber}`"
      >
        <PacbioRunWell
          :position="position"
          :plate-number="plateNumber"
          :interactive="true"
          @click="onWellClick"
        />
      </LabwareMap>
    </div>
    <PacbioRunWellEdit ref="modal" class="modal" @alert="alert"></PacbioRunWellEdit>
  </div>
</template>

<script setup>
/**
 * PacbioRunPlateItem component
 * This component displays a single plate with its wells and allows the user to interact with the wells.
 * It also displays the sequencing kit box barcode and serial number of the plate.
 * It uses the PacbioRunWellEdit component to edit the well.
 * It uses the LabwareMap component to display the wells.
 * It uses the PacbioInstrumentTypes and validatePlate functions to validate the plate.
 * It uses the usePacbioRunCreateStore store to get the plate and instrument type.
 * It emits an alert event when an alert is triggered.
 */
import PacbioRunWellEdit from '@/components/pacbio/PacbioRunWellEdit.vue'
import PacbioRunWell from '@/components/labware/PacbioRunWell.vue'
import LabwareMap from '@/components/labware/LabwareMap.vue'
import { PacbioInstrumentTypes, validatePlate } from '@/lib/PacbioInstrumentTypes.js'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate.js'
import { ref, computed } from 'vue'

// Create a new store instance of the pacbioRunCreateStore
const store = usePacbioRunCreateStore()

// Define the props
const props = defineProps({
  // Define the plateNumber prop
  plateNumber: {
    type: [String, Number],
    required: true,
  },
})
// Define the emits
const emit = defineEmits(['alert'])

/*
`modal` is a reference (`ref`) that will be linked to the modal component in the template.
 This allows us to directly interact with the modal component, such as calling its methods or accessing its data.*/
const modal = ref(null)

// `isRevio` is a computed property that checks if the current instrument type is Revio.
const isRevio = computed(() => store.instrumentType.key === PacbioInstrumentTypes.Revio.key)

// `storePlate` is a computed property that gets the plate from the store using the plateNumber prop.
const storePlate = computed(() => store.getPlate(props.plateNumber))

// `serialNumber` is a computed property that extracts a substring from the sequencing kit box barcode of the plate.
const serialNumber = computed(() => storePlate.value.sequencing_kit_box_barcode.substring(15, 20))

//`validateSequencingKitBoxBarcode` is a computed property that validates the plate's sequencing kit box barcode.
const validateSequencingKitBoxBarcode = computed(() => {
  if (!storePlate.value) return
  return validatePlate({ plate: storePlate.value, instrumentType: store.instrumentType })
})
// Define the alert function that emits an alert event with a message and type.
const alert = (message, type) => emit('alert', message, type)
// Define the onWellClick function that shows the modal for the clicked well position and plate number.
const onWellClick = (position, plateNumber) =>
  modal.value.showModalForPositionAndPlate(position, plateNumber)
</script>
