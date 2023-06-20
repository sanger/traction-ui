import { LabwareTypes } from '@/lib/LabwareTypes'

describe('LabwareTypes', () => {
  it('contains plate96', () => {
    const plate96 = LabwareTypes.Plate96
    expect(plate96.name).toEqual('96-well plate')
    expect(plate96.numRows).toEqual(8)
    expect(plate96.numColumns).toEqual(12)
  })
})
