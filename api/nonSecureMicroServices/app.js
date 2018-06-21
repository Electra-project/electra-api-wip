// app.js
const express = require('express');
const config = require('./../../configs/config'); // will be used to fetch cors configs
const routes = require('./routes');
const cors = require('cors');

const app = express();

// for security
app.use(cors());

// for the base routes of all the apis in the non secure microservices
app.use('/api/v1/passbook', routes);

module.exports = app;
