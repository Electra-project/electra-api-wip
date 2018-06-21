// error.js

const error = {
  databaseConnectionFailure: 'There was a failure in database connection, Try again after some time',
  sessionExpired: 'Session was expired',
  invalidToken: 'Session expired or not a valid token',
  invalidTokenSession: 'Token is invalid or Session Expired',
  userNotFound: 'User not found.',
  expiredOTP: 'The OTP was expired',
  invalidOTP: 'The Entered OTP is not valid',
  incorrectPassword: 'Please entter the correct password.',
  userAlreadyExist: 'The user already exist in the system.',
  userBlocked: 'The user is blocked, wait for 5 minutes to be able to login again',
  deviceLimitExceeded: 'The user has reached the device limit of 5 for different sessions',
  invalidEmail: 'Please enter a valid email address',
  invalidMobileNo: 'Please enter a valid mobile number',
  invalidPasswordFormat: 'Password must contain atleast one lowercase letter, uppercase letter and special symbol',
  invalidUuidFormat: 'Please check the UUID again',
  unexpectedError: 'An unexpected  error has occured',
  alreadyLoggedIn: 'User already logged in',
};

module.exports = error;
