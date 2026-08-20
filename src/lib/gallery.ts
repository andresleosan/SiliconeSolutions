type AutoAdvanceState = {
  autoPlayEnabled: boolean;
  reducedMotion: boolean;
  pointerInside: boolean;
  focusInside: boolean;
  dragging: boolean;
  itemCount: number;
};

export function wrapGalleryIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

export function relativeGalleryPosition(
  itemIndex: number,
  activeIndex: number,
  length: number,
): number {
  return wrapGalleryIndex(itemIndex - activeIndex, length);
}

export function canAutoAdvance(state: AutoAdvanceState): boolean {
  return (
    state.itemCount > 1 &&
    state.autoPlayEnabled &&
    !state.reducedMotion &&
    !state.pointerInside &&
    !state.focusInside &&
    !state.dragging
  );
}
