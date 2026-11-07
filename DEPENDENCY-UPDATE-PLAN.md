# Dependency Update Plan

Plan for bringing the template's dependencies up to date. Split into 6 chunks, ordered from
low-risk (patch/minor) to high-risk (major version jumps with breaking changes).

## How this plan is executed

- One agent works on **one chunk** at a time, then commits and hands off.
- All chunks happen **on the same topic branch** (e.g. `deps/update-to-latest`).
  The first agent creates it from `main`; subsequent agents continue on it.
- After finishing a chunk, the agent must leave the tree **clean and green**:
  `pnpm install` (lockfile updated), `pnpm run ci` (build + lint + test + webpack) all
  pass. Note the `run` verb is required: pnpm 11+ has a built-in `pnpm ci`
  (clean install), which shadows the repo's `ci` script.
- Commit message format: `deps: <chunk name> — <one-line summary> (chunk N/6)`
- If a chunk hits a blocker that can't be fixed without scope creep (e.g. a breaking
  change in a *different* package's API surface), stop, commit what is green, and leave
  a note at the bottom of the "Progress log" section for the next agent.
- Do **not** run `pnpm install` before making the manifest edits in a chunk — do the
  edits first, then a single `pnpm install` to regenerate the lockfile.

## Baseline (as of plan creation)

Newest-available versions were checked against npm. Deps already up to date:
`eslint-plugin-react` @ ^7.37.5. Workspace deps (`workspace:*`) are never touched.

Toolchain (pnpm, nx, Node) was updated separately before Chunk 1 started — see the
Progress log. Chunk 4 (nx) was pulled forward as a prerequisite of the pnpm bump and
is already complete.

---

## Chunk 1 — Safe patches and minors (no major bumps)

Low risk: same major, semver-compatible. Expected to be nearly mechanical.

| Package | From | To | Where |
|---|---|---|---|
| `react` | ^19.1.0 | ^19.3.1 | examples |
| `react-dom` | ^19.1.0 | ^19.3.1 | examples |
| `@types/react` | ^19.1.8 | ^19.3.0 | examples |
| `@types/react-dom` | ^19.1.6 | ^19.3.0 | examples |
| `@jest/globals` | ^30.0.4 | ^30.5.2 | examples, packages/package1, packages/package2 |
| `jest` | ^30.0.4 | ^30.5.2 | examples, packages/package1, packages/package2 |
| `html-webpack-plugin` | ^5.6.3 | ^5.6.8 | examples |
| `ts-loader` | ^9.5.2 | ^9.6.2 | examples |
| `webpack` | ^5.100.0 | ^5.112.2 | examples |
| `@stylistic/eslint-plugin` | ^5.2.0 | ^5.10.0 | build/eslint-config-shared |
| `typescript-eslint` | ^8.37.0 | ^8.72.1 | build/eslint-config-shared |

Steps:
1. Check out the existing topic branch `deps/update-to-latest` (already created from `main`).
2. Edit the `package.json` files above.
3. `pnpm install`, then `pnpm run ci`.
4. Fix anything that breaks (unlikely; check jest 30.5 and React 19.3 changelogs for
   deprecation warnings).
5. Commit.

Exit criteria: all `pnpm run ci` targets green, lockfile updated, no new peer-dependency warnings.

---

## Chunk 2 — ESLint 10 stack (major) — DONE (see Progress log)

Bumps the lint toolchain to ESLint 10. `eslint-plugin-perfectionist` 5.x is assumed to
target the modern toolchain — verify its peer deps after install.

| Package | From | To | Where |
|---|---|---|---|
| `eslint` | ^9.31.0 | ^10.14.0 | examples, packages/package1, packages/package2 |
| `@eslint/js` | ^9.31.0 | ^10.0.1 | build/eslint-config-shared |
| `eslint-plugin-perfectionist` | ^4.15.0 | ^5.13.0 | build/eslint-config-shared |

Steps:
1. Read the ESLint 10 migration guide and the perfectionist v5 changelog **before** editing.
2. Bump versions in all four `package.json` files.
3. `pnpm install` — watch for peer-dependency conflicts (especially
   `typescript-eslint` from Chunk 1 vs ESLint 10). If `typescript-eslint` 8.72.1 has an
   unmet peer on eslint 10, bump it to the newest compatible release within 8.x, or to
   the release that declares eslint 10 support.
4. `pnpm run lint` — expect possible rule/plugin renames or config-shape changes.
   Update `build/eslint-config-shared/index.mjs` and any per-package eslint configs as
   needed. Goal: lint passes with the same effective rules (avoid silently disabling
   rules; prefer porting them to new names).
5. `pnpm run ci` for the full gate, then commit.

Exit criteria: lint green with no new `--no-*` suppressions or disabled rules added
without justification in the commit message.

---

## Chunk 3 — webpack tooling majors (webpack-cli 7, webpack-dev-server 6) — DONE (see Progress log)

| Package | From | To | Where |
|---|---|---|---|
| `webpack-cli` | ^6.0.1 | ^7.3.1 | examples |
| `webpack-dev-server` | ^5.2.2 | ^6.1.0 | examples |

Steps:
1. Read the v7 (webpack-cli) and v6 (webpack-dev-server) changelogs/breaking-changes
   notes before editing.
2. Bump versions in `examples/package.json`.
3. `pnpm install`.
4. Verify the webpack pipeline end-to-end:
   - `pnpm webpack` (production build output unchanged in shape),
   - `pnpm start` (dev server boots, serves the built app, HMR intact — smoke test
     manually or via curl; then shut it down).
5. Update `examples/webpack.config.*` for any renamed options, and the
   `start`/`webpack` scripts in `examples/package.json` if CLI flags changed.
6. `pnpm run ci`, then commit.

Exit criteria: production webpack build byte-comparable (same entry/asset structure),
dev server starts cleanly.

---

## Chunk 4 — nx 21 → 24 (three majors) — DONE (pulled forward, see Progress log)

| Package | From | To | Where |
|---|---|---|---|
| `nx` | ^21.3.0 | ^24.0.5 | root |

Steps:
1. Read the nx release notes for v22, v23, and v24 — note plugin/config changes
   (workspace file layout, `nx.json` options, run-many flags).
2. Bump `nx` in the root `package.json`.
3. `pnpm install`.
4. Check for a migration generator (e.g. `pnpm exec nx migrate`) and run it if one
   exists; otherwise apply the breaking changes by hand to `nx.json`,
   `project.json` files, and any `executors`/`generators` references.
5. Verify **every** root script still works: `pnpm build`, `pnpm lint`, `pnpm test`,
   `pnpm webpack`, `pnpm run ci`, and `pnpm nx show projects`.
6. Commit (include migration notes in the commit body).

Exit criteria: `pnpm run ci` green, `nx reset` works, no deprecated-config warnings in output.

---

## Chunk 5 — @changesets/cli 2 → 3 (major)

| Package | From | To | Where |
|---|---|---|---|
| `@changesets/cli` | ^2.29.5 | ^3.0.3 | root |

Steps:
1. Read the changesets v3 migration notes (config format lives in
   `.changeset/config.json`).
2. Bump version in the root `package.json`, `pnpm install`.
3. Port `.changeset/config.json` if the schema changed.
4. Smoke test: `pnpm exec changeset status` runs without error; if trivial, do a
   dry `pnpm exec changeset version` and `git restore` the result.
5. `pnpm run ci`, then commit.

Exit criteria: `changeset status` clean, config validated.

---

## Chunk 6 — TypeScript 5 → 7 (major, do last)

The biggest jump in the plan: TS 7 is the native-compiler line. Tooling from earlier
chunks (`ts-loader`, `typescript-eslint`) may not fully support it yet.

| Package | From | To | Where |
|---|---|---|---|
| `typescript` | ^5.8.3 | ^7.0.2 | examples, packages/package1, packages/package2 |

Steps:
1. Read the TS 7 migration/release notes.
2. **Fallback first:** check whether `ts-loader` and `typescript-eslint` declare
   `typescript@7` in their peer ranges (`pnpm why typescript` / npm pages). If not,
   pin to the newest 5.x line instead (check `npm view typescript dist-tags` and
   `npm view typescript versions` for the latest 5.x), note the deferral in the commit
   message and in the Progress log, and stop here.
3. Otherwise bump all three `package.json` files, `pnpm install`.
4. `pnpm build` — expect strictness/diagnostic changes. Fix source or
   `build/tsconfig-shared` as needed. Do not blanket-disable new checks; fix code, or
   document a deliberate `// @ts-expect-error` per case.
5. `pnpm run ci` (lint via typescript-eslint must also pass on TS 7).
6. Commit (summarize source changes required by the new compiler).

Exit criteria: `pnpm run ci` green on TS 7 (or documented fallback to latest 5.x).

---

## Final handoff (after Chunk 6)

- Run `pnpm run ci` one last time from a clean checkout of the branch.
- Squash or leave history as-is per repo convention; update this file's Progress log
  with the final state.
- Do **not** merge or open a PR without explicit user permission.

## Final step (only after explicit user approval)

Once the user has reviewed the finished branch and explicitly approved it:

1. Delete this file (`DEPENDENCY-UPDATE-PLAN.md`).
2. Commit the deletion (e.g. `chore: remove dependency update plan`).

Do not perform this step without the user's explicit approval.

## Progress log

<!-- One line per completed chunk: date, agent, commit hash, notes/blockers -->

### Toolchain / infrastructure (before Chunk 1, 2026-11-06..07)

- pnpm 10.13.1 → 12.18.0 (commit `0718c36` superseded by `c320c10`). pnpm 12
  rewrites `pnpm-lock.yaml` as a two-document YAML stream (env document recording
  the pinned package manager), which nx 21.3.0's single-document parser cannot read.
  No pnpm setting suppresses the env document, so the nx bump (Chunk 4) was pulled
  forward into the same work. `pnpm-workspace.yaml` `onlyBuiltDependencies` was
  rewritten by pnpm 12 to the `allowBuilds` format (nx, unrs-resolver).
- `c320c10` (2026-11-07): nx 21.3.0 → 24.0.5 — **Chunk 4 complete**. No migration
  needed: the repo uses only the core `nx` package with script-based targets (no
  `@nx/*` plugins, no `project.json` files, no executors). Verified `pnpm nx show
  projects` and the full `pnpm run ci` gate.
- `d640273`: `engines.pnpm` >=10 → >=12.
- `20c1a35`: workflows explicitly pinned pnpm majors (`version: 9`/`version: 10`)
  which overrode the `packageManager` field; pins removed so action-setup reads the
  pin. The publish job's node 20 (unsupported by pnpm 11+) was bumped to 22.
- `94d042e`: README prerequisites pnpm 10 → 12.
- `1bdd430`: latest Node LTS 22 → 26 (engines, all four workflow jobs, README).
  Known pnpm 11+ behaviors not yet addressed (flagged, deferred): `minimumReleaseAge`
  defaults to 1 day (matters for the verdaccio local-publish flow — may need
  `minimumReleaseAge: 0`), `verifyDepsBeforeRun: install` adds a pre-run check to
  every script, and the `# pnpm ci is reserved` comments in workflows are stale.

### Chunks

- `bc12aac` (2026-11-07): **Chunk 1 complete** — react 19.3.1, jest 30.5.2,
  webpack 5.112.2, @stylistic 5.10.0, typescript-eslint 8.72.1, etc. (all targets
  in the plan were still the npm latest). jest 30.5 pulls `@parcel/watcher` via
  jest-haste-map; added to `allowBuilds`. Full gate green. No blockers.

- `b98a678` (2026-11-07): **Chunk 2 complete** — eslint 10.14.0, @eslint/js 10.0.1,
  eslint-plugin-perfectionist 5.13.0 (ESM-only; no deprecated v4 options in use),
  eslint added as a devDependency of eslint-config-shared so @eslint/js's peer
  resolves in-package. Two deviations, both verified empirically (dry-run in a
  scratch copy first): (1) `react.mjs` react version setting changed
  "detect" -> "19.x" — "detect" routes through an API removed in ESLint 10 and
  crashes `react/display-name` rule loading on eslint-plugin-react 7.37.5
  (jsx-eslint/eslint-plugin-react#3970); an explicit version bypasses the broken
  path and is deterministic. (2) One new peer warning accepted: eslint-plugin-react
  7.37.5 peer range caps at eslint ^9.7 (10-compatibility PR #4022 still pending
  upstream); all enabled react rules load and lint correctly under ESLint 10. No
  config or rule renames were needed; ESLint 10's new recommended rules and the
  perfectionist v5 defaults produce no violations on this codebase. Full gate
  green (build/lint/test/webpack x3).

- `6b88260` (2026-11-07): **Chunk 3 complete** — webpack-cli 7.3.1,
  webpack-dev-server 6.1.0. One script change: `start` is now `webpack serve`
  (dev-server v6 removed its CLI; the old bin only delegates to webpack-cli
  serve, so the canonical form is preferred). webpack-cli 7.2.0+ is required
  to peer dev-server 6 (7.0.x/7.1.x cap at ^5.0.0); 7.3.0+ drives dev-server 6
  as a compiler plugin. No `webpack.config.js` changes needed (no devServer
  section; none of the removed v6 options in use). Verified in a scratch-copy
  dry-run and in-tree: build output byte-identical to the previous toolchain,
  dev server boots in ~3s with live reload working, full gate green. No new
  peer warnings (all new webpack-cli peers are optional).

- [x] Chunk 1 — safe patches and minors
- [x] Chunk 2 — ESLint 10 stack
- [x] Chunk 3 — webpack tooling majors
- [x] Chunk 4 — nx 21 → 24 (done in `c320c10` as a pnpm prerequisite; see above)
- [ ] Chunk 5 — @changesets/cli 2 → 3
- [ ] Chunk 6 — TypeScript 5 → 7
