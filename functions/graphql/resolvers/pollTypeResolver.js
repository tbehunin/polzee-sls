export default {
  choices: async ({ choices, ...poll }) => (choices || []).map((choice) => ({ poll, ...choice })),
};
