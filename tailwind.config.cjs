const defaultOptions = require('@sanger/ui-styling/tailwind.config')

module.exports = {
  ...defaultOptions,
  content: [...defaultOptions.content, './src/**/*.{html,vue,js}'],
  theme: {
    ...defaultOptions.theme,
    fontSize: {
      xxs: '0.6rem',
      ...defaultOptions.theme.fontSize,
    },
    boxShadow: {
      'custom-pink': '8px 8px 0 0 #F06292',
    },
  },
  important: true,
  corePlugins: {},
}
