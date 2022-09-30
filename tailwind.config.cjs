const defaultOptions = require('@sanger/ui-styling/tailwind.config')

module.exports = {
  ...defaultOptions,
  content: [...defaultOptions.content, './src/**/*.{html,vue}'],
  theme: {
    ...defaultOptions.theme,
    fontSize: {
      xxs: '0.6rem',
      ...defaultOptions.theme.fontSize,
    },
  },
  important: true,
  corePlugins: {},
  plugins: [],
}
