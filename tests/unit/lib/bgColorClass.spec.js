import { BgColorClass } from '@/lib/BgColorClass'

describe('bgColorClass', () => {
    it('contains 3 color classes', () => {
        expect(BgColorClass.development).toEqual('bg-blue-600')
        expect(BgColorClass.uat).toEqual('bg-purple-600')
        expect(BgColorClass.production).toEqual('bg-gradient-to-tr')  
    })  
})