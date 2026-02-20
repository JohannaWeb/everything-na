# OpenClaw Personal Workspace

A structured, versioned workspace for running a persistent OpenClaw assistant.

## Purpose

This repository is not an app codebase yet — it is the assistant's **operating environment**:

- behavior and safety rules
- identity and user context
- short-term and long-term memory files
- heartbeat/task automation checklist

## Architecture

### 1) Behavior / Policy Layer
- `AGENTS.md` — operational rules for every session (boot order, memory habits, safety boundaries)
- `SOUL.md` — assistant personality and interaction style

### 2) Identity & Human Context Layer
- `IDENTITY.md` — who the assistant is
- `USER.md` — who the assistant helps and user preferences
- `TOOLS.md` — local environment notes (camera names, hosts, voice prefs, etc.)

### 3) Memory Layer
- `MEMORY.md` — curated long-term memory (important durable facts)
- `memory/YYYY-MM-DD.md` — daily raw notes / session logs
- `memory/heartbeat-state.json` — optional state for recurring checks

### 4) Runtime State Layer
- `.openclaw/workspace-state.json` — bootstrap/runtime metadata

### 5) Automation Layer
- `HEARTBEAT.md` — optional recurring checks; empty means no periodic work

## Repository Layout

- `AGENTS.md`
- `SOUL.md`
- `USER.md`
- `IDENTITY.md`
- `TOOLS.md`
- `HEARTBEAT.md`
- `MEMORY.md`
- `memory/`
- `scripts/validate-workspace.ps1`
- `.gitignore`

## Quick Start

1. Fill `IDENTITY.md` and `USER.md`
2. Add meaningful entries to `MEMORY.md`
3. Log important session context in `memory/YYYY-MM-DD.md`
4. Optionally add heartbeat tasks in `HEARTBEAT.md`
5. Run validation:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\validate-workspace.ps1
```

## Validation

The workspace validator checks:
- required root files exist
- `memory/` exists
- today's memory note exists (or warns)
- whether `BOOTSTRAP.md` still exists

It exits with non-zero only on missing required core files.

## Evolving This Repo

When you start adding code/services, create:
- `src/` for implementation
- `tests/` for automated tests
- CI workflow for lint/test checks
- release/versioning notes

Until then, this repo remains a high-quality assistant workspace foundation.
