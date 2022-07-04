const defaultOptions = require('../traction-ui/node_modules/@sanger/ui-styling/tailwind.config')
module.exports = {
  ...defaultOptions,
  purge: {
    ...defaultOptions.purge,
    content: ['./src/**/*.{html,vue}'],
  },
  important: true,
  corePlugins: {},
  plugins: [],
}
