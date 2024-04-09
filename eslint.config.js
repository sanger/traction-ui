import pluginVue from 'eslint-plugin-vue'
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'

export default [
  ...pluginVue.configs['flat/recommended'],
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.js,**/*.vue,**/*.cjs'],
    rules: {
      'no-console': 'off', // It may be worth re-enabling this is we add proper error logging
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
        },
      ],
      'vue/no-v-model-argument': 'off',
    },
  },
  {
    files: ['src/components/pacbio/PacbioWell.vue'],
    rules: {
      'vue/attribute-hyphenation': 'off',
    },
  },
  {
    ignores: ['dist/**/*.js'],
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.jest,
        vi: 'readonly',
        cy: 'readonly',
        Cypress: 'readonly',
      },
    },
  },
]
