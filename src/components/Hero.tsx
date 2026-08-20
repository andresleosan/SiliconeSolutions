"use client";

import { ArrowUpRight, Phone } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useRef } from "react";

type HeroCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

type HeroProps = {
  siteCopy: HeroCopy;
  videoSrc: string;
  posterSrc: string;
  phoneHref: string;
  quoteHref: string;
};

function getRevealVariants(reducedMotion: boolean): Variants {
  return {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reducedMotion ? 0 : 0.6, ease: "easeOut" },
    },
  };
}

export function Hero({
  siteCopy,
  videoSrc,
  posterSrc,
  phoneHref,
  quoteHref,
}: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const revealVariants = getRevealVariants(shouldReduceMotion === true);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || shouldReduceMotion === null) {
      return;
    }

    if (shouldReduceMotion) {
      video.pause();
      return;
    }

    void video.play().catch(() => undefined);
  }, [shouldReduceMotion]);

  return (
    <section
      className="relative isolate overflow-hidden bg-[var(--navy)] text-[var(--warm-white)]"
      aria-labelledby="hero-title"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-px bg-[var(--orange)]/70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 top-12 -z-10 h-48 w-48 rounded-full border border-[var(--orange)]/30"
        aria-hidden="true"
      />
      <div className="container grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,0.92fr)_minmax(22rem,0.75fr)] lg:gap-16 lg:py-28">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="relative z-10"
        >
          <p className="mb-5 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--orange)]">
            <span className="h-0.5 w-9 bg-[var(--orange)]" aria-hidden="true" />
            {siteCopy.eyebrow}
          </p>
          <h1
            id="hero-title"
            className="max-w-[10ch] text-5xl font-extrabold leading-[0.94] tracking-[-0.075em] text-[var(--warm-white)] sm:text-7xl lg:text-[clamp(4rem,7vw,7.5rem)]"
          >
            {siteCopy.title}
          </h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-[var(--warm-white)]/75 sm:text-lg">
            {siteCopy.description}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a className="button button--orange" href={quoteHref}>
              <span>Get a Free Quote</span>
              <ArrowUpRight aria-hidden="true" size={17} strokeWidth={2.25} />
            </a>
            <a
              className="button border border-[var(--warm-white)]/35 bg-transparent text-[var(--warm-white)] hover:border-[var(--warm-white)] hover:bg-[var(--warm-white)] hover:text-[var(--navy)]"
              href={phoneHref}
            >
              <Phone aria-hidden="true" size={16} strokeWidth={2.25} />
              <span>Call Now</span>
            </a>
          </div>
          <div className="mt-10 inline-flex items-center gap-3 border-l-2 border-[var(--orange)] pl-4 text-sm text-[var(--warm-white)]/75">
            <span className="font-extrabold text-[var(--warm-white)]">15+</span>
            <span>years of experience</span>
          </div>
        </motion.div>

        <motion.figure
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="relative m-0 overflow-hidden rounded-[2rem] border border-[var(--warm-white)]/15 bg-[var(--warm-white)]/5 p-2 shadow-2xl shadow-black/25"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-black">
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={videoSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Silicone sealing work video"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--navy)]/60 via-transparent to-transparent"
              aria-hidden="true"
            />
            <figcaption className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-xs font-bold uppercase tracking-[0.14em] text-[var(--warm-white)]">
              <span>Clean lines. Durable results.</span>
              <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--orange)]" aria-hidden="true" />
            </figcaption>
          </div>
        </motion.figure>
      </div>
    </section>
  );
}
