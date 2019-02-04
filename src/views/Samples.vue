<template>
  <div class="samples">
    <alert ref='alert'></alert>
    <table class="table">
      <thead>
        <tr>
          <th></th>
          <th>Sample ID</th>
          <th>Name</th>
          <th>Species</th>
          <th>Barcode</th>
        </tr>
      </thead>
      <data-list ref="samples" v-bind="tractionConfig.resource('samples')">
        <tbody slot-scope="{ data: samples }">
          <sample-item v-for="sample in samples" v-bind:key="sample.id" v-bind="sample"></sample-item>
        </tbody>
      </data-list>
    </table>

    <!-- Button to create libraries -->
    <modal v-on:selectEnzyme="createLibraries" :disabled=false class="float-right" ></modal>

  </div>
</template>

<script>
import DataList from '@/api/DataList'
import DataModel from '@/api/DataModel'
import SampleItem from '@/components/SampleItem'
import Alert from '@/components/Alert'
import ApiConfig from '@/api/Config'
import ConfigItem from '@/api/ConfigItem'
import ComponentFactory from '@/mixins/ComponentFactory'
import Modal from '@/components/Modal';

export default {
  name: 'Samples',
  mixins: [ComponentFactory],
  props: {
  },
  data () {
    return {
    }
  },
  created() {
  },
  methods: {
    async createLibraries (selectedEnzymeId) {
      try {
        await this.createLibrariesInTraction(selectedEnzymeId)
      } catch (error) {
        // log error
      } finally {
        this.showAlert
      }
    },
    async createLibrariesInTraction (selectedEnzymeId) {
      let libraryAttrs = []
      for (let i = 0; i < this.selected.length; i++) {
        let sampleId = this.selected[i].id
        let enzymeId = selectedEnzymeId
        libraryAttrs.push( {'sample_id': sampleId, 'enzyme_id': enzymeId} )
      }
      let body = { data: { type: 'libraries', attributes: { libraries: libraryAttrs }}}

      await this.tractionApiLibrary.create(body)

      if (this.tractionApiLibrary.data !== null) {
        this.message = 'Libraries created in Traction'
      } else {
        this.message = this.tractionApiLibrary.errors.message
        throw this.message
      }
    },
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
  },
  components: {
    DataList,
    SampleItem,
    Alert,
    Modal
  },
  computed: {
    selected () {
      return this.$refs.samples.$children.filter(sample => sample.selected).map(sample => sample.json)
    },
    tractionConfig () {
      return this.build(ConfigItem, ApiConfig.traction)
    },
    tractionApiLibrary () {
      return this.build(DataModel, this.tractionConfig.resource('libraries'))
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  }
}
</script>
