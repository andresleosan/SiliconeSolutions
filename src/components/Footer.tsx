import { LogoMark } from "./LogoMark";

type FooterProps = {
  phoneHref: string;
  whatsappHref: string;
  emailHref: string;
  serviceArea: string;
};

export function Footer({ phoneHref, whatsappHref, emailHref, serviceArea }: FooterProps) {
  return (
    <footer className="bg-[var(--navy)] py-12 text-[var(--warm-white)]">
      <div className="container grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <LogoMark />
          <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--orange)]">
            {serviceArea}
          </p>
          <p className="mt-3 max-w-md text-sm leading-7 text-[var(--warm-white)]/65">
            Specialist silicone sealing for homes and businesses across Jersey.
          </p>
        </div>

        <address className="grid gap-3 not-italic sm:grid-cols-3 sm:gap-6">
          <a
            className="text-sm font-extrabold transition-colors hover:text-[var(--orange)]"
            href={phoneHref}
            aria-label="Call +44 7700 323453"
          >
            +44 7700 323453
          </a>
          <a
            className="text-sm font-extrabold transition-colors hover:text-[var(--orange)]"
            href={whatsappHref}
            aria-label="Message on WhatsApp"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          <a
            className="break-all text-sm font-extrabold transition-colors hover:text-[var(--orange)]"
            href={emailHref}
            aria-label="Email Silicone Solutions: davidcameron481@yahoo.com"
          >
            davidcameron481@yahoo.com
          </a>
        </address>
      </div>
      <div className="container mt-10 border-t border-[var(--warm-white)]/15 pt-6">
        <p className="text-xs text-[var(--warm-white)]/55">© 2026 Silicone Solutions C.I. Ltd</p>
      </div>
    </footer>
  );
}
