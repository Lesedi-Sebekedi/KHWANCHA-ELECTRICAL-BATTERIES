"""Generate favicon.ico and favicon.svg from images/logo.png."""
import base64
import io
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
LOGO = ROOT / "images" / "logo.png"
ICO_OUT = ROOT / "favicon.ico"
SVG_OUT = ROOT / "favicon.svg"


def generate_ico() -> None:
    with Image.open(LOGO) as img:
        rgba = img.convert("RGBA")
        rgba.save(
            ICO_OUT,
            format="ICO",
            sizes=[(16, 16), (32, 32), (48, 48)],
        )
    print(f"Wrote {ICO_OUT} ({ICO_OUT.stat().st_size} bytes)")


def generate_svg() -> None:
    with Image.open(LOGO) as img:
        width, height = img.size
        png_buf = io.BytesIO()
        img.convert("RGBA").save(png_buf, format="PNG")
        encoded = base64.b64encode(png_buf.getvalue()).decode("ascii")

    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
        f'role="img" aria-label="Khwancha Batteries">\n'
        f'  <image width="{width}" height="{height}" '
        f'href="data:image/png;base64,{encoded}"/>\n'
        f"</svg>\n"
    )
    SVG_OUT.write_text(svg, encoding="utf-8")
    print(f"Wrote {SVG_OUT} ({SVG_OUT.stat().st_size} bytes)")


def main() -> None:
    generate_ico()
    generate_svg()


if __name__ == "__main__":
    main()
