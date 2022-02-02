module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'eslint:recommended',
    'prettier', // make sure this plugin is last since it turns conflicting rules off
  ],
  rules: {
    'no-console': 'off', // It may be worth re-enabling this is we add proper error logging
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  overrides: [
    {
      // this override is for the SVG tag which is found in the parent component
      files: ['src/components/pacbio/PacbioWell.vue'],
      rules: {
        'vue/attribute-hyphenation': 'off',
      },
    },
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
}
