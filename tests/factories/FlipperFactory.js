import BaseFactory from './BaseFactory.js'

const FlipperFactory = () => {
  const data = {
    flipper_id: 'User 1',
    features: {
      enable_feature: { enabled: true },
      disabled_feature: { enabled: false },
      // specific to flexible_pooling work
      flexible_pooling: { enabled: true },
    },
  }

  return BaseFactory(data)
}

export default FlipperFactory
