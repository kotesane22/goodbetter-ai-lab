#!/usr/bin/env python3
"""Content save utilities for the AI employee."""

import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent.parent
OUTPUT = ROOT / "output"


def _save(subdir: str, filename_prefix: str, content: str) -> str:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    slug = filename_prefix.replace(" ", "_")[:40]
    filepath = OUTPUT / subdir / f"{timestamp}_{slug}.md"
    filepath.parent.mkdir(parents=True, exist_ok=True)
    filepath.write_text(content, encoding="utf-8")
    return str(filepath)


def save_x_post(topic: str, content: str) -> str:
    return _save("x_posts", topic, content)


def save_note_draft(title: str, content: str) -> str:
    return _save("note_drafts", title, content)


def save_research(topic: str, content: str) -> str:
    return _save("research", topic, content)


COMMANDS = {
    "x_post": save_x_post,
    "note": save_note_draft,
    "research": save_research,
}

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: writer.py <x_post|note|research> <topic/title> <content>")
        print("\nOutput directories:")
        for subdir in ["x_posts", "note_drafts", "research"]:
            print(f"  {OUTPUT / subdir}")
        sys.exit(0)

    cmd, name, body = sys.argv[1], sys.argv[2], sys.argv[3]
    if cmd not in COMMANDS:
        print(f"Unknown command: {cmd}. Choose from: {', '.join(COMMANDS)}")
        sys.exit(1)

    path = COMMANDS[cmd](name, body)
    print(f"Saved: {path}")
