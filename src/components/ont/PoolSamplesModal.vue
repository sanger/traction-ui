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

import LIBRARY_CREATE_MUTATION from '@/graphql/queries/LibraryCreate.mutation.gql'

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
        mutation: LIBRARY_CREATE_MUTATION,
        variables: {
          plate_id: 1,
        }
      }).then(data => {
        // Show alert
        console.log(data)
        console.log('Success!');
      })
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