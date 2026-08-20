import { galleryItems, processSteps, services, siteCopy } from "../src/content";
import { AboutSection } from "../src/components/AboutSection";
import { BeforeAfterSlider } from "../src/components/BeforeAfterSlider";
import { Hero } from "../src/components/Hero";
import { MobileContactBar } from "../src/components/MobileContactBar";
import { Navbar } from "../src/components/Navbar";
import { ProblemSection } from "../src/components/ProblemSection";
import { ServicesCarousel } from "../src/components/ServicesCarousel";
import { TrustBar } from "../src/components/TrustBar";
import { WorkGallery } from "../src/components/WorkGallery";
import { phoneHref, whatsappHref } from "../src/lib/contact";

export default function Home() {
  return (
    <div className="site-shell" id="top">
      <Navbar whatsappHref={whatsappHref} />
      <main className="page-main">
        <Hero
          siteCopy={siteCopy.hero}
          videoSrc="/video/silicone-solutions.mp4"
          posterSrc="/images/services.webp"
          phoneHref={phoneHref}
          quoteHref={whatsappHref}
        />
        <TrustBar trustItems={siteCopy.trustPoints} />
        <ProblemSection
          problem={siteCopy.problem}
          solution={siteCopy.solution}
          processSteps={processSteps}
          problemImage="/images/banera-antes.webp"
          resultImage="/images/banera.webp"
        />
        <AboutSection
          about={siteCopy.about}
          businessName={siteCopy.businessName}
          serviceArea={siteCopy.serviceArea}
          imageSrc="/images/lavamanos.webp"
          phoneHref={phoneHref}
        />
        <ServicesCarousel services={services} />
        <BeforeAfterSlider
          beforeSrc="/images/banera-antes.webp"
          afterSrc="/images/banera.webp"
          beforeAlt="Bath edge showing an ageing silicone seal before specialist work"
          afterAlt="Bath edge showing a clean finished silicone seal"
        />
        <WorkGallery items={galleryItems} />
        <div id="contact" className="h-0" aria-hidden="true" />
      </main>
      <MobileContactBar whatsappHref={whatsappHref} phoneHref={phoneHref} />
    </div>
  );
}
