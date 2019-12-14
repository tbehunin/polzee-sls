import corsHeaders from './common';

// eslint-disable-next-line import/prefer-default-export
export const handler = async (event, context) => {
  const response = {
    statusCode: 200,
    headers: { ...corsHeaders },
    body: JSON.stringify({ event, context }),
  };
  return response;
};
