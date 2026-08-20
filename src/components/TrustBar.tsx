import { CalendarDays, MapPin, Sparkles, Zap, type LucideIcon } from "lucide-react";

import { siteCopy } from "../content";

type TrustItem = (typeof siteCopy.trustPoints)[number];

type TrustBarProps = {
  trustItems: readonly TrustItem[];
};

const trustIcons: Record<TrustItem, LucideIcon> = {
  "Local Jersey Service": MapPin,
  "15+ Years Experience": CalendarDays,
  "Fast Response": Zap,
  "Professional Finish": Sparkles,
};

export function TrustBar({ trustItems }: TrustBarProps) {
  return (
    <section className="border-b border-[var(--stone)] bg-[var(--warm-white)]" aria-label="Why customers choose us">
      <div className="container grid divide-y divide-[var(--stone)] py-2 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {trustItems.map((item) => {
          const Icon = trustIcons[item];

          return (
            <div className="flex items-center gap-3 px-3 py-4 first:pl-0 last:pr-0 sm:px-5 lg:py-6" key={item}>
              <Icon className="shrink-0 text-[var(--orange)]" aria-hidden="true" size={20} strokeWidth={1.8} />
              <span className="text-sm font-extrabold tracking-[-0.02em] text-[var(--navy)]">{item}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
