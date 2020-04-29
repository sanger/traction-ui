<template>
  <div>
    <b-button right size="sm" variant="outline-success" :id="'pool-btn-'+plate_id" @click="modalShow = !modalShow">
      Pool Samples
    </b-button>

    <b-modal 
      v-model="modalShow" 
      ok-title="Create" 
      @ok="handleOk" 
      :ok-disabled="!this.selectedTagSet"
    > 
      <template v-slot:modal-title>
        {{ modalTitle }}
      </template> 

      <b-form-select v-model="selectedTagSet" :options="options"></b-form-select>
    </b-modal>
  </div>

</template>

<script>

export default {
  name: 'PoolSamplesModal',
  props: ['plate_id'],
  data() {
    return {
      modalShow: false,
      selectedTagSet: null,
      options: [{ value: null, text: 'Please select a tag set' }, 24, 96]
    }
  },
  methods: {
    handleOk() {
      // GraphQL post
    }
  },
  computed: {
    modalTitle () {
      let poolingTitle = { null: '', 24: 'into 4 libraries', 96: 'into 1 library' }
      return 'Pool Samples ' + poolingTitle[this.selectedTagSet]
    }
  }
}

</script>