import { groupByAttribute } from '@/stores/utilities/root.js'
import { extractAttributes } from '@/api/JsonApi.js'

describe('groupByAttribute', () => {
  it('groups data types by attribute', () => {
    const dataTypes = [
      { id: 1, type: 'data_type', attributes: { name: 'foo', pipeline: 'ont' } },
      { id: 2, type: 'data_type', attributes: { name: 'bar', pipeline: 'ont' } },
      { id: 3, type: 'data_type', attributes: { name: 'baz', pipeline: 'pacbio' } },
    ]
    const grouped = groupByAttribute({ data: dataTypes, key: 'pipeline', fn: extractAttributes })
    expect(grouped).toEqual({
      ont: [
        { id: 1, type: 'data_type', name: 'foo', pipeline: 'ont' },
        { id: 2, type: 'data_type', name: 'bar', pipeline: 'ont' },
      ],
      pacbio: [{ id: 3, type: 'data_type', name: 'baz', pipeline: 'pacbio' }],
    })
  })
})
