"use client";

import Image from "next/image";
import { ArrowLeftRight } from "lucide-react";
import { useState } from "react";

import { SectionHeading } from "./SectionHeading";

type BeforeAfterSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
}: BeforeAfterSliderProps) {
  const [reveal, setReveal] = useState(50);

  return (
    <section className="bg-[var(--warm-white)] py-20 sm:py-28" aria-labelledby="comparison-title">
      <div className="container">
        <SectionHeading
          eyebrow="Before and after"
          title="See the difference in the finish"
          body="Compare the visible change from an ageing sealant edge to a cleaner finished result."
          id="comparison-title"
        />

        <div data-comparison-root>
          <noscript data-comparison-fallback>
            <style>{`[data-comparison-enhanced] { display: none !important; }`}</style>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              <figure className="m-0">
                <div className="overflow-hidden rounded-[1.5rem] bg-[var(--stone)]">
                  <Image
                    src={afterSrc}
                    alt={afterAlt}
                    width={1200}
                    height={1600}
                    loading="lazy"
                    sizes="(max-width: 639px) calc(100vw - 2rem), 39rem"
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="mt-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--navy)]/60">
                  After
                </figcaption>
              </figure>
              <figure className="m-0">
                <div className="overflow-hidden rounded-[1.5rem] bg-[var(--stone)]">
                  <Image
                    src={beforeSrc}
                    alt={beforeAlt}
                    width={1200}
                    height={1600}
                    loading="lazy"
                    sizes="(max-width: 639px) calc(100vw - 2rem), 39rem"
                    className="h-auto w-full"
                  />
                </div>
                <figcaption className="mt-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--navy)]/60">
                  Before
                </figcaption>
              </figure>
            </div>
          </noscript>

          <div data-comparison-enhanced className="mt-12">
            <p id="before-after-description" className="sr-only">
              After: {afterAlt}. Before: {beforeAlt}.
            </p>
            <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-[var(--stone)] shadow-[0_1.5rem_4rem_rgba(15,23,42,0.12)] has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[var(--navy)] has-[:focus-visible]:ring-offset-4 has-[:focus-visible]:ring-offset-[var(--warm-white)]">
              <Image
                src={beforeSrc}
                alt=""
                fill
                loading="lazy"
                sizes="(max-width: 767px) calc(100vw - 2rem), 78rem"
                className="object-contain"
              />

              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
                aria-hidden="true"
              >
                <Image
                  src={afterSrc}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(max-width: 767px) calc(100vw - 2rem), 78rem"
                  className="object-contain"
                />
              </div>

              <span className="absolute left-4 top-4 rounded-full bg-[var(--navy)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--warm-white)] sm:left-6 sm:top-6">
                After
              </span>
              <span className="absolute right-4 top-4 rounded-full bg-[var(--orange)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--navy)] sm:right-6 sm:top-6">
                Before
              </span>

              <div
                className="pointer-events-none absolute inset-y-0 z-10 w-px bg-[var(--warm-white)] shadow-[0_0_0_1px_rgba(15,23,42,0.18)]"
                style={{ left: `${reveal}%` }}
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute top-1/2 z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--warm-white)] bg-[var(--orange)] text-[var(--navy)] shadow-lg"
                style={{ left: `clamp(1.5rem, ${reveal}%, calc(100% - 1.5rem))` }}
                aria-hidden="true"
              >
                <ArrowLeftRight size={21} strokeWidth={2.25} />
              </span>

              <label className="sr-only" htmlFor="before-after-range">
                Reveal After on the left and Before on the right
              </label>
              <input
                id="before-after-range"
                className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0 focus-visible:outline-none"
                type="range"
                min="0"
                max="100"
                step="1"
                value={reveal}
                onChange={(event) => setReveal(Number(event.target.value))}
                aria-describedby="before-after-description"
                aria-valuetext={`${reveal}% After revealed from the left`}
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--navy)]/60">
              <span>Drag or use the keyboard</span>
              <span>{reveal}% revealed</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
