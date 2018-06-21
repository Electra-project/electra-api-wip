const request = require('request');
const logger = require('../helper/winstons');

// for getting the balance using electra Block explorer
function getBalance(address) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      uri: `https://apielectraexplorer.herokuapp.com/ext/getaddress/${address}`,
      json: true, // Automatically parses the JSON string in the response
    };

    request(options, (error, response, body) => {
      if (error) {
        logger.log('error', error);
        return reject(error);
      }
      return resolve(body);
    });
  });
}

module.exports = {
  getBalance,
};
