import assert from 'node:assert/strict';
import test from 'node:test';

import { initLightbox } from '../js/components/lightbox.js';

function createElement(options = {}) {
    const listeners = {};
    const children = options.children || {};

    return {
        listeners,
        src: options.src || '',
        alt: options.alt || '',
        textContent: options.textContent || '',
        style: {},
        addEventListener(event, callback) {
            listeners[event] = callback;
        },
        querySelector(selector) {
            return children[selector] || null;
        }
    };
}

test('initLightbox skips pages without lightbox markup', () => {
    const galleryItem = createElement();
    let keydownListenerAdded = false;

    global.document = {
        body: { style: {} },
        getElementById() {
            return null;
        },
        querySelectorAll() {
            return [galleryItem];
        },
        addEventListener(event) {
            if (event === 'keydown') {
                keydownListenerAdded = true;
            }
        }
    };

    assert.doesNotThrow(() => initLightbox());
    assert.equal(galleryItem.listeners.click, undefined);
    assert.equal(keydownListenerAdded, false);
});

test('initLightbox opens a gallery image when markup is present', () => {
    const lightbox = createElement();
    const lightboxImg = createElement();
    const lightboxCaption = createElement();
    const lightboxClose = createElement();
    const prevBtn = createElement();
    const nextBtn = createElement();
    const galleryImage = createElement({ src: 'images/sample.png', alt: 'Sample Battery Prototype' });
    const galleryCaption = createElement({ textContent: 'Sample Battery Prototype' });
    const galleryItem = createElement({
        children: {
            '.gallery-item__image': galleryImage,
            '.gallery-item__caption': galleryCaption
        }
    });

    const elementsById = {
        lightbox,
        lightboxImg,
        lightboxCaption,
        lightboxClose,
        prevBtn,
        nextBtn
    };

    global.document = {
        body: { style: {} },
        getElementById(id) {
            return elementsById[id] || null;
        },
        querySelectorAll() {
            return [galleryItem];
        },
        addEventListener() {}
    };

    initLightbox();
    galleryItem.listeners.click();

    assert.equal(lightbox.style.display, 'flex');
    assert.equal(global.document.body.style.overflow, 'hidden');
    assert.equal(lightboxImg.src, 'images/sample.png');
    assert.equal(lightboxImg.alt, 'Sample Battery Prototype');
    assert.equal(lightboxCaption.textContent, 'Sample Battery Prototype');
});
