# Project notes

The World Media website is built as Framer code components: sources in `framer/world-media/src/`, built by `framer/world-media/build.py` into `framer/world-media/dist/`, then uploaded to Framer. The owner is not a coder, so explain changes in plain language.

## Which skill to lead with

Pick by the kind of work; combine them when a task spans several rows.

| Work | Lead with | Also use |
|---|---|---|
| A new page or section from scratch, or a redesign | `design-for-ai` (research → plan → mock → build) | `web-design-guidelines` to review the result |
| A single visual decision: colours, type, spacing, layout | `bencium-controlled-ux-designer` | — |
| Reviewing an existing design for accessibility or UX | `web-design-guidelines` | `bencium-controlled-ux-designer` for fixes |
| Writing or refactoring component code | `vercel-react-best-practices` | `vercel-composition-patterns` for component structure |
| Page transitions and enter/exit animation | `vercel-react-view-transitions` | — |
| Site copy and microcopy | `writing-guidelines` | — |
| Charts or data displays | `dataviz` | — |

When the owner names a skill, use that one. When skills disagree, `bencium-controlled-ux-designer`'s rule wins: ask before making colour, font, layout or spacing decisions, but ask once per decision rather than per detail.

Not for this project: the site is hosted on Framer, so `deploy-to-vercel`, `vercel-cli-with-tokens` and `vercel-optimize` don't apply, and `vercel-react-native-skills` is for phone apps.
