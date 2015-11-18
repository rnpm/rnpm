function updateProjects(cli, program) {}

module.exports = {
  description: 'This is sample demonstration with what is available',
  options: [{
    name: '-f --force',
    description: 'Force linking of all dependencies'
  }],
  args: [{
    name: 'folder',
    required: true
  }, {
    name: 'reactNativeVersion'
  }],
  run: updateProjects
};
