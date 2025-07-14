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
      AnnotationItemType({
        attributes: annotation,
        id: annotation.id,
        newRecord: false, // Assuming existing annotations are not new records
      }),
    )
}

/**
 * Generates an array of options for an annotation type select input.
 *
 * @param {Array} annotationTypes - An array of annotation type objects, each with at least `id` and `name` properties.
 * @returns {Array} An array of option objects for use in a select input, each with `text` and `value` properties.
 *
 * @example
 * const types = [{ id: 1, name: 'Comment' }, { id: 2, name: 'Flag' }]
 * const options = annotationTypeSelectOptions(types)
 * // options = [
 * //   { text: 'Select Annotation Type', value: '' },
 * //   { text: 'Comment', value: 1 },
 * //   { text: 'Flag', value: 2 }
 * // ]
 */
const annotationTypeSelectOptions = (annotationTypes = []) => [
  { text: 'Select Annotation Type', value: '' },
  ...annotationTypes.map((type) => ({
    text: type.name,
    value: type.id,
  })),
]

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
 * const annotation = annotationItemType({ attributes: { comment: 'Test' }, id: 1, newRecord: true })
 * // annotation = { comment: 'Test', annotatation_type_id: null, created_at: '', user: '', newRecord: true, id: 1 }
 */
const AnnotationItemType = ({ attributes = {}, id, newRecord } = {}) => {
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

export { annotationsByAnnotatable, annotationTypeSelectOptions, AnnotationItemType }
