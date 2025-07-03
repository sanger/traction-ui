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

export { annotationType }
