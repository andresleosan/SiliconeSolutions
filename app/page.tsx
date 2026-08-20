import { processSteps, services, siteCopy } from "../src/content";
import { AboutSection } from "../src/components/AboutSection";
import { Hero } from "../src/components/Hero";
import { MobileContactBar } from "../src/components/MobileContactBar";
import { Navbar } from "../src/components/Navbar";
import { ProblemSection } from "../src/components/ProblemSection";
import { ServicesCarousel } from "../src/components/ServicesCarousel";
import { TrustBar } from "../src/components/TrustBar";
import { phoneHref, whatsappHref } from "../src/lib/contact";

export default function Home() {
  return (
    <div className="site-shell" id="top">
      <Navbar whatsappHref={whatsappHref} />
      <main className="page-main">
        <Hero
          siteCopy={siteCopy.hero}
          videoSrc="/video/silicone-solutions.mp4"
          posterSrc="/images/services.jpg"
          phoneHref={phoneHref}
          quoteHref={whatsappHref}
        />
        <TrustBar trustItems={siteCopy.trustPoints} />
        <ProblemSection
          problem={siteCopy.problem}
          solution={siteCopy.solution}
          processSteps={processSteps}
          problemImage="/images/banera-antes.jpg"
          resultImage="/images/banera.jpg"
        />
        <AboutSection
          about={siteCopy.about}
          businessName={siteCopy.businessName}
          serviceArea={siteCopy.serviceArea}
          imageSrc="/images/lavamanos.jpg"
          phoneHref={phoneHref}
        />
        <ServicesCarousel services={services} />
        <div id="contact" className="h-0" aria-hidden="true" />
      </main>
      <MobileContactBar whatsappHref={whatsappHref} phoneHref={phoneHref} />
    </div>
  );
}
