# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

`goodbetter-ai-lab` is a lab repository for AI tool development and content management. It is in early/planning stage with no application code yet. Documentation is primarily written in Japanese.

## Directory Structure

| Path | Purpose |
|------|---------|
| `docs/` | Design documents, strategy notes, ideas, and prompts (設計・戦略・メモ) |
| `docs/content/` | SNS and note publishing management (SNS・note・発信管理) |
| `apps/` | Planned directory for AI tools and app development — does not exist yet |

### Planned apps/ contents (from notes)
- キャンプAI診断 (Camp AI diagnosis tool)
- 便利ツール (Utility tools)

## Git Conventions

Commit messages observed in this repo follow a short, descriptive English pattern:
```
Create docs directory for app development tools
Add initial README content for documentation
```

When creating new directories, add a `README.md` inside them describing the folder's purpose (in Japanese if consistent with surrounding files).

## Development Stage

There are no build scripts, package managers, test runners, or lint configurations in this repository yet. When `apps/` is created and code is added, this file should be updated to reflect those workflows.
