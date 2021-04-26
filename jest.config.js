module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,vue}', //
  ],
  coverageReporters: [
    'json', //
  ],
  moduleFileExtensions: [
    'js', //
    'jsx',
    'json',
    'vue',
  ],
  transform: {
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    '^.+\\.(vue)$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.(js)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/!node_modules\\/lodash-es/', //
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: [
    'jest-serializer-vue', //
  ],
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)', //
  ],
  testURL: 'http://localhost/',
}
