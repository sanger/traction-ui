import { bgColorClass } from '@/lib/BackgroundColor'

describe('bgColorClass'), () => {
    expect(bgColorClass.development).toEqual('bg-blue-600')
    expect(bgColorClass.uat).toEqual('bg-purple-600')
    expect(bgColorClass.production).toEqual('bg-gradient-to-tr')    
}