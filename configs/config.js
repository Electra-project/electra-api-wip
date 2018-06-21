// config.js
const env = process.env.NODE_ENV || 'dev'; // 'dev' or 'prod'
const userBlockedTime = 5 * 60 * 1000;
const dev = {
  aesSecretKey: process.env.aesSecretKey || 'asncaln53165asqwbyqihbwnfasc65312sac01',
  blockedTime: parseInt(process.env.userBlockedTime, 10) || userBlockedTime,
  dburl: process.env.dbURL || 'mongodb://localhost/electra',
  email: {
    from: process.env.emailFrom || 'testelectra@gmail.com',
    port: process.env.emailPort || '25',
    username: process.env.emailUser || '4a55e99a547715',
    password: process.env.emailPass || '189346d551dc1b',
  },
  session: {
    main: parseInt(process.env.MAIN, 10) || 1 * 60 * 60,
    otpExpiresAt: parseInt(process.env.OTPEXP, 10) || 24 * 60 * 60,
  },
  loggerOptions: {
    file: {
      level: process.env.logfileLEVEL || 'info',
      filename: process.env.logfileNAME || '/home/sagar2agrawal/Desktop/Work/sundaypyjamas/code/electra-backend/api/security/logs/security.log',
      handleExceptions: process.env.logfileHANDLEXP || false,
      json: process.env.logfileSON || true,
      maxsize: parseInt(process.env.logfileMAXSIZE, 10) || 5242880, // 5MB
      maxFiles: parseInt(process.env.logfileMAXFILE, 10) || 5,
      colorize: process.env.logfileCOLORIZE || false,
    },
    console: {
      level: process.env.logfileCONLEVEL || 'debug',
      handleExceptions: process.env.logconsoleHANDLEXP || true,
      json: process.env.logconsoleJSON || false,
      colorize: process.env.logconsoleCOLORIZE || true,
    },
  },
  electraRPC: {
    userName: process.env.rpcUserName || 'user',
    userPassword: process.env.rpcUserPassword || 'pass',
    curl: process.env.rpcCurl || 'http://0.0.0.0:5788',
  },
  security: {
    Port: parseInt(process.env.securityPORT, 10) || 3000,
  },
  nonSecureMicroServices: {
    loggerOptions: {
      file: {
        level: process.env.MSlogfileLEVEL || 'info',
        filename: process.env.MSlogfileNAME || '/home/sagar2agrawal/Desktop/Work/sundaypyjamas/code/electra-backend/api/nonSecureMicroServices/logs/nonSecureMicroServices.log',
        handleExceptions: process.env.MSlogfileHANDLEXP || false,
        json: process.env.MSlogfileJSON || true,
        maxsize: parseInt(process.env.MSlogfileMAXSIZE, 10) || 5242880, // 5MB
        maxFiles: parseInt(process.env.MSlogfileMAXFILES, 10) || 5,
        colorize: process.env.MSLOGFILECOLORIZE || false,
      },
      console: {
        level: process.env.MSconsolefileLEVEL || 'debug',
        handleExceptions: process.env.MSconsoleHANDLEXP || true,
        json: env.MSconsoleJSON || false,
        colorize: process.env.MSconsoleCOLORIZE || true,
      },
    },
    Port: parseInt(process.env.MSPORT, 10) || 3001,
  },
};

const prod = {
  aesSecretKey: process.env.aesSecretKey || 'asncaln53165asqwbyqihbwnfasc65312sac01',
  blockedTime: parseInt(process.env.userBlockedTime, 10) || userBlockedTime,
  dburl: process.env.dbURL || 'mongodb://localhost/electra',
  email: {
    from: process.env.emailFrom || 'testelectra@gmail.com',
    port: process.env.emailPort || '25',
    username: process.env.emailUser || '4a55e99a547715',
    password: process.env.emailPass || '189346d551dc1b',
  },
  session: {
    main: parseInt(process.env.MAIN, 10) || 1 * 60 * 60,
    otpExpiresAt: parseInt(process.env.OTPEXP, 10) || 24 * 60 * 60,
  },
  loggerOptions: {
    file: {
      level: process.env.logfileLEVEL || 'info',
      filename: process.env.logfileNAME || '/home/sagar2agrawal/Desktop/Work/sundaypyjamas/code/electra-backend/api/security/logs/security.log',
      handleExceptions: process.env.logfileHANDLEXP || false,
      json: process.env.logfileSON || true,
      maxsize: parseInt(process.env.logfileMAXSIZE, 10) || 5242880, // 5MB
      maxFiles: parseInt(process.env.logfileMAXFILE, 10) || 5,
      colorize: process.env.logfileCOLORIZE || false,
    },
    console: {
      level: process.env.logfileCONLEVEL || 'debug',
      handleExceptions: process.env.logconsoleHANDLEXP || true,
      json: process.env.logconsoleJSON || false,
      colorize: process.env.logconsoleCOLORIZE || true,
    },
  },
  electraRPC: {
    userName: process.env.rpcUserName || 'user',
    userPassword: process.env.rpcUserPassword || 'pass',
    curl: process.env.rpcCurl || 'http://0.0.0.0:5788',
  },
  security: {
    Port: parseInt(process.env.securityPORT, 10) || 3000,
  },
  nonSecureMicroServices: {
    loggerOptions: {
      file: {
        level: process.env.MSlogfileLEVEL || 'info',
        filename: process.env.MSlogfileNAME || '/home/sagar2agrawal/Desktop/Work/sundaypyjamas/code/electra-backend/api/nonSecureMicroServices/logs/nonSecureMicroServices.log',
        handleExceptions: process.env.MSlogfileHANDLEXP || false,
        json: process.env.MSlogfileJSON || true,
        maxsize: parseInt(process.env.MSlogfileMAXSIZE, 10) || 5242880, // 5MB
        maxFiles: parseInt(process.env.MSlogfileMAXFILES, 10) || 5,
        colorize: process.env.MSLOGFILECOLORIZE || false,
      },
      console: {
        level: process.env.MSconsolefileLEVEL || 'debug',
        handleExceptions: process.env.MSconsoleHANDLEXP || true,
        json: env.MSconsoleJSON || false,
        colorize: process.env.MSconsoleCOLORIZE || true,
      },
    },
    Port: parseInt(process.env.MSPORT, 10) || 3001,
  },
};

const config = {
  dev,
  prod,
};

module.exports = config[env];
