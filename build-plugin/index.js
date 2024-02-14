module.exports = {
  onPreBuild: ({ inputs }) => {
    console.log('Environment Variables:', process.env);
  },
};
