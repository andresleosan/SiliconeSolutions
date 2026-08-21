"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bath,
  Building2,
  CookingPot,
  MessageCircle,
  PanelTop,
  RefreshCw,
  ShowerHead,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { type Service } from "../content";
import { whatsappHref } from "../lib/contact";
import { usePrefersReducedMotion } from "../lib/use-prefers-reduced-motion";

type ServicesCarouselProps = {
  services: Service[];
};

const serviceIcons: Record<string, LucideIcon> = {
  Bath,
  Building2,
  CookingPot,
  PanelTop,
  RefreshCw,
  ShowerHead,
};

export function ServicesCarousel({ services }: ServicesCarouselProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const motionDisabled = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const isPaused = isPointerInside || isFocusWithin;

  const goTo = (targetIndex: number) => {
    if (services.length === 0) {
      return;
    }

    const nextIndex = (targetIndex + services.length) % services.length;
    const rail = railRef.current;
    const card = cardRefs.current[nextIndex];

    if (rail && card) {
      rail.scrollTo({
        left: card.offsetLeft,
        behavior: motionDisabled ? "auto" : "smooth",
      });
    }

    setActiveIndex(nextIndex);
  };

  useEffect(() => {
    if (services.length < 2 || isPaused || motionDisabled) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % services.length;
        const rail = railRef.current;
        const card = cardRefs.current[nextIndex];

        if (rail && card) {
          rail.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
        }

        return nextIndex;
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isPaused, motionDisabled, services.length]);

  const handleRailScroll = () => {
    const rail = railRef.current;

    if (!rail || cardRefs.current.length === 0) {
      return;
    }

    const closestIndex = cardRefs.current.reduce((closest, card, index) => {
      if (!card) {
        return closest;
      }

      const closestCard = cardRefs.current[closest];
      if (!closestCard) {
        return index;
      }

      const cardDistance = Math.abs(card.offsetLeft - rail.scrollLeft);
      const closestDistance = Math.abs(closestCard.offsetLeft - rail.scrollLeft);
      return cardDistance < closestDistance ? index : closest;
    }, 0);

    setActiveIndex(closestIndex);
  };

  const handleRailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    goTo(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
  };

  return (
    <section
      id="services"
      className="overflow-hidden bg-[var(--navy)] py-20 text-[var(--warm-white)] sm:py-28"
      aria-labelledby="services-title"
      onPointerEnter={() => setIsPointerInside(true)}
      onPointerLeave={() => setIsPointerInside(false)}
      onFocusCapture={() => setIsFocusWithin(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsFocusWithin(false);
        }
      }}
    >
      <div className="container">
        <div className="flex flex-col justify-between gap-8 border-b border-[var(--warm-white)]/15 pb-10 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-5 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--orange)]">
              <span className="h-0.5 w-9 bg-[var(--orange)]" aria-hidden="true" />
              Services
            </p>
            <h2 id="services-title" className="max-w-[12ch] text-4xl font-extrabold leading-[0.98] tracking-[-0.065em] text-[var(--warm-white)] sm:text-6xl">
              Our sealing services
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--warm-white)]/72 sm:text-lg">
              Explore the work we cover across homes and businesses in Jersey.
            </p>
          </div>

          <div className="flex items-center gap-3" aria-label="Carousel controls">
            <span className="mr-2 text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--warm-white)]/55" aria-live="polite">
              {String(activeIndex + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--warm-white)]/25 text-[var(--warm-white)] transition-colors hover:border-[var(--orange)] hover:bg-[var(--orange)] hover:text-[var(--navy)]"
              aria-label="Previous service"
              aria-controls="services-rail"
              onClick={() => goTo(activeIndex - 1)}
            >
              <ArrowLeft aria-hidden="true" size={18} strokeWidth={2} />
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--orange)] bg-[var(--orange)] text-[var(--navy)] transition-transform hover:-translate-y-0.5"
              aria-label="Next service"
              aria-controls="services-rail"
              onClick={() => goTo(activeIndex + 1)}
            >
              <ArrowRight aria-hidden="true" size={18} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div
          id="services-rail"
          ref={railRef}
          className="flex w-full items-start snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-3 pt-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          tabIndex={0}
          role="region"
          aria-label="Service cards"
          onScroll={handleRailScroll}
          onKeyDown={handleRailKeyDown}
        >
          {services.map((service, index) => {
            const Icon = serviceIcons[service.icon];

            return (
              <article
                key={service.title}
                ref={(card) => {
                  cardRefs.current[index] = card;
                }}
                data-service-card
                className="group flex min-w-[calc(100%-1.5rem)] snap-start flex-col overflow-hidden rounded-[1.5rem] border border-[var(--warm-white)]/15 bg-[var(--warm-white)]/5 sm:min-w-[31rem] lg:min-w-[35rem]"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[var(--stone)]">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    width={service.width}
                    height={service.height}
                    sizes="(max-width: 639px) calc(100vw - 3.5rem), (max-width: 1279px) 31rem, 35rem"
                    className="h-full w-full object-contain"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--navy)]/80 via-[var(--navy)]/10 to-transparent" aria-hidden="true" />
                </div>

                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div aria-hidden="true" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--orange)] text-[var(--navy)]">
                      <Icon aria-hidden="true" size={20} strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="mt-7 text-2xl font-extrabold leading-tight tracking-[-0.045em] text-[var(--warm-white)] sm:text-3xl">{service.title}</h3>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--warm-white)]/70 sm:text-base">{service.description}</p>
                  <p className="mt-auto border-t border-[var(--warm-white)]/15 pt-5 text-sm font-extrabold leading-6 text-[var(--warm-white)]">
                    {service.benefit}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-9 flex flex-col items-start justify-between gap-5 border-t border-[var(--warm-white)]/15 pt-7 sm:flex-row sm:items-center">
          <p className="max-w-xl text-sm leading-6 text-[var(--warm-white)]/65">Not sure which service fits? Send us a photo and request a free quote.</p>
          <a className="button button--orange shrink-0" href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle aria-hidden="true" size={16} strokeWidth={2.25} />
            <span>Request a Quote</span>
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.25} />
          </a>
        </div>
      </div>
    </section>
  );
}
