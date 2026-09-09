# Migration verification: diff legacy HTML against dist/ output after
# normalizing the differences we intend (hashed assets, whitespace).
# Delete along with migrate-pages.py once the migration lands.
import difflib
import glob
import html
import re
import sys

def normalize(text, is_new):
    # unify the css/js references we intentionally changed
    text = re.sub(r'<link rel="stylesheet" href="/?styles\.css[^"]*"\s*/?>', "<CSS>", text)
    text = re.sub(r'<link rel="stylesheet" href="/_astro/[^"]*"\s*/?>', "<CSS>", text)
    text = re.sub(r'<script src="/script\.js[^"]*" defer(="")?\s*></script>', "<JS>", text)
    text = re.sub(r'<script type="module" src="/_astro/[^"]*"\s*></script>', "<JS>", text)
    # vite inlines the small site script as an inline module (same behavior,
    # one request fewer); treat it as the script.js reference
    text = re.sub(r'<script type="module">.*?</script>', "<JS>", text, flags=re.S)
    # accepted drift fix: packages wa-float svg gains aria-hidden like index's
    text = text.replace(
        '<svg class="icon-wa" focusable="false">',
        '<svg class="icon-wa" aria-hidden="true" focusable="false">',
    )
    # normalize JSON-LD blocks to parsed-and-redumped form
    def ld(m):
        import json
        return "<LD>" + json.dumps(json.loads(m.group(1)), ensure_ascii=False, sort_keys=True) + "</LD>"
    text = re.sub(r'<script type="application/ld\+json">(.*?)</script>', ld, text, flags=re.S)
    # index.html uses relative asset urls; new output uses absolute - same target at /
    text = re.sub(r'(href|src)="(?!https?:|/|#|data:)', r'\1="/', text)
    # drop whitespace between tags, collapse the rest
    text = re.sub(r">\s+<", "><", text)
    text = re.sub(r"\s+", " ", text)
    # attribute-order/entity-insensitive-ish: unescape entities in text runs
    text = html.unescape(text)
    # boolean attribute spelling: crossorigin vs crossorigin=""
    text = text.replace('crossorigin=""', "crossorigin").replace('defer=""', "defer")
    # self-closing vs void-tag spelling
    text = re.sub(r"\s*/>", ">", text)
    # accepted equivalences: doctype case, explicit svg close tags,
    # title whitespace, stylesheet position within head
    text = text.replace("<!DOCTYPE", "<!doctype")
    text = text.replace(" >", ">")
    # childless svg elements: self-closing vs explicit close tag
    text = text.replace("</path>", "").replace("</use>", "")
    text = re.sub(r"<title>\s*(.*?)\s*</title>", r"<title>\1</title>", text)
    assert text.count("<CSS>") == 1, "expected exactly one stylesheet link"
    text = text.replace("<CSS>", "")
    return text.strip()

fail = 0
for old in sorted(["index.html"] + glob.glob("[a-z]*/index.html")):
    if old.startswith(("dist/", "node_modules/", "public/", "scripts/", "src/")):
        continue
    new = "dist/" + ("index.html" if old == "index.html" else old)
    a = normalize(open(old).read(), False)
    b = normalize(open(new).read(), True)
    if a == b:
        print(f"OK   {old}")
        continue
    fail += 1
    print(f"DIFF {old}")
    # char-level context for the first few differences
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    shown = 0
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal" or shown >= 4:
            continue
        shown += 1
        print(f"  old[{i1}:{i2}]: …{a[max(0,i1-60):i2+60]}…")
        print(f"  new[{j1}:{j2}]: …{b[max(0,j1-60):j2+60]}…")
print("FAILURES:", fail)
sys.exit(1 if fail else 0)
