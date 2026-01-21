import BaseFactory from './BaseFactory.js'

const FlipperFactory = (features = {}) => {
  const data = {
    flipper_id: 'User 1',
    features: {
      enable_feature: { enabled: true },
      disabled_feature: { enabled: false },
      ...features,
    },
  }

  return BaseFactory(data)
}

export default FlipperFactory
