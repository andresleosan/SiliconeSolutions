import Image from "next/image";
import { ArrowUpRight, Building2, MapPin, Phone, Timer } from "lucide-react";

import { siteCopy } from "../content";

type AboutSectionProps = {
  about: typeof siteCopy.about;
  businessName: string;
  serviceArea: string;
  imageSrc: string;
  phoneHref: string;
};

export function AboutSection({
  about,
  businessName,
  serviceArea,
  imageSrc,
  phoneHref,
}: AboutSectionProps) {
  return (
    <section id="about" className="bg-[var(--navy)] py-20 text-[var(--warm-white)] sm:py-28" aria-labelledby="about-title">
      <div className="container grid items-center gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-20">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--warm-white)]/15 bg-[var(--warm-white)]/5 p-2">
          <div className="overflow-hidden rounded-[1.25rem]">
            <Image
              src={imageSrc}
              alt="Silicone Solutions finished washbasin sealing detail"
              width={1200}
              height={1600}
              sizes="(max-width: 1023px) 100vw, 36vw"
              className="h-auto w-full"
            />
          </div>
        </div>

        <div>
          <p className="mb-5 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--orange)]">
            <span className="h-0.5 w-9 bg-[var(--orange)]" aria-hidden="true" />
            About us
          </p>
          <h2 id="about-title" className="max-w-[12ch] text-4xl font-extrabold leading-[0.98] tracking-[-0.065em] text-[var(--warm-white)] sm:text-6xl">
            {about.title}
          </h2>
          <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--warm-white)]/72 sm:text-lg">{about.description}</p>

          <dl className="mt-9 grid gap-4 border-y border-[var(--warm-white)]/15 py-6 sm:grid-cols-3">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 shrink-0 text-[var(--orange)]" aria-hidden="true" size={19} strokeWidth={1.8} />
              <div>
                <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--warm-white)]/50">Coverage</dt>
                <dd className="mt-1 text-sm font-bold text-[var(--warm-white)]">{serviceArea}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="mt-0.5 shrink-0 text-[var(--orange)]" aria-hidden="true" size={19} strokeWidth={1.8} />
              <div>
                <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--warm-white)]/50">Scope</dt>
                <dd className="mt-1 text-sm font-bold text-[var(--warm-white)]">Domestic &amp; commercial</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Timer className="mt-0.5 shrink-0 text-[var(--orange)]" aria-hidden="true" size={19} strokeWidth={1.8} />
              <div>
                <dt className="text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--warm-white)]/50">Experience</dt>
                <dd className="mt-1 text-sm font-bold text-[var(--warm-white)]">15+ years</dd>
              </div>
            </div>
          </dl>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.12em] text-[var(--warm-white)]/50">{businessName}</p>
          <a className="button button--orange mt-6" href={phoneHref}>
            <Phone aria-hidden="true" size={16} strokeWidth={2.25} />
            <span>Speak to David</span>
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.25} />
          </a>
        </div>
      </div>
    </section>
  );
}
