module.exports = {
  rootDir: '../../../.',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['<rootDir>/tests/integration/**/*.spec.ts'],
  setupFiles: ['<rootDir>/tests/configurations/jest.setup.js'],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      { multipleReportsUnitePath: './reports', pageTitle: 'integration', publicPath: './reports', filename: 'integration.html' },
    ],
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['text', 'html', 'json'],
  moduleDirectories: ['node_modules', 'src'],
  collectCoverageFrom: ['<rootDir>/src/metadata/**/*.ts', '!<rootDir>/src/metadata/models/generated.ts'],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      branches: 60, // 80
      functions: 70, // 80
      lines: 70, // 80
      statements: -40, // -10
    },
  },
  verbose: true,
};
