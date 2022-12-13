import { getCurrentDate } from '@/lib/DateHelpers'

describe('dateHelpers', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers()
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  it('#getCurrentDate', () => {
    // https://vitest.dev/guide/mocking.html
    const date = new Date('2022-11-22T08:51:46.326Z')
    vi.setSystemTime(date)

    expect(getCurrentDate()).toEqual('22-Nov-22')
  })
})
