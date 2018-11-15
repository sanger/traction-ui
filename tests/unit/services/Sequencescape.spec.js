import Request from '@/services/Sequencescape'

describe('Sequencescape.vue', () => {

  let json, request

  describe('Request', () => {
    json = {
      'id': 1,
      'name': 'Sample1'
    }

    request = new Request(json)
  })

  it('has an id', () => {
    expect(request.id).toEqual(json.id)
  })

  it('has a name', () => {
    expect(request.name).toEqual(json.name)
  })

})
