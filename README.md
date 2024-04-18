# Project Template

This repo is meant to be used as a template for typescript monorepo projects.  It contains placeholder packages to demonstrate the setup.

## Usage

This repo has the following prerequisites:

* The latest LTS version of Node (currently 20) is installed.
    * If you are using nvm, you can run `nvm install` or `nvm use` to install or use the correct version, respectively.
* The latest version of `pnpm` (currently 9) is globally installed.

Run `pnpm i` from the project root to install dependencies.

### Commands

All commands should be run from the project root.

* `pnpm build` - Build all packages
* `pnpm lint` - Lint all packages
* `pnpm test` - Test all packages that provide a test command
* `pnpm webpack` - Webpack examples
* `pnpm clean` - Delete all build and webpack outputs
* `pnpm start` - Start a dev server running the examples
* `pnpm changeset` - Add a changeset

## Setup

After establishing a new repository using this template, take the following additional steps:
* Set up a branch protection ruleset for `main` and `release/*`.  In addition to the default protections, add:
    * Require linear history
    * Require a pull request before merging
    * Require status checks to pass: CI Validation
* Disallow merge commits and rebase merging
* Allow auto-merge
* Automatically delete head branches
* Ensure ChumpChief Release Bot is installed, and add these variables/secrets:
    * vars.CHUMPCHIEF_RELEASE_BOT_APP_ID
    * secrets.CHUMPCHIEF_RELEASE_BOT_APP_PRIVATE_KEY

## Structure

The repo is divided into three high-level directories:  `build`, `packages`, and `examples`.

### `build`

The `build` directory holds shared project configuration used by the other packages.  This includes shared configuration for typescript and eslint.  This shouldn't require modification in most cases.

### `packages`

The `packages` directory holds the majority of the project.  Packages contained in this directory are intended to be part of the shipping project output.  These are the only non-private packages in the repo.

### `examples`

The `examples` directory contains a single package with all examples.  When running `pnpm start`, navigating to `http://localhost:8080/` will load an index of these examples.

## Github

This repo provides Github Actions for:
* CI - Runs all checks against the repo on push and PRs, and is appropriate to use as a blocking status check.
* Create Github Release - For a given branch: consumes changesets, bumps versions, produces changelogs, creates a git tag, and creates a Github release.
* Publish to NPM (IN PROGRESS) - For a given release tag: publishes to NPM

## Technology choices

This repo is opinionated about its technology choices.  Specifically,

* `pnpm` for package management and workspaces
* `nx` for monorepo commanding and caching
* `tsc` for type checking and build output (considering other options for build output though)
* `eslint` for linting
* `jest` for testing
* `changesets` for change tracking
* `react` for DOM rendering
* ESM modules
* Node16 module resolution
* Strict configurations for typescript, linting, and formatting
* Recent major version requirements for dependencies
* Trunk-based development (optionally with release branches)

![CI status badge](https://github.com/ChumpChief/ProjectTemplate/actions/workflows/ci.yml/badge.svg)