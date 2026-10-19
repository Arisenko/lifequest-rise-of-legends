from pathlib import Path
from PIL import Image
import json

root = Path(__file__).resolve().parents[1]
assets = root / "public/assets"
entries = {}
original_bytes = 0
optimized_bytes = 0
for directory in ("brand", "items", "characters/classes"):
    for source in (assets / directory).glob("*.png"):
        target = source.with_suffix(".webp")
        with Image.open(source) as image:
            image = image.convert("RGBA")
            image.save(target, "WEBP", quality=88, method=6)
        if target.stat().st_size >= source.stat().st_size:
            target.unlink()
            continue
        entries["/assets/" + str(source.relative_to(assets))] = "/assets/" + str(target.relative_to(assets))
        original_bytes += source.stat().st_size
        optimized_bytes += target.stat().st_size
(root / "src/data/optimizedAssets.json").write_text(json.dumps(entries, indent=2) + "\n")
print(json.dumps({"files": len(entries), "original_bytes": original_bytes, "optimized_bytes": optimized_bytes}))
