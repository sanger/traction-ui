<template>
  <traction-table-row
    data-type="pool-aliquot-edit"
    :class="['cursor-pointer', `${props.selected && 'border-4 border-purple-500'}`]"
    @click="onTableRowClick"
  >
    <traction-table-column data-attribute="request-sample-name">
      {{ props.request.sample_name }}
    </traction-table-column>
    <traction-table-column data-attribute="request-source-identifier">
      {{ props.request.source_identifier }}
    </traction-table-column>
    <traction-table-column>
      <traction-field-error
        data-attribute="tag-id-error"
        :error="errorsFor('tag_id')"
        :with-icon="isValidationExists('tag_id')"
      >
        <traction-select
          v-if="tagList.length > 0"
          v-model="tag_id"
          data-type="tag-list"
          :options="tagListOptions"
        ></traction-select>
      </traction-field-error>
    </traction-table-column>
    <traction-table-column>
      <traction-field-error
        data-attribute="template-prep-kit-box-barcode-error"
        :error="errorsFor('template_prep_kit_box_barcode')"
        :with-icon="isValidationExists('template_prep_kit_box_barcode')"
      >
        <traction-input
          v-model="template_prep_kit_box_barcode"
          data-attribute="template-prep-kit-box-barcode"
          placeholder="Template Prep Kit Box Barcode"
        />
      </traction-field-error>
    </traction-table-column>
    <traction-table-column>
      <traction-field-error
        data-attribute="volume-error"
        :error="errorsFor('volume')"
        :with-icon="isValidationExists('volume')"
      >
        <traction-input
          v-model="volume"
          data-attribute="volume"
          placeholder="Volume"
          classes="min-w-128"
        />
        <div class="flex items-center px-1" data-attribute="available-volume-div">
          <traction-tooltip
            v-show="aliquot.available_volume != null"
            :tooltip-text="'Available volume is ' + aliquot.available_volume"
          >
            <traction-badge id="library-used-volume" colour="sanger-yellow"
              ><TractionInfoIcon class="mr-1" />{{ aliquot.available_volume }}</traction-badge
            >
          </traction-tooltip>
        </div>
      </traction-field-error>
    </traction-table-column>

    <traction-table-column>
      <traction-field-error
        data-attribute="concentration-error"
        :error="errorsFor('concentration')"
        :with-icon="isValidationExists('concentration')"
      >
        <traction-input
          v-model="concentration"
          data-attribute="concentration"
          placeholder="Concentration"
        />
      </traction-field-error>
    </traction-table-column>
    <traction-table-column>
      <traction-field-error
        data-attribute="insert-size-error"
        :error="errorsFor('insert_size')"
        :with-icon="isValidationExists('insert_size')"
      >
        <traction-input
          v-model="insert_size"
          data-attribute="insert-size"
          placeholder="Insert Size"
        />
      </traction-field-error>
    </traction-table-column>
  </traction-table-row>
</template>
<script setup>
/**
 * @name PacbioPoolAliquotEdit
 * @description Edit form for a pool aliquot
 * @param {Object} props
 * @param {Object} props.request - The request object
 * @param {Boolean} props.autoTag - Whether to automatically tag the aliquot
 * @param {Boolean} props.validated - Whether the values have been validated
 * @param {Function} props.notify - Callbcak function when an attribute is changed
 */
import { computed, ref } from 'vue'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import TractionBadge from '@/components/shared/TractionBadge.vue'
import TractionInfoIcon from '@/components/shared/icons/TractionInfoIcon.vue'
import TractionTooltip from '@/components/shared/TractionTooltip.vue'

const props = defineProps({
  /*
   * The request object
   * @type {Object}
   * @default { id: null }
   */
  request: {
    type: Object,
    default() {
      return { id: null }
    },
  },
  /**
   * Whether to automatically tag the aliquot
   * @type {Boolean}
   * @default false
   */
  autoTag: {
    type: Boolean,
    default: false,
  },
  /**
   * Indicates whether the values have been validated
   * @type {Boolean}
   * @default false
   */
  validated: {
    type: Boolean,
    default: false,
  },

  selected: {
    type: Boolean,
    default: false,
  },
  /**
   * @type {Function}
   * Callback function passed from parent indicating what to do when an attribute is changed
   */
  notify: {
    type: Function,
    required: true,
    default: () => {},
  },
})
const emit = defineEmits(['aliquotSelected'])

const fieldsThatRequireValidation = ref([]) // store the fields that have been altered and require validation
// store
const store = usePacbioPoolCreateStore()

/**
 *The list of tags in the selected tag set ready for use in a select component
  The format is an array of objects with value and text properties
 */
const tagList = computed(() => {
  return store.selectedTagSet.tags.map(({ id: value, group_id: text }) => ({ value, text }))
})

/**
 * The list of tags with a default option
 */
const tagListOptions = computed(() => {
  return [{ value: null, text: 'Please select a tag' }, ...tagList.value]
})
/**
 * The aliquot object for the request
 */
const aliquot = computed(() => store.usedAliquotItem(props.request.source_id))

/**
 * A function to set the library attributes
 * @param {String} attr - The attribute to set
 * */
const aliquotSetter = (attr) => {
  return computed({
    get() {
      return aliquot.value[attr]
    },
    set(newValue) {
      store.updateUsedAliquot({
        request: aliquot.value.request,
        [attr]: newValue,
        source_id: aliquot.value.source_id,
      })
      // Validate the given attribute in the aliquot object
      store.validateUsedAliquot(aliquot.value, attr)
    },
  })
}

//The aliquotSetter function for each attribute - volume, insert_size, concentration and template_prep_kit_box_barcode
const volume = aliquotSetter('volume')
const insert_size = aliquotSetter('insert_size')
const concentration = aliquotSetter('concentration')
const template_prep_kit_box_barcode = aliquotSetter('template_prep_kit_box_barcode')

/**
 * The tag id for the aliquot
 */
const tag_id = computed({
  get() {
    return store.usedAliquotItem(aliquot.value.source_id).tag_id
  },
  set(tag_id) {
    if (tag_id !== this.tag_id) {
      // record that the tag id has been altered
      fieldsThatRequireValidation.value['tag_id'] = true
      props.notify()
    }
    store.applyTags({
      used_aliquots: { tag_id, request: aliquot.value.request, source_id: aliquot.value.source_id },
      autoTag: props.autoTag,
    })
  },
})

/**
 * The errors for an attribute
 */
const errorsFor = (attribute) => {
  if (props.validated) {
    fieldsThatRequireValidation.value = []
  }
  return aliquot.value?.errors?.[attribute]
}

/**
 * Whether a validation exists for an attribute
 */
const isValidationExists = (attribute) => {
  if (props.validated) {
    return true
  } else {
    return !fieldsThatRequireValidation.value[attribute]
  }
}

const onTableRowClick = (event) => {
  // Avoid toggle selection when user clivks on any edit fields
  if (event.target.tagName !== 'TD') {
    return
  }
  emit('aliquotSelected', !props.selected)
}
</script>
