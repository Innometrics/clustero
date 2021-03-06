'use strict';

const cluster = require('cluster');
let numCPUs = require('os').cpus().length;

exports.setupMaster = (settings, logger = console) => {
    cluster.setupMaster(settings);

    while (numCPUs--) {
        const worker = cluster.fork();
        const codename = String.fromCharCode(65 + worker.id);
        worker.name = `Worker "${codename}"`;
    }

    cluster.on('exit', function (worker, code, signal) {
        if (code === 0) {
            return;
        }

        const {id, name} = worker;

        logger.info(`${name} (ID=${id}) died with code ${code}, signal is ${signal}`);
        const newWorker = cluster.fork();
        newWorker.name = name;
        logger.info(`${name} restarted (new ID=${newWorker.id})`);
    });

    function shutdown () {
        cluster.disconnect(function () {
            var workersCount = Object.keys(cluster.workers).length;
            if (workersCount > 0) {
                logger.warn(`There are still ${workersCount} workers!`);
            }
            /* eslint-disable no-process-exit */
            process.exit();
            /* eslint-enable no-process-exit */
        });
    }

    // on STOP service
    process.on('SIGTERM', shutdown);

    // on CTRL+C
    process.on('SIGINT', shutdown);
};
