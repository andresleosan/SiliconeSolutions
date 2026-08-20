"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, useSyncExternalStore, type KeyboardEvent } from "react";

import { SectionHeading } from "./SectionHeading";
import { type GalleryItem } from "../content";
import {
  canAutoAdvance,
  relativeGalleryPosition,
  wrapGalleryIndex,
} from "../lib/gallery";

type WorkGalleryProps = {
  items: GalleryItem[];
};

const AUTO_ADVANCE_MS = 4500;
const SWIPE_THRESHOLD_PX = 50;

const subscribeToHydration = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

const stack = [
  { x: 0, y: 0, scale: 1, rotate: 0, zIndex: 40 },
  { x: 24, y: -12, scale: 0.97, rotate: 3, zIndex: 30 },
  { x: -18, y: -22, scale: 0.94, rotate: -4, zIndex: 20 },
  { x: 10, y: -30, scale: 0.91, rotate: 2, zIndex: 10 },
];

export function WorkGallery({ items }: WorkGalleryProps) {
  const shouldReduceMotion = useReducedMotion();
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getClientSnapshot,
    getServerSnapshot,
  );
  const reducedMotion = hydrated && shouldReduceMotion === true;
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(true);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [departingIndex, setDepartingIndex] = useState<number | null>(null);
  const currentIndex = wrapGalleryIndex(activeIndex, items.length);
  const activeItem = items[currentIndex];

  const navigate = (targetIndex: number, nextDirection: 1 | -1) => {
    if (items.length <= 1) return;

    const nextIndex = wrapGalleryIndex(targetIndex, items.length);
    if (nextIndex === currentIndex) return;

    setDirection(nextDirection);
    setDepartingIndex(reducedMotion ? null : currentIndex);
    setActiveIndex(nextIndex);
    setAutoPlayEnabled(false);
  };

  useEffect(() => {
    if (
      !canAutoAdvance({
        autoPlayEnabled,
        reducedMotion,
        pointerInside,
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
    pointerInside,
    reducedMotion,
  ]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const nextDirection = event.key === "ArrowRight" ? 1 : -1;
    navigate(currentIndex + nextDirection, nextDirection);
  };

  return (
    <section
      className="overflow-hidden bg-[var(--stone)] py-20 sm:py-28"
      aria-labelledby="gallery-title"
      aria-roledescription="carousel"
      aria-label="Silicone Solutions work gallery"
      onPointerEnter={() => setPointerInside(true)}
      onPointerLeave={() => setPointerInside(false)}
      onFocusCapture={(event) => {
        setFocusInside(true);
        const enteredFromOutside = !event.currentTarget.contains(
          event.relatedTarget as Node | null,
        );
        if (
          enteredFromOutside &&
          !(event.target as HTMLElement).closest("[data-gallery-autoplay-control]")
        ) {
          setAutoPlayEnabled(false);
        }
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

                return (
                  <motion.figure
                    className={`col-start-1 row-start-1 m-0 overflow-hidden rounded-[1.5rem] bg-[var(--warm-white)] shadow-[0_1.5rem_4rem_rgba(15,23,42,0.16)] ${isActive ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"}`}
                    key={item.src}
                    animate={{
                      x: reducedMotion ? 0 : isDeparting ? direction * -360 : transform.x,
                      y: transform.y,
                      scale: transform.scale,
                      rotate: reducedMotion ? 0 : transform.rotate,
                      opacity: isDeparting ? 0 : 1,
                    }}
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 260, damping: 28 }
                    }
                    style={{ zIndex: isDeparting ? 50 : transform.zIndex }}
                    drag={isActive && !reducedMotion ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.18}
                    onDragStart={() => setDragging(true)}
                    onDragEnd={(_, info) => {
                      setDragging(false);
                      if (info.offset.x <= -SWIPE_THRESHOLD_PX) {
                        navigate(currentIndex + 1, 1);
                      } else if (info.offset.x >= SWIPE_THRESHOLD_PX) {
                        navigate(currentIndex - 1, -1);
                      }
                    }}
                    onAnimationComplete={() => {
                      if (isDeparting) setDepartingIndex(null);
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
                  </motion.figure>
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

              <div className="flex flex-col items-center gap-3">
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
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--navy)]/25 bg-[var(--warm-white)] px-4 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--navy)] transition-colors hover:border-[var(--navy)]"
                  aria-label={autoPlayEnabled ? "Pause automatic rotation" : "Start automatic rotation"}
                  aria-controls="work-gallery-deck"
                  disabled={reducedMotion || items.length <= 1}
                  onClick={() => setAutoPlayEnabled((enabled) => !enabled)}
                  data-gallery-autoplay-control
                >
                  {autoPlayEnabled ? (
                    <Pause aria-hidden="true" size={14} fill="currentColor" />
                  ) : (
                    <Play aria-hidden="true" size={14} fill="currentColor" />
                  )}
                  {autoPlayEnabled ? "Pause" : "Start"}
                </button>
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
