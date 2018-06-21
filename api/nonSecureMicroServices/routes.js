const express = require('express');
const bodyParser = require('body-parser');
const accountHandler = require('./handlers/accountHandler');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// check balance
/**
 * @api {post} /api/v1/passbook/balance Request to list transactions of an address
 *
 * @apiParam {String}     address   wallet address of user.
 *
 * @apiSuccess {Number}   balance   balance of users wallet address.
 * @apiSuccess {String}   status    success
 * @apiSuccess {String}   message   success message
 */
router.post('/balance', accountHandler.checkBalance);

// Get the List of Transactions
/**
 * @api {post} /api/v1/passbook/listTransaction Request to list of transactions of an given address
 *
 * @apiParam {String}     address   wallet address of user.
 *
 * @apiSuccess {Mixed}    result    All the transactions of the user
 * @apiSuccess {String}   status    success
 * @apiSuccess {String}   message   success message
 */
router.post('/listTransaction', accountHandler.listTransactions);

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
