# Interface Artifacts

**At the start of every session, read `docs/design-spec.md` in full before making any changes.** It is the single source of truth for all design decisions, architecture, visual tokens, and build conventions. Do not proceed without reading it.

## Quick rules
- One change per prompt. Test between each.
- Visuals first, logic second for new levels.
- Don't modify files you weren't asked to touch.
- Always: `git add -A && git commit -m "msg" && git push`
- The museum layer (shared UI) and artifact layer (era-specific) never cross-contaminate styles.
