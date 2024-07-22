import { bgColorClass } from '@/lib/BgColorClass'

describe('bgColorClass', () => {
  it('contains 3 color classes', () => {
    expect(bgColorClass.development).toEqual('bg-blue-600')
    expect(bgColorClass.uat).toEqual('bg-purple-600')
    expect(bgColorClass.production).toEqual('bg-gradient-to-tr from-sdb to-sdb-400')
  })
})
