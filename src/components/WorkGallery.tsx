import Image from "next/image";

import { SectionHeading } from "./SectionHeading";
import { type GalleryItem } from "../content";

type WorkGalleryProps = {
  items: GalleryItem[];
};

export function WorkGallery({ items }: WorkGalleryProps) {
  return (
    <section className="bg-[var(--stone)] py-20 sm:py-28" aria-labelledby="gallery-title">
      <div className="container">
        <SectionHeading
          eyebrow="Our work"
          title="Services and sealing details"
          body="Explore our service information alongside close-up views of clean silicone sealing details."
          id="gallery-title"
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
          {items.map((item, index) => (
            <figure
              className={`group m-0 ${index === 0 ? "sm:col-span-2 lg:col-span-7" : "lg:col-span-5"}`}
              key={item.src}
            >
              <div className="overflow-hidden rounded-[1.5rem] bg-[var(--warm-white)]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  loading="lazy"
                  sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) 50vw, 58vw"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between gap-4 text-xs font-extrabold uppercase tracking-[0.12em] text-[var(--navy)]/65">
                <span>{item.label}</span>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
