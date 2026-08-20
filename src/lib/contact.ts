export type QuoteFormValues = {
  name: string;
  contact: string;
  service: string;
  message: string;
};

export type QuoteFormErrors = Partial<Record<keyof QuoteFormValues, string>>;

export const phoneHref = "tel:+447700323453";
export const whatsappHref = "https://wa.me/447700323453";
export const emailHref = "mailto:davidcameron481@yahoo.com";

export function normalizeQuoteFormValues(values: QuoteFormValues): QuoteFormValues {
  return {
    name: values.name.trim(),
    contact: values.contact.trim(),
    service: values.service.trim(),
    message: values.message.trim(),
  };
}

export function validateQuoteForm(values: QuoteFormValues): QuoteFormErrors {
  const normalized = normalizeQuoteFormValues(values);
  const errors: QuoteFormErrors = {};

  if (!normalized.name) errors.name = "Enter your name.";
  if (!normalized.contact) errors.contact = "Enter a phone number or email address.";
  if (!normalized.service) errors.service = "Choose a type of work.";
  if (!normalized.message) errors.message = "Tell us what needs sealing.";

  return errors;
}

export function buildQuoteWhatsAppUrl(values: QuoteFormValues): string {
  const normalized = normalizeQuoteFormValues(values);
  const body = [
    "Hello Silicone Solutions, I would like a free quote.",
    `Name: ${normalized.name}`,
    `Contact: ${normalized.contact}`,
    `Service: ${normalized.service}`,
    `Message: ${normalized.message}`,
  ].join("\n");

  return `${whatsappHref}?text=${encodeURIComponent(body)}`;
}
