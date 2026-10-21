# Genera imágenes Open Graph (1200x630 JPG) a partir de las imágenes de src/img/. Correr cuando lleguen imágenes nuevas.
import os, sys
from PIL import Image, ImageOps
base = os.path.join(os.path.dirname(__file__), "..", "src", "img")
out = os.path.join(base, "og"); os.makedirs(out, exist_ok=True)
n = 0
for f in sorted(os.listdir(base)):
    if not f.endswith(".webp") or f.endswith("-600.webp"): continue
    dst = os.path.join(out, f[:-5] + ".jpg")
    if os.path.exists(dst) and os.path.getmtime(dst) > os.path.getmtime(os.path.join(base, f)): continue
    im = Image.open(os.path.join(base, f)).convert("RGB")
    ImageOps.fit(im, (1200, 630), Image.LANCZOS, centering=(0.5, 0.3)).save(dst, "JPEG", quality=82, optimize=True, progressive=True)
    n += 1
print("og generadas:", n)
