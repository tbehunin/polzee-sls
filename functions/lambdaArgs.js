import corsHeaders from './common';

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: { ...corsHeaders },
    body: JSON.stringify({
      event,
      context,
      node_env: process.env.NODE_ENV,
      env: process.env,
    }),
  };
  return response;
};
