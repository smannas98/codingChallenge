const express = require('express');
const appConfig = require('./config/main-config.js');
const routeConfig = require('./config/route-config.js');

const app = express();

appConfig.init(app, express);
routeConfig.init(app);

module.exports = app;
