"""Update HTML files with picture tags and width/height from manifest."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = json.loads((ROOT / "images" / "manifest.json").read_text(encoding="utf-8"))

JPEG_SOURCES = {
    key: value for key, value in MANIFEST.items() if key.lower().endswith((".jpeg", ".jpg"))
}


def picture_block(jpeg_name: str, alt: str, extra_attrs: str = "") -> str:
    info = MANIFEST[jpeg_name]
    webp = info["webp"]
    w, h = info["width"], info["height"]
    attrs = f' width="{w}" height="{h}"'
    if extra_attrs:
        extra_attrs = extra_attrs.strip()
        if not extra_attrs.startswith(" "):
            extra_attrs = f" {extra_attrs}"
    return (
        f'<picture>\n'
        f'                        <source srcset="images/{webp}" type="image/webp">\n'
        f'                        <img src="images/{jpeg_name}" alt="{alt}"{attrs}{extra_attrs}>\n'
        f'                    </picture>'
    )


def png_img(src: str, alt: str, extra_attrs: str = "") -> str:
    name = Path(src).name
    info = MANIFEST[name]
    attrs = f' width="{info["width"]}" height="{info["height"]}"'
    if extra_attrs:
        extra_attrs = extra_attrs.strip()
        if not extra_attrs.startswith(" "):
            extra_attrs = f" {extra_attrs}"
    return f'<img src="{src}" alt="{alt}"{attrs}{extra_attrs}>'


def update_index() -> None:
    path = ROOT / "index.html"
    html = path.read_text(encoding="utf-8")

    html = html.replace(
        '<img src="./images/logo.png" alt="Khwancha Batteries Logo" class="logo__image">',
        png_img("./images/logo.png", "Khwancha Batteries Logo", 'class="logo__image"'),
    )

    html = html.replace(
        '<img src="images/sample.png" alt="Khwancha battery prototype in development" loading="lazy">',
        png_img("images/sample.png", "Khwancha battery prototype in development", 'loading="lazy"'),
    )

    html = html.replace(
        '<img src="images/batteryprod.png" alt="Khwancha EV battery pack production unit" loading="lazy">',
        png_img("images/batteryprod.png", "Khwancha EV battery pack production unit", 'loading="lazy"'),
    )

    html = re.sub(
        r'<img src="images/batery2\.jpeg" alt="Battery conversion kit components" loading="lazy">',
        picture_block("batery2.jpeg", "Battery conversion kit components", 'loading="lazy"'),
        html,
    )

    html = re.sub(
        r'<img src="images/batery4\.jpeg" alt="Advanced lithium-ion cell assembly for energy storage" loading="lazy">',
        picture_block("batery4.jpeg", "Advanced lithium-ion cell assembly for energy storage", 'loading="lazy"'),
        html,
    )

    html = html.replace(
        '<img src="images/busreg.png" alt="CIPC company registration certificate for Khwancha Electrical Batteries" class="credibility-card__image" loading="lazy">',
        png_img(
            "images/busreg.png",
            "CIPC company registration certificate for Khwancha Electrical Batteries",
            'class="credibility-card__image" loading="lazy"',
        ),
    )

    for jpeg, alt in [
        ("BRICS.JPG", "Khwancha Batteries at BRICS-related industry event"),
        ("acms.JPG", "Khwancha Batteries at ACMS automotive conference"),
        ("SA-autweek.JPG", "Khwancha Batteries at SA Auto Week"),
    ]:
        html = html.replace(
            f'<img src="images/{jpeg}" alt="{alt}" class="credibility-card__image" loading="lazy">',
            picture_block(jpeg, alt, 'class="credibility-card__image" loading="lazy"'),
        )

    html = html.replace(
        '<img src="images/photo0.jpeg" alt="Conference Attendance" class="gallery-item__image" loading="lazy">',
        picture_block("photo0.jpeg", "Conference Attendance", 'class="gallery-item__image" loading="lazy"'),
    )

    html = html.replace(
        '<img src="images/batteryprod.png" alt="Sample Batteries" class="gallery-item__image" loading="lazy">',
        png_img("images/batteryprod.png", "Sample Batteries", 'class="gallery-item__image" loading="lazy"'),
    )

    html = html.replace(
        '<img src="./images/footer.png" alt="Khwancha Batteries Logo" class="footer__logo">',
        png_img("./images/footer.png", "Khwancha Batteries Logo", 'class="footer__logo"'),
    )

    path.write_text(html, encoding="utf-8")


def update_gallery_page(filename: str, items: list[tuple[str, str, str]]) -> None:
    path = ROOT / filename
    html = path.read_text(encoding="utf-8")

    html = html.replace(
        '<img src="./images/logo.png" alt="Khwancha Batteries Logo" class="logo__image">',
        png_img("./images/logo.png", "Khwancha Batteries Logo", 'class="logo__image"'),
    )

    for src, alt, caption in items:
        if src.endswith(".png"):
            block = png_img(f"images/{src}", alt, 'class="gallery-item__image" loading="lazy"')
        else:
            block = picture_block(src, alt, 'class="gallery-item__image" loading="lazy"')

        html = re.sub(
            rf'<img src="images/{re.escape(src)}" alt="{re.escape(alt)}" class="gallery-item__image" loading="lazy">',
            block,
            html,
            count=1,
        )

    html = html.replace(
        '<img src="" alt="" class="lightbox__image" id="lightboxImg">',
        '<img src="" alt="" width="1200" height="1600" class="lightbox__image" id="lightboxImg">',
    )

    html = html.replace(
        '<img src="./images/footer.png" alt="Khwancha Batteries Logo" class="footer__logo">',
        png_img("./images/footer.png", "Khwancha Batteries Logo", 'class="footer__logo"'),
    )

    path.write_text(html, encoding="utf-8")


def main() -> None:
    update_index()
    update_gallery_page(
        "conferences.html",
        [
            ("photo1.jpeg", "Energy Conference 2023", "Africa Energy Conference 2023 - Johannesburg"),
            ("photo2.jpeg", "EV Summit", "Electric Vehicle Summit - Cape Town"),
            ("photo3.jpeg", "Tech Expo", "Clean Technology Expo - Durban"),
            ("photo4.jpeg", "Innovation Forum", "Battery Innovation Forum - Pretoria"),
            ("photo5.jpeg", "Industry Meet", "Industry Stakeholders Meeting - Mahikeng"),
            ("photo7.jpeg", "Partner Conference", "Partner Conference with Leema Industries - Midrand"),
            ("BRICS.JPG", "BRICS industry engagement", "BRICS Industry Engagement"),
            ("acms.JPG", "ACMS automotive conference", "ACMS Conference"),
            ("SA-autweek.JPG", "SA Auto Week", "SA Auto Week"),
        ],
    )
    update_gallery_page(
        "samples.html",
        [
            ("sample.png", "Sample Battery Prototype", "Sample Battery Prototype"),
            ("batery1.jpeg", "Battery Sample 1", "Battery Sample 1"),
            ("batery2.jpeg", "Battery Sample 2", "Battery Sample 2"),
            ("batery3.jpeg", "Battery Sample 3", "Battery Sample 3"),
            ("batery4.jpeg", "Battery Sample 4", "Battery Sample 4"),
        ],
    )
    print("HTML files updated")


if __name__ == "__main__":
    main()
