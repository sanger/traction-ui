<template>
  <div class="table">
    <alert ref='alert'></alert>

    <dataTable>
      <samples v-if="dataType === 'samples'" :items="getItems" @alert="showAlert"></samples>
      <libraries v-if="dataType === 'libraries'" :items="getItems" @alert="showAlert"></libraries>
    </dataTable>
  </div>
</template>

<script>
import Samples from '@/views/Samples'
import Libraries from '@/views/Libraries'
import DataTable from '@/components/DataTable'
import Alert from '@/components/Alert'

export default {
  name: 'Table',
  props: {
    items: Array
  },
  components: {
    DataTable,
    Samples,
    Libraries,
    Alert
  },
  data () {
    return {
      dataType: '',
      message: ''
    }
  },
  methods: {
    showAlert (message) {
      this.message = message
      this.alert
    },
    setType () {
      if (Object.keys(this.items[0]).includes('material')) {
        this.dataType = this.items[0].material.type
      }
    }
  },
  computed: {
    getItems () {
      return this.items.map(i => Object.assign(i.material, {barcode: i.barcode}))
    },
    alert () {
      return this.$refs.alert.show(this.message, 'primary')
    }
  },
  created() {
    this.setType()
  }
}
</script>
