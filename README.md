# PatchHive

PatchHive is a desktop-first multi-agent workspace for open-source contribution work. It gives each agent a clear specialty, keeps evidence attached to every decision, and leaves risky edits or maintainer communication behind explicit human approval gates.

## Why PatchHive

Most multi-agent demos stop at chat bubbles. PatchHive is aimed at real contribution workflows:

- issue triage
- repository understanding
- review simulation
- patch planning
- test generation
- maintainer handoff

The product idea is simple: let multiple agents work in parallel, but keep the process structured, inspectable, and human-led.

## Current MVP

This first version is a product prototype built with React, TypeScript, and Vite. It showcases:

- a mission-based workspace with reusable presets
- parallel agent lanes for planning, repo reading, review, patching, and testing
- timeline checkpoints and next-action prompts
- evidence cards tied to files, logs, and decisions
- human approval gates before risky handoffs
- a maintainer-facing outputs panel

The interface currently ships with three example missions:

1. `PR Rescue`
2. `Issue Intake`
3. `Release Brief`

## Product Direction

PatchHive is designed around five principles:

- specialization over generic agent chatter
- evidence before action
- human approval for meaningful risk
- maintainers need concise handoffs, not noisy transcripts
- workflows should feel good on desktop and remain usable on mobile

## Stack

- React 19
- TypeScript
- Vite
- hand-authored CSS

## Run Locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

## Roadmap

- add a real mission composer instead of static presets
- persist mission state locally
- attach repository files and issue links as live evidence
- support pluggable model providers
- add replayable activity logs and exportable handoff summaries
- explore a Tauri desktop shell

## Repo Status

This repository used to contain a small lottery page. It has now been reset and rebuilt around a new product direction: a serious multi-agent collaboration tool for software contribution workflows.
