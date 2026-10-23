# AGENTS

Concise guidance for coding agents. **Do not turn this file into a manual.**

## Product

WordPress plugin: large set of Gutenberg blocks and related editor/settings UI (`GhostKit_*` classes).

## Stack

- PHP, WPCS
- React + `@wordpress/scripts`, SCSS
- Blocks and editor code: `gutenberg/`; PHP services: `classes/`; admin/settings as structured in repo; `build/` is compiled.

## Rules

- Prefer minimal, localized changes; match existing Ghost Kit patterns.
- WordPress: sanitize/escape; verify nonces and capabilities for privileged flows.
- Confirm script names in `package.json` before running builds or linters.

## Tests

- Ghost Kit Pro's CI runs these E2E specs with Pro active (`CORE=true`, this repo as its `core-plugin` submodule). A test that asserts what free shows without Pro must skip itself when `process.env.CORE` is set.
- A locator must still find the same element when Pro adds content. Pro adds icon packs, so the icon picker's pack filter becomes a select, and its `<option>` elements match `getByRole('option')` before the grid does.

## Commands

Defined in `package.json` (e.g. `npm run dev`, `npm run build`, lint, env, e2e). Use those exact names.
