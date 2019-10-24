<template>
  <td>
    <div>
      <select v-model="movieTime" ref="movieTime">
        <option>15</option>
        <option>20</option>
        <option>30</option>
      </select>
    </div>
    
    <div>
      <label for="insertSize">Insert Size:</label>
      <input type="text" v-model="insertSize" name="insertSize" ref="insertSize" />
    </div>
    <div>
      <label for="onPlateLoadingConc">On Plate Loading Concentration (mP):</label>
      <input type="text" v-model="onPlateLoadingConc" name="onPlateLoadingConc" ref="onPlateLoadingConc" />
    </div>
    <div>
      <label for="libraryBarcode">Library Barcode:</label>
      <input type="text" v-model="libraryBarcode" name="libraryBarcode" ref="libraryBarcode" />
    </div>
  </td>
</template>

<script>

export default {
  name: 'Well',
  props: {
    row: {
      type: String,
      required: true
    },
    column: {
      type: [String,Number],
      required: true
    }
  },
  computed: {
    position () {
      return this.row.concat(this.column)
    }
  },
  data () {
    return {
      movieTimeOptions: [15,20,30],
      movieTime: null,
      insertSize: null,
      onPlateLoadingConc: null,
      libraryBarcode: null
    }
  },
  methods: {
  }
}
</script>
