const actions = require('../src/actions');
const ios = require('../src/ios');
const android = require('../src/android');
const config = require('../src/getConfig')();

const projects = {
  ios: ios.fromConfig(config.ios),
  android: android.fromConfig(config.android),
};

console.log(projects, actions);
