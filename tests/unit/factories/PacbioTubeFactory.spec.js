import PacbioTubeFactory from '@tests/factories/PacbioTubeFactory.js'

describe('PacbioTubeFactory', () => {
  it('find_by libraries will return a single tube with libraries', () => {
    const pacbioTubeFactory = PacbioTubeFactory({ findBy: 'libraries' })
    expect(pacbioTubeFactory.content.data.length).toEqual(1)
    expect(pacbioTubeFactory.content.data[0].relationships.libraries.data).not.toBeNull()
    expect(pacbioTubeFactory.content.data[0].relationships.pools.data).toEqual([])
  })

  it('find_by pools will return a single tube with pools', () => {
    const pacbioTubeFactory = PacbioTubeFactory({ findBy: 'pools' })
    expect(pacbioTubeFactory.content.data.length).toEqual(1)
    expect(pacbioTubeFactory.content.data[0].relationships.pools.data.length).toEqual(1)
    expect(pacbioTubeFactory.content.data[0].relationships.libraries.data).toBeNull()
  })
})
