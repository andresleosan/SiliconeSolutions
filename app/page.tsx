import {
  benefits,
  galleryItems,
  processSteps,
  services,
  siteCopy,
  testimonials,
} from "../src/content";
import { AboutSection } from "../src/components/AboutSection";
import { BeforeAfterSlider } from "../src/components/BeforeAfterSlider";
import { FinalCTA } from "../src/components/FinalCTA";
import { Footer } from "../src/components/Footer";
import { Hero } from "../src/components/Hero";
import { MobileContactBar } from "../src/components/MobileContactBar";
import { Navbar } from "../src/components/Navbar";
import { ProcessSteps } from "../src/components/ProcessSteps";
import { ProblemSection } from "../src/components/ProblemSection";
import { QuoteForm } from "../src/components/QuoteForm";
import { ServicesCarousel } from "../src/components/ServicesCarousel";
import { Testimonials } from "../src/components/Testimonials";
import { TrustBar } from "../src/components/TrustBar";
import { WhyChooseUs } from "../src/components/WhyChooseUs";
import { WorkGallery } from "../src/components/WorkGallery";
import { emailHref, phoneHref, whatsappHref } from "../src/lib/contact";

export default function Home() {
  return (
    <div className="site-shell" id="top">
      <Navbar whatsappHref={whatsappHref} />
      <main className="page-main">
        <Hero
          siteCopy={siteCopy.hero}
          videoSrc="/video/silicone-solutions.mp4"
          mobileVideoSrc="/video/silicone-solutions-mobile.mp4"
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
        <WhyChooseUs benefits={benefits} />
        <ProcessSteps steps={processSteps} />
        <Testimonials testimonials={testimonials} />
        <QuoteForm
          services={services}
          phoneHref={phoneHref}
          emailHref={emailHref}
          whatsappHref={whatsappHref}
        />
        <FinalCTA
          title={siteCopy.finalCta.title}
          description={siteCopy.finalCta.description}
          phoneHref={phoneHref}
        />
      </main>
      <Footer
        phoneHref={phoneHref}
        whatsappHref={whatsappHref}
        emailHref={emailHref}
        serviceArea={siteCopy.serviceArea}
      />
      <MobileContactBar whatsappHref={whatsappHref} phoneHref={phoneHref} />
    </div>
  );
}
