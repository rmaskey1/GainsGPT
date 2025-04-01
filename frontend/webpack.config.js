module.exports = {
    // other config like entry, output, etc.
    resolve: {
      fallback: {
        path: false, // 👈 disables Node's 'path' module in the browser
      },
    },
  };
  