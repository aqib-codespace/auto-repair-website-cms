/**
 * Every word, number, and image path the template ships with.
 *
 * This file has two jobs, which is why it is plain data with zero imports:
 *
 *   1. `scripts/seed.mjs` imports it to populate a fresh Supabase project.
 *   2. `src/db/queries/content.js` falls back to it when Supabase env vars
 *      are absent, so `npm run dev` renders a complete site with no setup.
 *
 * To rebrand the template for a new shop, either edit these values and
 * re-seed, or (better) leave them alone and change everything from /admin.
 */

export const DEFAULT_SETTINGS = {
  company: "Meridian Auto Care",
  tagline: "Auto repair you can trust",
  logoUrl: "",
  phone: "(817) 555-0142",
  email: "service@meridianautocare.com",
  addressLine1: "1420 Meridian Way, Suite B",
  addressLine2: "Fort Worth, TX 76102",
  mapEmbedUrl: "",
  scheduleUrl: "#contact",
  brandColor: "#1A4FD1",
  accentColor: "#F59E0B",
  metaTitle: "Meridian Auto Care — Honest Auto Repair in Fort Worth, TX",
  metaDescription:
    "ASE-certified technicians, transparent pricing, and fast turnaround on brakes, diagnostics, transmissions, and full-service maintenance. Schedule service today.",
  siteUrl: "http://localhost:3000",
  socialLinks: [
    { platform: "Facebook", url: "https://facebook.com" },
    { platform: "Instagram", url: "https://instagram.com" },
    { platform: "Google", url: "https://google.com" },
    { platform: "YouTube", url: "https://youtube.com" },
  ],
  financingEnabled: true,
  template: "momentum",
};

export const DEFAULT_BLOCKS = {
  hero: {
    eyebrow: "ASE Certified • Family Owned Since 1998",
    headline: "Auto Repair You Can Trust.",
    subheadline:
      "Professional maintenance and repair services backed by honest communication and experienced technicians.",
    primaryCtaLabel: "Schedule Service",
    secondaryCtaLabel: "Call Now",
    trustIndicators: [
      { icon: "badge-check", label: "ASE Certified" },
      { icon: "users", label: "Family Owned" },
      { icon: "hand-coins", label: "Honest Pricing" },
      { icon: "clock", label: "Fast Turnaround" },
    ],
    image: {
      src: "/images/hero-technicians.jpg",
      alt: "Vehicles raised on lifts inside a bright, modern service facility",
    },
    stats: [
      { value: "25+", label: "Years in business" },
      { value: "40k+", label: "Vehicles serviced" },
      { value: "4.9", label: "Average rating" },
      { value: "1,200+", label: "Verified reviews" },
    ],
  },

  makes: {
    heading: "Servicing every major make — domestic, import, hybrid, and fleet",
    items: [
      "Toyota",
      "Honda",
      "Ford",
      "Chevrolet",
      "BMW",
      "Mercedes-Benz",
      "Subaru",
      "Nissan",
      "Volkswagen",
      "Hyundai",
      "Kia",
      "Ram",
      "Jeep",
      "Lexus",
      "Audi",
      "Mazda",
    ],
  },

  services_intro: {
    eyebrow: "What We Do",
    heading: "Complete care for every mile",
    body: "From routine oil changes to complex diagnostics, our technicians work on all makes and models with factory-grade equipment and parts we stand behind.",
  },

  about: {
    eyebrow: "About Us",
    heading: "A neighborhood shop with dealership-level capability",
    paragraphs: [
      "Meridian Auto Care has served the same community for over twenty-five years. What started as a two-bay garage is now a full-service facility — but the way we treat people has not changed.",
      "Every repair starts with a written estimate and a conversation. We show you what we found, explain what is urgent and what can wait, and never begin work you have not approved.",
    ],
    stats: [
      { value: "12", label: "Average years per technician" },
      { value: "60+", label: "Makes and models serviced" },
      { value: "98%", label: "Jobs finished same week" },
      { value: "24/24", label: "Month / thousand-mile warranty" },
    ],
    ctaLabel: "Meet the team",
    image: {
      src: "/images/about-shop.jpg",
      alt: "The Meridian Auto Care service floor with vehicles on lifts and organized tool stations",
    },
  },

  why_us: {
    eyebrow: "Why Choose Us",
    heading: "Built on work that holds up",
    body: "Four commitments that shape every job that rolls through our bays.",
    features: [
      {
        icon: "wrench",
        title: "Experienced Technicians",
        description:
          "ASE-certified pros with an average of twelve years on the floor and ongoing factory training every year.",
      },
      {
        icon: "hand-coins",
        title: "Transparent Pricing",
        description:
          "Written estimates before we start, itemized invoices when we finish, and no surprise line items in between.",
      },
      {
        icon: "shield-check",
        title: "Quality Parts",
        description:
          "OEM and premium aftermarket components backed by a 24-month, 24,000-mile parts and labor warranty.",
      },
      {
        icon: "thumbs-up",
        title: "Customer Satisfaction",
        description:
          "Digital inspection photos, status updates by text, and a shuttle so your day keeps moving.",
      },
    ],
  },

  process: {
    eyebrow: "How It Works",
    heading: "Five steps from problem to peace of mind",
    body: "No guesswork and no runaround — here is exactly what happens after you book.",
    steps: [
      {
        icon: "calendar-check",
        title: "Schedule",
        description: "Book online in under a minute or call and talk to a real advisor.",
      },
      {
        icon: "search",
        title: "Inspection",
        description: "A certified tech performs a documented multi-point inspection.",
      },
      {
        icon: "clipboard-list",
        title: "Estimate",
        description: "You get photos, priorities, and a firm price before anything begins.",
      },
      {
        icon: "wrench",
        title: "Repair",
        description: "Approved work is completed with quality parts and road-tested.",
      },
      {
        icon: "key",
        title: "Drive Away",
        description: "We walk you through the invoice, warranty, and what to watch next.",
      },
    ],
  },

  reviews_intro: {
    eyebrow: "Customer Reviews",
    heading: "Trusted by thousands of local drivers",
    body: "We earn repeat customers the slow way — one honest repair at a time.",
    ratingLabel: "4.9 average from 1,200+ verified reviews",
  },

  cta_band: {
    heading: "Something not sounding right?",
    body: "Most inspections are scheduled within 24 hours. Tell us what you are hearing and we will take it from there.",
    primaryCtaLabel: "Schedule Service",
    secondaryCtaLabel: "Call Now",
  },

  financing: {
    eyebrow: "For Shop Owners",
    heading: "Looking to Grow Your Auto Repair Business?",
    body: "Whether you're purchasing equipment, expanding your current location, acquiring another shop, or buying the building your business operates from, financing options may be available.",
    bullets: [
      "Equipment purchases — lifts, alignment racks, and diagnostic tools",
      "Expansion or build-out of your existing location",
      "Acquisition of another shop or book of business",
      "Owner-occupied commercial real estate purchases",
    ],
    ctaLabel: "Talk to an Advisor",
    ctaHref: "#contact",
    image: {
      src: "/images/financing.jpg",
      alt: "A shop owner reviewing expansion plans on a tablet inside a modern service facility",
    },
  },

  gallery_intro: {
    eyebrow: "Our Shop",
    heading: "Take a look around",
    body: "A clean, organized facility is the first sign of careful work.",
    promoHeading: "Come see the bays before you book",
    promoBody:
      "Walk-in tours are welcome any weekday. Meet the technician who will work on your vehicle, and see exactly where it will be worked on.",
    promoCtaLabel: "Book a visit",
  },

  faq_intro: {
    eyebrow: "FAQ",
    heading: "Questions we hear every week",
    body: "Still not sure about something? Call us — we would rather answer than have you guess.",
  },

  contact: {
    eyebrow: "Schedule Service",
    heading: "Book your appointment",
    body: "Tell us about your vehicle and what you're experiencing. We'll confirm your appointment within one business hour.",
    formNote:
      "Submitting this form does not confirm an appointment until a service advisor follows up.",
    successMessage:
      "Thanks — your request is in. A service advisor will confirm your appointment shortly.",
    hours: [
      { days: "Monday – Friday", hours: "7:30 AM – 6:00 PM" },
      { days: "Saturday", hours: "8:00 AM – 2:00 PM" },
      { days: "Sunday", hours: "Closed" },
    ],
    serviceOptions: [
      "Oil Change & Maintenance",
      "Brake Repair",
      "Engine Diagnostics",
      "Suspension & Steering",
      "Transmission Service",
      "Air Conditioning",
      "Electrical Repair",
      "Fleet Maintenance",
      "Not sure — please advise",
    ],
  },

  footer: {
    about:
      "Family-owned, ASE-certified auto repair serving Fort Worth and the surrounding communities since 1998.",
    quickLinksHeading: "Quick Links",
    servicesHeading: "Services",
    connectHeading: "Connect",
    legalNote: "All manufacturer names and logos are the property of their respective owners.",
  },

  legal_privacy: {
    heading: "Privacy Policy",
    updatedAt: "January 2026",
    body: "This is placeholder policy text. Replace it from the admin panel with the privacy policy your business actually uses.\n\nWe collect the information you submit through our appointment request form — your name, phone number, email address, vehicle details, and any comments you provide — solely to schedule and perform the service you requested.\n\nWe do not sell your personal information. We share it only with service providers who help us operate this website and communicate with you about your appointment.\n\nTo request a copy or deletion of the information we hold about you, contact us using the phone number or email address listed on this site.",
  },

  legal_terms: {
    heading: "Terms of Service",
    updatedAt: "January 2026",
    body: "This is placeholder terms text. Replace it from the admin panel with terms reviewed by your own counsel.\n\nThe content on this website is provided for general information about our services. Estimates, pricing, and availability described here are not offers and are not binding until confirmed in writing by a service advisor.\n\nAppointment requests submitted through this website are requests only. An appointment is confirmed when a member of our team contacts you directly.\n\nWarranty coverage, where offered, is described on your invoice and governed by the terms printed there.",
  },
};

export const DEFAULT_SERVICES = [
  {
    icon: "droplets",
    title: "Oil Changes",
    description:
      "Full-synthetic and conventional oil services with a complimentary multi-point inspection every visit.",
  },
  {
    icon: "disc",
    title: "Brake Repair",
    description:
      "Pads, rotors, calipers, lines, and fluid service — measured, documented, and road-tested before pickup.",
  },
  {
    icon: "cpu",
    title: "Engine Diagnostics",
    description:
      "Factory-level scan tools and real diagnostic time to find the actual cause, not just the code.",
  },
  {
    icon: "car",
    title: "Suspension",
    description:
      "Shocks, struts, control arms, and precision alignment to restore ride quality and tire life.",
  },
  {
    icon: "cog",
    title: "Transmission",
    description:
      "Fluid and filter service, valve body work, and full replacements for automatics and manuals.",
  },
  {
    icon: "snowflake",
    title: "Air Conditioning",
    description:
      "Leak detection, compressor and condenser repair, and refrigerant service for R-134a and R-1234yf.",
  },
  {
    icon: "zap",
    title: "Electrical Repair",
    description:
      "Batteries, alternators, starters, sensors, and wiring faults traced with wiring diagrams — not guesswork.",
  },
  {
    icon: "truck",
    title: "Fleet Maintenance",
    description:
      "Scheduled preventive maintenance, priority scheduling, and consolidated monthly invoicing for local fleets.",
  },
];

export const DEFAULT_TESTIMONIALS = [
  {
    quote:
      "They found a cracked coolant line two other shops missed, sent me photos of it, and had my car back the next morning. The estimate matched the invoice to the dollar.",
    name: "Danielle R.",
    vehicle: "2019 Honda Pilot",
    rating: 5,
    featured: true,
    image: { src: "/images/avatar-1.jpg", alt: "Portrait of a smiling customer" },
  },
  {
    quote:
      "I've taken three vehicles here over eight years. They tell me what can wait, which is exactly why I keep coming back instead of the dealer.",
    name: "Marcus T.",
    vehicle: "2016 Ford F-150",
    rating: 5,
    featured: false,
    image: { src: "/images/avatar-2.jpg", alt: "Portrait of a smiling customer" },
  },
  {
    quote:
      "My AC quit on the hottest week of the year. They diagnosed it same-day, explained both repair options with prices, and never pushed the expensive one.",
    name: "Priya S.",
    vehicle: "2021 Toyota RAV4",
    rating: 5,
    featured: false,
    image: { src: "/images/avatar-3.jpg", alt: "Portrait of a smiling customer" },
  },
  {
    quote:
      "We run six work vans through here. Priority scheduling and one invoice a month has saved my office manager hours of paperwork.",
    name: "Kevin O.",
    vehicle: "Fleet — 6 vehicles",
    rating: 5,
    featured: false,
    image: { src: "/images/avatar-4.jpg", alt: "Portrait of a smiling customer" },
  },
  {
    quote:
      "Clean waiting room, straight answers, and a text with photos before they touched anything. First shop I've actually trusted since moving here.",
    name: "Alyssa M.",
    vehicle: "2020 Subaru Outback",
    rating: 5,
    featured: false,
    image: { src: "/images/avatar-5.jpg", alt: "Portrait of a smiling customer" },
  },
];

export const DEFAULT_FAQS = [
  {
    question: "Do I need an appointment, or can I just drop off my vehicle?",
    answer:
      "Both work. Appointments get you a guaranteed inspection window, and we hold same-day drop-off slots for anything that feels unsafe to drive. Call ahead and we will tell you honestly how the day looks.",
  },
  {
    question: "Will you tell me the price before you start the work?",
    answer:
      "Always. You receive a written estimate — usually with inspection photos — and nothing proceeds until you approve it. If we find something additional mid-repair, we stop and call you first.",
  },
  {
    question: "What kind of warranty comes with a repair?",
    answer:
      "Most repairs carry a 24-month / 24,000-mile warranty on both parts and labor. The exact coverage for your job is printed on your invoice.",
  },
  {
    question: "Do you work on my make and model?",
    answer:
      "We service nearly all domestic and import cars, trucks, and light-duty vans. Certain EV high-voltage and exotic drivetrain work is referred to a specialist — we will tell you upfront if that applies.",
  },
  {
    question: "How long will my repair take?",
    answer:
      "Maintenance and brake work is typically same-day. Diagnostics depend on the fault, and larger jobs depend on parts availability. You get a realistic time estimate with your written quote, plus text updates along the way.",
  },
  {
    question: "Can I wait at the shop, or do you offer a ride?",
    answer:
      "Our waiting room has fast Wi-Fi, coffee, and a quiet area to work. For longer jobs we offer a local shuttle and can help arrange a loaner or rental.",
  },
];

export const DEFAULT_GALLERY = [
  {
    image: { src: "/images/gallery-exterior.jpg", alt: "The shop exterior with service bay doors open" },
    caption: "Shop exterior",
  },
  {
    image: {
      src: "/images/gallery-waiting-room.jpg",
      alt: "A bright customer lounge with comfortable seating and floor-to-ceiling windows",
    },
    caption: "Customer lounge",
  },
  {
    image: {
      src: "/images/hero-detail.jpg",
      alt: "Technician running diagnostics on an engine with a handheld scan tool",
    },
    caption: "Digital inspections",
  },
  {
    image: { src: "/images/gallery-technicians.jpg", alt: "Technicians working together on a vehicle" },
    caption: "Our technicians",
  },
  {
    image: { src: "/images/gallery-equipment.jpg", alt: "Alignment rack and diagnostic equipment in a service bay" },
    caption: "Diagnostic equipment",
  },
  {
    image: {
      src: "/images/gallery-repair.jpg",
      alt: "A technician applying a final machine polish to a finished vehicle",
    },
    caption: "Finished work",
  },
  {
    image: { src: "/images/gallery-bay.jpg", alt: "A vehicle raised on a lift in a clean service bay" },
    caption: "Service bay",
  },
];
