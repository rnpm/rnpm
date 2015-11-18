const config = require('../src/getConfig')();
const actions = require('../src/actions');

const ios = require('../src/ios');
const android = require('../src/android');

const projects = {
  ios: ios.fromConfig(config.ios),
  android: android.fromConfig(config.android),
};

module.exports = {projects, actions};
