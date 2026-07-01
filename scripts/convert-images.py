"""Convert JPEG/JPG images to WebP (~150KB max) and emit dimension manifest."""
import json
from pathlib import Path

from PIL import Image

IMAGES_DIR = Path(__file__).resolve().parent.parent / "images"
TARGET_BYTES = 150 * 1024


def to_webp(src_path: Path) -> dict:
    img = Image.open(src_path)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    width, height = img.size
    out_path = IMAGES_DIR / f"{src_path.stem}.webp"
    quality = 85
    scale = 1.0
    best = None

    for _ in range(30):
        trial = img
        if scale < 1.0:
            nw = max(1, int(width * scale))
            nh = max(1, int(height * scale))
            trial = img.resize((nw, nh), Image.Resampling.LANCZOS)

        trial.save(out_path, "WEBP", quality=quality, method=6)
        size = out_path.stat().st_size

        if size <= TARGET_BYTES:
            best = (trial.size, size, quality, scale)
            break

        if quality > 30:
            quality -= 5
        else:
            scale *= 0.9
            quality = 80

    if best is None:
        trial.save(out_path, "WEBP", quality=20, method=6)
        best = (trial.size, out_path.stat().st_size, 20, scale)

    dims, size, quality, scale = best
    return {
        "original": src_path.name,
        "webp": out_path.name,
        "width": dims[0],
        "height": dims[1],
        "webp_bytes": size,
        "original_bytes": src_path.stat().st_size,
        "quality": quality,
        "scale": scale,
    }


def main() -> None:
    manifest: dict = {}

    for src in sorted(IMAGES_DIR.iterdir()):
        if src.suffix.lower() in (".jpeg", ".jpg"):
            info = to_webp(src)
            manifest[src.name] = info
            print(
                f"{src.name} -> {info['webp']} "
                f"({info['webp_bytes'] // 1024}KB) {info['width']}x{info['height']}"
            )

    for src in sorted(IMAGES_DIR.glob("*.png")):
        with Image.open(src) as img:
            manifest[src.name] = {
                "original": src.name,
                "width": img.size[0],
                "height": img.size[1],
                "bytes": src.stat().st_size,
            }
            print(f"{src.name} PNG {img.size[0]}x{img.size[1]} ({src.stat().st_size // 1024}KB)")

    manifest_path = IMAGES_DIR / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"Wrote {manifest_path}")


if __name__ == "__main__":
    main()
