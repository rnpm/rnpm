React Native Package Manager
=============

> Codename: rnpm

React Native package manager built up from multiple independent actions to ease your daily react native development. It aims to work with almost all packages available with no extra configuration required.

**This version is still in alpha as we are getting unit tests written. Feel free to submit bugs and feature requests**

## Requirements

- Node 4.x

## Usage

```bash
$ npm install rnpm -g
$ cd ./my-app && rnpm --help
```

## Rationale

Why? Tooling is important. We all know this. One of the biggest advantages of native iOS development is XCode and its great tools. Unfortunately, the process of for example adding native dependencies to React Native projects is far from perfect and our aim is to make it fun again. If you have ever worked with `Cocoapods` - you will feel at home.

React Native Package Manager provides you with (soon) multiple features and actions to help you with daily development, including automatic app store releases, over-the-air integration with AppHub and react-native-playground shares.

**But hey, we are tired of tools and 1239012 .rc files**

So are we. That's why we have spent great amount of work on getting configuration done right. Our packager automatically scans your source directory and dependencies you are working with which allows it to link all the things without specifying any extra flags. It detects Android package names, import paths, gradle location - and for iOS - it works with any code structure you have ever came up with.

And don't worry - in case it fails, you can always add `rnpm` object to your `package.json` - our `npm` in a name is not a mistake! We embrance existing ecosystem and integrate with the present tooling for maxium developer experience.

## Available commands

#### rnpm link [name]
Automatically updates your project by linking all dependencies for Android (if present) and for iOS (if present). It's a great fit to your `postinstall` hook to always make sure you are linked. You can supply optional [name] argument to link only one dependency, e.g.

```bash
$ rnpm link react-native-module
```

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

## FAQ

#### How's that different from react-native link

react-native link is great, but it only works for Android now. It also does not automatically add packages to your project nor support custom folder configuration. We aim to solve these issues by analyzing folders and getting maxium informations available from them. When running `rnpm link` you don't have to think about the package exported by developer or the import path to include in your Java project.

#### Does it works with Cocoapods?

Yes, in fact - it has nothing to do with it. What it does is it just automatically links static libraries to your xcodeproj in the normal way you have been doing that. There are no more other changes.

## Contributing

We welcome all contributors, simply make an issue or send over a pull request. We really appreciate your help - let's build this tool together!

## Sponsors

tba
