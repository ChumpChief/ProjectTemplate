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

Decision (2026-11-08, user-approved — option c):
- The `@v1` pin actually resolves to **v1.12.0** (2025-03, node20) — already kebab-case
  inputs, already has the `post:` token-revocation hook. So v2's breaking changes are
  N/A and revocation behavior is unchanged across the bump.
- **v3.1.0** introduced `client-id` and soft-deprecated `app-id` (GitHub's UI rename of
  "App ID" → "Client ID"). Verified in the v3.3.0 source that both inputs map to the
  identical octokit `appId` field — the rename is a semantic no-op; the repo variable
  `CHUMPCHIEF_RELEASE_BOT_APP_ID` keeps its name.
- **Pinned `@v3.3.0` exactly instead of the `v3` major tag.** v3.3.0 (2026-10-12) is
  the latest release and the `v3` tag points at the same commit — but actionlint 1.7.12
  serves stale v3.0.0 metadata for the `@v3` tag (verified: the raw file at the tag
  contains `client-id`; actionlint reports it does not, consistently, no cache on
  disk). Pinning the exact tag gives actionlint a fresh manifest (verified clean) and
  keeps the token-minting action at a reproducible version.
- All 6 call sites: `@v1` → `@v3.3.0` and `app-id:` → `client-id:`.

Steps (as executed):
1. Replace every `actions/create-github-app-token@v1` with
   `actions/create-github-app-token@v3.3.0` (6 occurrences) and rename the
   `app-id` input to `client-id` (6 occurrences).
2. `actionlint` at baseline. Commit. This chunk cannot be verified by a PR push
   (workflow is dispatch-only); the user's dry run after Chunk 5 covers it (a dry run
   exercises the app-token step in `create_bump_branch` / `create_bump_pr`; the
   `lock_branch`/`unlock_branch` token steps are skipped in dry run by the workflow's
   own `if:` and are verified at the next real release).

Exit criteria: `actionlint` at baseline; diff limited to the version string + the
user-approved `app-id` → `client-id` rename (the "no non-version-string changes"
ruling is amended for this chunk only).

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

Done (2026-11-08, commit `8b65f33`): audit re-run against current files immediately
before the bump (all clear — 6 inline `require()` calls load local `.cjs` files or
node builtins only; no `getOctokit` redeclarations); v7 and v9 manifests confirmed
byte-identical for every input in use and the `result` output (runtime node20 →
node24); `@v9` is an annotated tag at v9.0.0, the latest release (no v9.1, no v10),
so the major tag carries no stale-resolution risk. Diff was exactly the 11 version
lines, byte-identical to the validated scratch; `actionlint` at the 2-finding
baseline. Remaining: step 4 — user triggers dry runs of both dispatch-only
workflows.

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
- 2026-11-08 — **Chunk 3 done** (commit `7d4e25b`): `actions/setup-node` v4 → v7 in
  all 4 places (ci.yml ×1, release-github.yml ×1, publish-npm.yml ×2). Inputs in use
  — `node-version: 26` (×4) and `registry-url` (publish job ×1) — both unchanged in
  the v7.1.0 manifest. v5's automatic package-manager caching is inert: v6 limited
  it to npm, and we pass no `cache:` input, so net caching behavior is unchanged
  (none). v7's removal of the dummy `NODE_AUTH_TOKEN` export is inert: the publish
  job sets it explicitly per-step from `secrets.NPM_AUTH_TOKEN`. Scratch dry-run
  diff was exactly the 4 version lines; `actionlint` identical to the 2-finding
  baseline. Noted for a later follow-up: v7's docs recommend OIDC / Trusted
  Publisher for npm publish (direction of travel, not a v7 requirement). PR CI /
  dry-run verification deferred (local-only effort — verify on push).

- 2026-11-08 — **Chunk 4 done** (commit `0a8bdab`): `create-github-app-token`
  pinned to v3.3.0 + `client-id` adopted, in all 6 places (release-github.yml only,
  12 lines: 6 × `uses` + 6 × input rename). User-approved option (c):
  - **Current pin was v1.12.0**, not v1.0.0: already kebab-case, already revokes
    tokens (`post:` hook). v2's breaking changes (snake_case removal, required
    inputs) are N/A — we were already compliant, and revocation is unchanged.
  - **v3.1.0** added `client-id` and soft-deprecated `app-id` (log warning only).
    Verified in the v3.3.0 source: `clientId` is passed straight into
    `createAppAuth({ appId: clientId, ... })` — identical to `app-id`. The repo
    variable `CHUMPCHIEF_RELEASE_BOT_APP_ID` keeps its name.
  - **Why the exact pin:** the live `v3` tag moved to the v3.3.0 commit on 2026-10-12
    (tag → `64ab729`), but actionlint 1.7.12 consistently serves v3.0.0 metadata for
    `@v3` (stale; no local cache found). With `@v3` + `client-id` it reports 12 false
    findings; with `@v3.3.0` + `client-id` it fetches the correct fresh manifest and
    is clean (verified by probe files). Also: reproducible version for the action
    that mints release tokens. v3.3.0 is the latest release overall (no v4).
  - `actionlint` after bump: identical to the 2-finding baseline, zero
    app-token-related findings. All files byte-identical to the validated scratch.
  - Remaining verification (unchanged from plan): user's dispatch dry run after
    Chunk 5 exercises the `create_bump_branch`/`create_bump_pr` token steps; the
    `lock_branch`/`unlock_branch` steps are verified at the next real release.
- 2026-11-08 — **Chunk 5 done** (commit `8b65f33`): `actions/github-script` v7 → v9
  in all 11 places (release-github.yml ×7, publish-npm.yml ×4). Pure version-string
  bump. Audit re-run on the current files immediately before editing: the 5 external
  scripts use only the injected `{github, context, core, exec}` params; the 6 inline
  `require()` calls load local `.cjs` files or the `fs` builtin — none touch
  `@actions/github` (v9's only breaking change: the package became ESM-only, and
  `getOctokit` is an injected function param); zero `getOctokit` redeclarations.
  v7 and v9 `action.yml` are byte-identical for the inputs in use (`script`,
  `github-token`, `result-encoding`) and the `result` output (consumed by 6 job
  outputs); runtime node20 → node24. `@v9` resolves to v9.0.0 = latest release.
  Scratch dry-run diff exactly 11 lines; `actionlint` identical to the 2-finding
  baseline. Remaining: user-triggered dry runs of both dispatch-only workflows
  (first end-to-end pass of all the new majors together).
- 2026-11-08 — **Chunk 6 decision: ADOPT `pnpm/setup@v3` (variant B′)**, in all
  three workflows (4 setup pairs). Recorded before editing, per the chunk's
  procedure.
  - **Shape:** each `actions/setup-node@v7` + `pnpm/action-setup@v6` pair becomes
    one inputless step: `uses: pnpm/setup@v3` with `install: false` (existing
    explicit `pnpm i` steps stay byte-identical). The no-op `registry-url` on the
    publish job's setup-node step is dropped (confirmed no-op: npmjs is the
    default registry for both npm and pnpm; auth flows via the explicit per-step
    `NODE_AUTH_TOKEN` env; no workflow consumes the setup action's outputs).
  - **Node version source (B′):** the manifest. Prep commit `9d9e832` added
    `devEngines.runtime: { name: "node", version: "26", onFail: "warn" }` to the
    root `package.json` (CI reads it via the action's precedence order; locally
    pnpm 12.18 warns on mismatch without downloading — verified empirically)
    plus a `.node-version` file (`26`) for local version managers. No `runtime:`
    or `node-version-file:` inputs — the action's `pnpm runtime set` installs the
    declared runtime regardless of `onFail`.
  - **Why adopt:** the v6 README points to `pnpm/setup` as the successor; one
    step replaces two; the manifest becomes the single source of truth for both
    pnpm (`packageManager`) and Node (`devEngines.runtime`), consistent with the
    prep step.
  - **Accepted caveats:** `pnpm/setup` is younger (first public May 2026, v3.1.2
    Oct 2026); Node provenance in CI changes (action-managed runtime via `pnpm
    runtime set` instead of the runner's preinstalled node); `actionlint` 1.7.12
    has no registry metadata for `pnpm/setup` (cannot validate its inputs —
    verified by probe file), so input review is manual.
  - **Remaining verification (deferred per the no-push constraint):** PR CI run
    for ci.yml; user-triggered `workflow_dispatch` dry runs of
    `release-github.yml` and `publish-npm.yml` (supersedes the Chunk-5 dry runs
    as the final state).
- 2026-11-08 — **Chunk 6 done** (commit `9d847d0`, decision `c7e3274`, prep
  `9d9e832`): adopted `pnpm/setup@v3` in all 4 setup pairs (ci.yml ×1,
  release-github.yml ×1, publish-npm.yml ×2). Each pair → one step:
  `uses: pnpm/setup@v3` with `install: false`. Net −10 lines. The publish job's
  no-op `registry-url` is gone. All install/build/publish commands unchanged.
  - **Verification (local, per the no-push constraint):** `actionlint` = the
    2-finding baseline only (mergeInfo/tagInfo, now at lines 166/190 after the
    line shift), zero new findings. No residual `setup-node`/`action-setup`
    references in any workflow. Local proxy test of the action's core
    mechanism: `pnpm runtime set node 26 -g` (the exact internal step, reading
    `devEngines.runtime` from the repo manifest) into an isolated PNPM_HOME →
    node 26.13.0 downloaded; with `PNPM_HOME/bin` on PATH (as the action does),
    `node -v` → 26.13.0 and scripts run under the pinned runtime.
  - **Caveat on actionlint:** it has no registry metadata for `pnpm/setup`
    (probe-file verified), so the `install: false` input is not machine-checked;
    the diff was reviewed line-by-line instead.
  - **Remaining (deferred per the no-push constraint):** PR CI run for ci.yml;
    user-triggered `workflow_dispatch` dry runs of `release-github.yml` and
    `publish-npm.yml` — the first end-to-end pass of `pnpm/setup` in this repo,
    and of all new action majors together. All six chunks are now complete.
- 2026-11-08 — **Post-chunk polish (user-requested): pinned all actions to exact
  version tags** (commit `aaac88f`). 23 sites across the 3 workflows: checkout
  `@v7` → `@v7.0.1`, github-script `@v9` → `@v9.0.0`, `pnpm/setup` `@v3` →
  `@v3.1.2`; `create-github-app-token` was already at exact `@v3.3.0`. No
  floating tags remain.
  - **checkout v7.0.0 → v7.0.1:** the `v7` tag had drifted to v7.0.1
    (published 2026-07-20) after Chunk 1's bump — a benign patch (skip unsafe
    PR check when input is default, ascii whitespace trim for branch, escape
    `--unset` values, dep updates). Pinning to `@v7.0.1` both picks it up and
    prevents future drift.
  - **Why exact tags rather than commit SHAs:** this is a public repo using
    public actions — tag references run from GitHub's pre-validated,
    pre-packaged builds (trusted-publisher mechanism), while SHA pins run the
    action from source. Released version tags are never re-pointed, so exact
    tags give no-float pinning with pre-packaged execution and readable
    workflows. (SHA pinning remains the required choice if the repo ever goes
    private.)
  - `actionlint`: the 2-finding baseline only. All 23 changed lines are
    version-string-only.

## Branch review feedback — triage (2026-11-08)

A critical review of the completed branch was performed; the user triaged the
findings as follows. Dependency-side items (createBumpBranch.cjs pre-check,
react.mjs detect crash, non-dev dependency coverage) are triaged in
`DEPENDENCY-UPDATE-PLAN.md`.

1. **`devEngines.runtime.version: "26"` floats the CI Node minor** (pnpm/setup
   resolves "26" to the latest 26.x at run time): **keep floating** — the repo
   deliberately targets the latest Node LTS, so a minor float within the 26 line
   is intended, not an accident.
2. **Deferred verification**: the entire new workflow stack (checkout v7.0.1,
   pnpm/setup v3.1.2, app-token v3.3.0, github-script v9.0.0) has been verified
   by `actionlint` + local proxy tests only, never on a real runner. Note that
   `actionlint` lacks registry metadata for `pnpm/setup` (its `install: false`
   input was validated against the action's README instead). Triage: **noted,
   no action at this moment** — the PR's CI run and the two `workflow_dispatch`
   dry runs remain the end-to-end checks.
3. **The 2-finding `actionlint` baseline** (JSON-string `mergeInfo`/`tagInfo`
   outputs in release-github.yml): **noted, no action at this moment**. Fixing
   it (splitting the JSON-string job outputs into discrete outputs) would bring
   the repo to zero findings; deferred.
4. **Pre-existing workflow TODOs**: `unlock_branch` has no `if: always()` — a
   non-dry-run failure after `lock_branch` leaves the branch locked until manual
   intervention; plus the dist-tag "is this actually latest?" check, "use fewer
   external scripts", and "wait for CI of the merged PR". Triage: **noted, out
   of scope** for this branch.
5. **The `# pnpm ci is reserved` comments** (ci.yml, publish-npm.yml): now more
   load-bearing than when written (pnpm ≥ 11 made `pnpm ci` a built-in
   clean-install command) but still accurate. Triage: **noted, out of scope**.
6. **Handoff decisions**: history is **always squashed** (the mixed
   `chore:`/`deps:`/`ci:`/`docs:` commit subjects are therefore moot); the
   **branch name** is not a concern; **both plan files will be deleted before
   the PR — but not yet**.
