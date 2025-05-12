import * as stringHumanisation from '@/lib/stringHumanisation'

describe('stringHumanisation', () => {
  it('#capitalizeFirstLetter', () => {
    expect(stringHumanisation.capitalizeFirstLetter('hello')).toEqual('Hello')
    expect(stringHumanisation.capitalizeFirstLetter('is it me youre looking for')).toEqual(
      'Is it me youre looking for',
    )
  })

  it('#humanise', () => {
    // Test for strings with dashes
    expect(stringHumanisation.humanise('hello')).toEqual('Hello')
    expect(stringHumanisation.humanise('is-it-me-youre-looking-for')).toEqual(
      'Is it me youre looking for',
    )

    // Test for strings with underscores
    expect(stringHumanisation.humanise('return_to_customer_after_2_years')).toEqual(
      'Return to customer after 2 years',
    )

    // Test for strings with both dashes and underscores
    expect(stringHumanisation.humanise('destroy_after-2_years')).toEqual('Destroy after 2 years')
  })
})
