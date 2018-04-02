const master = require('./master');
const worker = require('./worker');

exports.setupMaster = master.setupMaster;
exports.initApp = worker.initApp;
