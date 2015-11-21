#!/usr/bin/env node

const pjson = require('../package.json');
const program = require('commander');

program
  .version('0.0.1')
  .command('install [name]', 'Install Android native dependencies')
  .parse(process.argv);
