import * as stringHumanisation from '@/lib/stringHumanisation'

describe('stringHumanisation', () => {
  it('#capitalizeFirstLetter', () => {
    expect(stringHumanisation.capitalizeFirstLetter('hello')).toEqual('Hello')
    expect(stringHumanisation.capitalizeFirstLetter('is it me youre looking for')).toEqual(
      'Is it me youre looking for',
    )
  })

  it('#humanise', () => {
    expect(stringHumanisation.humanise('hello')).toEqual('Hello')
    expect(stringHumanisation.humanise('is-it-me-youre-looking-for')).toEqual(
      'Is it me youre looking for',
    )
  })
})
