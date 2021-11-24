const path = require('path');
const copydir = require('copy-dir');

const config = require('./config');


// Copy deploy files into dest directory.
copydir(path.resolve(`${config.DEPLOY_SOURCE}`), path.resolve(`${config.DIST_DIR}`), {
    utimes: true,  // keep add time and modify time
    mode: true,    // keep file mode
    cover: true    // cover file when exists, default is true
}, function(err){
    if(err) throw err;
    console.log('Predeploy Done!');
});
