/**
 * Returns an array that contains all the actions that can be called
 * in the current CLI version
 *
 * Each action exports an object that can be consumed by Commander to form
 * a nice CLI interface with flags, options and help
 */
module.exports = [
  require('./link'),
];
