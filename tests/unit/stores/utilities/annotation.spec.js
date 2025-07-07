import {
  annotationsByAnnotatable,
  AnnotationItemType,
  AnnotationListType,
  annotationTypeSelectOptions,
} from '@/stores/utilities/annotation.js'
import { describe, expect, it } from 'vitest'
import PacbioRunFactory from '@tests/factories/PacbioRunFactory.js'
import AnnotationTypeFactory from '@tests/factories/AnnotationTypeFactory.js'

const pacbioRunFactory = PacbioRunFactory({ count: 1 })
const annotationTypeFactory = AnnotationTypeFactory()

describe('annotation.js', () => {
  describe('AnnotationItemType', () => {
    it('will assign default attributes to the AnnotationItemType if none are passed', () => {
      const annotation = AnnotationItemType()
      expect(annotation.comment).toEqual('')
      expect(annotation.annotatation_type_id).toBeNull()
      expect(annotation.created_at).toEqual('')
      expect(annotation.user).toEqual('')
    })

    it('will assign the attributes to the AnnotationItemType', () => {
      const annotation = AnnotationItemType({
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

    it('will assign an id to the AnnotationItemType', () => {
      const annotation = AnnotationItemType({ id: 123 })
      expect(annotation.id).toEqual(123)
    })

    it('will assign a newRecord property to the AnnotationItemType', () => {
      let annotation = AnnotationItemType()
      expect(annotation.newRecord).toBeFalsy()
      annotation = AnnotationItemType({ newRecord: true })
      expect(annotation.newRecord).toBeTruthy()
    })
  })

  describe('annotationsByAnnotatable', () => {
    it('returns annotations for a given annotatable', () => {
      const annotations = annotationsByAnnotatable({
        annotations: Object.values(pacbioRunFactory.storeData.annotations),
        annotatableType: 'Pacbio::Run',
        annotatableId: pacbioRunFactory.storeData.run.id,
      })
      expect(annotations.length).toEqual(2)
      // we need to ensure the actual value is false
      expect(annotations.every((annotation) => annotation.newRecord === false)).toBeTruthy()
      expect(annotations.map((annotation) => annotation.id)).toEqual(['1', '2'])
    })
  })

  describe('AnnotationListType', () => {
    it('returns a list of annotations for a given annotatable', () => {
      const annotationList = AnnotationListType({
        parent: pacbioRunFactory.storeData.run,
        annotatableType: 'Pacbio::Run',
        annotatableId: pacbioRunFactory.storeData.run.id,
        annotations: Object.values(pacbioRunFactory.storeData.annotations),
        annotationTypes: Object.values(annotationTypeFactory.storeData),
      })
      expect(annotationList.parent).toEqual(pacbioRunFactory.storeData.run)
      expect(annotationList.parent.annotations).toEqual(
        annotationsByAnnotatable({
          annotations: Object.values(pacbioRunFactory.storeData.annotations),
          annotatableType: 'Pacbio::Run',
          annotatableId: pacbioRunFactory.storeData.run.id,
        }),
      )
    })

    it('returns an empty list if no annotations are found for the annotatable', () => {
      const annotationList = AnnotationListType({
        parent: pacbioRunFactory.storeData.run,
        annotations: Object.values(pacbioRunFactory.storeData.annotations),
      })
      expect(annotationList.parent.annotations).toEqual([])
    })

    it('returns some annotation type select options', () => {
      const annotationList = AnnotationListType({
        parent: pacbioRunFactory.storeData.run,
        annotationTypes: Object.values(annotationTypeFactory.storeData),
      })
      expect(annotationList.annotationTypeSelectOptions).toEqual(
        annotationTypeSelectOptions(Object.values(annotationTypeFactory.storeData)),
      )
    })

    it('allows an item to be added to the annotations list', () => {
      const annotationList = AnnotationListType({
        parent: pacbioRunFactory.storeData.run,
        annotatableType: 'Pacbio::Run',
        annotatableId: pacbioRunFactory.storeData.run.id,
        annotations: Object.values(pacbioRunFactory.storeData.annotations),
        annotationTypes: Object.values(annotationTypeFactory.storeData),
      })
      expect(annotationList.parent.annotations.length).toEqual(2)
      annotationList.add('3')
      expect(annotationList.parent.annotations.length).toEqual(3)
      expect(annotationList.parent.annotations[2].id).toEqual('3')
      expect(annotationList.parent.annotations[2].newRecord).toBeTruthy()
    })

    it('allows an item to be removed from the annotations list', () => {
      const annotationList = AnnotationListType({
        parent: pacbioRunFactory.storeData.run,
      })
      expect(annotationList.parent.annotations.length).toEqual(0)
      annotationList.add('1')
      expect(annotationList.parent.annotations.length).toEqual(1)
      annotationList.remove('1')
      expect(annotationList.parent.annotations.length).toEqual(0)
      // check it does not throw an error when trying to remove a non-existent item
      annotationList.remove('non-existent-id')
      expect(annotationList.parent.annotations.length).toEqual(0)
    })
  })

  describe('annotationTypeSelectOptions', () => {
    it('returns the correct options for annotation types', () => {
      const options = annotationTypeSelectOptions(Object.values(annotationTypeFactory.storeData))
      expect(options.length).toEqual(Object.values(annotationTypeFactory.storeData).length + 1) // +1 for the default "Select type" option
      expect(options[0].value).toEqual('')
      expect(options[0].text).toEqual('Select Annotation Type')
      const annotationType = Object.values(annotationTypeFactory.storeData)[0]
      expect(options[1].value).toEqual(annotationType.id)
      expect(options[1].text).toEqual(annotationType.name)
    })
  })
})
