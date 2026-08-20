import { Quote } from "lucide-react";

import { type Testimonial } from "../content";
import { SectionHeading } from "./SectionHeading";

type TestimonialsProps = {
  testimonials: Testimonial[];
};

export function Testimonials({ testimonials }: TestimonialsProps) {
  const verifiedRecommendation = testimonials.find((testimonial) => testimonial.verified);
  const examples = testimonials.filter((testimonial) => !testimonial.verified);

  return (
    <section className="bg-[var(--stone)] py-20 sm:py-28" aria-labelledby="testimonials-title">
      <div className="container">
        <SectionHeading
          eyebrow="Recommendations"
          title="Proof, presented honestly"
          body="A local recommendation with its source, alongside clearly labelled examples awaiting customer confirmation."
          id="testimonials-title"
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
          {verifiedRecommendation ? (
            <figure className="m-0 flex min-h-96 flex-col rounded-[1.75rem] bg-[var(--navy)] p-7 text-[var(--warm-white)] sm:p-10">
              <div className="flex items-center justify-between gap-5">
                <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--orange)]">
                  Verified recommendation
                </span>
                <Quote aria-hidden="true" className="text-[var(--orange)]" size={30} strokeWidth={1.6} />
              </div>
              <blockquote className="mt-12 max-w-3xl text-2xl font-extrabold leading-snug tracking-[-0.045em] sm:text-4xl">
                &ldquo;{verifiedRecommendation.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-auto pt-12">
                <p className="text-base font-extrabold">{verifiedRecommendation.author}</p>
                <cite className="mt-2 block text-sm not-italic leading-6 text-[var(--warm-white)]/65">
                  {verifiedRecommendation.source}
                </cite>
              </figcaption>
            </figure>
          ) : null}

          <div className="grid gap-5">
            {examples.map((testimonial, index) => (
              <figure
                className="m-0 flex flex-col border border-[var(--navy)]/10 bg-[var(--warm-white)]/55 p-6 sm:p-7"
                key={`${testimonial.source}-${index}`}
              >
                <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--navy)]/60">
                  Example review
                </span>
                <blockquote className="mt-7 text-lg font-bold leading-8 tracking-[-0.025em] text-[var(--navy)]/70">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-auto pt-8">
                  <p className="text-sm font-extrabold text-[var(--navy)]/65">{testimonial.author}</p>
                  <cite className="mt-2 block text-xs not-italic leading-5 text-[var(--navy)]/60">
                    {testimonial.source}
                  </cite>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
