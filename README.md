# Project Template

This repo is meant to be used as a template for typescript monorepo projects.  It contains placeholder packages to demonstrate the setup.

## Usage

This repo has the following prerequisites:

* The latest LTS version of Node (currently 20) is installed.
    * If you are using nvm, you can run `nvm install` or `nvm use` to install or use the correct version, respectively.
* The latest version of `pnpm` (currently 9) is globally installed.

Run `pnpm i` from the project root to install dependencies.

### Primary commands

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
    * `vars.CHUMPCHIEF_RELEASE_BOT_APP_ID`
    * `secrets.CHUMPCHIEF_RELEASE_BOT_APP_PRIVATE_KEY`
    * TODO: NPM publishing secrets

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
* **CI** - Runs all checks against the repo on push and PRs, and is appropriate to use as a blocking status check.
* **Create Github Release** - For a given branch: consumes changesets, bumps versions, produces changelogs, creates a git tag, and creates a Github release.
* **Publish to NPM (IN PROGRESS)** - For a given release tag: publishes to NPM

## Verdaccio

This repo can publish to [Verdaccio](https://verdaccio.org/) as a way to verify the contents of published packages and try them out locally.

In addition to the primary commands above, the following commands can be run at the repo root to facilitate Verdaccio usage:

* `pnpm verdaccio:adduser` - Create a (local) Verdaccio user account
* `pnpm verdaccio:login` - Log in to an existing Verdaccio user account
* `pnpm verdaccio:publish` - Publish all packages
* `pnpm verdaccio:purge` - Remove all published packages
* `pnpm verdaccio:purgeuser` - Remove all (local) Verdaccio user accounts
* `pnpm pnpm:prune` - If you try to publish the same package twice, pnpm caches the result that nothing needed to be published.  If you want pnpm to try again (e.g. after running `pnpm verdaccio:purge`), this command will clear that cached result to permit retry.

## Releasing

### Changesets

This repo drives versioning using [Changesets](https://github.com/changesets/changesets).  You must include changesets with your changes to produce a release.

### Synchronized versions

This repo elects to synchronize version numbers across packages.  Making changes to any package and releasing will bump the version number for all packages according to the included changesets.

### Release branches

This repo assumes trunk-based development, and releasing directly from `main` is normal.  However it also supports using release branches, particularly for servicing minor or patch versions.  Some recommendations for working with release branches:
* They should be created from the release tag they build upon.
* They can be created lazily, since the release tags are always available to create the branch from on-demand.
    * Similarly, they are safe to delete after release since a new one can be created from the desired tag at any time.
* They should be named in the format:
    * For minor or patches of latest-minor: `release/${ major }.x`
    * For non-latest-minor patches: `release/${ major }.${ minor }.x`.

### Using the release Github action

Performing a release is done in three parts:

1. Dispatch the "Create Github Release" workflow against the branch you will release from.
    * This creates a PR for bumping the package versions to the version to be released, and generates the changelogs from the changesets.
    * After generating the PR, the workflow will wait for the PR to be merged before proceeding.
        * By default, it will wait for 10 minutes before failing.
        * If it times out, the PR can still be merged and the workflow resumed using "Re-run failed jobs".
    * Note: This will lock the base branch until the version bump is merged, to ensure no further changes are unintentionally included between the generation of the bump/changelogs and its completion.
1. Review and merge the version bump PR.
    * Because the base branch is locked at this stage, a user with admin priviliges is expected to perform the merge by bypassing branch protections.
    * After merging the PR, the workflow will resume.  It will create a git tag and Github release, and unlock the base branch.
1. Dispatch the "Publish to NPM" workflow against either the tag to be published (preferred) or a branch (see below), specifying the tag name to be published.
    * This will publish the packages at the **specified release tag** to NPM, and update the Github release with links to the published packages.
    * The publishing script that is used is based on the **branch/tag the workflow is dispatched from**.
        * It is recommended to run the workflow against the same tag that is to be released.  However since tags can't be easily changed, allowing this workflow to run against another branch gives opportunity to fix any glitches in the publish flow (i.e. in the case that the workflow is bugged at the specified tag).

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
* Synchronized version numbers across packages
* MacOS/Linux development environment

![CI status badge](https://github.com/ChumpChief/ProjectTemplate/actions/workflows/ci.yml/badge.svg)