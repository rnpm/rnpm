const fs = require('fs');
const path = require('path');
const android = require('./android');

const flat = {
  android: android.valid,
};

const nested = {
  android: {
    app: android.valid,
  },
};

const empty = {};

// `Can I embed some other stuff as well?`
// const dependencies = require('./dependencies');
// const sampleProjectWithDeps = {
//   android: android.valid,
//   node_modules: dependencies,
// };

module.exports = { flat, nested, empty, };
