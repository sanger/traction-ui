import {
  SelectOptionsType,
  InstrumentTypeSelectOptionsType,
  SmrtLinkVersionSelectOptionsType,
} from '@/lib/SelectOptionsTypes'
import { describe, expect } from 'vitest'

describe('SelectOptionType', () => {
  const key = 'key'
  const name = 'name'

  const currentItem = {
    id: 5,
    key: 'key5',
    name: 'name5',
  }

  const list = [
    {
      id: 1,
      key: 'key1',
      name: 'name1',
      active: true,
    },
    {
      id: 2,
      key: 'key2',
      name: 'name2',
      active: true,
    },
    {
      id: 3,
      key: 'key3',
      name: 'name3',
      active: true,
    },
    {
      id: 4,
      key: 'key4',
      name: 'name4',
      active: false,
    },
    {
      id: 5,
      key: 'key5',
      name: 'name5',
      active: false,
    },
  ]

  it('returns an object with fields', () => {
    expect(SelectOptionsType({ key, name }).fields).toEqual({ value: key, text: name })
  })

  it('can filter the list', () => {
    expect(SelectOptionsType({ key, name, list }).filterByActiveOrKey(currentItem)).toEqual([
      list[0],
      list[1],
      list[2],
      list[4],
    ])
  })

  it('can create a list of options', () => {
    const expected = [
      { value: 'key1', text: 'name1' },
      { value: 'key2', text: 'name2' },
      { value: 'key3', text: 'name3' },
      { value: 'key5', text: 'name5' },
    ]
    expect(SelectOptionsType({ key, name, list }).options(currentItem)).toEqual(expected)
  })

  it('can create an InstrumentTypeSelectOptionType', () => {
    const instrumentTypeSelectOptionsType = InstrumentTypeSelectOptionsType(list)
    expect(instrumentTypeSelectOptionsType.fields).toEqual({ value: 'key', text: 'name' })
  })

  it('can create an SmrtLinkVersionSelectOptionType', () => {
    const smrtLinkVersionSelectOptionsType = SmrtLinkVersionSelectOptionsType(list)
    expect(smrtLinkVersionSelectOptionsType.fields).toEqual({ value: 'id', text: 'name' })
  })
})
