export interface ServiceCategory {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  iconName: string;
  features: string[];
  idealFor: string;
}

export const SERVICES: ServiceCategory[] = [
  {
    id: "motor",
    name: "Motor Insurance",
    shortDesc: "Complete bumper-to-bumper car & two-wheeler protection with quick roadside assistance and cashless garage network.",
    fullDesc: "Protect your personal and commercial vehicles against accidents, theft, third-party liability, and natural calamities. Enjoy zero-depreciation covers, engine protection, return to invoice, and 24x7 roadside assistance with 10,000+ cashless network garages.",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
    iconName: "Car",
    features: [
      "Zero Depreciation (Bumper to Bumper) Cover",
      "Engine & Gearbox Protection with Consumables",
      "Return to Invoice (RTI) Guarantee",
      "Instant Cashless Claim Settlement Across India"
    ],
    idealFor: "Individual car owners, fleet operators, luxury vehicles & commercial transport"
  },
  {
    id: "health",
    name: "Health Insurance",
    shortDesc: "Comprehensive medical and family floater plans with cashless hospitalization across 14,000+ top hospitals.",
    fullDesc: "Safeguard your family against escalating medical costs. Our health insurance solutions feature no room-rent capping, pre- and post-hospitalization coverage, day-care treatments, critical illness riders, and maternity benefits with quick cashless pre-authorization.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    iconName: "HeartPulse",
    features: [
      "100% Bill Payment with No Room Rent Limit",
      "Pre & Post Hospitalization Covered up to 180 Days",
      "Annual Health Checkups & Preventive Wellness",
      "Cumulative No Claim Bonus up to 150%"
    ],
    idealFor: "Families, senior citizens, parents, individuals & self-employed professionals"
  },
  {
    id: "life",
    name: "Life & Term Insurance",
    shortDesc: "Secure your family's future, children's education, and retirement with guaranteed returns and high-value term covers.",
    fullDesc: "Ensure lasting financial security for your loved ones even in your absence. We advise on pure term protection plans with terminal illness riders, whole life policies, guaranteed income plans, and disciplined retirement savings backed by top-rated life insurers.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
    iconName: "ShieldCheck",
    features: [
      "High Life Cover up to ₹5+ Crores at Affordable Premiums",
      "Waiver of Premium on Critical Illness or Disability",
      "Tax Saving under Section 80C and 10(10D)",
      "Guaranteed Maturity Benefits with Wealth Accumulation"
    ],
    idealFor: "Primary breadwinners, young parents, salaried professionals & long-term wealth builders"
  },
  {
    id: "travel",
    name: "Travel Insurance",
    shortDesc: "Worry-free international & domestic travel with emergency medical expense coverage, flight delays, and baggage protection.",
    fullDesc: "Travel the world with peace of mind. Our Schengen-compliant and worldwide travel insurance plans cover emergency overseas medical treatments, loss of passport, trip cancellations, lost checked-in baggage, and personal liability abroad.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
    iconName: "Plane",
    features: [
      "Schengen Visa Approved Overseas Medical Cover",
      "Cashless Hospitalization in Foreign Countries",
      "Flight Delay, Cancellation & Baggage Loss Compensation",
      "24x7 Global Emergency Assistance Helpline"
    ],
    idealFor: "Holiday travellers, business executives, international students & senior globe-trotters"
  },
  {
    id: "home",
    name: "Home Insurance",
    shortDesc: "All-in-one protection for your home structure and valuable contents against fire, earthquakes, burglary, and water damage.",
    fullDesc: "Your home is your most valuable asset. Shield your residential apartment or independent bungalow from natural disasters, accidental fires, electrical breakdown of appliances, theft, and third-party liabilities with tailored domestic property insurance.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    iconName: "Home",
    features: [
      "Building Structure & Interior Renovation Protection",
      "Contents Insurance: Electronics, Furniture & Valuables",
      "Cover Against Fire, Storm, Flood & Earthquakes",
      "Alternative Accommodation Support During Repairs"
    ],
    idealFor: "Home owners, tenants, apartment dwellers & residential property investors"
  },
  {
    id: "business",
    name: "Business Insurance",
    shortDesc: "Tailored commercial risk management covering shops, offices, warehouses, employee health, and fire liability.",
    fullDesc: "Shield your enterprise from operational interruptions. Comprehensive corporate packages including Standard Fire and Special Perils, Shopkeeper policies, Marine Transit, Directors & Officers liability, Cyber Insurance, and Group Mediclaim for employees.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    iconName: "Briefcase",
    features: [
      "Standard Fire & Special Perils (SFSP) Policy",
      "Shopkeeper & Commercial Establishment Package",
      "Group Health & Workmen Compensation for Staff",
      "Public & Product Liability Coverage"
    ],
    idealFor: "Retailers, SMEs, manufacturers, distributors, contractors & corporate offices"
  }
];

export const INSURANCE_PARTNERS = [
  { name: "Star Health", code: "STAR", tag: "Health Leader" },
  { name: "HDFC ERGO", code: "HDFCERGO", tag: "General Insurance" },
  { name: "ICICI Lombard", code: "ICICILOMBARD", tag: "Motor & General" },
  { name: "Life Insurance Corporation", code: "LIC", tag: "Trust of India" },
  { name: "Tata AIG", code: "TATAAIG", tag: "Comprehensive Care" },
  { name: "Care Health", code: "CARE", tag: "Specialized Mediclaim" },
  { name: "Bajaj Allianz", code: "BAJAJALLIANZ", tag: "Trusted Claims" },
  { name: "The New India Assurance", code: "NEWINDIA", tag: "Govt. of India Enterprise" },
];

export const TESTIMONIALS = [
  {
    quote: "When my father was hospitalized in Apollo Bilaspur, Om Prakash Sahu ji personally coordinated with Star Health's TPA team to get our cashless claim authorized within 90 minutes. You don't just buy a policy from him, you get a dedicated family advisor.",
    author: "Rajesh Kumar Verma",
    location: "Raipur, CG",
    policyType: "Health Insurance",
    rating: 5
  },
  {
    quote: "I have been renewing my commercial fleet and personal Creta insurance through OP Life Solutions for the past 6 years. Their renewal reminder arrives well on time and claims are processed without any headache.",
    author: "Manoj Kumar Patidar",
    location: "Rajnandgaon, CG",
    policyType: "Motor Insurance",
    rating: 5
  },
  {
    quote: "Professional, transparent, and thoroughly honest. He explained the fine print of term insurance riders that online portals never tell you. Highly recommended for every family.",
    author: "Priya Dewangan",
    location: "Raipur, CG",
    policyType: "Life Insurance",
    rating: 5
  }
];

export const FAQS = [
  {
    q: "How can I check my policy details on this website?",
    a: "Simply head over to the 'Policy Details' section, enter your registered 10-digit mobile number or policy number, and click 'View Policy Details'. After a quick privacy verification, you can view all active and upcoming policy schedules, renewal dates, and download official policy documents uploaded by our team."
  },
  {
    q: "Can I purchase insurance directly online through this portal?",
    a: "No, we believe insurance is a crucial financial safeguard that requires personalized professional advisory. We do not sell automated one-size-fits-all policies online. Instead, we study your exact needs, compare top insurers, structure the right riders, and assist you end-to-end with documentation and claim settlements."
  },
  {
    q: "What should I do when my policy is due for renewal?",
    a: "Our automated advisory system notifies you via WhatsApp and SMS 30, 15, and 7 days prior to expiry. You can also click 'Talk to an Advisor' or WhatsApp us directly at +91 62688 19299 with your vehicle/policy details, and we will issue your renewed schedule seamlessly."
  },
  {
    q: "How do you help during an insurance claim?",
    a: "Claims advocacy is our core priority. From intimation and hospital cashless coordination to garage surveyor visits and paperwork submission, Mr. Om Prakash Sahu and our support desk assist you until the reimbursement or cashless claim is credited."
  }
];
