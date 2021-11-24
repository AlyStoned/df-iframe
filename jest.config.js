const path = require('path');
const config = require('./config');

module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        `${config.SOURCE_DIR}/js/**/*.{js,jsx}`
    ],
    coverageDirectory: path.join(process.cwd(), 'coverage'),
    moduleDirectories: [
        'node_modules',
        path.join(config.SOURCE_DIR, 'js', 'tests')
    ],
    rootDir: path.join(config.SOURCE_DIR, 'js'),
    setupFiles: ['<rootDir>/tests/helpers.js'],
    setupFilesAfterEnv: [
        '<rootDir>/tests/setup.js',
        'jest-localstorage-mock'
    ]
};
