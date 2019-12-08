const dynamodb = require('serverless-dynamodb-client');
const add = require('./add');
const get = require('./get');
const getAll = require('./getAll');
const getAllDirect = require('./getAllDirect');
const getUserVote = require('./getUserVote');
const getVotes = require('./getVotes');

module.exports = ({
  add: (input) => add(dynamodb.doc, input),
  get: (userId, createTimestamp) => get(dynamodb.doc, userId, createTimestamp),
  getAll: (userId, excludePrivate) => getAll(dynamodb.doc, userId, excludePrivate),
  getAllDirect: (userId) => getAllDirect(dynamodb.doc, userId),
  getUserVote: (userId, pollId) => getUserVote(dynamodb.doc, userId, pollId),
  getVotes: (userId, pollIds) => getVotes(dynamodb.doc, userId, pollIds),
});
