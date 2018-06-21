// accountController.js
const logger = require('../helper/winstons');
const balance = require('../helper/getBalance');
const transactions = require('../helper/listTransactions');
// verify user status
async function checkBalance(req, res, next) {
  try {
    const apiResponse = {
      status: 'unknown',
    };

    // get the balance using electra blockexploer
    const result = await balance.getBalance(req.body.address);

    if (result.error) {
      throw new Error('Invalid address or Address not found');
    }

    apiResponse.status = 'success';
    apiResponse.balance = result.balance;
    return res.json(apiResponse);
  } catch (err) {
    logger.log('error', err);
    return next(err);
  }
}

// get the transaction history
async function listTransactions(req, res, next) {
  try {
    const apiResponse = {
      status: 'unknown',
    };

    // setting the default transaction fetch limit to 100
    let count = 100; // by default we will list down the last 100 transactions

    if (req.body.count) {
      count = req.body.count; // will use only if count is specified
    }

    // get the transaction history using electra blockchain exploerer
    const result = await transactions.listTransactions(req.body.address, count);

    // if no result found
    if (!result) {
      throw new Error('An Error occured, possibily due to invalid address');
    }
    apiResponse.status = 'success';
    apiResponse.result = result;
    return res.json(apiResponse);
  } catch (err) {
    logger.log('error', err);
    return next(err);
  }
}

module.exports = {
  checkBalance,
  listTransactions,
};
