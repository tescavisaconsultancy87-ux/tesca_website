"""
Convert large statically-referenced PNGs to WebP and rewrite their references
in src/. Originals are KEPT (not deleted) so a missed reference can never 404.
Excludes Tesca_logo.png (logo/favicon, needs PNG) and DB-managed folders
(universities/, bank/) which are referenced dynamically.

Run from project root:  python scripts/optimize_images.py
"""
import os
import glob
from PIL import Image

QUALITY = 82
SRC_EXTS = (".astro", ".ts", ".tsx", ".js", ".jsx", ".md")

# Build the conversion target list (top-level images + hero), excluding the logo.
targets = []
for p in glob.glob("public/images/*.png"):
    if os.path.basename(p) == "Tesca_logo.png":
        continue
    targets.append(p)
targets += glob.glob("public/images/Hero/*.png")

total_old = total_new = 0
ref_map = {}  # "/images/foo.png" -> "/images/foo.webp"

for p in sorted(targets):
    webp = p[:-4] + ".webp"
    img = Image.open(p)
    img = img.convert("RGBA") if img.mode in ("RGBA", "LA", "P") else img.convert("RGB")
    img.save(webp, "WEBP", quality=QUALITY, method=6)
    old, new = os.path.getsize(p), os.path.getsize(webp)
    total_old += old
    total_new += new
    rel = "/" + os.path.relpath(p, "public").replace("\\", "/")
    ref_map[rel] = rel[:-4] + ".webp"
    print(f"  {old//1024:5d}KB -> {new//1024:5d}KB   {rel}")

print(f"\nIMAGES: {total_old/1048576:.1f}MB -> {total_new/1048576:.1f}MB "
      f"({100*(1-total_new/total_old):.0f}% smaller)\n")

# Rewrite references in source files (exact-path replacement).
changed_files = 0
for root, _, files in os.walk("src"):
    for fn in files:
        if not fn.endswith(SRC_EXTS):
            continue
        fp = os.path.join(root, fn)
        with open(fp, "r", encoding="utf-8") as f:
            text = f.read()
        new_text = text
        for old_ref, new_ref in ref_map.items():
            new_text = new_text.replace(old_ref, new_ref)
        if new_text != text:
            with open(fp, "w", encoding="utf-8") as f:
                f.write(new_text)
            changed_files += 1
            print(f"  updated refs in {fp}")

print(f"\nDone. {len(ref_map)} images converted, {changed_files} source files updated.")
print("Originals kept. After visual verification, delete originals with:")
print("  find public/images -maxdepth 2 -name '*.png' ! -name 'Tesca_logo.png' -delete")
