"use client";

import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";

import { type Service } from "../content";
import {
  buildQuoteWhatsAppUrl,
  validateQuoteForm,
  type QuoteFormErrors,
  type QuoteFormValues,
} from "../lib/contact";

type QuoteFormProps = {
  services: Service[];
  phoneHref: string;
  emailHref: string;
  whatsappHref: string;
};

const initialValues: QuoteFormValues = {
  name: "",
  contact: "",
  service: "",
  message: "",
};

const fieldClassName =
  "mt-2 min-h-12 w-full rounded-xl border border-[var(--warm-white)]/40 bg-[var(--warm-white)]/8 px-4 text-base text-[var(--warm-white)] outline-none transition-colors placeholder:text-[var(--warm-white)]/40 hover:border-[var(--warm-white)]/45 focus:border-[var(--orange)]";

export function QuoteForm({
  services,
  phoneHref,
  emailHref,
  whatsappHref,
}: QuoteFormProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<QuoteFormErrors>({});

  function updateField(field: keyof QuoteFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateQuoteForm(values);
    setErrors(nextErrors);

    const firstInvalidField = (Object.keys(nextErrors) as Array<keyof QuoteFormValues>)[0];
    if (firstInvalidField) {
      document.getElementById(`quote-${firstInvalidField}`)?.focus();
      return;
    }

    window.open(buildQuoteWhatsAppUrl(values), "_blank", "noopener,noreferrer");
  }

  return (
    <section id="contact" className="bg-[var(--warm-white)] py-20 sm:py-28" aria-labelledby="quote-title">
      <div className="container">
        <div className="grid grid-cols-1 overflow-hidden rounded-[2rem] bg-[var(--navy)] text-[var(--warm-white)] lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
          <div className="border-b border-[var(--warm-white)]/15 p-7 sm:p-10 lg:border-r lg:border-b-0 lg:p-12">
            <p className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--orange)]">
              <span className="h-0.5 w-9 bg-[var(--orange)]" aria-hidden="true" />
              Free quote
            </p>
            <h2
              id="quote-title"
              className="mt-6 max-w-[10ch] text-4xl font-extrabold leading-[0.98] tracking-[-0.065em] sm:text-6xl"
            >
              Tell us what needs sealing
            </h2>
            <p className="mt-6 max-w-md text-base leading-8 text-[var(--warm-white)]/70">
              Share the essentials, then review the prepared request before choosing whether to send it in WhatsApp.
            </p>

            <address className="mt-10 grid gap-3 not-italic">
              <a
                className="flex min-h-14 items-center gap-3 border-t border-[var(--warm-white)]/15 py-3 text-sm font-extrabold transition-colors hover:text-[var(--orange)]"
                href={phoneHref}
                aria-label="Call +44 7700 323453"
              >
                <Phone aria-hidden="true" className="text-[var(--orange)]" size={19} strokeWidth={1.9} />
                +44 7700 323453
              </a>
              <a
                className="flex min-h-14 items-center gap-3 border-t border-[var(--warm-white)]/15 py-3 text-sm font-extrabold transition-colors hover:text-[var(--orange)]"
                href={emailHref}
                aria-label="Email Silicone Solutions: davidcameron481@yahoo.com"
              >
                <Mail aria-hidden="true" className="text-[var(--orange)]" size={19} strokeWidth={1.9} />
                davidcameron481@yahoo.com
              </a>
              <a
                className="flex min-h-14 items-center gap-3 border-y border-[var(--warm-white)]/15 py-3 text-sm font-extrabold transition-colors hover:text-[var(--orange)]"
                href={whatsappHref}
                aria-label="Message on WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden="true" className="text-[var(--orange)]" size={19} strokeWidth={1.9} />
                Message on WhatsApp
              </a>
            </address>
          </div>

          <form className="min-w-0 p-7 sm:p-10 lg:p-12" noValidate onSubmit={handleSubmit}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="text-sm font-extrabold" htmlFor="quote-name">
                  Name
                </label>
                <input
                  className={fieldClassName}
                  id="quote-name"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  value={values.name}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "quote-name-error" : undefined}
                  onChange={(event) => updateField("name", event.target.value)}
                />
                {errors.name ? (
                  <p className="mt-2 text-sm font-bold text-[var(--orange)]" id="quote-name-error">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="text-sm font-extrabold" htmlFor="quote-contact">
                  Phone or email
                </label>
                <input
                  className={fieldClassName}
                  id="quote-contact"
                  type="text"
                  autoComplete="email"
                  maxLength={150}
                  value={values.contact}
                  aria-invalid={Boolean(errors.contact)}
                  aria-describedby={errors.contact ? "quote-contact-error" : undefined}
                  onChange={(event) => updateField("contact", event.target.value)}
                />
                {errors.contact ? (
                  <p className="mt-2 text-sm font-bold text-[var(--orange)]" id="quote-contact-error">
                    {errors.contact}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-extrabold" htmlFor="quote-service">
                Type of work
              </label>
              <select
                className={`${fieldClassName} [&>option]:bg-[var(--navy)]`}
                id="quote-service"
                value={values.service}
                aria-invalid={Boolean(errors.service)}
                aria-describedby={errors.service ? "quote-service-error" : undefined}
                onChange={(event) => updateField("service", event.target.value)}
              >
                <option value="">Choose a type of work</option>
                {services.map((service) => (
                  <option value={service.title} key={service.title}>
                    {service.title}
                  </option>
                ))}
              </select>
              {errors.service ? (
                <p className="mt-2 text-sm font-bold text-[var(--orange)]" id="quote-service-error">
                  {errors.service}
                </p>
              ) : null}
            </div>

            <div className="mt-6">
              <label className="text-sm font-extrabold" htmlFor="quote-message">
                Message
              </label>
              <textarea
                className={`${fieldClassName} resize-y py-3`}
                id="quote-message"
                maxLength={1000}
                rows={5}
                value={values.message}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "quote-message-error" : undefined}
                onChange={(event) => updateField("message", event.target.value)}
              />
              {errors.message ? (
                <p className="mt-2 text-sm font-bold text-[var(--orange)]" id="quote-message-error">
                  {errors.message}
                </p>
              ) : null}
            </div>

            <button className="button button--orange mt-8 w-full sm:w-auto" type="submit">
              Build my free quote request
              <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.25} />
            </button>
            <p className="mt-4 text-xs leading-5 text-[var(--warm-white)]/65">
              Nothing is sent until you choose to continue in WhatsApp.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
