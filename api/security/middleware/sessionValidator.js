// UserController.js
const Auth = require('../models/Authentication');
const ObjectId = require('mongoose').Types.ObjectId;
const error = require('../helper/error');

// verify if the session is valid or not
async function validate(req, res, next) {
  const apiResponse = {
    status: 'unknown',
  };

  try {
    // fetches the token from url, body and headers if exists
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    // check if the token format is valid or not
    if (!ObjectId.isValid(token)) {
      throw new Error(error.invalidToken);
    }

    // checking if the session is valid or not
    const query = Auth.findById(req.body.token);
    const authResponse = await query.lean().exec();
    if (authResponse) {
      if (authResponse.authenticated === true) {
        throw new Error(error.alreadyLoggedIn);
      }
      return next();
    }
    throw new Error(error.sessionExpired);
  } catch (err) {
    apiResponse.status = 'failure';
    apiResponse.message = err.message;
    return res.json(apiResponse);
  }
}

module.exports = { validate };
