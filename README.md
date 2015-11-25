React Native Package Manager
=============

> Codename: rnpm

React Native package manager built up from multiple independent actions to ease your daily react native development. It aims to work with almost all packages available with no extra configuration required.

## Usage

```bash
$ npm install rnpm -g
$ cd ./my-app && rnpm --help
```

## Rationale

Why? Tooling is important. We all know this. One of the biggest advantages of native iOS development is XCode and its great tools. Unfortunately, the process of for example adding native dependencies to React Native projects is far from perfect and our aim is to make it fun again. If you have ever worked with `Cocoapods` - you will feel at home.

React Native Packager provides you with (soon) multiple features and actions to help you with daily development, including automatic app store releases, over-the-air integration with AppHub and react-native-playground shares.

**But hey, we are tired of tools and 1239012 .rc files**

So are we. That's why we have spent great amount of work on getting configuration done right. Our packager automatically scans your source directory and dependencies you are working with which allows it to link all the things without specifying any extra flags. It detects Android package names, import paths, gradle location - and for iOS - it works with any code structure you have ever came up with.

And don't worry - in case it fails, you can always add `rnpm` object to your `package.json` - our `npm` in a name is not a mistake! We embrance existing ecosystem and integrate with the present tooling for maxium developer experience.

## Available commands

#### rnpm update [name]
Automatically updates your project by linking all dependencies for Android (if present) and for iOS (if present). It's a great fit to your `postinstall` hook to always make sure you are linked. You can supply optional [name] argument to link only one dependency, e.g.

```bash
$ rnpm udpate react-native-module
```

to link only specified package.

## Roadmap

We have lots of plans to make this tool better, some of them are:
- [ ] 100% test coverage
- [ ] support for plugins and custom project linters
- [ ] rnpm ship appstore
- [ ] rnpm ship apphub
- [ ] rnpm ship hockey
- [ ] rnpm build
- [ ] rnpm share rnplay
- [ ] your ideas
