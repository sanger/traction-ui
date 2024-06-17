import BaseFactory from '@tests/factories/BaseFactory.js'

const data = {
  karma: {
    karma: {
      karma: 'chameleon',
    },
  },
}

describe('BaseFactory', () => {
  it('will have some content', () => {
    const factory = BaseFactory(data)
    expect(factory.content).toEqual(data)
  })

  it('will have an axios response', () => {
    const factory = BaseFactory(data)
    expect(factory.responses.axios).toEqual({
      status: 200,
      statusText: 'OK',
      data: { ...data },
    })
  })

  it('will have a fetch response', async () => {
    const factory = BaseFactory(data)
    expect(factory.responses.fetch).toEqual(
      expect.objectContaining({
        status: 200,
        statusText: 'OK',
        ok: true,
      }),
    )
    const json = await factory.responses.fetch.json()
    expect(json).toEqual(data)
  })
})
