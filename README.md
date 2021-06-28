<div align="center">

# @tinyhttp/cli

[![npm](https://img.shields.io/npm/dt/@tinyhttp/cli?style=for-the-badge&color=hotpink)][npm-url] [![GitHub Workflow Status](https://img.shields.io/github/workflow/status/tinyhttp/tinyhttp/CI?style=for-the-badge&logo=github&label=&color=hotpink)][github-actions] [![Coverage][cov-img]][cov-url] [![](https://img.shields.io/badge/donate-DEV-hotpink?style=for-the-badge)](https://stakes.social/0x14308514785B216904a41aB817282d25425Cce39)

</div>

The [tinyhttp](https://github.com/talentlessguy/tinyhttp) CLI to quick-start new projects.

## Install

```sh
pnpm i -g @tinyhttp/cli
```

## Usage

### `tinyhttp new <template> [folder]`

```sh
tinyhttp new basic my-app
```

#### Arguments

- `template` is the name of template from [examples](https://github.com/talentlessguy/tinyhttp/tree/master/examples) folder.
- `folder` argument is optional

#### Flags

- `--pkg` - custom package manager to use for running installation commands.

Some flags help you to quickly create popular tool configurations for Node.js projects so you don't have to write them from scratch.

- `--prettier` - creates a Prettier config (and installs Prettier)
- `--eslint` - creates an ESLint config (and installs ESLint, Prettier and plugins)
- `--eslint-ts` - creates an ESLint config for a TypeScript project (and installs ESLint, Prettier, TypeScript and plugins)
- `--full` - `--prettier` and `--eslint` combined

[npm-url]: https://npmjs.com/package/@tinyhttp/cli
[github-actions]: https://github.com/tinyhttp/cli/actions
[cov-img]: https://img.shields.io/coveralls/github/tinyhttp/cli?style=for-the-badge&color=hotpink
[cov-url]: https://coveralls.io/github/tinyhttp/cli
