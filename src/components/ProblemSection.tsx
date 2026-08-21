import Image from "next/image";
import { AlertCircle, Check, Droplets, Hammer, type LucideIcon } from "lucide-react";

import { SectionHeading } from "./SectionHeading";
import { siteCopy, type ProcessStep } from "../content";

type ProblemSectionProps = {
  problem: typeof siteCopy.problem;
  solution: typeof siteCopy.solution;
  processSteps: readonly ProcessStep[];
  problemImage: string;
  resultImage: string;
};

type ProblemItem = (typeof siteCopy.problem.items)[number];

const problemIcons: Record<ProblemItem, LucideIcon> = {
  "Black mould around baths and showers": Droplets,
  "Cracked or peeling silicone": AlertCircle,
  "Water damage and leaks": Droplets,
  "Poor finishing from previous contractors": Hammer,
};

export function ProblemSection({
  problem,
  solution,
  processSteps,
  problemImage,
  resultImage,
}: ProblemSectionProps) {
  return (
    <section id="work" className="bg-[var(--warm-white)] py-20 sm:py-28" aria-labelledby="problem-title">
      <div className="container">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="The problem"
              title={problem.title}
              body={problem.description}
              id="problem-title"
            />
            <ul className="mt-9 grid gap-3" aria-label="Common silicone sealing problems">
              {problem.items.map((item) => {
                const Icon = problemIcons[item];

                return (
                  <li className="flex items-start gap-3 border-t border-[var(--stone)] py-4 text-sm font-bold text-[var(--navy)]" key={item}>
                    <Icon className="mt-0.5 shrink-0 text-[var(--orange)]" aria-hidden="true" size={18} strokeWidth={1.8} />
                    <span>{item}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 sm:items-start sm:content-start">
            <figure className="m-0">
              <div className="overflow-hidden rounded-[1.5rem] bg-[var(--stone)]">
                <Image
                  src={problemImage}
                  alt="Bath edge showing an existing silicone seal before specialist work"
                  width={1200}
                  height={1600}
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 34vw"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--navy)]/60">
                Visible result: an ageing sealant edge
              </figcaption>
            </figure>
            <figure className="m-0">
              <div className="overflow-hidden rounded-[1.5rem] bg-[var(--stone)]">
                <Image
                  src={resultImage}
                  alt="Bath edge showing a clean finished silicone seal"
                  width={1200}
                  height={1600}
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 34vw"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--navy)]/60">
                Visible result: a cleaner finished edge
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="mt-24 grid gap-10 border-t border-[var(--stone)] pt-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <SectionHeading eyebrow="The solution" title={solution.title} body={solution.description} />
          <ol className="grid gap-0 sm:grid-cols-2">
            {processSteps.map((step) => (
              <li className="flex gap-4 border-b border-[var(--stone)] py-5 sm:nth-[n+3]:border-b-0" key={step.number}>
                <span
                  className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-[var(--navy)] px-2 text-sm font-extrabold text-[var(--orange)]"
                  aria-hidden="true"
                >
                  {step.number}
                </span>
                <div>
                  <h3 className="m-0 text-base font-extrabold tracking-[-0.03em] text-[var(--navy)]">{step.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--navy)]/70">{step.description}</p>
                  <Check className="mt-4 text-[var(--orange)]" aria-hidden="true" size={20} strokeWidth={1.8} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
