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
const annotationTypeSelectOptions = (annotationTypes) => [
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

/**
 * Creates and manages a list of annotation items for a specific annotatable entity.
 *
 * @param {Object} params - The parameters for creating the annotation list.
 * @param {Object} params.parent - The parent object to which the annotations belong (e.g., a run or request).
 * @param {string} [params.annotatableType=null] - The type of the annotatable entity (e.g., 'Pacbio::Run').
 * @param {string|number} [params.annotatableId=null] - The ID of the annotatable entity.
 * @param {Array} [params.annotations=[]] - The list of raw annotation objects associated with the annotatable entity.
 * @param {Array} [params.annotationTypes=[]] - The available annotation types, as an array of objects.
 * @returns {Object} The annotation list object, containing:
 *   - parent: The parent object with its `annotations` property filtered for the given annotatable.
 *   - annotationTypeSelectOptions: Array of select options for annotation types.
 *   - add(id): Function to add a new annotation item with the given ID.
 *   - remove(id): Function to remove an annotation item by ID.
 *
 * @example
 * const list = AnnotationListType({
 *   parent: run,
 *   annotatableType: 'Pacbio::Run',
 *   annotatableId: run.id,
 *   annotations: run.annotations,
 *   annotationTypes: [{ id: 1, name: 'Comment' }]
 * })
 * list.add('new-id')
 * list.remove('old-id')
 * console.log(list.parent.annotations) // Array of annotation item objects
 */
const AnnotationListType = ({
  parent,
  annotatableType = null,
  annotatableId = null,
  annotations = [],
  annotationTypes = [],
}) => {
  parent.annotations = annotationsByAnnotatable({
    annotations,
    annotatableType,
    annotatableId,
  })

  const add = (id) => {
    parent.annotations.push(
      AnnotationItemType({
        id,
        newRecord: true,
      }),
    )
  }

  const remove = (id) => {
    const index = parent.annotations.findIndex((item) => item.id === id)
    if (index !== -1) {
      parent.annotations.splice(index, 1)
    }
  }

  const instance = {
    parent,
    annotationTypeSelectOptions: annotationTypeSelectOptions(annotationTypes),
    add,
    remove,
  }
  return instance
}

export {
  annotationsByAnnotatable,
  annotationTypeSelectOptions,
  AnnotationItemType,
  AnnotationListType,
}
