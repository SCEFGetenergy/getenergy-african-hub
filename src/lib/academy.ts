// GET Energy Academy catalogue: 58 standalone programmes + 6 career pathways (64 offerings).
// Fees are PROPOSED until management marks a programme price-approved. Partner/exam fees are always separate.
export type ProgrammeStatus = "Waiting list open" | "Applications open" | "Coming soon" | "On request" | "Corporate only" | "Full" | "Closed";
export type Programme = {
  n: number; slug: string; title: string; category: string; duration: string; fee: number; description: string;
  kind: "course" | "pathway"; audience?: string[]; partner?: string; includes?: string[]; note?: string;
  status?: ProgrammeStatus; priceApproved?: boolean;
};
export const ACADEMY_CATEGORIES = ["Technical Energy","Solar & BESS","Mini-Grid & Power","Smart Energy","Energy Efficiency","HSE & Safety","Green Economy","EV & Mobility","CNG","Project Development","Finance","GreenTech Entrepreneurship","Professional Skills","Corporate Training","Career Pathways"] as const;
export const PRICE_TIERS = [
  { label: "Under ₦150,000", min: 0, max: 149999 },
  { label: "₦150,000–₦249,999", min: 150000, max: 249999 },
  { label: "₦250,000–₦399,999", min: 250000, max: 399999 },
  { label: "₦400,000–₦599,999", min: 400000, max: 599999 },
  { label: "₦600,000+", min: 600000, max: Infinity },
] as const;
export const PROGRAMMES: Programme[] = [
 {
  "n": 1,
  "slug": "solar-pv-installation-supervision",
  "title": "Solar PV Installation & Supervision",
  "category": "Technical Energy",
  "duration": "20 days",
  "fee": 350000,
  "description": "Practical training covering solar PV fundamentals, site assessment, basic system design, installation, supervision, testing, commissioning principles, safety, maintenance and troubleshooting.",
  "kind": "course",
  "audience": [
   "Technicians",
   "Engineers",
   "Graduates",
   "Contractors",
   "Entrepreneurs"
  ],
  "partner": "NAPTIN / approved technical partner"
 },
 {
  "n": 2,
  "slug": "solar-plus-storage-design-operations",
  "title": "Solar-Plus-Storage Design & Operations",
  "category": "Solar & BESS",
  "duration": "10 days",
  "fee": 300000,
  "description": "Learn how solar PV and battery storage work together, including system sizing, load profiling, battery selection, inverter configuration, energy optimisation, monitoring and O&M.",
  "kind": "course"
 },
 {
  "n": 3,
  "slug": "battery-energy-storage-systems-bess",
  "title": "Battery Energy Storage Systems — BESS",
  "category": "Solar & BESS",
  "duration": "5 days",
  "fee": 225000,
  "description": "Introduction to commercial and industrial battery-storage systems, BMS, safety, solar-plus-storage, backup applications, peak management and operational considerations.",
  "kind": "course"
 },
 {
  "n": 4,
  "slug": "distributed-renewable-energy-systems",
  "title": "Distributed Renewable Energy Systems",
  "category": "Solar & BESS",
  "duration": "10 days",
  "fee": 300000,
  "description": "Covers distributed solar, batteries, hybrid generation, mini-grids, smart metering, energy management and productive-use applications.",
  "kind": "course"
 },
 {
  "n": 5,
  "slug": "generator-distributed-power-operations",
  "title": "Generator & Distributed Power Operations",
  "category": "Technical Energy",
  "duration": "5 days",
  "fee": 180000,
  "description": "Covers diesel, gas and CNG generators, hybrid generation, solar-generator integration, load optimisation, operations and preventive maintenance.",
  "kind": "course"
 },
 {
  "n": 6,
  "slug": "power-systems-operations-maintenance",
  "title": "Power Systems Operations & Maintenance",
  "category": "Technical Energy",
  "duration": "10 days",
  "fee": 300000,
  "description": "Technical introduction to transformers, substations, protection systems, distribution, SCADA, electrical operations and maintenance.",
  "kind": "course",
  "partner": "NAPTIN"
 },
 {
  "n": 7,
  "slug": "mini-grid-design-development",
  "title": "Mini-Grid Design & Development",
  "category": "Mini-Grid & Power",
  "duration": "20 days",
  "fee": 450000,
  "description": "Comprehensive mini-grid programme covering demand assessment, solar and hybrid architectures, BESS, distribution, smart metering, customer connections and project development.",
  "kind": "course",
  "partner": "NAPTIN"
 },
 {
  "n": 8,
  "slug": "mini-grid-commercial-operations",
  "title": "Mini-Grid Commercial Operations",
  "category": "Mini-Grid & Power",
  "duration": "5 days",
  "fee": 200000,
  "description": "Focuses on customer acquisition, metering, billing, tariffs, revenue assurance, customer service, operating costs and commercial sustainability.",
  "kind": "course"
 },
 {
  "n": 9,
  "slug": "power-as-a-service-electricity-as-a-service",
  "title": "Power-As-A-Service & Electricity-As-A-Service",
  "category": "Mini-Grid & Power",
  "duration": "3 days",
  "fee": 175000,
  "description": "Commercial programme covering recurring electricity-service models, BOO, BOOT, PPAs, energy-service agreements, metered sales, operating models and commercial risk.",
  "kind": "course"
 },
 {
  "n": 10,
  "slug": "captive-embedded-power-development",
  "title": "Captive & Embedded Power Development",
  "category": "Mini-Grid & Power",
  "duration": "5 days",
  "fee": 225000,
  "description": "Introduces captive power, embedded generation, distributed electricity systems, commercial structures, customer supply arrangements and project economics.",
  "kind": "course"
 },
 {
  "n": 11,
  "slug": "smart-metering-digital-energy-management",
  "title": "Smart Metering & Digital Energy Management",
  "category": "Smart Energy",
  "duration": "5 days",
  "fee": 200000,
  "description": "Training in prepaid metering, smart meters, estate and commercial metering, AMI concepts, billing, remote monitoring and revenue assurance.",
  "kind": "course"
 },
 {
  "n": 12,
  "slug": "energy-management-systems-iot",
  "title": "Energy Management Systems & IoT",
  "category": "Smart Energy",
  "duration": "5 days",
  "fee": 225000,
  "description": "Covers energy sensors, dashboards, IoT, remote monitoring, controls, analytics and digital energy-management platforms.",
  "kind": "course"
 },
 {
  "n": 13,
  "slug": "energy-audit-energy-management",
  "title": "Energy Audit & Energy Management",
  "category": "Energy Efficiency",
  "duration": "5 days",
  "fee": 225000,
  "description": "Practical energy auditing including energy baselines, load analysis, generator consumption, efficiency opportunities, monitoring and reporting.",
  "kind": "course",
  "partner": "NAPTIN"
 },
 {
  "n": 14,
  "slug": "energy-efficiency-in-buildings",
  "title": "Energy Efficiency in Buildings",
  "category": "Energy Efficiency",
  "duration": "5 days",
  "fee": 200000,
  "description": "Explores building energy use, HVAC, lighting, equipment efficiency, benchmarking and facility-energy optimisation.",
  "kind": "course"
 },
 {
  "n": 15,
  "slug": "health-safety-environment-hse",
  "title": "Health, Safety & Environment — HSE",
  "category": "HSE & Safety",
  "duration": "3–5 days",
  "fee": 150000,
  "description": "Workplace-focused HSE programme covering occupational safety, risk assessment, safe work practices, environmental awareness and incident prevention.",
  "kind": "course",
  "note": "Certification fee is separate where applicable."
 },
 {
  "n": 16,
  "slug": "electrical-safety-statutory-regulations",
  "title": "Electrical Safety & Statutory Regulations",
  "category": "HSE & Safety",
  "duration": "5 days",
  "fee": 175000,
  "description": "Covers electrical hazards, isolation principles, safe work procedures, permits, installation standards and regulatory awareness.",
  "kind": "course",
  "partner": "NAPTIN"
 },
 {
  "n": 17,
  "slug": "fire-safety-emergency-response",
  "title": "Fire Safety & Emergency Response",
  "category": "HSE & Safety",
  "duration": "2 days",
  "fee": 100000,
  "description": "Practical awareness programme covering fire prevention, workplace hazards, emergency response principles and evacuation procedures.",
  "kind": "course"
 },
 {
  "n": 18,
  "slug": "nemsa-competency-preparation",
  "title": "NEMSA Competency Preparation",
  "category": "HSE & Safety",
  "duration": "5 days",
  "fee": 200000,
  "description": "Preparation programme for relevant electrical, renewable-energy and metering competency pathways.",
  "kind": "course",
  "note": "This is preparation training. Statutory certification/examination remains subject to the applicable authority."
 },
 {
  "n": 19,
  "slug": "green-economy-fundamentals",
  "title": "Green Economy Fundamentals",
  "category": "Green Economy",
  "duration": "3 days",
  "fee": 120000,
  "description": "Introduction to green-economy concepts, sustainable business, renewable energy, green jobs, circular economy and climate-resilient development.",
  "kind": "course"
 },
 {
  "n": 20,
  "slug": "esg-impact-measurement",
  "title": "ESG & Impact Measurement",
  "category": "Green Economy",
  "duration": "3 days",
  "fee": 175000,
  "description": "Practical programme on ESG indicators, energy-access impact, emissions, jobs, gender indicators, sustainability reporting and investor metrics.",
  "kind": "course"
 },
 {
  "n": 21,
  "slug": "productive-use-of-renewable-energy",
  "title": "Productive Use of Renewable Energy",
  "category": "Green Economy",
  "duration": "3 days",
  "fee": 150000,
  "description": "Explores productive-energy applications for SMEs, agriculture, markets, health facilities, schools, rural businesses and community enterprises.",
  "kind": "course"
 },
 {
  "n": 22,
  "slug": "climate-carbon-awareness",
  "title": "Climate & Carbon Awareness",
  "category": "Green Economy",
  "duration": "2 days",
  "fee": 100000,
  "description": "Introduces climate change, emissions, carbon concepts, clean energy and organizational sustainability.",
  "kind": "course"
 },
 {
  "n": 23,
  "slug": "circular-economy-sustainability",
  "title": "Circular Economy & Sustainability",
  "category": "Green Economy",
  "duration": "3 days",
  "fee": 150000,
  "description": "Covers circular-economy thinking, resource efficiency, waste reduction and sustainable organizational practices.",
  "kind": "course"
 },
 {
  "n": 24,
  "slug": "ev-charging-infrastructure",
  "title": "EV Charging Infrastructure",
  "category": "EV & Mobility",
  "duration": "5 days",
  "fee": 250000,
  "description": "Covers AC and DC charging, site assessment, electrical capacity, charger safety, fleet charging and commercial charging models.",
  "kind": "course"
 },
 {
  "n": 25,
  "slug": "ev-hybrid-vehicle-fundamentals",
  "title": "EV & Hybrid Vehicle Fundamentals",
  "category": "EV & Mobility",
  "duration": "5 days",
  "fee": 250000,
  "description": "Introduces electric and hybrid vehicle architecture, battery systems, electrical safety, diagnostics, charging and workshop practices.",
  "kind": "course"
 },
 {
  "n": 26,
  "slug": "green-mobility-infrastructure",
  "title": "Green Mobility Infrastructure",
  "category": "EV & Mobility",
  "duration": "3 days",
  "fee": 175000,
  "description": "Covers charging stations, destination charging, fleet charging, solar-assisted charging, site-host models and commercial infrastructure planning.",
  "kind": "course"
 },
 {
  "n": 27,
  "slug": "cng-technical-fundamentals",
  "title": "CNG Technical Fundamentals",
  "category": "CNG",
  "duration": "5 days",
  "fee": 225000,
  "description": "Introduction to CNG systems, safety, cylinders, vehicle systems, technical operations and industry applications.",
  "kind": "course"
 },
 {
  "n": 28,
  "slug": "cng-vehicle-fleet-transition",
  "title": "CNG Vehicle & Fleet Transition",
  "category": "CNG",
  "duration": "3 days",
  "fee": 175000,
  "description": "Focuses on vehicle and fleet transition, fuel economics, operational considerations, safety and commercial fleet planning.",
  "kind": "course"
 },
 {
  "n": 29,
  "slug": "cng-refuelling-infrastructure",
  "title": "CNG Refuelling Infrastructure",
  "category": "CNG",
  "duration": "5 days",
  "fee": 250000,
  "description": "Introduces station design concepts, refuelling equipment, station operations, safety and commercial considerations.",
  "kind": "course"
 },
 {
  "n": 30,
  "slug": "renewable-energy-project-development",
  "title": "Renewable Energy Project Development",
  "category": "Project Development",
  "duration": "5 days",
  "fee": 250000,
  "description": "Project-development training covering opportunity identification, feasibility, technology selection, procurement, financing, implementation and O&M.",
  "kind": "course"
 },
 {
  "n": 31,
  "slug": "energy-project-finance-unit-economics",
  "title": "Energy Project Finance & Unit Economics",
  "category": "Finance",
  "duration": "5 days",
  "fee": 275000,
  "description": "Covers CAPEX, OPEX, tariffs, PPAs, cash flow, unit economics, project returns, DSCR concepts and energy-project financial modelling.",
  "kind": "course"
 },
 {
  "n": 32,
  "slug": "climate-finance-fundraising",
  "title": "Climate Finance & Fundraising",
  "category": "Finance",
  "duration": "3 days",
  "fee": 200000,
  "description": "Introduces grants, climate funds, blended finance, development finance, investor readiness, fundraising and due diligence.",
  "kind": "course"
 },
 {
  "n": 33,
  "slug": "green-procurement-energy-supply-chains",
  "title": "Green Procurement & Energy Supply Chains",
  "category": "Project Development",
  "duration": "3 days",
  "fee": 175000,
  "description": "Covers OEM selection, vendor due diligence, technical procurement, warranties, logistics and energy-sector supply-chain management.",
  "kind": "course"
 },
 {
  "n": 34,
  "slug": "project-management-for-energy-professionals",
  "title": "Project Management for Energy Professionals",
  "category": "Project Development",
  "duration": "5 days",
  "fee": 225000,
  "description": "Energy-focused project management covering planning, scheduling, procurement, risk, stakeholders, documentation and project controls.",
  "kind": "course"
 },
 {
  "n": 35,
  "slug": "energy-business-development",
  "title": "Energy Business Development",
  "category": "Finance",
  "duration": "3 days",
  "fee": 150000,
  "description": "Commercial skills programme covering sales pipelines, partnerships, proposals, tenders, negotiation and customer acquisition.",
  "kind": "course"
 },
 {
  "n": 36,
  "slug": "get-energy-greentech-launchpad",
  "title": "GET Energy GreenTech Launchpad",
  "category": "GreenTech Entrepreneurship",
  "duration": "10–12 weeks",
  "fee": 500000,
  "description": "Flagship GreenTech venture-development programme covering customer discovery, MVP development, pilot design, pricing, unit economics, ESG, regulatory readiness, project finance, fundraising, investor readiness and scale.",
  "kind": "course"
 },
 {
  "n": 37,
  "slug": "greentech-entrepreneurship",
  "title": "GreenTech Entrepreneurship",
  "category": "GreenTech Entrepreneurship",
  "duration": "5 days",
  "fee": 200000,
  "description": "Entrepreneurship programme focused on GreenTech opportunity identification, customer discovery, business models, market validation and venture growth.",
  "kind": "course"
 },
 {
  "n": 38,
  "slug": "green-energy-entrepreneurship",
  "title": "Green Energy Entrepreneurship",
  "category": "GreenTech Entrepreneurship",
  "duration": "5 days",
  "fee": 200000,
  "description": "Commercial training for entrepreneurs exploring solar, mini-grid, EV, CNG, metering, O&M and energy-service businesses.",
  "kind": "course"
 },
 {
  "n": 39,
  "slug": "leadership-team-management",
  "title": "Leadership & Team Management",
  "category": "Professional Skills",
  "duration": "2 days",
  "fee": 100000,
  "description": "Practical leadership, supervision, team coordination, delegation and workplace-performance skills.",
  "kind": "course"
 },
 {
  "n": 40,
  "slug": "business-development",
  "title": "Business Development",
  "category": "Professional Skills",
  "duration": "2 days",
  "fee": 100000,
  "description": "Foundational commercial skills in prospecting, relationship management, opportunity development and business growth.",
  "kind": "course"
 },
 {
  "n": 41,
  "slug": "customer-service",
  "title": "Customer Service",
  "category": "Professional Skills",
  "duration": "2 days",
  "fee": 85000,
  "description": "Practical customer-support training covering communication, enquiry management, complaint resolution and service quality.",
  "kind": "course"
 },
 {
  "n": 42,
  "slug": "sales-technical-sales",
  "title": "Sales & Technical Sales",
  "category": "Professional Skills",
  "duration": "3 days",
  "fee": 125000,
  "description": "Builds selling skills for technical products and services, including needs assessment, proposal positioning, negotiation and closing.",
  "kind": "course"
 },
 {
  "n": 43,
  "slug": "project-coordination",
  "title": "Project Coordination",
  "category": "Professional Skills",
  "duration": "3 days",
  "fee": 125000,
  "description": "Practical coordination skills covering tasks, schedules, documentation, stakeholders and project reporting.",
  "kind": "course"
 },
 {
  "n": 44,
  "slug": "workplace-communication",
  "title": "Workplace Communication",
  "category": "Professional Skills",
  "duration": "2 days",
  "fee": 85000,
  "description": "Professional workplace communication, email, meetings, reporting, presentation and interpersonal effectiveness.",
  "kind": "course"
 },
 {
  "n": 45,
  "slug": "digital-productivity",
  "title": "Digital Productivity",
  "category": "Professional Skills",
  "duration": "2 days",
  "fee": 85000,
  "description": "Practical digital tools for workplace efficiency, collaboration, reporting and information management.",
  "kind": "course"
 },
 {
  "n": 46,
  "slug": "procurement",
  "title": "Procurement",
  "category": "Professional Skills",
  "duration": "3 days",
  "fee": 125000,
  "description": "Covers procurement processes, supplier management, evaluation, documentation, commercial controls and purchasing fundamentals.",
  "kind": "course"
 },
 {
  "n": 47,
  "slug": "operations-management",
  "title": "Operations Management",
  "category": "Professional Skills",
  "duration": "3 days",
  "fee": 125000,
  "description": "Introduces operational planning, workflow management, performance monitoring, resource allocation and process improvement.",
  "kind": "course"
 },
 {
  "n": 48,
  "slug": "proposal-development",
  "title": "Proposal Development",
  "category": "Professional Skills",
  "duration": "2 days",
  "fee": 100000,
  "description": "Practical proposal-writing skills for commercial opportunities, partnerships, grants, tenders and projects.",
  "kind": "course"
 },
 {
  "n": 49,
  "slug": "technical-documentation",
  "title": "Technical Documentation",
  "category": "Professional Skills",
  "duration": "2 days",
  "fee": 100000,
  "description": "Covers technical reports, project documentation, specifications, operating records and professional technical writing.",
  "kind": "course"
 },
 {
  "n": 50,
  "slug": "data-reporting",
  "title": "Data & Reporting",
  "category": "Professional Skills",
  "duration": "2 days",
  "fee": 100000,
  "description": "Practical programme on data collection, interpretation, dashboards, reporting and management information.",
  "kind": "course"
 },
 {
  "n": 51,
  "slug": "cold-chain-energy-systems",
  "title": "Cold-Chain Energy Systems",
  "category": "Technical Energy",
  "duration": "3 days",
  "fee": 175000,
  "description": "Energy solutions for refrigeration, food storage, health products and temperature-controlled logistics, including solar, BESS, reliability and load-management considerations.",
  "kind": "course"
 },
 {
  "n": 52,
  "slug": "agricultural-productive-energy-systems",
  "title": "Agricultural Productive Energy Systems",
  "category": "Technical Energy",
  "duration": "3 days",
  "fee": 150000,
  "description": "Covers solar pumping, irrigation, agricultural processing, cold storage, farm-energy systems and productive-use business models.",
  "kind": "course"
 },
 {
  "n": 53,
  "slug": "green-jobs-career-readiness",
  "title": "Green Jobs & Career Readiness",
  "category": "Professional Skills",
  "duration": "2 days",
  "fee": 85000,
  "description": "Career-development programme introducing green-energy jobs, CV development, workplace expectations, interviews, technical career pathways and professional readiness.",
  "kind": "course"
 },
 {
  "n": 54,
  "slug": "energy-sales-customer-service",
  "title": "Energy Sales & Customer Service",
  "category": "Professional Skills",
  "duration": "3 days",
  "fee": 125000,
  "description": "Energy-sector specific customer acquisition, technical selling, quotations, account management, service recovery and customer retention.",
  "kind": "course"
 },
 {
  "n": 55,
  "slug": "workplace-entrepreneurship-innovation",
  "title": "Workplace Entrepreneurship & Innovation",
  "category": "Professional Skills",
  "duration": "3 days",
  "fee": 125000,
  "description": "Develops entrepreneurial thinking, problem solving, internal innovation, opportunity identification and productivity improvement within organizations.",
  "kind": "course"
 },
 {
  "n": 56,
  "slug": "train-the-trainer-for-technical-energy-programmes",
  "title": "Train-The-Trainer for Technical & Energy Programmes",
  "category": "Professional Skills",
  "duration": "5 days",
  "fee": 200000,
  "description": "Designed for technical instructors and subject-matter experts who need to develop lesson planning, facilitation, practical demonstrations, learner assessment and professional training delivery skills.",
  "kind": "course"
 },
 {
  "n": 57,
  "slug": "technical-vocational-instructor-development",
  "title": "Technical & Vocational Instructor Development",
  "category": "Professional Skills",
  "duration": "5 days",
  "fee": 200000,
  "description": "Builds instructional capability for technical and vocational educators, including competency-based training, workshop management, learner assessment and practical skills delivery.",
  "kind": "course"
 },
 {
  "n": 58,
  "slug": "corporate-energy-management-for-executives",
  "title": "Corporate Energy Management for Executives",
  "category": "Corporate Training",
  "duration": "3 days",
  "fee": 225000,
  "description": "Executive-level programme covering energy cost management, energy procurement, efficiency, distributed power, renewable transition, risk, ESG and corporate energy strategy. 11. SIX CAREER PATHWAY BUNDLES",
  "kind": "course"
 },
 {
  "n": 59,
  "slug": "solar-technician-pathway",
  "title": "Solar Technician Pathway",
  "category": "Career Pathways",
  "duration": "4–6 weeks",
  "fee": 650000,
  "description": "Structured pathway for learners seeking practical technical skills relevant to solar installation, storage and renewable-energy fieldwork.",
  "kind": "pathway",
  "includes": [
   "HSE",
   "Electrical Safety",
   "Solar PV",
   "BESS",
   "Energy Efficiency"
  ]
 },
 {
  "n": 60,
  "slug": "ev-charging-technician-pathway",
  "title": "EV Charging Technician Pathway",
  "category": "Career Pathways",
  "duration": "3–4 weeks",
  "fee": 600000,
  "description": "Structured pathway combining Electrical Safety, EV Charging, BESS, Smart Metering and HSE into one sequenced programme.",
  "kind": "pathway",
  "includes": [
   "Electrical Safety",
   "EV Charging",
   "BESS",
   "Smart Metering",
   "HSE"
  ]
 },
 {
  "n": 61,
  "slug": "cng-technician-pathway",
  "title": "CNG Technician Pathway",
  "category": "Career Pathways",
  "duration": "3–4 weeks",
  "fee": 550000,
  "description": "Structured pathway combining HSE, CNG Safety, CNG Technical Fundamentals and Technical Operations into one sequenced programme.",
  "kind": "pathway",
  "includes": [
   "HSE",
   "CNG Safety",
   "CNG Technical Fundamentals",
   "Technical Operations"
  ]
 },
 {
  "n": 62,
  "slug": "mini-grid-professional-pathway",
  "title": "Mini-Grid Professional Pathway",
  "category": "Career Pathways",
  "duration": "6–8 weeks",
  "fee": 850000,
  "description": "Structured pathway combining Solar, BESS, Smart Metering, Mini-Grid Design, Energy Management and Project Development into one sequenced programme.",
  "kind": "pathway",
  "includes": [
   "Solar",
   "BESS",
   "Smart Metering",
   "Mini-Grid Design",
   "Energy Management",
   "Project Development"
  ]
 },
 {
  "n": 63,
  "slug": "energy-manager-pathway",
  "title": "Energy Manager Pathway",
  "category": "Career Pathways",
  "duration": "3–4 weeks",
  "fee": 600000,
  "description": "Structured pathway combining Energy Audit, Energy Efficiency, Smart Metering, Energy Management and ESG into one sequenced programme.",
  "kind": "pathway",
  "includes": [
   "Energy Audit",
   "Energy Efficiency",
   "Smart Metering",
   "Energy Management",
   "ESG"
  ]
 },
 {
  "n": 64,
  "slug": "greentech-founder-pathway",
  "title": "GreenTech Founder Pathway",
  "category": "Career Pathways",
  "duration": "8–12 weeks",
  "fee": 750000,
  "description": "Structured pathway combining GreenTech Entrepreneurship, Customer Discovery, MVP, Market Validation, Project Finance, ESG, Fundraising, Investor Readiness and Pitching into one sequenced programme.",
  "kind": "pathway",
  "includes": [
   "GreenTech Entrepreneurship",
   "Customer Discovery",
   "MVP",
   "Market Validation",
   "Project Finance",
   "ESG",
   "Fundraising",
   "Investor Readiness",
   "Pitching"
  ]
 }
];
export const FEATURED_SLUGS = ["solar-pv-installation-supervision","mini-grid-design-development","battery-energy-storage-systems-bess","ev-charging-infrastructure","health-safety-environment-hse","energy-audit-energy-management","get-energy-greentech-launchpad","energy-project-finance-unit-economics"];
export const statusOf = (p: Programme): ProgrammeStatus => p.status ?? "Waiting list open";
export const getProgramme = (slug: string) => PROGRAMMES.find((p) => p.slug === slug);
export const formatNaira = (n: number) => "₦" + n.toLocaleString("en-NG");
export const CERT_DISCLAIMER = "Selected GET Energy Academy programmes may be delivered in collaboration with recognized training and certification partners. Certification availability, awarding body, assessment requirements and recognition depend on the specific programme. Where external examination, statutory competency or certification fees apply, these may be charged separately from the GET Energy training fee.";
export const ACADEMY_WHATSAPP = "2348180742835";
export const whatsappFor = (title?: string) => `https://wa.me/${ACADEMY_WHATSAPP}?text=${encodeURIComponent(title ? `Hello GET Energy Academy. I joined the waiting list for ${title}. Please notify me when the next cohort, final fee, schedule and certification information are available.` : "Hello GET Energy Academy. I would like information about your training programmes.")}`;
