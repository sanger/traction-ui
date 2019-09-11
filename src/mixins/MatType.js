/**
 * A mixin to store commonly used functionality for the material types
 */
import * as consts from '@/consts/consts'
import handlePromise from '@/api/PromiseHelper'

export default {
  name: 'MatType',
  methods: {
    async getMaterial(materialType) {
      this.log(`getMaterial(${materialType})`)

      let promise = null
      if (materialType === consts.MAT_TYPE_REQUESTS) {
        promise = this.requestsRequest.get()
      } else if (materialType === consts.MAT_TYPE_LIBRARIES) {
        promise = this.libraryRequest.get()
      } else {
        throw Error(consts.MESSAGE_ERROR_INTERNAL)
      }
      let response = await handlePromise(promise)
      this.log(response)

      if (response.successful) {
        let materials = eval(`response.deserialize.${materialType}`)
        this.log(materials)

        this.$store.commit(`add${this.capitalizeFirstLetter(materialType)}`, materials)

        // Pre-filter the samples to those provided as a query paramater
        if (typeof this.$route.query.barcode !== 'undefined' && this.$route.query.barcode !== '') {
          let preFilteredBarcodes = []
          if (typeof this.$route.query.barcode === 'string') {
            preFilteredBarcodes.push(this.$route.query.barcode)
          } else {
            preFilteredBarcodes.push(...this.$route.query.barcode)
          }
          this.log(`preFilteredBarcodes: ${preFilteredBarcodes}`)

          // There might be barcodes in the query which are invalid, remove these and alert the user
          let barcodesOfMaterials = materials.map(material => material.barcode)
          let invalidBarcodes = preFilteredBarcodes.filter(
            barcode => !barcodesOfMaterials.includes(barcode))

          if (invalidBarcodes.length > 0) {
            this.showAlert(consts.MESSAGE_ERROR_INVALID_BARCODES.concat(invalidBarcodes.join(', ')),
              'danger')
          }

          // Pre-filter the materials with the supplied barcodes
          this.preFilteredMaterials = materials.filter(
            material => preFilteredBarcodes.includes(material.barcode))

          // If there are no materials after pre-filtering (due to invalid barcodes), show all
          if (this.preFilteredMaterials.length === 0) return materials

          return this.preFilteredMaterials
        }
        return materials
      } else {
        this.showAlert(response.errors.message)
        return []
      }
    },
  }
}
