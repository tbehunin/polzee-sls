const dynamodb = require('serverless-dynamodb-client');
const add = require('./add');
const get = require('./get');
const getAll = require('./getAll');
const getAllDirect = require('./getAllDirect');

module.exports = ({
  add: (input) => add(dynamodb.doc, input),
  get: (userId, createTimestamp) => get(dynamodb.doc, userId, createTimestamp),
  getAll: (userId, excludePrivate) => getAll(dynamodb.doc, userId, excludePrivate),
  getAllDirect: (userId) => getAllDirect(dynamodb.doc, userId),
});
