"""Check ordered conversion sections on all generated companion landing pages."""
from pathlib import Path
from html.parser import HTMLParser
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
SLUGS = json.loads((ROOT / "data/landing-copy.json").read_text(encoding="utf-8"))
ORDER = ["trust","problem","solution","explore","how","voices","pricing","faq","connect"]

class Inspect(HTMLParser):
    def __init__(self):
        super().__init__()
        self.sections = []
        self.ids = set()
        self.links = []
        self.stylesheets = []
        self.hero = 0
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            if tag == "section": self.sections.append(a["id"])
            self.ids.add(a["id"])
        if tag == "section" and "hero" in (a.get("class") or "").split(): self.hero += 1
        if tag == "a" and a.get("href"): self.links.append(a["href"])
        if tag == "link" and a.get("rel") == "stylesheet": self.stylesheets.append(a.get("href"))

def main():
    problems = []
    for slug in SLUGS:
        path = ROOT / slug / "index.html"
        parser = Inspect()
        if not path.exists():
            problems.append(f"{slug}: page missing")
            continue
        parser.feed(path.read_text(encoding="utf-8"))
        actual = [x for x in parser.sections if x in ORDER]
        if actual != ORDER: problems.append(f"{slug}: section order mismatch {actual}")
        if parser.hero != 1: problems.append(f"{slug}: expected one hero, got {parser.hero}")
        if "../assets/landing-sections.css" not in parser.stylesheets: problems.append(f"{slug}: landing stylesheet not linked")
        for href in parser.links:
            if href.startswith("#") and href != "#" and href[1:] not in parser.ids:
                problems.append(f"{slug}: broken local anchor {href}")
        if "<form" in path.read_text(encoding="utf-8").lower():
            problems.append(f"{slug}: unexpected native form; confirm backend & consent")
    if problems:
        print("\n".join(problems), file=sys.stderr)
        return 1
    print(f"PASS: {len(SLUGS)} brand landing pages, ordered sections and local anchor targets")
    return 0
if __name__ == "__main__": raise SystemExit(main())
