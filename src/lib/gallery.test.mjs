import assert from "node:assert/strict";
import test from "node:test";

import {
  canAutoAdvance,
  relativeGalleryPosition,
  wrapGalleryIndex,
} from "./gallery.ts";

test("wrapGalleryIndex wraps in both directions", () => {
  assert.equal(wrapGalleryIndex(4, 4), 0);
  assert.equal(wrapGalleryIndex(-1, 4), 3);
  assert.equal(wrapGalleryIndex(2, 4), 2);
  assert.equal(wrapGalleryIndex(2, 0), 0);
});

test("relativeGalleryPosition places the active card at depth zero", () => {
  assert.equal(relativeGalleryPosition(2, 2, 4), 0);
  assert.equal(relativeGalleryPosition(3, 2, 4), 1);
  assert.equal(relativeGalleryPosition(1, 2, 4), 3);
});

test("canAutoAdvance requires normal motion and no interaction", () => {
  const idle = {
    autoPlayEnabled: true,
    reducedMotion: false,
    focusInside: false,
    dragging: false,
    itemCount: 4,
  };

  assert.equal(canAutoAdvance(idle), true);
  assert.equal(canAutoAdvance({ ...idle, autoPlayEnabled: false }), false);
  assert.equal(canAutoAdvance({ ...idle, reducedMotion: true }), false);
  assert.equal(canAutoAdvance({ ...idle, focusInside: true }), false);
  assert.equal(canAutoAdvance({ ...idle, dragging: true }), false);
  assert.equal(canAutoAdvance({ ...idle, itemCount: 1 }), false);
});
