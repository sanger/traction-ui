<template>
  <div>
    <b-button right size="sm" variant="outline-success" :id="'pool-btn-'+plate_barcode" @click="modalShow = !modalShow">
      Pool Samples
    </b-button>

    <b-modal 
      v-model="modalShow" 
      ok-title="Create" 
      @ok="handleOk" 
      :ok-disabled="!this.selectedTagSet || !this.groupingDirection"
    > 
      <template v-slot:modal-title>
        {{ modalTitle }}
      </template> 

      <b-form-select v-model="selectedTagSet" :options="tagSetOptions"></b-form-select>
      <b-form-select v-model="groupingDirection" :options="groupingDirectionOptions"></b-form-select>
    </b-modal>
  </div>

</template>

<script>

import POOL_SAMPLES from '@/graphql/queries/PoolSamples.mutation.gql'

export default {
  name: 'PoolSamplesModal',
  props: {
    plate_barcode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      modalShow: false,
      selectedTagSet: null,
      groupingDirection: null,
      // TODO: How/Do we need to get tag set options/ names?
      tagSetOptions: [{ value: null, text: 'Please select a tag set' }, 'ONTTagSetTest2Wells', 'OntWell96Samples'],
      groupingDirectionOptions: [{ value: null, text: 'Please select a grouping option' }, 'horizontal', 'vertical']
    }
  },
  methods: {
    handleOk () {
      this.$apollo.mutate({
        mutation: POOL_SAMPLES,
        variables: {
          plate_barcode: this.plate_barcode,
          tag_set_name: this.selectedTagSet,
          grouping_direction: this.groupingDirection,
        }
      }).then(data => {
        // TODO: is there a better way to handle mutation errors?
        let response = data.data.createOntLibraries
        if (response.errors.length > 0) {
          this.$parent.$emit('alert', 'Failure: ' + data.data.createOntLibraries.errors.join(', '), 'danger')
        } else {
          let libraryBarcodes = response.tubes.map(t => t.barcode).join(', ')
          this.$parent.$emit('alert', 'Library(s) were created with barcodes: ' + libraryBarcodes, 'success')
        }
      })
    },
  },
  computed: {
    // TODO: Update once know more about tag set options
    modalTitle () {
      let poolingTitle = { null: '', 24: 'into 4 libraries', 96: 'into 1 library' }
      return 'Pool Samples ' + poolingTitle[this.selectedTagSet]
    }
  }
}

</script>