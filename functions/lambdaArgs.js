const { corsHeaders } = require('./common');

module.exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: { ...corsHeaders },
    body: JSON.stringify({ event, context }),
  };
  return response;
};
