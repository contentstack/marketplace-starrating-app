## Developer Ecosystem workflow (read first)

This repo belongs to a Developer Ecosystem pod (DevEx: MCP, CLI, SDK, Starters including the SAP connector; Marketplace; Mkt Apps; Developer Hub).
New features and changes go through the deveco workflow before any code is written here:

1. Find the work's DSCDX idea and where it is in the flow. No idea yet: write one with the `brief` skill in `contentstack/product-wiki`.
2. The PRD, TRD, test cases, tickets and code come from your own routines (PM, Architect, QA agent, Dev), gate by gate. Do not plan, draft or build them in this session. No routine for a step yet: set it up with the `deveco-aisdlc-onboarding` skill in `contentstack/agent-skills`.
3. The order, gates and intake: https://github.com/contentstack/agent-skills/blob/main/skills/deveco-aisdlc-onboarding/references/run-protocol.md

Bug fixes and support cases keep this repo's usual path. Not sure which applies? Ask before building.

## This repo

Star Ratings: a Marketplace custom field (Tier 1, UI-only) that saves `{ "value": 0–5 }` in half-star steps. Wiki: `marketplace-apps/starrating/` in `contentstack/product-wiki` (start with `features.md` for the spec, `debugging.md` for known drift).

| Task | Command (Node 24) |
|---|---|
| Install | `npm ci` |
| Run locally | `npm run dev` (http://localhost:3000; the field only renders inside Contentstack) |
| Lint / typecheck | `npm run lint` · `npm run typecheck` |
| Unit tests | `npm test` · `npm run test:coverage` (fails under 90%) |
| Build | `npm run build` (output `dist/`; leaves the tree clean) |

- Tests are Vitest specs next to the code (`*.spec.tsx`). Expected values come from the spec, not from running the code.
- The in-repo Playwright suite (`e2e/`) is moving to `contentstack/e2e-marketplace-playwright` (MKT-19707); don't extend it here.
- Branches `claude/<type>/<KEY>-<slug>`, conventional commits (commitlint), PRs into `main`.
