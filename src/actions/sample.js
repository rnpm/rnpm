function sampleAction() {
  console.log(arguments);
  // {'0':
  //   { projects: { ios: null, android: null },
  //     actions: { update: [Object], sample: [Object] } },
  //  '1': { folderName: 'd', rnVersion: undefined },
  //  '2': { force: undefined } }
}

module.exports = {
  description: 'This is sample demonstration with what is available',
  options: [{
    name: '-f --force',
    description: 'Force linking of all dependencies'
  }],
  args: [{
    name: 'folder',
    required: true,
  }, {
    name: 'reactNativeVersion',
    property: 'rnVersion'
  }],
  run: sampleAction
};
