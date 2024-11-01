import PacbioRunFactory from '@tests/factories/PacbioRunFactory.js'

describe('PacbioRunFactory', () => {
  it('find_by libraries will return a single tube with libraries', () => {
    const pacbioRunFactory = PacbioRunFactory({ findBy: 'Revio' })
    console.log(pacbioRunFactory.content.data)
    expect(pacbioRunFactory.content.data.attributes.system_name).toEqual('Revio')
    // expect(pacbioRunFactory.content.included).toEqual(PacbioRunFactory().content.included)
  })

  it('find_by pools will return a single tube with pools', () => {
    const pacbioRunFactory = PacbioRunFactory({ findBy: 'Sequel IIe' })
    expect(pacbioRunFactory.content.data.attributes.system_name).toEqual('Sequel IIe')
    // expect(pacbioRunFactory.content.included).toEqual(PacbioRunFactory().content.included)
  })
})
