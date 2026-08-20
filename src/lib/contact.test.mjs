import assert from "node:assert/strict";
import test from "node:test";

import * as contact from "./contact.ts";

const validValues = {
  name: "  Test Visitor  ",
  contact: "  test@example.com  ",
  service: "  Bathroom Silicone Sealing  ",
  message: "  Please quote a bathroom reseal.  ",
};

test("normalizeQuoteFormValues trims all four fields", () => {
  assert.deepEqual(contact.normalizeQuoteFormValues(validValues), {
    name: "Test Visitor",
    contact: "test@example.com",
    service: "Bathroom Silicone Sealing",
    message: "Please quote a bathroom reseal.",
  });
});

test("buildQuoteWhatsAppUrl trims and encodes every field", () => {
  const url = new URL(contact.buildQuoteWhatsAppUrl(validValues));
  assert.equal(url.origin + url.pathname, "https://wa.me/447700323453");
  assert.equal(
    url.searchParams.get("text"),
    [
      "Hello Silicone Solutions, I would like a free quote.",
      "Name: Test Visitor",
      "Contact: test@example.com",
      "Service: Bathroom Silicone Sealing",
      "Message: Please quote a bathroom reseal.",
    ].join("\n"),
  );
});

test("validateQuoteForm reports each whitespace-only field", () => {
  assert.equal(typeof contact.validateQuoteForm, "function");
  assert.deepEqual(
    contact.validateQuoteForm({ name: " ", contact: "", service: "  ", message: "" }),
    {
      name: "Enter your name.",
      contact: "Enter a phone number or email address.",
      service: "Choose a type of work.",
      message: "Tell us what needs sealing.",
    },
  );
});

test("validateQuoteForm accepts normalized non-empty values", () => {
  assert.equal(typeof contact.validateQuoteForm, "function");
  assert.deepEqual(contact.validateQuoteForm(validValues), {});
});
