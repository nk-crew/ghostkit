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

## Commands

Defined in `package.json` (e.g. `npm run dev`, `npm run build`, lint, env, e2e). Use those exact names.
