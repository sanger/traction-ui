<template>
  <div class="newrun">
    <b-container>
      <b-row>
        <b-col>
          <table class="table">
            <thead>
              <tr>
                <th></th>
                <th>Library ID</th>
                <th>Sample name</th>
                <th>Barcode</th>
                <th>Enzyme</th>
                <th>State</th>
              </tr>
            </thead>
            <data-list ref="libraries" v-bind="tractionConfig.resource('libraries')">
              <tbody slot-scope="{ data: libraries }">
                <library-item v-for="library in libraries" v-bind:key="library.id" v-bind="library"></library-item>
              </tbody>
            </data-list>
          </table>
        </b-col>
        <b-col>
          <flowcell></flowcell>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import DataList from '@/api/DataList'
import DataModel from '@/api/DataModel'
import ConfigItem from '@/api/ConfigItem'
import ApiConfig from '@/api/Config'
import ComponentFactory from '@/mixins/ComponentFactory'
import LibraryItem from '@/components/LibraryItem'
import Flowcell from '@/components/Flowcell'

export default {
  name: 'NewRun',
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
  },
  components: {
    DataList,
    LibraryItem,
    Flowcell,
  },
  computed: {
    tractionConfig () {
      return this.build(ConfigItem, ApiConfig.traction)
    },
    tractionApi () {
      return this.build(DataModel, this.tractionConfig.resource('libraries'))
    }
  }
}
</script>
