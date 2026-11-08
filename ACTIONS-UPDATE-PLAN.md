# GitHub Actions Update Plan

Plan for bringing the template's GitHub Actions up to their newest majors. Split into 6
chunks, ordered simplest first (pure version-string bumps before the one chunk with a
code audit). Chunk 6 is not a mechanical bump: it is the planned consideration of the
official successor action `pnpm/setup`, taken after all the version bumps are in.

## How this plan is executed

- One agent works on **one chunk** at a time, then commits and hands off.
- All chunks happen **on the existing `deps/update-to-latest` branch**, right after the
  six dependency-update chunks. Action versions and package versions are orthogonal, but
  the user wants one update branch for the whole template refresh.
  Consequence: the branch is no longer purely "deps" — its commit history will contain
  `ci:` commits as well. (The branch name is kept as-is; it will be mentioned in the
  eventual PR description.)
- Chunks 1–4 are **version strings only**: no workflow logic changes. Chunk 5 adds a
  documented grep audit. Chunk 6 is a documented, decision-gated shape change (the
  `pnpm/setup` consideration) — the only chunk allowed to restructure steps, and only
  after its decision is recorded in the Progress log. If any bump unexpectedly requires
  a logic change, stop and record it in the Progress log instead of expanding scope.
- Commit message format: `ci: bump <action> to <major> (chunk N/6)` for Chunks 1–5;
  Chunk 6 uses `ci: <decision/summary> (chunk 6/6)`.
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
- **Local-only effort (user decision, 2026-11-08):** the agent does **not push** for
  the duration of this effort. Per-chunk verification is therefore local:
  scratch dry-run + `actionlint` (baseline: 2 pre-existing `[expression]` false
  positives in release-github.yml lines 168/192 — `mergeInfo`/`tagInfo` JSON-string
  outputs; criterion is *no new findings vs. that baseline*). The end-to-end checks
  mentioned in the chunk steps below (PR CI runs, `workflow_dispatch` dry runs) are
  deferred to when the user pushes the branch; they remain the acceptance evidence
  for the dispatch-only workflows.

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

In scope as a final decision chunk (Chunk 6):
- The pnpm org has released a **successor action `pnpm/setup`** (v3.1.2,
  2026-10-25) that installs pnpm *and* a JS runtime in one step, superseding
  `pnpm/action-setup` (whose v6.0.10 README points to it). Per user decision
  (2026-11-08), considering it is **in scope for this same effort/branch**,
  explicitly as the last step, after Chunks 1–5 are done and verified. It is a
  workflow shape change, not a version bump — hence its own chunk with a decision
  gate (see Chunk 6).

Out of scope (flagged, follow-up):
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

## Chunk 6 — Consider `pnpm/setup` (successor action), after Chunks 1–5 are complete

This chunk is a **decision step with an implementation option**, deliberately placed
last so it evaluates the *final* workflow state (all actions on newest majors) rather
than re-litigating anything Chunks 1–5 already settled.

Background (verified 2026-11-08 from the v3.1.2 README):
- `pnpm/setup@v3` downloads pnpm's self-contained release binary from the npm
  registry (signature-verified, no GitHub API calls) and installs the requested
  runtime via `pnpm runtime set` — replacing `pnpm/action-setup` **and**
  `actions/setup-node` (Node case) in one step. Requires pnpm ≥ 11 (we pin 12.18.0 ✓).
- **`pnpm install` runs automatically** by default (`install: true`) when a
  `package.json` is present. Our workflows have their own explicit install steps
  (`pnpm i`, then `pnpm run ci` / `pnpm publish`); the conservative adoption is
  `install: false` to keep the existing install commands verbatim.
- Node version source precedence: `runtime` input (e.g. `node@26`) >
  `devEngines.runtime` in `package.json` > `.node-version`/`.nvmrc`/`.tool-versions`.
  Our current source is the `node-version: 26` input in `setup-node`. Adoption can
  move that into the manifest via `devEngines: { runtime: { name: "node", version:
  "^26.0.0" } }` (pnpm ≥ 10.10 supports `devEngines`) — making the manifest the
  single source of truth for both pnpm and Node — or simply pass `runtime: node@26`.
- **No `registry-url` equivalent.** The one affected step is the publish job in
  `publish-npm.yml`, which sets `registry-url: "https://registry.npmjs.org/"`. Since
  npmjs is npm's default registry and authentication flows via the explicit
  `NODE_AUTH_TOKEN` env on the publish step, the `registry-url` is very likely a
  no-op — but that must be confirmed during this chunk, and if in doubt the publish
  job keeps `actions/setup-node` (a mixed setup is acceptable; the decision is
  per-workflow, not forced).
- Intel-macOS caveat (no pnpm v11 binary) is N/A — we run `ubuntu-latest` only.
- `cache: true` (pnpm store cache keyed on the lockfile) is available but changes CI
  behavior; out of scope for a version-update effort — default `false`, revisit later.

Steps:
1. **Evaluate** the three workflows against the notes above. In particular, confirm
   the `registry-url` no-op analysis for the publish job (check how `NODE_AUTH_TOKEN`
   is consumed in the `pnpm publish` exec).
2. **Decide**, per workflow: adopt `pnpm/setup@v3` (replacing the `setup-node` +
   `pnpm/action-setup` pair with one step, `install: false`, Node version via
   `devEngines.runtime` in the root `package.json` if the manifest route is taken) or
   stay on the Chunk 2/3 result. Record the decision and rationale in the Progress
   log *before* editing anything.
3. **If adopted**: make the edits (workflow steps + optionally `devEngines` in
   `package.json`), keep all install/build/publish commands byte-identical, and
   `actionlint` clean. Commit as `ci: adopt pnpm/setup, replacing setup-node and
   pnpm/action-setup (chunk 6/6)` (or the inverse if the decision is "stay": no
   commit, log only).
4. **Verify** (adoption only): push — PR CI is the end-to-end check for ci.yml — and
   ask the user for fresh dry runs of both dispatch workflows (supersedes the
   Chunk-5 dry runs as the final state).
5. Log outcome in the Progress log.

Exit criteria: a recorded decision (adopt or stay, with rationale); if adopted,
`actionlint` clean, PR CI green, both dry runs green.

---

## Follow-ups after all chunks (separate work, not part of this plan)

- Next **real** (non-dry-run) release and npm publish are the final verification of
  the `lock_branch`/`unlock_branch`/publish paths on the new action majors.
- If Chunk 6 adopts `pnpm/setup` with `cache: false`: consider enabling the pnpm
  store cache (`cache: true`) in a later CI-performance pass.

## Progress log

- 2026-11-08 — **Chunk 1 done** (commit `c4c9ed7`): `actions/checkout` v4 → v7 in all
  8 places (ci.yml ×1, release-github.yml ×5, publish-npm.yml ×2). Scratch dry-run
  confirmed the diff is exactly the 8 version lines; `actionlint` 1.7.12 output
  identical to the recorded 2-finding baseline (no new findings). `ref` input
  compatibility verified against v7.0.1 `action.yml`; v7's fork-PR block is N/A
  (no `pull_request_target`/`workflow_run` triggers). PR CI verification deferred
  (local-only effort — verify on push).
- 2026-11-08 — **Chunk 2 done** (commit `778dba8`): `pnpm/action-setup` v3 → v6 in
  all 4 places (ci.yml ×1, release-github.yml ×1, publish-npm.yml ×2). No inputs are
  passed anywhere; v6 resolves pnpm 12.18.0 from the `packageManager` pin via its
  bootstrap (npm ci of pnpm 11.19.0 from a committed lockfile, then self-update to
  the pinned version — verified by reading the v6.0.10 source). Defaults benign:
  `run_install: null`, `cache: false`, `standalone: false`; system Node 26 ≥ 22.13
  keeps the non-standalone path. Scratch dry-run diff was exactly the 4 version
  lines; `actionlint` identical to the 2-finding baseline. Note: v6's README points
  to the successor `pnpm/setup` — that consideration is Chunk 6. PR CI / dry-run
  verification deferred (local-only effort — verify on push).
