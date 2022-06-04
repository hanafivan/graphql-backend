const ApplicationServer = require('./bin/app/server');
const appServer = new ApplicationServer();
const config = require('./bin/config');
const port = config.get('/port');

appServer.server.listen(port, () => {
  console.log(`service running properly on port ${port}`);
});