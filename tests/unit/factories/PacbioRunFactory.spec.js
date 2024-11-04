import PacbioRunFactory from '@tests/factories/PacbioRunFactory.js'

describe('PacbioRunFactory', () => {
  it('find_by libraries will return a single tube with libraries', () => {
    const pacbioRunFactory = PacbioRunFactory({ findBy: 'Revio' })
    expect(pacbioRunFactory.content.data.attributes.system_name).toEqual('Revio')
  })

  it('find_by pools will return a single tube with pools', () => {
    const pacbioRunFactory = PacbioRunFactory({ findBy: 'Sequel IIe' })
    expect(pacbioRunFactory.content.data.attributes.system_name).toEqual('Sequel IIe')
  })
})
