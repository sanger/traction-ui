<template>
  <div>
    <b-button :id="'infoPlateBtn-' + plate.id" size="sm" variant="info" @click="show">+</b-button>

    <b-modal id="infoPlateModal" ref="modal" title="Plate info" size="lg">
      <div id="plate-template">
        Plate SVG
      </div>
      <div id="pool-template">
        <b-button variant="success"> Pool samples </b-button>
      </div>
      <b-form-group id="select-input" label="Options:" label-for="input">
        <b-form-select id="input" v-model="selected" :options="options" class="mb-3" />
      </b-form-group>
      <template v-slot:modal-footer="{ cancel }">
        <b-button variant="primary" @click="cancel()"> Close </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import ModalHelper from '@/mixins/ModalHelper'
// Note this file has temporary changes waiting on UAT for updates

export default {
  name: 'PacbioPlateInfoModal',
  mixins: [ModalHelper],
  props: {
    plate: {
      type: [Object],
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      selected: null,
      options: [
        { value: null, text: 'Please select an option' },
        { value: 'a', text: 'Example of how we can add metadata' },
        { value: 'b', text: 'Option 2' },
      ],
    }
  },
  methods: {
    show() {
      this.$refs['modal'].show()
    },
    alert(message, type) {
      this.$emit('alert', message, type)
    },
  },
}
</script>
<style>
#plate-template {
  height: 200px;
  padding: 25% 0;
  text-align: center;
  border: solid blue 1px;
}

#pool-template {
  padding: 25px 0;
  text-align: center;
}
</style>
