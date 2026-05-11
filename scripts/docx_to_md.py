"""Convert all .docx under a root directory to .md next to each source file.

Requires: pip install mammoth markdownify
"""
from __future__ import annotations

import sys
from pathlib import Path

import mammoth
from markdownify import markdownify as html_to_md


def convert_docx(docx_path: Path) -> None:
    md_path = docx_path.with_suffix(".md")
    with docx_path.open("rb") as f:
        result = mammoth.convert_to_html(f)
    if result.messages:
        for msg in result.messages:
            print(f"  [{docx_path.name}] {msg}", file=sys.stderr)
    md = html_to_md(result.value, heading_style="ATX", bullets="-")
    md_path.write_text(md.strip() + "\n", encoding="utf-8")
    print(f"Wrote {md_path}")


def main() -> int:
    root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
    docx_files = sorted(root.rglob("*.docx"))
    if not docx_files:
        print(f"No .docx files under {root}", file=sys.stderr)
        return 1
    for p in docx_files:
        convert_docx(p)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
