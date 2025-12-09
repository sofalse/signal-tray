export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^electron/main$": "<rootDir>/src/__mocks__/electron-main.js",
    "^electron/common$": "<rootDir>/src/__mocks__/electron-common.js",
  },
  testMatch: ["**/*.test.js"],
};
