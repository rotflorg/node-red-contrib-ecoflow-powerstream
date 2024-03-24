process.env.TZ = 'UTC';

module.exports = {
  verbose: true,
  injectGlobals: true,
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js'],
  collectCoverage: false,
  displayName: 'Test',
  testPathIgnorePatterns: [
    '/__tests__/src',
    '/__tests__/helper'
  ],
  snapshotFormat: {
    escapeString: true,
  },
};
