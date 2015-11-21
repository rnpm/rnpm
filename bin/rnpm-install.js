#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const compose = require('lodash.flowright');
const pjson = require('../package.json');
const utils = require('../src/utils');

const registerNativeAndroidModule = require('../src/android');

const NODE_MODULES = path.join('.', 'node_modules');

fs.readdirSync(NODE_MODULES)
  .forEach((name) => {
    if (name[0] === '.') return;

    const content = fs.readFileSync(
      path.join(NODE_MODULES, name, 'package.json'),
      'utf8'
    );
    const config = utils.getConfig(content);

    if (!config) return;

    // registerNativeIOSModule(name, config);
    registerNativeAndroidModule(name, config);
  });
