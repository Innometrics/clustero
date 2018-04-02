/* eslint-disable no-process-exit, no-process-env */

'use strict';

const cluster = require('cluster');
const exit = () => process.exit();

const createGracefulKiller = workerId => {
    let inProgress = false;
    return (killApp = exit) => {
        if (inProgress) {
            return;
        }
        inProgress = true;
        console.log(`Worker #${workerId}: Stopping the app`);

        killApp(exit);

        // for exit after 30 seconds
        setTimeout(exit, 30000);
    };
};

exports.initApp = init => {
    const worker = cluster.worker || {id: 0};
    return init(worker, createGracefulKiller(worker.id));
};
