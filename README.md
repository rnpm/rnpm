:iphone: rnpm ![npm version](https://img.shields.io/npm/v/rnpm.svg) ![dependencies](https://img.shields.io/david/rnpm/rnpm.svg)
=============

**React Native Package Manager** built to ease your daily React Native development. Inspired by `Cocoapods`, `fastlane` and `react-native link` it acts as your best friend and guides you through the native unknowns. It aims to work with almost all packages available with no extra configuration required.

**This version is still in alpha as we are getting unit tests written. Feel free to submit bugs and feature requests. Always use this tool in a connection with source control to make sure all changes can be reverted.**

## Requirements

- node >= 4.x

## Getting started

**Installation**
```bash
$ npm install rnpm -g
```

**Running**

From your's project folder install some react-native modules that require additional installation and simply run:
```bash
$ rnpm link
```
In the case you want to link only one depepndency, you can specify it's name as an argument:
```bash
$ rnpm link react-native-blur
```

## Rationale

Why? Tooling is important. We all know this. One of the biggest advantages of native iOS development is XCode and its great tools. Unfortunately, the process of adding native dependencies to React Native projects is far from perfect and our aim is to make it fun again.

React Native Package Manager provides you with (soon) multiple actions to help you with daily development, including automatic app store releases, over-the-air integration with AppHub and react-native-playground shares.

**But hey, we are tired of tools and 9000+ .rc files**

So are we. That's why we have spent great amount of work on getting configuration done right. Our packager automatically scans your source directory and dependencies you are working with. This approach allows it to link all the things without supplying any extra configuration. It detects Android package names, import paths, gradle location - and for iOS - it works with any code structure you have ever came up with.

And don't worry - in case it fails, you can always add `rnpm` object to your `package.json` - our `npm` in a name is not a mistake! We embrance existing ecosystem and integrate with the present tooling for maxium developer experience.

## Available commands

#### rnpm link [name]
Automatically updates your project by linking all dependencies for Android (if present) and for iOS (if present). It's a great fit to your `postinstall` hook to always make sure you are linked. You can supply optional [name] argument to link only one dependency, e.g.

```bash
$ rnpm link react-native-module
```

Source: https://github.com/rnpm/rnpm-plugin-link

## Advanced usage
If you're authoring an awesome react-native library with custom assets, you probably need an additional step after linking - copying assets to the application folder. Well, that's not complicated: just add `rnpm` section in your `package.json` file:
```json
...
"rnpm": {
  "assets": ["Fonts"]
},
...
```
We'll copy your assets carefully with love for Android :heart: For iOS, we will add files to `Resources` group and update Info.plist so fonts are available for you to use straight away!

## Plugins

As of version 1.1.0, rnpm supports plugin system. It allows you to write your own / use third-party commands to make your `rnpm` sharpened for specific purposes.

#### Installing plugins

In order to install 3rd party plugin simply run below from your project directory:
```bash
$ npm install rnpm-plugin-<name> --save-dev
$ rnpm --help # you'll see installed plugin in the commands list
```

Command exported by installed plugin will be available straight away.

#### Mastering your first plugin

First of all, every plugin is [just a function](https://github.com/rnpm/rnpm-plugin-link/blob/master/src/action.js#L24) which accepts `config` and `args` parameters. Every plugin consists of [public interface](https://github.com/rnpm/rnpm-plugin-link/blob/master/index.js) for CLI and [implementation intself](https://github.com/rnpm/rnpm-plugin-link/blob/master/src/action.js).

We use **public interface** to make your plugins auto-pluggable and easy to use for end-users. Every public interface consists of `name`, `func` & `description` fields:
- `name` - Name of the plugin. After plugin installation it'll be used as a command name. For instance plugin with following interface:
  ```javascript
  module.exports = {
    func: require('./src/action'),
    description: 'This action updates your project and links all native dependencies',
    name: 'link [packageName]',
  };
  ```
  can be used like via rnpm like this:
  ```bash
  $ rnpm link
  ```

- `func` - Plugin itself. This function will be used when you run a command above
- `descripion` - Command description. If user runs `$ rnpm --help`, this field will be displayed as a command description.

#### Using third-party plugins

All existing plugins follows a naming convention: `rnpm-plugin-<plugin name>` (e.g. [`rnpm-plugin-link`]((https://github.com/rnpm/rnpm-plugin-link))). To include plugin to your rnpm build, just install it as a npm package, it'll be included to your rnpm tool automatically (wow, magic!). Let's consider following example: we have a `rnpm-plugin-something` plugin which we doesn't provide you automatically with `rnpm` tool. To install it manually, you need to run `npm install rnpm-plugin-something --save-dev` inside your project folder. Then, you can run it by `rnpm something` or check if command has been successfully installed by running `rnpm --help` - you should see a new plugin in the list of commands.

For further reading you can check our [example plugin](https://github.com/rnpm/rnpm-plugin-link)

### Developers

The documentation is still in progress, but if you are interested in the concept and good practices, see sample implementation [here](https://github.com/rnpm/rnpm-plugin-link/blob/master/index.js)

## Roadmap

First prio: **core elements**
- [ ] Test coverage
- [X] Plugins support

Second prio: **new plugins**
- [ ] rnpm ship
- [ ] rnpm build

We're open for community ideas!
If you know how to improve `rnpm` - please, [let us know](https://github.com/rnpm/rnpm/issues/new)!

## FAQ

#### How's that different from react-native link

`react-native link` is great, but it only works for Android now. It also does not automatically add packages to your project nor support custom folder configuration. We aim to solve these issues by analyzing folders and getting maxium informations available from them. When running `rnpm link` you don't have to think about the package exported by developer or the import path to include in your Java project.

#### Does it work with Cocoapods?

Yes, in fact - it has nothing to do with it. What it does is just linking static libraries automatically to your xcodeproj in the normal way you have been doing that. There are no more other changes.

#### Can I use `rnpm link` with npm's postinstall hook?
Sure you can! Try doing something like this in your package.json:
```json
...
"scripts": {
  "postinstall": "rnpm link"
},
...
```

## Special thanks

Special thanks to [**coreh**](https://github.com/coreh) for giving us the `rnpm` name in the registry.

## Versioning

This project follows semver. There are several 0.x versions published to npm registry you should not install as they belong to the previous project that was using that name 2 years ago.

## Contributing

We welcome all contributors, simply make an issue or send over a pull request. We really appreciate your help - let's build this tool together!

## Sponsors

This tool development and maintainance is sponsored by below companies:

<a href="http://manandmoon.com" title="Man+Moon"><img src="http://manandmoon.com/images/man-moon-full-logo-.svg" width="200" /></a>

## License

The MIT License (MIT)

Copyright (c) 2015 Mike Grabowski, 2015 Alexey Kureev

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
