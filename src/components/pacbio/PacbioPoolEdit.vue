<template>
  <b-tr data-type="pool-edit">
     <b-td>
      <b-form-input
        v-model="poolItem.template_prep_kit_box_barcode"
        data-attribute="template-prep-kit-box-barcode"
        :value="poolItem.template_prep_kit_box_barcode"
        placeholder="Template Prep Kit Box Barcode"
        type="text"
        title="Template Prep Kit Box Barcode"
      />
    </b-td>
    <b-td>
      <b-form-input
        v-model="poolItem.volume"
        data-attribute="volume"
        :value="poolItem.volume"
        placeholder="Volume"
        type="text"
        title="Volume"
      />
    </b-td>
    <b-td>
      <b-form-input
        v-model="poolItem.concentration"
        data-attribute="concentration"
        :value="poolItem.concentration"
        placeholder="Concentration"
        type="text"
        title="Concentration"
      />
    </b-td>
    <b-td>
      <b-form-input
        v-model="poolItem.fragment_size"
        data-attribute="fragment-size"
        :value="poolItem.fragment_size"
        placeholder="Fragment Size"
        type="text"
        title="Fragment Size"
      />
    </b-td>
  </b-tr>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PoolEdit',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['poolItem']),
  },
  mounted() {
  },
  methods: {
  }
}
</script>
