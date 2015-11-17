var log = require('npmlog');
var initProjects = require('./projects');
var initActions = require('./actions');

log.heading = 'rnpm';

// Inits CLI
function init() {
  return {
    projects: initProjects(),
    actions: initActions()
  };
}

module.exports = init;
