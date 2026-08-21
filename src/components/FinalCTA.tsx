import { ArrowUpRight, Phone } from "lucide-react";

type FinalCTAProps = {
  title: string;
  description: string;
  phoneHref: string;
};

export function FinalCTA({ title, description, phoneHref }: FinalCTAProps) {
  return (
    <section className="bg-[var(--orange)] py-16 text-[var(--navy)] sm:py-20" aria-labelledby="final-cta-title">
      <div className="container grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em]">Your next clean finish</p>
          <h2
            id="final-cta-title"
            className="mt-5 max-w-[12ch] text-4xl font-extrabold leading-[0.95] tracking-[-0.07em] sm:text-6xl"
          >
            {title}
          </h2>
          <p className="mt-6 max-w-2xl text-base font-semibold leading-8 sm:text-lg">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            className="button button--navy"
            href="#contact"
          >
            Get Free Quote
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.25} />
          </a>
          <a className="button button--light" href={phoneHref}>
            <Phone aria-hidden="true" size={16} strokeWidth={2.25} />
            Call Now
          </a>
        </div>
      </div>
    </section>
  );
}
