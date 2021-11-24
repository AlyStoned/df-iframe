const path = require('path');


const PROJECT_ROOT = process.cwd();
const SOURCE_DIR = path.join(PROJECT_ROOT, 'src');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');
const DEPLOY_SOURCE = path.join(PROJECT_ROOT, 'deploy_source');


let environment = process.env.NODE_ENV;
module.exports = {
    env: {
        production: environment !== 'development',
        development: environment === 'development'
    },

    SOURCE_DIR: SOURCE_DIR,
    DIST_DIR: DIST_DIR,
    DEPLOY_SOURCE: DEPLOY_SOURCE,
    DIST_URL: process.env.DIST_URL || '',

    bundleAnalyzerReport: process.env.npm_config_report
};
