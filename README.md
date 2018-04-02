# clustero

**Example**

Your app's files:
* package.json
```
...
"scripts": {
    "start": "node server.js",
    "start-cluster": "node server-cluster.js",
}
...
```
* server-cluster.js
```javascript
const cluster = require('clustero');
cluster.setupMaster({
    exec: 'server.js'
});
```
* server.js

```javascript
const clustero = require('clustero');

function initApp () {
    const app = new MyApp();
    return app;
}

function doWriteErrorLog (error) {
    console.error(error);
    const timer = setTimeout(() => {
        clearInterval(timer);
        process.exit(1);
    }, 100);
}

module.exports = clustero.initApp((worker, gracefulKiller) => {
    process.on('error', doWriteErrorLog);
    process.on('uncaughtException', doWriteErrorLog);

    const app = initApp();
    server.app('error', doWriteErrorLog);

    const stopApp = callback => app.shutdown(callback);
    const kill = () => gracefulKiller(stopApp);

    // on STOP service
    process.on('SIGTERM', kill);
    // on CTRL+C
    process.on('SIGINT', kill);
});

```

Run in single mode: **npm start**

Run in cluster mode: **npm run start-cluster**
