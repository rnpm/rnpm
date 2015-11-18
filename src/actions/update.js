function updateProjects(cli, program) {
  // cli is our cli.actions, cli.projects and so on, so we have more flexibilty, but we can easily scope that to just `projects`.
  // just want the cli in case there's gonna be some global config regarding actions, like cli.config.verbose etc.
  console.log('Done', program.force);
}

module.exports = {
  description: 'This action updates your project and links all native dependencies',
  options: [
    ['-f --force', 'Force linking of all dependencies. This removes everything and links it again']
  ],
  run: updateProjects
};
