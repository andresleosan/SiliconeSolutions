import {
  BadgePoundSterling,
  Building2,
  MapPin,
  MessageCircle,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { type Benefit } from "../content";
import { SectionHeading } from "./SectionHeading";

type WhyChooseUsProps = {
  benefits: Benefit[];
};

const benefitIcons: Record<string, LucideIcon> = {
  BadgePoundSterling,
  Building2,
  MapPin,
  MessageCircle,
  Sparkles,
  Zap,
};

export function WhyChooseUs({ benefits }: WhyChooseUsProps) {
  return (
    <section className="bg-[var(--warm-white)] py-20 sm:py-28" aria-labelledby="benefits-title">
      <div className="container">
        <SectionHeading
          eyebrow="Why choose us"
          title="Why Jersey Chooses Silicone Solutions"
          body="Specialist sealing shaped around clean work, clear communication and local service."
          id="benefits-title"
        />
        <div className="mt-12 grid border-l border-t border-[var(--stone)] sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => {
            const Icon = benefitIcons[benefit.icon];

            return (
              <article
                className="relative min-h-64 border-b border-r border-[var(--stone)] p-7 sm:p-8"
                key={benefit.title}
              >
                <span
                  className="text-xs font-extrabold tracking-[0.14em] text-[var(--navy)]/70"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Icon
                  className="mt-10 text-[var(--orange)]"
                  aria-hidden="true"
                  size={28}
                  strokeWidth={1.8}
                />
                <h3 className="mt-6 text-2xl font-extrabold tracking-[-0.045em]">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--navy)]/70">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
