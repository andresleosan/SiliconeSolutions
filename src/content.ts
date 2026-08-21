type MediaDimensions = {
  width: number;
  height: number;
};

export type Service = MediaDimensions & {
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

export type GalleryItem = MediaDimensions & {
  src: string;
  alt: string;
  label: string;
  description: string;
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
    image: "/images/services.webp",
    imageAlt: "Silicone Solutions service overview flyer with contact and service information",
    width: 947,
    height: 2048,
    icon: "Bath",
  },
  {
    title: "Kitchen Silicone Sealing",
    description: "Neat sealing around worktops, sinks and splashback edges.",
    benefit: "A professional finish for the areas used every day.",
    image: "/images/poceta.webp",
    imageAlt: "Clean white silicone seal around the base of a toilet",
    width: 1200,
    height: 1600,
    icon: "CookingPot",
  },
  {
    title: "Shower Resealing",
    description: "Remove failed sealant and reseal shower trays, screens and joints.",
    benefit: "Restore a fresh, tidy appearance to your shower space.",
    image: "/images/banera.webp",
    imageAlt: "Resealed bath edge with a clean silicone finish",
    width: 1200,
    height: 1600,
    icon: "ShowerHead",
  },
  {
    title: "Window Sealing",
    description: "Professional sealing for window frames and surrounding joints.",
    benefit: "A neat finish for domestic and commercial spaces.",
    image: "/images/lavamanos.webp",
    imageAlt: "Clean white silicone seal between a washbasin and blue splashback",
    width: 1200,
    height: 1600,
    icon: "PanelTop",
  },
  {
    title: "Commercial Sealing",
    description: "Silicone sealing for commercial washrooms, kitchens and maintenance work.",
    benefit: "Specialist attention for busy property environments.",
    image: "/images/services.webp",
    imageAlt: "Silicone Solutions service overview flyer with contact and service information",
    width: 947,
    height: 2048,
    icon: "Building2",
  },
  {
    title: "Sealant Replacement",
    description: "Careful removal of cracked or peeling sealant before a clean new bead.",
    benefit: "Refresh tired joints with a durable-looking finish.",
    image: "/images/banera-antes.webp",
    imageAlt: "Old sealant prepared for careful replacement around a bath",
    width: 1200,
    height: 1600,
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
    quote: "I can highly recommend David Cameron from Silicone Solutions C.I. Ltd. He does silicone work for everything from bathrooms to kitchens and flooring etc.",
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
    src: "/images/lavamanos.webp",
    alt: "Clean white silicone seal between a washbasin and blue splashback",
    label: "Washbasin sealing",
    description: "A neat white seal following the washbasin and splashback joint.",
    width: 1200,
    height: 1600,
  },
  {
    src: "/images/poceta.webp",
    alt: "Clean white silicone seal around the base of a toilet",
    label: "Toilet base sealing",
    description: "A clean silicone bead following the toilet base.",
    width: 1200,
    height: 1600,
  },
  {
    src: "/images/banera.webp",
    alt: "Bath edge showing a clean finished silicone seal",
    label: "Bath reseal result",
    description: "The completed bath edge after resealing.",
    width: 1200,
    height: 1600,
  },
  {
    src: "/images/banera-antes.webp",
    alt: "Bath edge showing an ageing silicone seal before replacement",
    label: "Before condition",
    description: "The original bath edge before the replacement work.",
    width: 1200,
    height: 1600,
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
