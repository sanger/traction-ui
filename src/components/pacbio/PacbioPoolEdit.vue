<template>
  <b-col data-type="pool">
    <alert ref="alert" data-type="pool-create-message"></alert>
    <h3>Pooled Samples</h3>
    <PacbioPoolLibraryList />
    <div class="pool-edit" data-type="pool-edit">
      <b-table-simple>
        <b-tr>
          <td class="td-empty">&nbsp;</td>
          <td class="td-empty">&nbsp;</td>
          <td class="td-empty">&nbsp;</td>
          <td>
            <b-form-input
              v-model="poolItem.template_prep_kit_box_barcode"
              data-attribute="template-prep-kit-box-barcode"
              :value="poolItem.template_prep_kit_box_barcode"
              placeholder="Template Prep Kit Box Barcode"
              type="text"
              title="Template Prep Kit Box Barcode"
            />
          </td>
          <td>
            <b-form-input
              v-model="poolItem.volume"
              data-attribute="volume"
              :value="poolItem.volume"
              placeholder="Volume"
              type="text"
              title="Volume"
            />
          </td>
          <td>
            <b-form-input
              v-model="poolItem.concentration"
              data-attribute="concentration"
              :value="poolItem.concentration"
              placeholder="Concentration"
              type="text"
              title="Concentration"
            />
          </td>
          <td>
            <b-form-input
              v-model="poolItem.fragment_size"
              data-attribute="fragment-size"
              :value="poolItem.fragment_size"
              placeholder="Fragment Size"
              type="text"
              title="Fragment Size"
            />
          </td>
        </b-tr>
      </b-table-simple>
    </div>
    <div class="text-right">
      <b-button
        v-if="!persisted"
        data-action="create-pool"
        variant="success"
        :disabled="busy"
        @click="create()"
      >
        <span class="button-text">Create Pool </span>
        <b-spinner v-show="busy" small></b-spinner>
      </b-button>
      <b-button
        v-if="persisted"
        data-action="update-pool"
        variant="success"
        :disabled="busy"
        @click="update()"
      >
        <span class="button-text">Update Pool </span>
        <b-spinner v-show="busy" small></b-spinner>
      </b-button>
    </div>
  </b-col>
</template>

<script>
import Alert from '@/components/Alert'
import PacbioPoolLibraryList from '@/components/pacbio/PacbioPoolLibraryList'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('traction/pacbio/poolCreate')

export default {
  name: 'PoolEdit',
  components: {
    PacbioPoolLibraryList,
    Alert,
  },
  data() {
    return {
      busy: false,
    }
  },
  computed: {
    ...mapGetters(['poolItem']),
    persisted() {
      return !!this.poolItem.id
    },
  },
  mounted() {},
  methods: {
    ...mapActions(['createPool']),
    create() {
      this.busy = true
      this.createPool().then(({ success, barcode, errors }) => {
        success
          ? this.$refs.alert.show(`Pool successfully created with barcode ${barcode}`, 'success')
          : this.$refs.alert.show(errors, 'danger')
      })
      this.busy = false
    },
  },
}
</script>

<style scoped lang="scss">
@import 'src/styles/components.scss';

.button-text {
  padding-right: 2px;
  position: relative;
  top: 2px;
}
.form-control {
  font-size: 0.8em;
}
.pool-edit {
  padding-bottom: 5px;
  padding-top: 5px;
}
.td-empty {
  width: 110px;
}
</style>
