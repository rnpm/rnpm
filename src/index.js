const config = require('./getConfig')();
const actions = require('./actions');

const ios = require('./ios');
const android = require('./android');

const projects = {
  ios: ios.fromConfig(config.ios),
  android: android.fromConfig(config.android),
};

module.exports = {projects, actions};
