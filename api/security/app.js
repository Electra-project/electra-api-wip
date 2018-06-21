// app.js
const express = require('express');
const db = require('./../../configs/mdb'); // database uri file
const routes = require('./routes');
const cors = require('cors');
const expressValidator = require('express-validator');

const app = express();

// for app security
app.use(cors());
app.use(expressValidator());

// base route for all API's of security module
app.use('/api/v1/security', routes);

module.exports = app;
