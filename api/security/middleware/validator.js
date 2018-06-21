const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const error = require('../helper/error');

function registerValidator(req, res, next) {
  req.check('firstname').isLength({ min: 1, max: undefined }).isAlpha();
  req.check('lastname').isLength({ min: 1, max: undefined }).isAlpha();
  req.check('email', error.invalidEmail).exists().isEmail();
  req.check('mobileNo', error.invalidMobileNo).exists().isLength({ min: 10, max: 10 }).isMobilePhone('any');

  const errors = req.validationErrors();
  if (errors) {
    return res.json(errors).end();
  }
  return next();
}

function loginValidator(req, res, next) {
  req.check('email', error.invalidEmail).exists().isEmail();
  req.check('password', error.invalidPasswordFormat).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,20}$/, 'i');

  const errors = req.validationErrors();
  if (errors) {
    return res.json(errors).end();
  }
  return next();
}

function otpValidator(req, res, next) {
  req.check('email', error.invalidEmail).exists().isEmail();
  req.check('password', error.invalidPasswordFormat).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,20}$/, 'i');
  const errors = req.validationErrors();
  if (errors) {
    return res.json(errors).end();
  }
  return next();
}

function createSessionValidator(req, res, next) {
  req.check('uuid', error.invalidUuidFormat).exists().isUUID();
  req.check('mobileNo', error.invalidMobileNo).exists().isLength({ min: 10, max: 10 }).isMobilePhone('any');

  const errors = req.validationErrors();
  if (errors) {
    return res.json(errors).end();
  }
  return next();
}

module.exports = {
  registerValidator, loginValidator, createSessionValidator, otpValidator,
};
