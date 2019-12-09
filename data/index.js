const dynamodb = require('serverless-dynamodb-client');

module.exports = {
  db: dynamodb.doc,
};
