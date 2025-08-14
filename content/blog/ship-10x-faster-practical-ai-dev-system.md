# Ship 10x Faster: A Practical System for AI-Accelerated Development

## Who this guide is for and what “10x” really means

“10x” isn’t magic. It’s about compressing the plan → implement → test loop so you ship value faster and with fewer stalls.

- **A realistic baseline**: a developer might write ~100 lines of code per hour on average. For suitable tasks, AI can generate 1,000–5,000 lines per hour. But that raw output isn’t the full story—some of that time will be spent fixing mistakes, refactoring poor solutions, or steering the AI away from dead ends. Net acceleration varies widely by task and context.
- **Where AI excels**: tests, HTML/CSS, content/copy, simple CRUD and glue code, scaffolding repetitive patterns.
- **Where AI struggles**: complex architectural changes, nuanced framework integration, non‑trivial library usage, and debugging rare or novel issues.
- **Developers remain essential**: architecture, key decisions, correctness, integrating frameworks and libraries, fixing rare or new bugs, and overall quality.

This playbook shows you how to harness the speed while keeping control over design and quality.

## Step 1: Plan the system

Use Claude Sonnet 4 to plan before you code: short docs you’ll reuse.

- Architecture doc (one page: goals, constraints, modules, data flow, deps, risks, rollout)
- Coding guidelines (naming, module boundaries, error handling, logging, behavior‑first tests)

```text
Help me plan the architecture for this app. Ask me questions and propose solutions. At the end output ARCHITECTURE.md.
```

```text
Create CODING_GUIDELINES.md for this repo. Ask a few preference questions; then write the doc.
```

## Step 2: Brand and narrative

Use ChatGPT to establish brand direction and repo‑ready assets.

```text
Help me find the brand persona and archetype for my app. Ask questions, then propose 2–3 options.
```

```text
Create a BRAND.md with color palette (hex), typography, UI tokens, and voice/tone. Keep it practical.
```

After exporting UI from v0 (next step), apply branding:

```text
Apply BRAND.md colors/typography to the v0 scaffold. Update tokens/theme and base components. Show small diffs only.
```

## Step 3: UI foundation with v0

Use v0 for a fast UI baseline. Export what’s useful and stop there.

- Great at: layout, components, styles
- Weak at: complex state, non‑trivial libs, cross‑file refactors
- Anti‑loop: extract UI → rebuild logic in repo with Cursor + Claude Sonnet 4

```text
Generate a clean UI scaffold, export code/assets, no state/data. Extract tokens (colors/spacing/typography). I’ll wire logic in the repo.
```

## Step 4: Set up your repo and IDE

Use Cursor for tight feedback loops and pin Claude Sonnet 4 for coding. Verify the active model at session start; some tools may fall back to smaller models. Claude Code is typically stricter about staying on Sonnet 4.

```text
Summarize key rules from ARCHITECTURE.md and CODING_GUIDELINES.md into a very short list for IDE rules/memory.
```

## Step 5: Build features in small loops

Run plan → implement → test/fix for every feature. Keep edits tiny and reviewable. Ask for options before code; define acceptance criteria; avoid “god modules.”

```text
For <feature>, give 2–3 approaches with trade‑offs; recommend one.
```

```text
Propose a minimal edit to implement the chosen approach. Show the diff only.
```

```text
Write behavioral tests for <feature> based on these acceptance criteria.
```

## Step 6: Debugging when things stall

Reproduce, isolate, instrument, and escalate quickly to a targeted web search if loops start.

1) Minimal repro with exact errors and versions
2) Short plan with checks per step
3) Keep diffs small and reversible; roll back if needed
4) Lock fixes with tests; record the root cause

```text
Minimal repro in <AREA>: <steps/code>. Error: <...>. Versions: <...>.
Propose a 3–5 step plan with checks per step; keep diffs small/reversible. If stuck, give an exact search query and expected answer shape.
```

## Step 7: Persist decisions and knowledge

Keep one lightweight source of truth in the repo; mirror key rules in IDE memory.

- Docs: `ARCHITECTURE.md`, `CODING_GUIDELINES.md`, `DECISIONS.md`
- Contents: constraints, dependencies, module boundaries, testing policy, chosen patterns
- Policy: pin Claude Sonnet 4; verify model at session start

```text
Append the decisions from this feature to DECISIONS.md (one paragraph). Update guidelines if needed.
```

## Step 8: Cost strategy and model choice

- Minimum spend: Cursor only, explicitly on Claude Sonnet 4
- Add Claude Code if you see fallbacks or need longer planning sessions
- Use v0 free for the initial UI; stop paying when you switch to your repo
- Reduce token waste: small edits, reusable context docs

## Conclusion + next steps

“10x” comes from tighter loops and better leverage, not from skipping engineering. Use v0 for a fast UI start, keep Claude Sonnet 4 for planning and code changes, and run the plan → implement → test loop in small increments. Developers remain critical for architecture, integration, correctness, and quality.

Next steps: apply this system to a small but end‑to‑end feature (e.g., an authenticated CRUD page). Draft the plan, pick an approach, implement in small edits with tests, and capture the decisions in your guidelines.


