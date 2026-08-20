import { type ProcessStep } from "../content";

type ProcessStepsProps = {
  steps: ProcessStep[];
};

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <section className="bg-[var(--navy)] py-20 text-[var(--warm-white)] sm:py-28" aria-labelledby="process-title">
      <div className="container">
        <p className="mb-5 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--orange)]">
          <span className="h-0.5 w-9 bg-[var(--orange)]" aria-hidden="true" />
          How we work
        </p>
        <h2
          id="process-title"
          className="max-w-[12ch] text-4xl font-extrabold leading-[0.98] tracking-[-0.065em] text-[var(--warm-white)] sm:text-6xl"
        >
          A clear route to a perfect finish
        </h2>

        <ol className="mt-14 grid gap-10 border-l-2 border-[var(--orange)] pl-7 lg:grid-cols-4 lg:gap-8 lg:border-l-0 lg:border-t-2 lg:pl-0">
          {steps.map((step) => (
            <li className="relative lg:pt-12" key={step.number}>
              <span className="inline-flex min-h-10 items-center bg-[var(--navy)] pr-4 text-sm font-extrabold tracking-[0.16em] text-[var(--orange)] lg:absolute lg:-top-5 lg:left-0 lg:min-w-14 lg:justify-center lg:px-2">
                {step.number}
              </span>
              <h3 className="mt-4 text-xl font-extrabold tracking-[-0.04em] text-[var(--warm-white)] lg:mt-0">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[var(--warm-white)]/70">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
