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

const siteUrl = "https://siliconesolutions.pages.dev";
const socialImageAlt = "Silicone Solutions professional silicone sealing in Jersey";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: socialImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional Silicone Sealing in Jersey | Silicone Solutions",
    description:
      "Professional silicone sealing across Jersey for homes and businesses. Clean workmanship, durable results and competitive pricing.",
    images: [{ url: "/og-image.png", alt: socialImageAlt }],
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
      <head>
        <link rel="canonical" href={`${siteUrl}/`} />
        <meta property="og:url" content={`${siteUrl}/`} />
        <link rel="preload" as="image" href="/images/services.webp" fetchPriority="high" />
        <style>{`
          main > section:first-child > .container > div,
          main > section:first-child > .container > figure {
            opacity: 1 !important;
            transform: none !important;
          }

          @media (max-width: 767px) {
            main > section:first-child > .container > div:first-child {
              display: flex;
              min-height: calc(100svh - 11.5rem);
              flex-direction: column;
              justify-content: center;
            }
          }
        `}</style>
      </head>
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
