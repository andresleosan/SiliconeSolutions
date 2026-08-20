import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { siteCopy } from "../src/content";
import { emailHref, phoneHref } from "../src/lib/contact";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Professional Silicone Sealing in Jersey | Silicone Solutions",
  description:
    "Professional silicone sealing across Jersey for homes and businesses. Clean workmanship, durable results and competitive pricing.",
  openGraph: {
    title: "Professional Silicone Sealing in Jersey | Silicone Solutions",
    description:
      "Professional silicone sealing across Jersey for homes and businesses. Clean workmanship, durable results and competitive pricing.",
    type: "website",
    locale: "en_GB",
    siteName: siteCopy.businessName,
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: siteCopy.businessName,
  telephone: phoneHref.replace("tel:", ""),
  email: emailHref.replace("mailto:", ""),
  areaServed: siteCopy.serviceArea,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={manrope.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
