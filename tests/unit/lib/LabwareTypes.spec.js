import { LabwareTypes } from '@/lib/LabwareTypes'

describe('LabwareTypes', () => {
  describe('plate96', () => {
    it('contains correct properties', () => {
      const plate96 = LabwareTypes.Plate96
      expect(plate96.name).toEqual('96-well plate')
      expect(plate96.numRows).toEqual(8)
      expect(plate96.numColumns).toEqual(12)
      expect(plate96.walkingDirection).toEqual('byColumn')
    })

    it('uses alphanumeric positionFormat function', () => {
      const plate96 = LabwareTypes.Plate96
      expect(
        plate96.positionFormat({ row: 1, column: 1, walkingDirection: plate96.walkingDirection }),
      ).toEqual('A1')
      expect(
        plate96.positionFormat({ row: 8, column: 12, walkingDirection: plate96.walkingDirection }),
      ).toEqual('H12')
      expect(
        plate96.positionFormat({ row: 27, column: 5, walkingDirection: plate96.walkingDirection }),
      ).toEqual('27,5')
    })
  })

  describe('multiPool96', () => {
    it('contains correct properties', () => {
      const multiPool96 = LabwareTypes.MultiPool96
      expect(multiPool96.name).toEqual('96-well multi pool')
      expect(multiPool96.numRows).toEqual(8)
      expect(multiPool96.numColumns).toEqual(12)
      expect(multiPool96.walkingDirection).toEqual('byColumn')
    })

    it('uses numeric positionFormat function', () => {
      const multiPool96 = LabwareTypes.MultiPool96
      expect(
        multiPool96.positionFormat({
          row: 1,
          column: 1,
          numRows: multiPool96.numRows,
          numColumns: multiPool96.numColumns,
          walkingDirection: multiPool96.walkingDirection,
        }),
      ).toEqual('1')
      expect(
        multiPool96.positionFormat({
          row: 8,
          column: 12,
          numRows: multiPool96.numRows,
          numColumns: multiPool96.numColumns,
          walkingDirection: multiPool96.walkingDirection,
        }),
      ).toEqual('96')
      expect(
        multiPool96.positionFormat({
          row: 5,
          column: 3,
          numRows: multiPool96.numRows,
          numColumns: multiPool96.numColumns,
          walkingDirection: multiPool96.walkingDirection,
        }),
      ).toEqual('21')
    })
  })

  describe('plate4', () => {
    it('contains correct properties', () => {
      const plate4 = LabwareTypes.Plate4
      expect(plate4.name).toEqual('4-well plate')
      expect(plate4.numRows).toEqual(4)
      expect(plate4.numColumns).toEqual(1)
      expect(plate4.walkingDirection).toEqual('byColumn')
    })

    it('uses alphanumeric positionFormat function', () => {
      const plate4 = LabwareTypes.Plate4
      expect(
        plate4.positionFormat({ row: 1, column: 1, walkingDirection: plate4.walkingDirection }),
      ).toEqual('A1')
      expect(
        plate4.positionFormat({ row: 4, column: 1, walkingDirection: plate4.walkingDirection }),
      ).toEqual('D1')
    })
  })
})
