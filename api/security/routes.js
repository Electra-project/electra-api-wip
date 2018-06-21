const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const UserHandler = require('./handlers/userHandler');
const tokenChecker = require('./middleware/tokenChecker');
const logginSession = require('./middleware/sessionValidator');
const validator = require('./middleware/validator');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// user log in
/**
 * @api {post} /api/v1/security/login   let the user log in the system to manage transactions and access their data.
 *
 * @apiParam   {String} email           Email id of the user
 * @apiParam   {String} password        token recived from createSession API.
 * @apiParam   {String} mobileNo        mobile no of the user
 * @apiParam   {String} token           token recived from createSession API.
 *
 * @apiSuccess {String} status          success
 * @apiSuccess {String} message         Session creation succeesful
 */
router.post('/login', logginSession.validate, validator.loginValidator, UserHandler.login);


// verify user login status
/**
 * @api {post} /api/v1/security/verifyUser     check if the user is logged in or not, and if the session is valid or not
 *
 * @apiParam   {String} token           token recived from createSession API.
 *
 * @apiSuccess {String} status          success
 * @apiSuccess {String} message         message of success respect to that API
 */
router.post('/verifyUser', tokenChecker.tokenCheck, UserHandler.verifyUser);


// resetting the password
/**
 * @api {post} /api/v1/security/otp     send the otp via email and change the user status to OTP for resetting the password
 *
 * @apiParam   {String} email           Email id of the user
 * @apiParam   {String} token           token recived from createSession API.
 *
 * @apiSuccess {String} status          success
 * @apiSuccess {String} message         message of success respect to that API
 */
router.post('/password', tokenChecker.tokenCheck, UserHandler.resetPassword);


// logging out user and destroying session
/**
 * @api {post} /api/v1/security/logout  logs out the user and destroy the session
 *
 * @apiParam   {String} token           token recived from createSession API.
 *
 * @apiSuccess {String} status          success
 * @apiSuccess {String} message         message of success respect to that API
 */
router.post('/logout', tokenChecker.tokenCheck, UserHandler.logout);


// verifying the otp and generate wallet address
/**
 * @api {post} /api/v1/security/otp     sets the password via verifying otp and compelte the registration process
 *
 * @apiParam   {String} otp             6 digit otp recieved via email
 * @apiParam   {String} password        8-20 characters password according to the format {Passwords must be between 8 and 20 characters and combine at least 3 of the following character types:.1) lower case letters, 2) uppercase letters, 3) numbers, 4) special characters ('! # $ * ? @ . - _' ;)}
 * @apiParam   {String} email           Email id of the user
 * @apiParam   {String} token           token recived from createSession API.
 *
 * @apiSuccess {String} status          success
 * @apiSuccess {String} message         message of success respect to that API
 * @apiSuccess {String} mnemonicPhrase  Mnemonic phrase generated from server
 */
router.post('/otp', tokenChecker.tokenCheck, validator.otpValidator, UserHandler.OTP);


// Register a new user
/**
 * @api {post} /api/v1/security/register Request to create an account
 *
 * @apiParam   {String} firstname   firstname of the user
 * @apiParam   {String} lastname    lastname of the user
 * @apiParam   {String} email       Email id of the user
 * @apiParam   {String} mobileNo    mobile no of user
 * @apiParam   {String} token       token recived from createSession API.
 *
 * @apiSuccess {String} status   success
 * @apiSuccess {String} message  message of success respect to that API
 */
router.post('/register', tokenChecker.tokenCheck, validator.registerValidator, UserHandler.createUser);


// Create a new session and verify devices status
/**
 * @api {post} /api/v1/security/createSession Request to create new Session
 *
 * @apiParam   {String} mobileNo   mobile no of user.
 * @apiParam   {String} uuid       uuid of mobile device.
 *
 * @apiSuccess {String} status   success
 * @apiSuccess {String} message  message of success respect to that API
 * @apiSuccess {String} token    A unique id for session.
 */
router.post('/createSession', validator.createSessionValidator, UserHandler.createSession);

// main error handler for all the routes
router.use((err, req, res, next) => {
  const apiResponse = {
    status: 'failure',
    message: err.message,
    errorCode: err.code || 500,
  };
  res.status(err.status || 500);
  res.json(apiResponse);
});

module.exports = router;
