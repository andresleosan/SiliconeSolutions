export type Service = {
  title: string;
  description: string;
  benefit: string;
  image: string;
  imageAlt: string;
  icon: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  source: string;
  verified: boolean;
};

export type GalleryItem = {
  src: string;
  alt: string;
  label: string;
};

export type Benefit = {
  title: string;
  description: string;
  icon: string;
};

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export const services: Service[] = [
  {
    title: "Bathroom Silicone Sealing",
    description: "Clean silicone sealing around baths, sinks and shower areas.",
    benefit: "A precise, cleaner-looking finish for wet areas.",
    image: "/images/services.jpg",
    imageAlt: "Fresh silicone sealing around a modern bath and shower area",
    icon: "Bath",
  },
  {
    title: "Kitchen Silicone Sealing",
    description: "Neat sealing around worktops, sinks and splashback edges.",
    benefit: "A professional finish for the areas used every day.",
    image: "/images/poceta.jpg",
    imageAlt: "Clean silicone seal around a kitchen sink and worktop",
    icon: "CookingPot",
  },
  {
    title: "Shower Resealing",
    description: "Remove failed sealant and reseal shower trays, screens and joints.",
    benefit: "Restore a fresh, tidy appearance to your shower space.",
    image: "/images/banera.jpg",
    imageAlt: "Resealed bath edge with a clean silicone finish",
    icon: "ShowerHead",
  },
  {
    title: "Window Sealing",
    description: "Professional sealing for window frames and surrounding joints.",
    benefit: "A neat finish for domestic and commercial spaces.",
    image: "/images/lavamanos.jpg",
    imageAlt: "Neat silicone sealing detail around a washbasin",
    icon: "PanelTop",
  },
  {
    title: "Commercial Sealing",
    description: "Silicone sealing for commercial washrooms, kitchens and maintenance work.",
    benefit: "Specialist attention for busy property environments.",
    image: "/images/services.jpg",
    imageAlt: "Silicone sealing work prepared for a commercial washroom",
    icon: "Building2",
  },
  {
    title: "Sealant Replacement",
    description: "Careful removal of cracked or peeling sealant before a clean new bead.",
    benefit: "Refresh tired joints with a durable-looking finish.",
    image: "/images/banera-antes.jpg",
    imageAlt: "Old sealant prepared for careful replacement around a bath",
    icon: "RefreshCw",
  },
];

export const benefits: Benefit[] = [
  {
    title: "Professional Finish",
    description: "Careful preparation and a clean bead for a polished result.",
    icon: "Sparkles",
  },
  {
    title: "Local Jersey Specialists",
    description: "A local service for homes and businesses across Jersey.",
    icon: "MapPin",
  },
  {
    title: "Fast Turnaround",
    description: "Clear communication and a responsive route from enquiry to work.",
    icon: "Zap",
  },
  {
    title: "Competitive Pricing",
    description: "Straightforward quotes shaped around the work your property needs.",
    icon: "BadgePoundSterling",
  },
  {
    title: "Residential & Commercial",
    description: "Experience across domestic spaces and commercial properties.",
    icon: "Building2",
  },
  {
    title: "Reliable Service",
    description: "Professional attention to detail and dependable communication.",
    icon: "MessageCircle",
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Request a Quote",
    description: "Tell us what needs attention and share the best way to reach you.",
  },
  {
    number: "02",
    title: "Site Assessment",
    description: "We review the area, the existing sealant and the work involved.",
  },
  {
    number: "03",
    title: "Professional Application",
    description: "Failed sealant is removed, surfaces are prepared and a clean bead is applied.",
  },
  {
    number: "04",
    title: "Perfect Finish Delivered",
    description: "You are left with a tidy, durable-looking finish and clear communication throughout.",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote: "I can highly recommend David Cameron from Silicone Solutions C.I. Ltd. He does silicone work for everything from bathrooms to kitchens and flooring etc. 👌",
    author: "Kate Forde",
    source: "Good Builders Jersey Business - Facebook recommendation",
    verified: true,
  },
  {
    quote: "The clean finish and careful attention to detail are exactly what we look for.",
    author: "Provisional customer example",
    source: "Example review - replace before launch",
    verified: false,
  },
  {
    quote: "A straightforward local service with clear communication from quote to finish.",
    author: "Provisional customer example",
    source: "Example review - replace before launch",
    verified: false,
  },
];

export const galleryItems: GalleryItem[] = [
  {
    src: "/images/services.jpg",
    alt: "Silicone sealing work in a bathroom setting",
    label: "Bathroom sealing",
  },
  {
    src: "/images/poceta.jpg",
    alt: "Finished silicone seal around a sink",
    label: "Sink sealing",
  },
  {
    src: "/images/lavamanos.jpg",
    alt: "Clean sealant detail around a washbasin",
    label: "Washbasin detail",
  },
];

export const siteCopy = {
  businessName: "Silicone Solutions C.I. Ltd",
  serviceArea: "Jersey, Channel Islands",
  navigation: ["Services", "About", "Our Work", "Contact"],
  hero: {
    eyebrow: "Jersey's silicone sealing specialists",
    title: "The Perfect Finish. Every Time.",
    description:
      "Professional silicone sealing across Jersey for homes and businesses. Clean workmanship, durable results and competitive pricing.",
  },
  trustPoints: [
    "Local Jersey Service",
    "15+ Years Experience",
    "Fast Response",
    "Professional Finish",
  ],
  problem: {
    title: "When old sealant lets your space down",
    description:
      "Black mould, cracked joints and poor finishing can make a well-kept property feel neglected.",
    items: [
      "Black mould around baths and showers",
      "Cracked or peeling silicone",
      "Water damage and leaks",
      "Poor finishing from previous contractors",
    ],
  },
  solution: {
    title: "A specialist process from removal to finish",
    description:
      "We remove failed sealant, prepare the surface, apply a clean bead and leave a durable finish.",
  },
  about: {
    title: "Local experience. Specialist attention.",
    description:
      "Silicone Solutions C.I. Ltd provides domestic and commercial silicone sealing across Jersey, backed by more than 15 years of experience and reliable communication.",
  },
  finalCta: {
    title: "Ready for a Perfect Finish?",
    description:
      "Get your free quote today and give your property the professional finish it deserves.",
  },
} as const;
