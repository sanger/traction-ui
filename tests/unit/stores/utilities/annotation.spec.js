import { annotationType } from '@/stores/utilities/annotation.js'
import { describe, it } from 'vitest'

describe('annotation.js', () => {
  describe('annotationType', () => {
    it('will assign default attributes to the annotationType if none are passed', () => {
      const annotation = annotationType()
      expect(annotation.comment).toEqual('')
      expect(annotation.annotatation_type_id).toBeNull()
      expect(annotation.created_at).toEqual('')
      expect(annotation.user).toEqual('')
    })

    it('will assign the attributes to the annotationType', () => {
      const annotation = annotationType({
        attributes: {
          comment: 'comment1',
          annotatation_type_id: 1,
          created_at: '2025-10-25',
          user: 'si5',
        },
      })
      expect(annotation.comment).toEqual('comment1')
      expect(annotation.annotatation_type_id).toEqual(1)
      expect(annotation.created_at).toEqual('2025-10-25')
      expect(annotation.user).toEqual('si5')
    })

    it('will assign an id to the annotationType', () => {
      const annotation = annotationType({ id: 123 })
      expect(annotation.id).toEqual(123)
    })

    it('will assign a newRecord property to the annotationType', () => {
      let annotation = annotationType()
      expect(annotation.newRecord).toBeFalsy()
      annotation = annotationType({ newRecord: true })
      expect(annotation.newRecord).toBeTruthy()
    })
  })
})
