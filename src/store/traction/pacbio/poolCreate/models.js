/**
 * Generates an object describing a new library for population `store.libraries`
 * @param {Object} attributes any attributes of the object to pre-populate
 * @example newLibrary({pacbio_request_id: '1'})
 */
import Vue from 'vue'

// These are the standard attributes that are expected in a library
const libraryAttributes = {
  pacbio_request_id: null,
  template_prep_kit_box_barcode: null,
  tag_id: null,
  volume: null,
  concentration: null,
  fragment_size: null,
}

// we have to do this to ensure the properties are reactive.
function Library(attributes) {
  for (const [key, value] of Object.entries(libraryAttributes)) {
    this[key] = attributes[key] || value
  }

  this.errors = {}
  this.validated = false

  this.validate = () => {
    Object.keys(libraryAttributes).forEach((key) => {
      if (!this[key]) {
        Vue.set(this.errors, key, 'must be present')
      } else {
        Vue.delete(this.errors, key)
      }
      this.validated = true
    })
  }

  this.valid = () => {
    return this.validated && Object.keys(this.errors).length === 0
  }
}

const newLibrary = (attributes) => {
  return new Library(attributes)
}

// const newLibrary = (attributes) => {

//   pacbio_request_id: null

//   // merge the two sets of attribtes so they will all be there
//   // saves redeclaring when an object is created
//   const instanceAttributes = { ...libraryAttributes, ...attributes}

//   const errors = {}
//   let validated = false

//   // Check whether each of the required attributes is present
//   const validate = () => {
//     if (pacbio_request_id)
//     Object.keys(libraryAttributes).forEach(key => {
//       if(!instanceAttributes[key]) {
//         Vue.set(errors, key, 'must be present')
//       } else {
//         Vue.delete(errors, key)
//       }
//       validated = true
//     })
//   }

//   // A library can't be valid unless it has been validated
//   const valid = () => {
//     return validated && Object.keys(errors).length === 0
//   }
//   return {
//     ...instanceAttributes,
//     errors,
//     valid,
//     validate
//   }
// }

export { newLibrary }
