const defaultOptions = require('@sanger/ui-styling/tailwind.config')

module.exports = {
  ...defaultOptions,
  content: [...defaultOptions.content, './src/**/*.{html,vue}'],
  theme: {
    ...defaultOptions.theme,
    fontSize: {
      ...defaultOptions.fontSize,
      xxs: '0.6rem',
    },
    fontFamily: {
      poppins: ["'Inter'", 'sans-serif'],
    },
  },
  important: true,
  corePlugins: {},
  plugins: [],
}
