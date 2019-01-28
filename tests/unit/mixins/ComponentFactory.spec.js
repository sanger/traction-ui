import ComponentFactory from '@/mixins/ComponentFactory'

const Cmp = {
  name: 'SayMyName',
  props: {
    propA: {
      type: String,
      default: 'say'
    },
    propB: {
      type: String,
      default: 'my name'
    }
  },
  methods: {
    say () {
      return `${this.propA} ${this.propB}`
    }
  }
}

describe('ComponentFactory', () => {

  let factory

  beforeEach(() => {
  })

  it('without passing any props', () => {
    factory = ComponentFactory.methods.build(Cmp)
    expect(factory.say()).toEqual('say my name')
  })

  it('passing some props', () => {
    factory = ComponentFactory.methods.build(Cmp, {propA: 'to me', propB: 'to you'})
    expect(factory.say()).toEqual('to me to you')
  })

})
