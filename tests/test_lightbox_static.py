from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class LightboxInitializationTests(unittest.TestCase):
    def test_homepage_gallery_does_not_trigger_lightbox_initialization(self):
        index_html = (ROOT / "index.html").read_text()
        main_js = (ROOT / "js" / "main.js").read_text()

        self.assertIn('class="gallery-item"', index_html)
        self.assertNotIn('id="lightbox"', index_html)
        self.assertIn("document.getElementById('lightbox')", main_js)
        self.assertNotIn("document.querySelector('.gallery-item')", main_js)

    def test_lightbox_component_guards_required_markup_before_binding_events(self):
        lightbox_js = (ROOT / "js" / "components" / "lightbox.js").read_text()

        guard_index = lightbox_js.index("if (!lightbox || !lightboxImg || !lightboxCaption) return;")
        binding_index = lightbox_js.index("galleryItems.forEach")
        keydown_index = lightbox_js.index("document.addEventListener('keydown'")

        self.assertLess(guard_index, binding_index)
        self.assertLess(guard_index, keydown_index)


if __name__ == "__main__":
    unittest.main()
