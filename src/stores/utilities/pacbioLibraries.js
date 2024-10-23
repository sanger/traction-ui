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

  return id
    ? {
        data: {
          type: 'libraries',
          id,
          attributes: {
            ...requiredAttributes,
            pacbio_request_id,
            primary_aliquot_attributes: {
              ...requiredAttributes,
            },
          },
        },
      }
    : {
        data: {
          type: 'libraries',
          attributes: {
            ...requiredAttributes,
            pacbio_request_id,
            primary_aliquot_attributes: {
              ...requiredAttributes,
            },
          },
        },
      }
}

export { libraryPayload }
