// Auhtentication.js
const mongoose = require('mongoose');
const config = require('../../../configs/config');

const AuthenticationSchema = new mongoose.Schema({
  uuid: String,
  mobileNo: { type: String },
  authenticated: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
    index: {
      expireAfterSeconds: config.session.main,
    },
  },
});

mongoose.model('Auth', AuthenticationSchema);
module.exports = mongoose.model('Auth');
