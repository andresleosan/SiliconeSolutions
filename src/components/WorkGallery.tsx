"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

import { SectionHeading } from "./SectionHeading";
import { type GalleryItem } from "../content";
import {
  canAutoAdvance,
  relativeGalleryPosition,
  wrapGalleryIndex,
} from "../lib/gallery";
import { usePrefersReducedMotion } from "../lib/use-prefers-reduced-motion";

type WorkGalleryProps = {
  items: GalleryItem[];
};

const AUTO_ADVANCE_MS = 4500;
const SWIPE_THRESHOLD_PX = 50;
const DEPARTURE_DURATION_MS = 300;

const stack = [
  { x: 0, y: 0, scale: 1, rotate: 0, zIndex: 40 },
  { x: 24, y: -12, scale: 0.97, rotate: 3, zIndex: 30 },
  { x: -18, y: -22, scale: 0.94, rotate: -4, zIndex: 20 },
  { x: 10, y: -30, scale: 0.91, rotate: 2, zIndex: 10 },
];

export function WorkGallery({ items }: WorkGalleryProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [focusInside, setFocusInside] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [departingIndex, setDepartingIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const pointerIdRef = useRef<number | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);
  const currentIndex = wrapGalleryIndex(activeIndex, items.length);
  const activeItem = items[currentIndex];

  const navigate = (targetIndex: number, nextDirection: 1 | -1) => {
    if (items.length <= 1) return;

    const nextIndex = wrapGalleryIndex(targetIndex, items.length);
    if (nextIndex === currentIndex) return;

    setDirection(nextDirection);
    setDepartingIndex(reducedMotion ? null : currentIndex);
    setActiveIndex(nextIndex);
  };

  useEffect(() => {
    if (
      !canAutoAdvance({
        autoPlayEnabled,
        reducedMotion,
        focusInside,
        dragging,
        itemCount: items.length,
      })
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setDirection(1);
      setDepartingIndex(currentIndex);
      setActiveIndex(wrapGalleryIndex(currentIndex + 1, items.length));
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(interval);
  }, [
    autoPlayEnabled,
    currentIndex,
    dragging,
    focusInside,
    items.length,
    reducedMotion,
  ]);

  useEffect(() => {
    if (departingIndex === null) {
      return;
    }

    const timeout = window.setTimeout(() => setDepartingIndex(null), DEPARTURE_DURATION_MS);
    return () => window.clearTimeout(timeout);
  }, [departingIndex]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const nextDirection = event.key === "ArrowRight" ? 1 : -1;
    navigate(currentIndex + nextDirection, nextDirection);
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>, isActive: boolean) => {
    if (!isActive || reducedMotion) {
      return;
    }

    pointerIdRef.current = event.pointerId;
    dragStartXRef.current = event.clientX;
    suppressClickRef.current = false;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const finishPointerDrag = (event: PointerEvent<HTMLElement>, shouldNavigate: boolean) => {
    if (event.pointerId !== pointerIdRef.current) {
      return;
    }

    const offset = dragOffset;
    const didSwipe = shouldNavigate && Math.abs(offset) >= SWIPE_THRESHOLD_PX;
    suppressClickRef.current = didSwipe;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    pointerIdRef.current = null;
    dragStartXRef.current = null;
    setDragging(false);
    setDragOffset(0);

    if (didSwipe && offset <= -SWIPE_THRESHOLD_PX) {
      navigate(currentIndex + 1, 1);
    } else if (didSwipe && offset >= SWIPE_THRESHOLD_PX) {
      navigate(currentIndex - 1, -1);
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (
      !dragging ||
      event.pointerId !== pointerIdRef.current ||
      dragStartXRef.current === null
    ) {
      return;
    }

    setDragOffset(event.clientX - dragStartXRef.current);
  };

  return (
    <section
      className="overflow-hidden bg-[var(--stone)] py-20 sm:py-28"
      aria-labelledby="gallery-title"
      aria-roledescription="carousel"
      aria-label="Silicone Solutions work gallery"
      onFocusCapture={() => {
        setFocusInside(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusInside(false);
        }
      }}
    >
      <div className="container">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,32rem)] lg:gap-20">
          <SectionHeading
            eyebrow="Our work"
            title="Sealing details, stacked"
            body="Explore close-up views of finished silicone work and the original bath condition before replacement."
            id="gallery-title"
          />

          <div className="mx-auto w-full max-w-lg">
            <div
              id="work-gallery-deck"
              className="relative grid w-full touch-pan-y outline-none focus-visible:rounded-[1.5rem] focus-visible:shadow-[var(--focus-ring)]"
              tabIndex={0}
              aria-label="Work gallery cards"
              onKeyDown={handleKeyDown}
              data-navigation-direction={direction}
            >
              {items.map((item, index) => {
                const depth = relativeGalleryPosition(index, currentIndex, items.length);
                const transform = stack[Math.min(depth, stack.length - 1)];
                const isActive = depth === 0;
                const isDeparting = index === departingIndex;

                const x = dragging && isActive
                  ? dragOffset
                  : isDeparting
                    ? direction * -360
                    : reducedMotion
                      ? 0
                      : transform.x;
                const rotate = reducedMotion ? 0 : transform.rotate;

                return (
                  <figure
                    className={`col-start-1 row-start-1 m-0 overflow-hidden rounded-[1.5rem] bg-[var(--warm-white)] shadow-[0_1.5rem_4rem_rgba(15,23,42,0.16)] ${isActive ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"}`}
                    key={item.src}
                    style={{
                      zIndex: isDeparting ? 50 : transform.zIndex,
                      transform: `translate3d(${x}px, ${transform.y}px, 0) scale(${transform.scale}) rotate(${rotate}deg)`,
                      opacity: isDeparting ? 0 : 1,
                      transition: dragging && isActive ? "none" : "transform 300ms ease-out, opacity 300ms ease-out",
                    }}
                    onPointerDown={(event) => handlePointerDown(event, isActive)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={(event) => finishPointerDrag(event, true)}
                    onPointerCancel={(event) => finishPointerDrag(event, false)}
                    onClick={() => {
                      if (suppressClickRef.current) {
                        suppressClickRef.current = false;
                        return;
                      }
                      if (isActive) setAutoPlayEnabled(false);
                    }}
                    aria-hidden={isActive ? "false" : "true"}
                    aria-label={`Project ${index + 1} of ${items.length}: ${item.label}`}
                    inert={isActive ? undefined : true}
                    data-gallery-card
                    data-active={isActive ? "true" : "false"}
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={1200}
                      height={1600}
                      loading="lazy"
                      sizes="(max-width: 639px) calc(100vw - 2rem), 32rem"
                      className="h-auto w-full"
                      draggable={false}
                    />
                    <figcaption className="grid min-h-36 grid-cols-[1fr_auto] gap-x-6 gap-y-2 p-5 sm:p-6">
                      <h3 className="text-xl font-extrabold leading-tight tracking-[-0.04em] text-[var(--navy)] sm:text-2xl">
                        {item.label}
                      </h3>
                      <span className="row-span-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--navy)]/55">
                        {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                      </span>
                      <p className="m-0 text-sm leading-6 text-[var(--navy)]/70">
                        {item.description}
                      </p>
                    </figcaption>
                  </figure>
                );
              })}
            </div>

            <div className="mt-10 flex items-center justify-between gap-5" aria-label="Gallery controls">
              <button
                type="button"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--navy)]/25 bg-[var(--warm-white)] text-[var(--navy)] transition-colors hover:border-[var(--navy)] hover:bg-[var(--navy)] hover:text-[var(--warm-white)] disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Previous project"
                aria-controls="work-gallery-deck"
                disabled={items.length <= 1}
                onClick={() => navigate(currentIndex - 1, -1)}
              >
                <ArrowLeft aria-hidden="true" size={18} strokeWidth={2} />
              </button>

              <div className="flex items-center justify-center" aria-label="Choose a project">
                  {items.map((item, index) => (
                    <button
                      type="button"
                      className="group inline-flex h-8 w-8 items-center justify-center rounded-full"
                      key={item.src}
                      aria-label={`Show project ${index + 1}`}
                      aria-controls="work-gallery-deck"
                      aria-current={index === currentIndex ? "true" : undefined}
                      onClick={() => navigate(index, index >= currentIndex ? 1 : -1)}
                      data-gallery-dot
                    >
                      <span
                        className={`block h-3 w-3 rounded-full border border-[var(--navy)] transition-[background-color,transform] group-hover:scale-125 ${index === currentIndex ? "bg-[var(--navy)]" : "bg-transparent"}`}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
              </div>

              <button
                type="button"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--orange)] bg-[var(--orange)] text-[var(--navy)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Next project"
                aria-controls="work-gallery-deck"
                disabled={items.length <= 1}
                onClick={() => navigate(currentIndex + 1, 1)}
              >
                <ArrowRight aria-hidden="true" size={18} strokeWidth={2} />
              </button>
            </div>

            <p
              className="sr-only"
              aria-live={autoPlayEnabled && !reducedMotion ? "off" : "polite"}
              aria-atomic="true"
              data-gallery-live
            >
              {activeItem
                ? `Showing project ${currentIndex + 1} of ${items.length}: ${activeItem.label}`
                : "No projects available"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
