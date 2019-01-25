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
    <b-button id="createLibraries" @click="createLibraries" class="float-right">Create Libraries</b-button>
  </div>
</template>

<script>
import Vue from 'vue'
import DataList from '@/api/DataList'
import DataModel from '@/api/DataModel'
import SampleItem from '@/components/SampleItem'
import Alert from '@/components/Alert'
import ApiConfig from '@/api/Config'
import ConfigItem from '@/api/ConfigItem'

export default {
  name: 'Samples',
  props: {
  },
  data () {
    return {
    }
  },
  created() {
  },
  methods: {
    async createLibraries () {
      try {
        await this.createLibrariesInTraction()
      } catch (error) {
        // log error
      } finally {
        this.showAlert
      }
    },
    async createLibrariesInTraction () {
      let sample_ids = []
      for (let i = 0; i < this.selected.length; i++) {
        let id = this.selected[i].id
        sample_ids.push( {'sample_id': id} )
      }
      let body = { data: { type: 'libraries', attributes: { libraries: sample_ids }}}

      await this.tractionApiLibrary.create(body)

      if (this.tractionApiLibrary.data !== null) {
        this.message = 'Libraries created in Traction'
      } else {
        this.message = this.tractionApiLibrary.errors.message
        throw this.message
      }

    },
  },
  components: {
    DataList,
    SampleItem,
    Alert
  },
  computed: {
    selected () {
      return this.$refs.samples.$children.filter(sample => sample.selected).map(sample => sample.json)
    },
    tractionConfig () {
      let Cmp = Vue.extend(ConfigItem)
      return new Cmp({ propsData: ApiConfig.traction})
    },
    tractionApiLibrary () {
      let Cmp = Vue.extend(DataModel)
      return new Cmp({ propsData: this.tractionConfig.resource('samples')})
    },
    showAlert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  }
}
</script>
