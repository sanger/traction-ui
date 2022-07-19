const defaultOptions = require('@sanger/ui-styling/tailwind.config')

module.exports = {
  ...defaultOptions,

  content: [...defaultOptions.content, './src/**/*.{html,vue}'],
  important: true,
  corePlugins: {},
  plugins: [],
}
