function updateProjects(cli) {
  console.log('Done');
}

module.exports = {
  description: 'This action updates your project and links all native dependencies',
  options: [
    ['-f --force', 'Force linking of all dependencies. This removes everything and links it again']
  ],
  run: updateProjects
};
