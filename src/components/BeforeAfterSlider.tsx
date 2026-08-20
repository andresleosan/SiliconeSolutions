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
          <div data-comparison-fallback className="mt-12 grid gap-6 sm:grid-cols-2">
            <figure className="m-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[var(--stone)]">
                <Image
                  src={beforeSrc}
                  alt={beforeAlt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 639px) calc(100vw - 2rem), 39rem"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--navy)]/60">
                Before
              </figcaption>
            </figure>
            <figure className="m-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[var(--stone)]">
                <Image
                  src={afterSrc}
                  alt={afterAlt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 639px) calc(100vw - 2rem), 39rem"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--navy)]/60">
                After
              </figcaption>
            </figure>
          </div>

          <div data-comparison-enhanced hidden className="mt-12" suppressHydrationWarning>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[var(--stone)] shadow-[0_1.5rem_4rem_rgba(15,23,42,0.12)]">
              <Image
                src={beforeSrc}
                alt={beforeAlt}
                fill
                loading="lazy"
                sizes="(max-width: 767px) calc(100vw - 2rem), 78rem"
                className="object-cover"
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
                  className="object-cover"
                />
              </div>

              <span className="absolute left-4 top-4 rounded-full bg-[var(--navy)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--warm-white)] sm:left-6 sm:top-6">
                Before
              </span>
              <span className="absolute right-4 top-4 rounded-full bg-[var(--orange)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--navy)] sm:right-6 sm:top-6">
                After
              </span>

              <div
                className="pointer-events-none absolute inset-y-0 z-10 w-px bg-[var(--warm-white)] shadow-[0_0_0_1px_rgba(15,23,42,0.18)]"
                style={{ left: `${reveal}%` }}
                aria-hidden="true"
              >
                <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[var(--warm-white)] bg-[var(--orange)] text-[var(--navy)] shadow-lg">
                  <ArrowLeftRight aria-hidden="true" size={21} strokeWidth={2.25} />
                </span>
              </div>

              <label className="sr-only" htmlFor="before-after-range">
                Reveal more of the finished result
              </label>
              <input
                id="before-after-range"
                className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--orange)]"
                type="range"
                min="0"
                max="100"
                step="1"
                value={reveal}
                onChange={(event) => setReveal(Number(event.target.value))}
                aria-valuetext={`${reveal}% finished result revealed`}
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--navy)]/60">
              <span>Drag or use the keyboard</span>
              <span>{reveal}% revealed</span>
            </div>
          </div>

          <script
            dangerouslySetInnerHTML={{
              __html: `(() => {
                const root = document.currentScript?.parentElement;
                const fallback = root?.querySelector("[data-comparison-fallback]");
                const enhanced = root?.querySelector("[data-comparison-enhanced]");
                if (fallback && enhanced) {
                  fallback.setAttribute("hidden", "");
                  enhanced.removeAttribute("hidden");
                }
              })();`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
