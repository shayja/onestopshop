# One-shot migration helper: converts each legacy */index.html into
# src/pages/*.astro on top of the Base layout. Not part of the build -
# delete after the migration lands.
import glob
import html
import json
import os
import re

HERO_SCRIPT = re.compile(r"<script>\s*\(function \(\) \{\s*var n = .*?</script>", re.S)

def meta_value(text, pattern):
    m = re.search(pattern, text, re.S)
    return " ".join(html.unescape(m.group(1)).split()) if m else None

def convert(src_path):
    text = open(src_path).read()
    slug = "" if src_path == "index.html" else src_path.split("/")[0]
    path = "/" if not slug else f"/{slug}/"

    title = meta_value(text, r"<title>(.*?)</title>")
    description = meta_value(text, r'name="description"\s+content="([^"]*)"')
    og_type = meta_value(text, r'property="og:type"\s+content="([^"]*)"')
    og_title = meta_value(text, r'property="og:title"\s+content="([^"]*)"')
    og_description = meta_value(text, r'property="og:description"\s+content="([^"]*)"')
    og_image_alt = meta_value(text, r'property="og:image:alt"\s+content="([^"]*)"')

    ld_blocks = re.findall(
        r'<script type="application/ld\+json">\s*(.*?)\s*</script>', text, re.S
    )
    hero = HERO_SCRIPT.search(text)

    body_start = text.index("</nav>") + len("</nav>")
    body_end = text.index("<footer>")
    body = text[body_start:body_end].strip("\n").rstrip()
    # legacy pages indent body content 4 spaces under <body>; keep as-is
    if "<style" in body or "<script" in body:
        raise SystemExit(f"{src_path}: unexpected <style>/<script> in body")

    variant = {"index.html": "home", "website-packages/index.html": "packages"}.get(
        src_path, "article"
    )
    wa_float = variant in ("home", "packages")

    def js(s):
        return json.dumps(s, ensure_ascii=False)

    props = [f"title={{{js(title)}}}"]
    props.append(f"description={{{js(description)}}}")
    props.append(f'path="{path}"')
    props.append(f'ogType="{og_type}"')
    props.append(f"ogTitle={{{js(og_title)}}}")
    props.append(f"ogDescription={{{js(og_description)}}}")
    default_alt = "One Stop Shop - בניית אתרים, אפליקציות ואוטומציה לעסקים"
    if og_image_alt != default_alt:
        props.append(f"ogImageAlt={{{js(og_image_alt)}}}")
    if variant != "article":
        props.append(f'variant="{variant}"')
    if wa_float:
        props.append("waFloat={true}")

    lines = ["---", 'import Base from "../layouts/Base.astro";']
    for i, block in enumerate(ld_blocks):
        if "`" in block or "${" in block:
            raise SystemExit(f"{src_path}: JSON-LD contains template-literal chars")
        lines.append(f"const ld{i} = String.raw`{block}`;")
    lines.append("---")
    lines.append("")
    lines.append(f"<Base\n  " + "\n  ".join(props) + "\n>")
    head_parts = []
    for i in range(len(ld_blocks)):
        head_parts.append(
            f'    <script type="application/ld+json" set:html={{ld{i}}} />'
        )
    if head_parts:
        lines.append('  <Fragment slot="head">')
        lines.extend(head_parts)
        lines.append("  </Fragment>")
    if hero:
        # the hero preload script sits after theme-color in the legacy head
        lines.append('  <Fragment slot="head-late">')
        lines.append(
            "    " + hero.group().replace("<script>", "<script is:inline>", 1)
        )
        lines.append("  </Fragment>")
    lines.append(body)
    lines.append("</Base>")

    out = "src/pages/index.astro" if not slug else f"src/pages/{slug}.astro"
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w") as f:
        f.write("\n".join(lines) + "\n")
    return out

SKIP = ("dist/", "public/", "node_modules/", "src/")
pages = sorted(["index.html"] + glob.glob("*/index.html"))
for p in pages:
    if p.startswith(SKIP):
        continue
    print(convert(p))
