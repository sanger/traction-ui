/**
 *
 * @param {Integer | String} id - id of the library
 * @param {Integer | String} pacbio_request_id - id of the pacbio request
 * @param {String} template_prep_kit_box_barcode - barcode of the template prep kit box
 * @param {Integer | String} tag_id - id of the tag
 * @param {Float} concentration - concentration of the library
 * @param {Float} volume - volume of the library
 * @param {Float} insert_size - insert size of the library
 * @returns {Object} - payload for creating a library
 * if it is an update id is added otherwise pacbio_request_id is added
 *
 */
const libraryPayload = ({
  id,
  pacbio_request_id,
  template_prep_kit_box_barcode,
  tag_id,
  concentration,
  volume,
  insert_size,
}) => {
  const requiredAttributes = {
    template_prep_kit_box_barcode,
    tag_id,
    concentration,
    volume,
    insert_size,
  }

  const payload = {
    data: {
      type: 'libraries',
      attributes: {
        ...requiredAttributes,
        primary_aliquot_attributes: {
          ...requiredAttributes,
        },
      },
    },
  }

  id ? (payload.data.id = id) : (payload.data.attributes.pacbio_request_id = pacbio_request_id)

  return payload
}

export { libraryPayload }
