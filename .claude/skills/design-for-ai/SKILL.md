---
name: design-for-ai
description: "Design workflow from the design-for-ai plugin (v4.2.0, MIT, github.com/ryanthedev/design-for-ai at commit 37d7ae6), saved in this repository because plugins don't load in cloud sessions: research → plan → mock → build, plus prototype mockups. Use when the user asks to research, plan, mock up, prototype or build a design with design-for-ai, or types /design-for-ai."
argument-hint: "[research|plan|mock|build|prototype] [brief or file path]"
---

# design-for-ai (saved copy of the plugin)

The plugin's files live in `.claude/design-for-ai/` at the repository root. Its two subagents, `design-build-agent` and `design-review-agent`, are in `.claude/agents/`.

## Run a stage

The first word of `$ARGUMENTS` picks the stage; pass the rest on as that stage's `$ARGUMENTS`.

| Stage | Read and follow |
|---|---|
| research | `.claude/design-for-ai/commands/research.md` |
| plan | `.claude/design-for-ai/commands/plan.md` |
| mock | `.claude/design-for-ai/commands/mock.md` |
| build | `.claude/design-for-ai/commands/build.md` |
| prototype | `.claude/design-for-ai/skills/prototype/SKILL.md` |

With no stage given, ask which one; a new idea starts with research.

## Reading the plugin's files

- `${CLAUDE_PLUGIN_ROOT}` is `.claude/design-for-ai`. In commands, docs and agents, relative paths starting with `docs/`, `scripts/`, `references/` or `skills/` resolve against that folder.
- Inside a skill (`.claude/design-for-ai/skills/<name>/SKILL.md`), `${CLAUDE_SKILL_DIR}` and relative `references/` or `examples/` paths resolve against that skill's own folder.
- `.design-foundations/` paths are the project's working files at the repository root.
- `Skill(<name>)` means: read `.claude/design-for-ai/skills/<name>/SKILL.md` and follow it.
- `/design-for-ai:<stage> …` means: run that stage of this skill (`/design-for-ai <stage> …`).
- Where the plugin's git steps (worktrees, new branches, `git add .`) conflict with the session's git instructions, the session's instructions win.
