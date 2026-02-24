// This is the main configuration file for ESLint. It is a JavaScript file that exports an ESLint configuration object.
// https://eslint.org/docs/user-guide/configuring
import pluginVue from 'eslint-plugin-vue'
import pluginCypress from 'eslint-plugin-cypress'
import js from '@eslint/js'
import globals from 'globals'
import eslintConfigPrettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  ...pluginVue.configs['flat/recommended'],
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['tests/e2e/**/*.js'],
    extends: [pluginCypress.configs.recommended],
    rules: {
      'cypress/no-unnecessary-waiting': 'off',
    },
  },
  {
    files: ['tests/e2e/**/*.js'],
    extends: [
      pluginCypress.configs.globals,
    ],
  },
  {
    ignores: ['dist/**/*.js', 'docs/**/*.js', 'documentation/**/*.js'],
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        // e.g. it, expect, describe
        ...globals.vitest,
        // e.g. document, alert, window
        ...globals.browser,
      },
    },
  },
])
