/**
 * Creates an annotation object with default and provided attributes.
 *
 * @param {Object} params - The parameters for the annotation.
 * @param {Object} [params.attributes={}] - The attributes to override the defaults.
 * @param {string|number} [params.id] - The unique identifier for the annotation.
 * @param {boolean} [params.newRecord] - Indicates if this is a new annotation record.
 * @returns {Object} The annotation object with merged attributes.
 *
 * @example
 * const annotation = annotationType({ attributes: { comment: 'Test' }, id: 1, newRecord: true })
 * // annotation = { comment: 'Test', annotatation_type_id: null, created_at: '', user: '', newRecord: true, id: 1 }
 */
const annotationType = ({ attributes = {}, id, newRecord } = {}) => {
  const defaultAttributes = {
    comment: '',
    annotatation_type_id: null,
    created_at: '',
    user: '',
  }
  const instance = {}

  Object.assign(instance, {
    ...defaultAttributes,
    ...attributes,
    id,
    newRecord: newRecord || false,
  })

  return instance
}

/**
 * Filters annotations by the specified annotatable type and ID.
 *
 * @param {Object} params - The parameters for filtering annotations.
 * @param {Array} params.annotations - The list of annotations to filter.
 * @param {string} params.annotatableType - The type of the annotatable entity (e.g., 'Pacbio::Run').
 * @param {string|number} params.annotatableId - The ID of the annotatable entity.
 * @returns {Array} The filtered list of annotations.
 */
const annotationsByAnnotatable = ({ annotations, annotatableType, annotatableId }) => {
  return annotations
    .filter(
      (annotation) =>
        annotation.annotatable_type === annotatableType &&
        // Ensure we are comparing the ids as integers
        parseInt(annotation.annotatable_id) === parseInt(annotatableId),
    )
    .map((annotation) =>
      annotationType({
        attributes: annotation,
        id: annotation.id,
        newRecord: false, // Assuming existing annotations are not new records
      }),
    )
}

export { annotationType, annotationsByAnnotatable }
