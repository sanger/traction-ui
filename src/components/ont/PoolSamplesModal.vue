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

import POOL_SAMPLES from '@/graphql/queries/PoolSamples.mutation.gql'

export default {
  name: 'PoolSamplesModal',
  props: {
    plate_id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      modalShow: false,
      selectedTagSet: null,
      options: [{ value: null, text: 'Please select a tag set' }, 24, 96]
    }
  },
  methods: {
    handleOk () {
      this.$apollo.mutate({
        mutation: POOL_SAMPLES,
        variables: {
          plate_id: 1,
        }
      }).then(data => {
        this.$parent.$emit('alert', 'Success ' + data, 'success')
      }).catch(data =>{
        this.$parent.$emit('alert', 'Failure ' + data, 'danger')
      })
    },

  },
  computed: {
    modalTitle () {
      let poolingTitle = { null: '', 24: 'into 4 libraries', 96: 'into 1 library' }
      return 'Pool Samples ' + poolingTitle[this.selectedTagSet]
    }
  }
}

</script>