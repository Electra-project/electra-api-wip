const request = require('request');
const config = require('../configs/config');

// setting the options and parameters for rpc calls
const options = {
  url: config.electraRPC.curl,
  method: 'post',
  headers:
          {
            'content-type': 'text/plain',
          },
  auth: {
    user: config.electraRPC.userName,
    pass: config.electraRPC.userPassword,
  },
  body: JSON.stringify({
    jsonrpc: '1.0', id: 'curltest', method: 'getnewaddress', params: [],
  }),
};

// getting the new public wallet address using rpc
function getNewAddress() {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        return reject(error);
      }
      return resolve(body);
    });
  });
}


module.exports = { getNewAddress };
