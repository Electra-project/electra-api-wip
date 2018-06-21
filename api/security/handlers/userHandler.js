// UserController.js
const email = require('../helper/email');
const User = require('../models/User');
const Auth = require('../models/Authentication');
const ObjectId = require('mongoose').Types.ObjectId;
const CryptoJS = require('crypto-js');
const config = require('../../../configs/config');
const logger = require('../helper/winstons');
const bip39 = require('bip39');
const error = require('../helper/error');
const mongoose = require('mongoose');

// verify user status and creating session
async function createSession(req, res, next) {
  try {
    // creating the object for api response
    const apiResponse = {
      status: 'unknown',
    };

    // checking if the database connection is working or not
    if (mongoose.connection.readyState === 0) {
      throw new Error(error.databaseConnectionFailure);
    }

    // finding for all the sessions that have same mobile no
    const authQuery = Auth.find({
      mobileNo: req.body.mobileNo,
    });
    let authResponse = await authQuery.lean().exec();

    // checking if the user asn't exceeded the 5 devices limit
    if (authResponse.length === 5) {
      throw new Error(error.deviceLimitExceeded);
    }

    // checking if the user is already in a session or not
    for (let i = 0; i < authResponse.length; i += 1) {
      if (authResponse[i].uuid === req.body.uuid) {
        apiResponse.sessionStatus = 'Active';
        apiResponse.status = 'Success';
        apiResponse.message = 'Already in a session';
        return res.json(apiResponse);
      }
    }

    // fetching the user data using mobile no
    const query = User.findOne({
      mobileNo: req.body.mobileNo,
    });
    let user = await query.exec();

    // checking if the users status from user collection
    apiResponse.sessionStatus = 'NEW';
    if (user) {
      // checking if the user found has the uuid regitered already
      const uuidStatus = user.uuid.indexOf(req.body.uuid);
      // checking if the user is blocked
      if (user.status === 'BLOCKED' && (user.invalidLogin.blockedOn.getTime() + config.blockedTime >= Date.now())) {
        apiResponse.sessionStatus = 'BLOCKED';
        // changing the user status back to ACTIVE if the user was blocked more than 5 minutes ago
      } else if (user.status === 'BLOCKED' && (user.invalidLogin.blockedOn.getTime() + config.blockedTime < Date.now())) {
        apiResponse.sessionStatus = 'BLOCKED';
        user.invalidLogin.count = 0;
        user.status = 'ACTIVE';
        user = await user.save();
        // checking if the user status is OTP
      } else if (user.status === 'OTP') {
        apiResponse.sessionStatus = 'OTP';
        // checking if both mobile and uuid exist in system
      } else if ((uuidStatus !== -1) && (user.mobileNo === req.body.mobileNo)) {
        apiResponse.sessionStatus = 'ACTIVE';
        // checking if the user mobile already exist and new uuid being registered
      } else if ((user.mobileNo === req.body.mobileNo) && (uuidStatus === -1)) {
        apiResponse.sessionStatus = 'DEVICE';
      }
    }

    // creating the session
    const auth = new Auth({
      mobileNo: req.body.mobileNo,
      uuid: req.body.uuid,
    });
    authResponse = await auth.save();

    // sending the reponse back to the user
    apiResponse.token = authResponse._id;
    apiResponse.status = 'Success';
    apiResponse.message = 'Session creation successfull';
    return res.json(apiResponse);
  } catch (err) {
    // Throwing error if the user has already a session
    if (err.name === 'MongoError' && err.code === 11000) {
      logger.log('error', err);
      return res.status(500).send({
        status: 'failure',
        message: 'Already in a session',
      });
    }
    // logging the error using winston logger in a file and console
    logger.log('error', err);

    // passing the error to the main error handler at the end of routes
    return next(err);
  }
}

// Api fdunction for registering the new user
async function createUser(req, res, next) {
  try {
    const apiResponse = {
      status: 'unknow',
    };

    if (mongoose.connection.readyState === 0) {
      throw new Error(error.databaseConnectionFailure);
    }

    // searching and fetching the token from url || body and header
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    // checking if the session wan't expired in the mean time
    const query = Auth.findById(token);
    const authResponse = await query.exec();

    // if session not found throw session expired error
    if (!authResponse) {
      throw new Error(error.sessionExpired);
    }

    // generating OTP
    const otp = Math.floor(100000 + (Math.random() * 900000));
    // date.now in the user field || convert to local time

    // creating the new usr object to save
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      mobileNo: req.body.mobileNo,
      emailVerification: {
        otp,
        created: Date.now(),
      },
    });

    // registering the uuid
    user.uuid.push(authResponse.uuid);

    // saving the user data back to database
    await user.save();

    // sending the otp via email using nodemon
    const message = `here is your ${otp}`;
    const subject = 'Email verification for Electra';
    await email.sendemail(req.body.email, subject, message);

    apiResponse.status = 'Success';
    apiResponse.message = 'user register successfully';
    return res.json(apiResponse);
  } catch (err) {
    // checking if there's already a user in the system
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).send({
        status: 'failure',
        message: error.userAlreadyExist,
      });
    }

    logger.log('error', err);
    return next(err);
  }
}

// save the password
async function OTP(req, res, next) {
  try {
    const apiResponse = {
      status: 'success',
    };

    if (mongoose.connection.readyState === 0) {
      throw new Error(error.databaseConnectionFailure);
    }

    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    let query = Auth.findById(token);
    const authResponse = await query.exec();

    // Enrypting the password using AES
    const hashPassword = CryptoJS.AES.encrypt(req.body.password, config.aesSecretKey);

    // searching the user object to save the password
    query = User.findOne({
      email: req.body.email,
    });

    const user = await query.exec();

    // chcking if user exist in the system
    if (!user) {
      throw new Error(error.userNotFound);
    }

    // checking if otp is valid or not
    if (user.emailVerification.otp !== req.body.otp) {
      throw new Error(error.invalidOTP);
    }

    // checking if the OTP hasn't expired
    if (user.emailVerification.created + config.session.otpExpiresAt < Date.now()) {
      throw new Error(error.expiredOTP);
    }

    apiResponse.message = 'Sucessecfully reset the password';

    // sending mnemonic if the user is loggin for the first time
    if (user.firstLogin) {
      // getting mnemonic phrase
      const mnemonic = bip39.generateMnemonic();
      apiResponse.mnemonicPhrase = mnemonic;
      apiResponse.message = 'Sucessecfully set the new password';
    }

    // updating the user first time login status
    user.firstLogin = false;

    // invalidating the old the otp in the database
    user.emailVerification.otp = null;
    user.passwordHash = hashPassword;
    user.status = 'ACTIVE';

    // saving the above user updates in the database
    const userResponse = await user.save();

    // changing the user status to logged in
    authResponse.authenticated = true;
    const authResult = await authResponse.save();
    return res.json(apiResponse);
  } catch (err) {
    logger.log('error', err);
    next(err);
  }
}

// api for resetting the password
async function resetPassword(req, res, next) {
  try {
    const apiResponse = {
      status: 'success',
    };

    if (mongoose.connection.readyState === 0) {
      throw new Error(error.databaseConnectionFailure);
    }

    // generating the random otp
    const otp = Math.floor(100000 + (Math.random() * 900000));

    // searching if the users with required email address exists or not and if no then don't save
    const query = User.findOneAndUpdate({
      email: req.body.email,
    }, {
      upsert: false,
    });
    const user = await query.exec();

    // check if user exist or not
    if (!user) {
      throw new Error(`No such user exist with the email address:  ${req.body.email}`);
    }

    // check if the user is blocked
    if (user.status === 'BLOCKED') {
      throw new Error('user is blocked');
    }

    // setting the otp and otp expire time for user
    user.emailVerification.otp = otp;
    user.emailVerification.created = Date.now();
    user.status = 'OTP';

    // sending the otp via email
    const message = `here is your ${otp}`;
    const subject = 'Email verification for Electra';
    const result = await email.sendemail(req.body.email, subject, message);

    await user.save();
    apiResponse.message = 'Otp is sent to your email for resseting pasword';
    return res.json(apiResponse);
  } catch (err) {
    logger.log('error', err);
    return next(err);
  }
}

// login function for login api
async function login(req, res, next) {
  try {
    const apiResponse = {
      status: 'success',
    };

    if (mongoose.connection.readyState === 0) {
      throw new Error(error.databaseConnectionFailure);
    }

    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    let query = User.findOne({
      email: req.body.email,
    });

    const user = await query.exec();

    // checks if the user is there in system or not
    if (user) {
      // check if the if the user is blocked or not
      if (user.status === 'BLOCKED' && (user.invalidLogin.blockedOn.getTime() + config.blockedTime >= Date.now())) {
        throw new Error(error.userBlocked);
      }

      // making the user active if the has been passed the blocked time
      if (user.status === 'BLOCKED' && (user.invalidLogin.blockedOn.getTime() + config.blockedTime < Date.now())) {
        user.invalidLogin.count = 0;
        user.status = 'ACTIVE';
      }

      // decrpyting the password for comparision
      let decryptedPassword = CryptoJS.AES.decrypt(user.passwordHash.toString(), config.aesSecretKey);
      decryptedPassword = decryptedPassword.toString(CryptoJS.enc.Utf8);

      // Setting the user status authenticated if users password matched
      if (decryptedPassword === req.body.password) {
        query = Auth.findByIdAndUpdate(token, {
          $set: {
            authenticated: true,
            createdAt: Date.now(),
          },
        });

        const authResponse = await query.exec();

        // fetching the public wallet address of the user
        apiResponse.wallets = user.wallets;

        // resetting the user invalid login counts whenever login gets successfull
        user.invalidLogin.count = 0;
        const userSave = await user.save();

        // sending back the login status
        if (userSave) {
          apiResponse.message = 'user login successfull';
          return res.json(apiResponse);
        } else {
          throw new Error(error.unexpectedError);
        }
      } else {
        // block flag
        let userBlockedFlag = false;

        // couting the invalid logins
        user.invalidLogin.count = user.invalidLogin.count + 1;

        // blocking the user for 5 or more time invalid login
        if (user.invalidLogin.count >= 5) {
          user.status = 'BLOCKED';
          user.invalidLogin.blockedOn = Date.now();
          userBlockedFlag = true;
        }

        // saving the updated status to db
        const userResponse = await user.save();

        // checking if the user is blocked or not
        if (userBlockedFlag) {
          throw new Error(error.userBlocked);
        }

        // sending the incorrect password status back to user
        throw new Error(error.incorrectPassword);
      }
    }
    throw new Error(error.userNotFound);
  } catch (err) {
    logger.log('error', err);
    return next(err);
  }
}

// verify user status
async function verifyUser(req, res, next) {
  try {
    const apiResponse = {
      status: 'success',
      userStatus: 'Invalid session or invalid token',
    };

    if (mongoose.connection.readyState === 0) {
      throw new Error(error.databaseConnectionFailure);
    }

    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!ObjectId.isValid(token)) {
      throw new Error(error.invalidToken);
    }

    // searching the session
    const query = Auth.findById(token);
    const authResponse = await query.lean().exec();

    // checking if the user is logged in or not using authenticated attribute
    if (authResponse) {
      apiResponse.userStatus = 'User needs to log in';
      if (authResponse.authenticated) {
        apiResponse.userStatus = 'Logged In';
      }
    }

    return res.json(apiResponse);
  } catch (err) {
    logger.log('error', err);
    return next(err);
  }
}

// logout and destroy the session api
async function logout(req, res, next) {
  try {
    const apiResponse = {
      status: 'success',
    };

    if (mongoose.connection.readyState === 0) {
      throw new Error(error.databaseConnectionFailure);
    }

    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    // it search and the session and destroys it
    const query = Auth.findByIdAndDelete(token);
    const authResponse = await query.exec();

    apiResponse.message = 'user successfully logged out';

    return res.json(apiResponse);
  } catch (err) {
    logger.log('error', err);
    return next(err);
  }
}

// exporting all the api functions

module.exports = {
  createSession,
  createUser,
  login,
  logout,
  verifyUser,
  OTP,
  resetPassword,
};
