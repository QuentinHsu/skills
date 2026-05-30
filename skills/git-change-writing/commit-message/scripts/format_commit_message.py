#!/usr/bin/env python3
"""Normalize Conventional Commit message spacing.

This script intentionally does not invent content. It only makes section and
bullet spacing deterministic before preview output or `git commit`.
"""

from __future__ import annotations

import argparse
import re
import sys


FOOTER_RE = re.compile(r"^(BREAKING CHANGE|[A-Za-z][A-Za-z0-9-]*):\s+\S")


def is_blank(line: str) -> bool:
    return line.strip() == ""


def is_bullet(line: str) -> bool:
    return line.startswith("- ")


def is_footer(line: str) -> bool:
    return bool(FOOTER_RE.match(line))


def trim_outer_blank_lines(lines: list[str]) -> list[str]:
    while lines and is_blank(lines[0]):
        lines.pop(0)
    while lines and is_blank(lines[-1]):
        lines.pop()
    return lines


def next_nonblank(lines: list[str], start: int) -> str | None:
    for line in lines[start:]:
        if not is_blank(line):
            return line
    return None


def previous_nonblank(out: list[str]) -> str | None:
    for line in reversed(out):
        if not is_blank(line):
            return line
    return None


def normalize_commit_message(text: str) -> str:
    lines = [line.rstrip() for line in text.replace("\r\n", "\n").replace("\r", "\n").split("\n")]
    lines = trim_outer_blank_lines(lines)
    if not lines:
        return ""

    header = lines[0]
    rest = trim_outer_blank_lines(lines[1:])
    if not rest:
        return f"{header}\n"

    normalized_rest: list[str] = []
    for index, line in enumerate(rest):
        if not is_blank(line):
            normalized_rest.append(line)
            continue

        prev_line = previous_nonblank(normalized_rest)
        next_line = next_nonblank(rest, index + 1)
        if prev_line is None or next_line is None:
            continue

        # Body bullets are always single-spaced. Empty lines between adjacent
        # bullets are formatting defects, not section separators.
        if is_bullet(prev_line) and is_bullet(next_line):
            continue

        # Keep one blank line before footers/trailers, and collapse any other
        # repeated blank run to a single separator.
        if normalized_rest and not is_blank(normalized_rest[-1]):
            normalized_rest.append("")

    normalized_rest = trim_outer_blank_lines(normalized_rest)

    # If a footer immediately follows bullet body content, restore the required
    # section separator even when the draft omitted it.
    with_footer_spacing: list[str] = []
    for line in normalized_rest:
        if (
            is_footer(line)
            and with_footer_spacing
            and not is_blank(with_footer_spacing[-1])
            and is_bullet(previous_nonblank(with_footer_spacing) or "")
        ):
            with_footer_spacing.append("")
        with_footer_spacing.append(line)

    with_footer_spacing = trim_outer_blank_lines(with_footer_spacing)
    return f"{header}\n\n" + "\n".join(with_footer_spacing) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("file", nargs="?", help="message file to normalize; reads stdin when omitted")
    args = parser.parse_args()

    if args.file:
        with open(args.file, "r", encoding="utf-8") as handle:
            text = handle.read()
    else:
        text = sys.stdin.read()

    sys.stdout.write(normalize_commit_message(text))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
