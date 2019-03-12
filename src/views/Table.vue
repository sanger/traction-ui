<template>
  <div class="table">
    <dataTable>
      <samples v-if="dataType === 'samples'" :items="getItems"></samples>
      <libraries v-if="dataType === 'libraries'" :items="getItems"></libraries>
    </dataTable>
  </div>
</template>

<script>
import Samples from '@/views/Samples'
import Libraries from '@/views/Libraries'
import DataTable from '@/components/DataTable'

export default {
  name: 'Table',
  props: {
    items: Array
  },
  components: {
    DataTable,
    Samples,
    Libraries
  },
  data () {
    return {
      dataType: ''
    }
  },
  methods: {
    setType () {
      if (Object.keys(this.items[0]).includes('material')) {
        this.dataType = this.items[0].material.type
      }
    }
  },
  computed: {
    getItems () {
      return this.items.map(i => Object.assign(i.material, {barcode: i.barcode}))
    }
  },
  created() {
    this.setType()
  }
}
</script>
