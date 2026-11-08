# GitHub Actions Update Plan

Plan for bringing the template's GitHub Actions up to their newest majors. Split into 5
chunks, ordered simplest first (pure version-string bumps before the one chunk with a
code audit).

## How this plan is executed

- One agent works on **one chunk** at a time, then commits and hands off.
- All chunks happen **on the existing `deps/update-to-latest` branch**, right after the
  six dependency-update chunks. Action versions and package versions are orthogonal, but
  the user wants one update branch for the whole template refresh.
  Consequence: the branch is no longer purely "deps" — its commit history will contain
  `ci:` commits as well. (The branch name is kept as-is; it will be mentioned in the
  eventual PR description.)
- Each chunk is (except Chunk 5, which adds a documented audit) **version strings only**:
  no workflow logic changes. If a bump requires a logic change, stop and record it in the
  Progress log instead of expanding scope.
- Commit message format: `ci: bump <action> to <major> (chunk N/5)`
- Verification per chunk:
  1. `actionlint` (install locally, e.g. `npm i -g actionlint` or the binary release)
     over all three workflow files — must be clean.
  2. Chunks touching `ci.yml`: push the branch — the PR itself runs `ci.yml` on the
     new action versions, which is the real end-to-end verification.
  3. `release-github.yml` and `publish-npm.yml` are `workflow_dispatch`-only with a
     `dryRun` default; they cannot be verified by a PR push. The user triggers a dry run
     after the chunks that touched them (see per-chunk notes). A dry run exercises the
     app-token, github-script, checkout, and setup/pnpm-setup paths to the extent the
     workflow's own `if:` conditions allow (e.g. `lock_branch` is skipped in dry run).
     Full-path verification of the release/publish flows happens at the next real
     release.
- Runner-version note: several of the new majors require Actions runner ≥ v2.327.1.
  GitHub-hosted `ubuntu-latest` runners track the latest runner image automatically, so
  this is a non-issue here; it would only matter for self-hosted runners.

## Baseline (as of plan creation, 2026-11-08)

| Action | In workflows | Newest major |
|---|---|---|
| `actions/checkout` | `@v4` (8×: ci.yml ×1, release-github.yml ×5, publish-npm.yml ×2) | **v7** (v7.0.1) |
| `actions/setup-node` | `@v4` (4×: ci.yml ×1, release-github.yml ×1, publish-npm.yml ×2) | **v7** (v7.1.0) |
| `pnpm/action-setup` | `@v3` (4×: ci.yml ×1, release-github.yml ×1, publish-npm.yml ×2) | **v6** (v6.1.1) |
| `actions/create-github-app-token` | `@v1` (6×: release-github.yml) | **v3** (v3.3.0) |
| `actions/github-script` | `@v7` (11×: release-github.yml ×7, publish-npm.yml ×4) | **v9** (v9.0.0) |

Inputs actually used by these workflows (audit of all three files):
`checkout`: `ref` only. `setup-node`: `node-version: 26`, plus `registry-url` in one
publish step. `pnpm/action-setup`: **no inputs** (reads the `packageManager` field,
pnpm 12.18.0). `create-github-app-token`: `app-id`, `private-key`. `github-script`:
`script`, `github-token` (some steps), `result-encoding: string` (one step). All of
these inputs still exist under the target majors (verified against each action's
`action.yml` on its newest major tag).

Out of scope (flagged, follow-up):
- The pnpm org has released a **successor action `pnpm/setup`** (v3.1.2,
  2026-10-25) that installs pnpm *and* a JS runtime in one step, superseding
  `pnpm/action-setup` (whose v6.0.10 README points to it). Adopting it would replace
  `pnpm/action-setup` and possibly `actions/setup-node` in several jobs — a workflow
  shape change (and `setup-node`'s `registry-url` behavior in the npm publish job would
  need a replacement), not a version bump. Deferred as a design decision.
- Stale `# pnpm ci is reserved` comments in ci.yml / publish-npm.yml (already flagged
  in the dependency plan).
- The `unlock_branch` needs-chain TODO in release-github.yml (already flagged).

---

## Chunk 1 — actions/checkout v4 → v7

Simplest: no inputs used besides `ref` (unchanged in v7); pure version-string bump in
all 8 places.

What changed upstream (release notes):
- **v5** (2025-08): Node 24 runtime; minimum runner v2.327.1 (N/A: hosted runners).
- **v6** (2025-11): credentials persisted to a separate file (internal implementation
  detail); tag-fetching fixes (annotations/explicit `fetch-tags` preserved).
- **v7** (2026-06): security hardening — fork-PR checkouts are blocked for
  `pull_request_target` / `workflow_run` triggers (and the default-unsafe pre-check was
  refined); internal ESM migration. This repo's `ci.yml` uses `pull_request` (the
  non-fork-PR-leaking trigger) and the other workflows are `workflow_dispatch`-only →
  no behavior change for us.

Steps:
1. Replace every `actions/checkout@v4` with `actions/checkout@v7` (8 occurrences).
2. `actionlint` clean. Commit. Push — the PR's own CI run is the verification.

Exit criteria: `actionlint` clean; PR `ci.yml` run green on checkout v7; diff contains
no non-version-string changes.

---

## Chunk 2 — pnpm/action-setup v3 → v6

No inputs are passed anywhere (the action reads `packageManager`: pnpm 12.18.0), so
this is a pure version-string bump in all 4 places.

What changed upstream (release notes):
- **v4** (2024-05): throws if a `version` input conflicts with the `packageManager`
  field — N/A, we pass no `version` input.
- **v5** (2026-03): Node 24 runtime.
- **v6** (2026-04): pnpm 11 support; the bootstrap now self-updates to the
  `packageManager`-pinned version before running; `bin_dest` output; cache restore-key
  improvements. Works with our pnpm 12.18.0 pin (bootstrap installs the pinned version
  from npm regardless of the bundled bootstrap version).

Steps:
1. Replace every `pnpm/action-setup@v3` with `pnpm/action-setup@v6` (4 occurrences).
2. `actionlint` clean. Commit. Push — PR CI verifies the ci.yml path; the
   release/publish paths await the user's dry runs (noted in the chunk-5 follow-up list
   below — one dry run of each workflow after Chunk 5 covers them all).

Exit criteria: `actionlint` clean; PR `ci.yml` run green (pnpm 12.18.0 installed from
the pin, full gate green).

---

## Chunk 3 — actions/setup-node v4 → v7

Inputs in use (`node-version: 26`, `registry-url` in one publish step) both still
exist in v7; version-string bump in all 4 places.

What changed upstream (release notes):
- **v5** (2025-09): automatic dependency caching when a `packageManager` field is
  present.
- **v6** (2025-10): that automatic caching was **limited to npm** — for pnpm/yarn it is
  disabled by default (enable manually via the `cache` input). Net effect for this
  pnpm repo: **no behavior change** (we never had a dependency cache; the pnpm store
  remains uncached in CI).
- **v7** (2026-07): ESM migration; new `cache-primary-key` / `cache-matched-key`
  outputs; **the dummy `NODE_AUTH_TOKEN` export was removed** — older versions exported
  an empty `NODE_AUTH_TOKEN` when `registry-url` was set without a token. Our publish
  job supplies a real `NODE_AUTH_TOKEN` in the step's `env:` → no impact (do not rely
  on the dummy in the future).

Steps:
1. Replace every `actions/setup-node@v4` with `actions/setup-node@v7` (4 occurrences).
2. `actionlint` clean. Commit. Push — PR CI verifies the ci.yml path.

Exit criteria: `actionlint` clean; PR `ci.yml` run green on setup-node v7; diff
contains no non-version-string changes.

---

## Chunk 4 — actions/create-github-app-token v1 → v3

Only used in `release-github.yml` (6 occurrences). Inputs in use (`app-id`,
`private-key`) are exactly the names that became **required** in v2 (v2 removed the
deprecated snake_case `app_id` / `private_key` / `skip_token_revoke`) — we are already
compliant. Output name `token` unchanged.

What changed upstream (release notes):
- **v2** (2025-04): removed deprecated snake_case inputs; `app-id` / `private-key`
  required.
- **v3** (2026-03): Node 24 runtime; **custom proxy handling removed** — if you run
  behind an HTTP proxy you must set `NODE_USE_ENV_PROXY=1` on the step (we don't use a
  proxy → N/A); minimum runner v2.327.1 (N/A: hosted runners).

Steps:
1. Replace every `actions/create-github-app-token@v1` with
   `actions/create-github-app-token@v3` (6 occurrences).
2. `actionlint` clean. Commit. This chunk cannot be verified by a PR push (workflow is
   dispatch-only); the user's dry run after Chunk 5 covers it (a dry run exercises the
   app-token step in `create_bump_branch` / `create_bump_pr`; the
   `lock_branch`/`unlock_branch` token steps are skipped in dry run by the workflow's
   own `if:` and are verified at the next real release).

Exit criteria: `actionlint` clean; diff contains no non-version-string changes.

---

## Chunk 5 — actions/github-script v7 → v9 (the audit chunk)

11 occurrences (release-github.yml ×7, publish-npm.yml ×4). Version-string bump, **plus**
a script audit — this is the only chunk with code-level risk, because v9 upgraded
`@actions/github` to v9, which is ESM-only.

What changed upstream (release notes):
- **v8** (2025-09): Node 24 runtime; minimum runner v2.327.1 (N/A: hosted runners). No
  API changes.
- **v9** (2026-04): `@actions/github` v9 (ESM-only). Breaking: `require('@actions/github')`
  no longer works inside scripts; `getOctokit` is now an **injected function parameter**
  in the script context (declaring `const getOctokit = ...` in a script is a
  `SyntaxError`); other `@actions/github` internals may have moved.

**Audit result (2026-11-08):** the 5 external scripts (`.github/workflows/scripts/*.cjs`)
export `async ({ github, context, core, exec }, ...)` and use only those injected
parameters (`github.rest.*`, `context.*`, `core.*`, `exec.*`, global `fetch`). None of
them — nor any of the 11 inline workflow scripts — use `require('@actions/github')`,
`getOctokit`, `octokit`, or any `@actions/github` internals (verified by grep). Inputs
we use (`script`, `github-token`, `result-encoding`) and the `result` output are
unchanged in v9's `action.yml`. → The bump is a drop-in for this repo.

Steps:
1. Re-run the grep audit before editing (cheap insurance against drift):
   `grep -rn "actions/github\|getOctokit\|octokit" .github/` must hit only the
   `uses: actions/github-script@v7` lines.
2. Replace every `actions/github-script@v7` with `actions/github-script@v9`
   (11 occurrences).
3. `actionlint` clean. Commit.
4. **Ask the user to trigger dry runs of both `Create Github Release` and
   `Publish to NPM`** (both default to dry run). This is the first chunk where the
   dispatch-only workflows get their end-to-end pass on the new majors: the dry runs
   exercise checkout, setup-node, pnpm/action-setup, create-github-app-token, and
   github-script together. Record the outcome in the Progress log.

Exit criteria: audit clean; `actionlint` clean; both workflow dry runs green (or any
failure recorded in the Progress log with the failing step identified).

---

## Follow-ups after all chunks (separate work, not part of this plan)

- Consider migrating `pnpm/action-setup` + `actions/setup-node` to the successor
  **`pnpm/setup`** action (see Baseline "out of scope").
- Next **real** (non-dry-run) release and npm publish are the final verification of
  the `lock_branch`/`unlock_branch`/publish paths on the new action majors.

## Progress log

<!-- One line per completed chunk: date, commit hash, verification outcome, notes -->
