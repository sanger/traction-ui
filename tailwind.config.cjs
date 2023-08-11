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
    colors: {
      ...defaultOptions.theme.colors,
      success: {
        DEFAULT: '#68d391',
        light: '#f0fff4',
        dark: '#276749',
      },
      failure: {
        DEFAULT: '#fc8181',
        light: '#fff5f5',
        dark: '#9b2c2c',
      },
      warning: '#f8db5f',
    },
  },
  important: true,
  corePlugins: {},
}
