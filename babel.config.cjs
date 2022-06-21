module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    [
      'babel-plugin-transform-vite-meta-env',
      {
        include: ['VITE_SAPHYR_LABEL_TEMPLATE_ID'],
      },
    ],
  ],
}
