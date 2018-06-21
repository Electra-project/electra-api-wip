const request = require('request');
const logger = require('../helper/winstons');

// getting the transactions history from electra blockchain explorer
function listTransactions(address, count) {
  return new Promise((resolve, reject) => {
    const options = {
      uri: `https://api.electraexplorer.com/ext/address/${address}/txs?count=${count}`,
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
  listTransactions,
};
