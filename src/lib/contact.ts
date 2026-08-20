export type QuoteFormValues = {
  name: string;
  contact: string;
  service: string;
  message: string;
};

export const phoneHref = "tel:+447700323453";
export const whatsappHref = "https://wa.me/447700323453";
export const emailHref = "mailto:davidcameron481@yahoo.com";

export function buildQuoteWhatsAppUrl(values: QuoteFormValues): string {
  const body = [
    "Hello Silicone Solutions, I would like a free quote.",
    `Name: ${values.name}`,
    `Contact: ${values.contact}`,
    `Service: ${values.service}`,
    `Message: ${values.message}`,
  ].join("\n");

  return `${whatsappHref}?text=${encodeURIComponent(body)}`;
}
