// server.js
const config = require('./configs/config'); // configs for apps
const app = require('./api/security/app'); // app for security microservices
const nonSecureMicroServicesApp = require('./api/nonSecureMicroServices/app');
const errorHandler = require('./errorHandler');

// starting the security micro services
const server = app.listen(config.security.Port, () => {
  console.log(`security express services listening on port ${config.security.Port}`);
});

// handeling the error occured while starting the Security microservices
server.on('error', errorHandler.onError);

// starting the non secure micro services
const server1 = nonSecureMicroServicesApp.listen(config.nonSecureMicroServices.Port, () => {
  console.log(`nonSecureMicroServices express services listening on port ${config.nonSecureMicroServices.Port}`);
});

// handeling the error occured while starting the Non secure microservices
server1.on('error', errorHandler.onError);
