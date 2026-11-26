// SOPHIA knowledge base: questions and answers SOPHIA searches before answering, also shown on /answers.
// Keep answers honest: say what is operating, what is in development, and never invent prices,
// stock, dates, partners or accreditations. Academy fees are PROPOSED and must say "to be confirmed".

export type KnowledgeTopic = "ev-charging" | "ev-hybrid" | "academy";

export type KnowledgeEntry = {
  id: string;
  topic: KnowledgeTopic;
  question: string;
  answer: string;
  /** Extra words people might search with (synonyms, local terms, common misspellings). */
  keywords?: string[];
  link?: { label: string; href: string };
};

export const TOPIC_LABELS: Record<KnowledgeTopic, string> = {
  "ev-charging": "EV charging stations",
  "ev-hybrid": "Electric & hybrid cars",
  academy: "GET Energy Academy",
};

const CHARGING_LINK = { label: "EV charging", href: "/solutions/ev-charging" };
const HOST_LINK = { label: "Become a charging location partner", href: "/solutions/ev-charging#enquire" };
const EV_LINK = { label: "EV & mobility", href: "/ev" };
const EV_SERVICE_LINK = { label: "EV & hybrid technical services", href: "/solutions/ev-hybrid-services" };
const FLEET_LINK = { label: "Fleet energy transition", href: "/solutions/fleet-energy-transition" };
const ACADEMY_LINK = { label: "GET Energy Academy", href: "/training-certification" };
const WAITLIST_LINK = { label: "Join the waiting list", href: "/training-certification/waitlist" };
const CORPORATE_LINK = { label: "Corporate training", href: "/training-certification/corporate" };

export const KNOWLEDGE: KnowledgeEntry[] = [
  // ---------------- EV charging stations ----------------
  {
    id: "chg-what-offer", topic: "ev-charging",
    question: "What EV charging services does GET Energy offer?",
    answer: "GET Energy is developing EV charging for Nigeria: AC destination charging (homes, offices, hotels, malls, estates), DC fast charging (highways, hubs, fleet depots, terminals, service stations), fleet charging, and solar-assisted charging with battery storage. The network is in development, so tell us your location and needs and our team will assess them.",
    keywords: ["charger", "charging point", "station", "services", "offer"],
    link: CHARGING_LINK,
  },
  {
    id: "chg-where", topic: "ev-charging",
    question: "Where are GET Energy's charging stations? Is there one near me?",
    answer: "GET Energy's public charging network is not operating yet. Sites are being developed with property hosts, starting in Lagos. Share your area and we will let you know when a location near you is confirmed.",
    keywords: ["near me", "location", "map", "find", "lagos", "abuja", "nearest", "open"],
    link: CHARGING_LINK,
  },
  {
    id: "chg-vision-400", topic: "ev-charging",
    question: "What is GET Vision 400?",
    answer: "GET Vision 400 is GET Energy's strategic programme to develop up to 400 EV charging points across Nigeria by 2029, starting in Lagos. It is a target, not existing infrastructure: each site depends on a host partnership, technical feasibility, financing and approvals.",
    keywords: ["vision 400", "400 stations", "2029", "network", "plan", "nigeria"],
    link: CHARGING_LINK,
  },
  {
    id: "chg-host", topic: "ev-charging",
    question: "Can I host a GET Energy charging station on my property?",
    answer: "Yes, we welcome hosts such as fuel stations, malls, hotels, hospitals, universities, estates, offices, fleet depots and transport terminals. Under GET Energy's standard host model, GET Energy and its partners can provide the charging equipment at no equipment cost to the host, with a share of charging revenue. Every site is subject to assessment, approvals and a written agreement.",
    keywords: ["host", "property", "landlord", "my land", "partner", "revenue share", "install at my", "business premises"],
    link: HOST_LINK,
  },
  {
    id: "chg-host-cost", topic: "ev-charging",
    question: "How much does it cost a host to have a charging station installed?",
    answer: "Under the standard host model there is no equipment cost to the host: GET Energy and its partners fund and operate the chargers and share charging revenue with the host. Some sites may need electrical upgrades; these are agreed case by case after a site assessment. Hosts who prefer to buy their own chargers can ask for that option.",
    keywords: ["cost", "free", "price", "pay", "host fee", "investment"],
    link: HOST_LINK,
  },
  {
    id: "chg-host-process", topic: "ev-charging",
    question: "What happens after I submit my property as a charging location?",
    answer: "Our team reviews the location, then arranges a site visit to check parking, access, power supply and visibility. If the site fits, we propose the charger mix (AC and/or DC) and the commercial terms, and agree everything in writing before any installation. Submitting a site is not a commitment for either side.",
    keywords: ["process", "steps", "next", "after submit", "site visit", "assessment"],
    link: HOST_LINK,
  },
  {
    id: "chg-ac-dc", topic: "ev-charging",
    question: "What is the difference between AC and DC charging?",
    answer: "AC chargers (usually about 7–22 kW) charge through the car's own on-board charger, so they are slower and suit places where cars park for hours: homes, offices, hotels and malls. DC fast chargers (often 30–180 kW or more) feed the battery directly and suit quick top-ups on highways, at hubs and for fleets. How fast a car charges also depends on what the car itself accepts.",
    keywords: ["ac", "dc", "fast charger", "rapid", "slow", "level 2", "kw", "difference"],
  },
  {
    id: "chg-time", topic: "ev-charging",
    question: "How long does it take to charge an electric car?",
    answer: "It depends on the battery size, the charger's power and the car's limits. As a rough guide, a car with a 60 kWh battery takes about 8–9 hours from nearly empty on a 7 kW AC charger, and roughly 40–60 minutes to about 80% on a DC fast charger the car can fully use. Charging usually slows down above 80%.",
    keywords: ["how long", "hours", "minutes", "charging time", "speed", "full charge", "80%"],
  },
  {
    id: "chg-connectors", topic: "ev-charging",
    question: "Which plug or connector does my car need?",
    answer: "Common connectors are Type 2 (AC) and CCS2 (DC) on European-specification cars, and GB/T (AC and DC) on many Chinese-specification cars, which are common in Nigeria. Check your car's charging port and manual before buying a charger. When we assess a home, office or site, we match the charger to the vehicles that will use it.",
    keywords: ["plug", "connector", "type 2", "ccs", "ccs2", "gbt", "gb/t", "socket", "compatible", "chademo"],
  },
  {
    id: "chg-cost-to-charge", topic: "ev-charging",
    question: "How much will it cost to charge at a GET Energy station?",
    answer: "Charging tariffs have not been published yet because the network is still in development. Prices will depend on the site, the charger type and the cost of electricity there. We will publish clear per-kWh prices before any station opens.",
    keywords: ["price", "tariff", "per kwh", "cost to charge", "how much", "naira"],
    link: CHARGING_LINK,
  },
  {
    id: "chg-payment", topic: "ev-charging",
    question: "How will I pay for charging?",
    answer: "Payments will be handled through GET Energy's charging platform, with a single dashboard for the network. Payment options will be announced when the first stations open; no charging payments are being taken yet.",
    keywords: ["pay", "payment", "app", "card", "transfer", "wallet", "dashboard"],
    link: CHARGING_LINK,
  },
  {
    id: "chg-home", topic: "ev-charging",
    question: "Can GET Energy install a charger at my home?",
    answer: "Yes. GET Energy arranges home AC charger installation. We first check your car, your electrical supply and where the charger will go, then recommend a suitable unit (usually 7 kW single-phase, or up to 22 kW on three-phase if your car supports it) and quote for supply and installation. Installation is done by qualified electricians with protection and earthing to standard.",
    keywords: ["home charger", "wallbox", "house", "residential", "install", "garage", "estate"],
    link: { label: "Request a home charger", href: "/contact?service=ev-charging" },
  },
  {
    id: "chg-socket", topic: "ev-charging",
    question: "Can I charge my electric car from a normal wall socket?",
    answer: "Many cars come with a portable cable for a household socket, but it is very slow (often around 2–3 kW) and should only be used on a sound, dedicated circuit checked by a qualified electrician. Avoid extension cords and adaptors. For daily use, a properly installed home charger is safer and faster.",
    keywords: ["wall socket", "13 amp", "plug in at home", "extension", "granny cable", "portable charger"],
  },
  {
    id: "chg-power-outage", topic: "ev-charging",
    question: "What about power outages? Can charging work without the grid?",
    answer: "Grid supply in Nigeria can be unreliable, so GET Energy designs charging with backup options: solar PV, battery storage and smart energy management, alongside the grid where available. The right mix is chosen per site after an assessment.",
    keywords: ["nepa", "light", "outage", "grid", "blackout", "solar", "generator", "backup", "power supply"],
    link: CHARGING_LINK,
  },
  {
    id: "chg-solar", topic: "ev-charging",
    question: "Can an EV be charged with solar power?",
    answer: "Yes. Solar PV with battery storage can charge EVs, especially at homes, offices and depots where cars park during the day. GET Energy offers solar-assisted charging designs; the system size depends on how much you drive and how much sun and roof or land space you have.",
    keywords: ["solar", "panels", "pv", "renewable", "off-grid", "battery storage"],
    link: CHARGING_LINK,
  },
  {
    id: "chg-fleet", topic: "ev-charging",
    question: "Do you provide charging for fleets?",
    answer: "Yes. For logistics, ride-hailing, bus, corporate and government fleets, GET Energy plans depot and hub charging sized to your routes and schedules, with energy management and driver training. We start with a fleet energy assessment.",
    keywords: ["fleet", "company cars", "logistics", "bus", "ride-hailing", "depot", "taxi", "delivery"],
    link: FLEET_LINK,
  },
  {
    id: "chg-safety", topic: "ev-charging",
    question: "Is EV charging safe?",
    answer: "Yes, when chargers are certified and installed correctly with proper protection, earthing and a dedicated circuit. Do not use damaged cables, adaptors or extension leads. If you see sparks, smoke, a burning smell or overheating, stop charging if it is safe to do so, keep people away and call qualified personnel.",
    keywords: ["safe", "safety", "fire", "rain", "shock", "danger"],
  },
  {
    id: "chg-rain", topic: "ev-charging",
    question: "Can I charge my car in the rain?",
    answer: "Yes. EV chargers and charging ports are designed to be used outdoors and in the rain. Keep connectors clean, do not use damaged cables, and never use household extension leads outside.",
    keywords: ["rain", "wet", "water", "outdoor", "weather"],
  },
  {
    id: "chg-maintenance", topic: "ev-charging",
    question: "Who maintains the chargers?",
    answer: "GET Energy and its technical partners operate and maintain the chargers they install, with remote monitoring through the charging platform. For chargers you own, GET Energy can provide technical support and maintenance on request.",
    keywords: ["maintenance", "repair", "broken", "faulty charger", "support", "service"],
    link: EV_SERVICE_LINK,
  },
  {
    id: "chg-invest", topic: "ev-charging",
    question: "Can I invest in GET Energy's EV charging network?",
    answer: "GET Energy works with investors and financing partners on its charging programme. Share your interest on the Invest page and our team will discuss options. Any opportunity is subject to due diligence and agreement; returns are never guaranteed.",
    keywords: ["invest", "investor", "fund", "finance", "partnership", "returns"],
    link: { label: "Invest", href: "/invest" },
  },

  // ---------------- Electric & hybrid cars ----------------
  {
    id: "car-types", topic: "ev-hybrid",
    question: "What is the difference between an EV, a hybrid and a plug-in hybrid?",
    answer: "An electric vehicle (EV or BEV) runs only on a battery and must be charged. A hybrid (HEV) has a petrol engine plus a small battery that charges itself while driving, so you never plug it in. A plug-in hybrid (PHEV) has a bigger battery you can charge for electric-only trips, plus a petrol engine for longer journeys.",
    keywords: ["bev", "hev", "phev", "hybrid", "plug-in", "difference", "types", "electric car"],
  },
  {
    id: "car-buy", topic: "ev-hybrid",
    question: "Does GET Energy sell electric and hybrid cars?",
    answer: "Yes. GET Energy can source electric and hybrid vehicles for individuals, businesses and fleets through its vehicle partners, and can pair the vehicle with a home or depot charger. Tell us the type of vehicle, budget and number of units; availability, price and delivery time are confirmed by our team in a written quotation.",
    keywords: ["buy", "sell", "purchase", "price", "dealer", "import", "order", "car sales"],
    link: EV_LINK,
  },
  {
    id: "car-which", topic: "ev-hybrid",
    question: "Should I choose an electric car or a hybrid?",
    answer: "If you can charge at home or work and mostly drive within the city, an EV gives the lowest running costs. If charging access is limited or you drive long distances often, a hybrid or plug-in hybrid is a practical first step. We can help you compare based on your daily distance and where the car parks.",
    keywords: ["which", "better", "choose", "recommend", "best", "advice"],
    link: EV_LINK,
  },
  {
    id: "car-range", topic: "ev-hybrid",
    question: "How far can an electric car go on one charge?",
    answer: "Most modern EVs cover roughly 250–500 km per charge, depending on the model and battery size. Real range drops with high speed, heavy loads, heavy air-conditioning use and hot weather, so plan with a margin.",
    keywords: ["range", "km", "distance", "how far", "one charge", "mileage"],
  },
  {
    id: "car-running-cost", topic: "ev-hybrid",
    question: "Is an electric car cheaper to run than a petrol car?",
    answer: "Usually yes. Electricity per kilometre generally costs less than petrol, and EVs need less routine maintenance (no oil changes, fewer moving parts). The saving depends on your electricity source and tariff; charging from a generator is much more expensive than grid or solar.",
    keywords: ["cheaper", "save", "running cost", "fuel cost", "petrol price", "economy"],
  },
  {
    id: "car-hybrid-charge", topic: "ev-hybrid",
    question: "Do I need to charge a hybrid car?",
    answer: "A standard hybrid (HEV) never needs plugging in; it charges its battery from the engine and braking. A plug-in hybrid (PHEV) should be charged regularly to get its fuel savings, but it still drives on petrol if the battery is empty.",
    keywords: ["hybrid", "charge hybrid", "plug", "self-charging"],
  },
  {
    id: "car-battery-life", topic: "ev-hybrid",
    question: "How long does an EV or hybrid battery last?",
    answer: "Vehicle batteries are designed to last many years; manufacturers' battery warranties are often around 8 years, but terms vary by brand and model, so check the specific warranty. Battery life is helped by avoiding constant charging to 100%, avoiding very deep discharge, and parking in shade in hot weather.",
    keywords: ["battery life", "warranty", "degradation", "replace battery", "years"],
  },
  {
    id: "car-heat", topic: "ev-hybrid",
    question: "Do electric cars work well in Nigeria's heat?",
    answer: "Yes, modern EVs have thermal-management systems for hot climates. Heat can reduce range slightly and speed up battery ageing over time, so park in shade where possible and follow the maker's charging advice.",
    keywords: ["heat", "hot", "climate", "temperature", "nigeria weather", "sun"],
  },
  {
    id: "car-flood", topic: "ev-hybrid",
    question: "Is it safe to drive an electric car through flood water?",
    answer: "EV battery packs are sealed, but no car should be driven through deep or fast-moving water. Follow the maker's wading limits. If a car has been submerged, do not drive or charge it; have it inspected by qualified EV technicians first.",
    keywords: ["flood", "water", "rain", "submerged", "wading"],
  },
  {
    id: "car-service", topic: "ev-hybrid",
    question: "Where can I service or repair my electric or hybrid car?",
    answer: "GET Energy is developing EV and hybrid technical services: diagnostics, high-voltage system inspection, battery health checks, charging-system and charging-port repair, preventive maintenance and fleet maintenance. Send a request with your vehicle make and model and our team will confirm what can be done.",
    keywords: ["service", "repair", "mechanic", "maintenance", "workshop", "diagnostics", "fault"],
    link: EV_SERVICE_LINK,
  },
  {
    id: "car-battery-check", topic: "ev-hybrid",
    question: "Can you check the health of a used EV's battery before I buy it?",
    answer: "Battery health assessment is part of the EV and hybrid technical services GET Energy is developing. Send us the vehicle details and we will confirm whether we can assess it and how. Battery refurbishment and remanufacturing are not offered at present.",
    keywords: ["used ev", "second hand", "battery health", "soh", "inspection", "tokunbo"],
    link: EV_SERVICE_LINK,
  },
  {
    id: "car-fleet", topic: "ev-hybrid",
    question: "Can you help my company move its fleet to electric or hybrid vehicles?",
    answer: "Yes. GET Energy's fleet energy transition starts with a fleet energy audit and vehicle assessment, compares running costs, then plans vehicles, charging or CNG infrastructure, driver and technician training, and maintenance. Request a fleet assessment to begin.",
    keywords: ["fleet", "company", "corporate", "transition", "logistics", "buses", "taxis"],
    link: FLEET_LINK,
  },
  {
    id: "car-cng-vs-ev", topic: "ev-hybrid",
    question: "Should I convert to CNG or switch to an electric car?",
    answer: "Both cut fuel costs. CNG conversion keeps your current petrol car and adds a gas system, which suits high-mileage drivers near CNG refuelling. An EV suits drivers who can charge at home or work. GET Energy works on both and can advise based on your vehicle, mileage and location.",
    keywords: ["cng", "gas", "conversion", "compare", "alternative fuel"],
    link: { label: "CNG conversion", href: "/cng-conversion" },
  },
  {
    id: "car-finance", topic: "ev-hybrid",
    question: "Can I buy an electric car on instalments or with financing?",
    answer: "GET Energy works with financing partners and can discuss financing options when it prepares your vehicle quotation, especially for businesses and fleets. Financing is subject to the partner's approval; nothing is guaranteed until agreed in writing.",
    keywords: ["finance", "loan", "instalment", "installment", "lease", "pay small small"],
    link: EV_LINK,
  },

  // ---------------- GET Energy Academy ----------------
  {
    id: "acad-what", topic: "academy",
    question: "What is GET Energy Academy?",
    answer: "GET Energy Academy for Green Skills & Certification is GET Energy's training line for the green economy. It lists 64 offerings: 58 programmes and 6 career pathways across solar and storage, mini-grids, EV and mobility, CNG, energy efficiency, HSE, project finance, entrepreneurship and professional skills.",
    keywords: ["academy", "training", "school", "courses", "green skills", "get academy"],
    link: ACADEMY_LINK,
  },
  {
    id: "acad-status", topic: "academy",
    question: "When does the next Academy training start?",
    answer: "All programmes currently have a waiting list open. Cohort dates, venues and final fees have not been confirmed yet. Join the waiting list for the programme you want and the team will contact you when the next cohort is scheduled.",
    keywords: ["start", "date", "when", "next class", "cohort", "schedule", "intake"],
    link: WAITLIST_LINK,
  },
  {
    id: "acad-ev-courses", topic: "academy",
    question: "Which EV and mobility courses does the Academy offer?",
    answer: "EV Charging Infrastructure (5 days), EV & Hybrid Vehicle Fundamentals (5 days), Green Mobility Infrastructure (3 days), and the EV Charging Technician Pathway (3–4 weeks), which combines electrical safety, EV charging, battery storage, smart metering and HSE. All are on the waiting list.",
    keywords: ["ev course", "ev training", "charging course", "hybrid training", "mobility", "technician"],
    link: { label: "EV Charging Infrastructure", href: "/training-certification/programmes/ev-charging-infrastructure" },
  },
  {
    id: "acad-ev-fees", topic: "academy",
    question: "How much do the EV courses cost?",
    answer: "Proposed fees, to be confirmed: EV Charging Infrastructure ₦250,000; EV & Hybrid Vehicle Fundamentals ₦250,000; Green Mobility Infrastructure ₦175,000; EV Charging Technician Pathway ₦600,000. Partner examination or certification fees, where they apply, are separate.",
    keywords: ["fee", "price", "cost", "how much", "naira", "ev course fee"],
    link: WAITLIST_LINK,
  },
  {
    id: "acad-fees-general", topic: "academy",
    question: "How much do Academy programmes cost?",
    answer: "Each programme lists a proposed fee, to be confirmed, ranging from about ₦85,000 for 2-day professional-skills courses to ₦850,000 for the Mini-Grid Professional Pathway. Final fees are confirmed with the cohort, and any partner examination or certification fees are separate. Ask about a specific programme for its proposed fee.",
    keywords: ["fee", "price", "cost", "tuition", "how much"],
    link: ACADEMY_LINK,
  },
  {
    id: "acad-solar", topic: "academy",
    question: "Do you have solar installation training?",
    answer: "Yes: Solar PV Installation & Supervision (20 days), Solar-Plus-Storage Design & Operations (10 days), Battery Energy Storage Systems (5 days), Distributed Renewable Energy Systems (10 days), and the Solar Technician Pathway (4–6 weeks). All are on the waiting list.",
    keywords: ["solar", "pv", "installer", "inverter", "battery", "bess"],
    link: { label: "Solar PV Installation & Supervision", href: "/training-certification/programmes/solar-pv-installation-supervision" },
  },
  {
    id: "acad-cng", topic: "academy",
    question: "Do you offer CNG training?",
    answer: "Yes: CNG Technical Fundamentals (5 days), CNG Vehicle & Fleet Transition (3 days), CNG Refuelling Infrastructure (5 days), and the CNG Technician Pathway (3–4 weeks). All are on the waiting list.",
    keywords: ["cng", "gas", "conversion training", "technician"],
    link: { label: "CNG Technical Fundamentals", href: "/training-certification/programmes/cng-technical-fundamentals" },
  },
  {
    id: "acad-certificate", topic: "academy",
    question: "Will I get a certificate?",
    answer: "Participants who complete a programme receive a GET Energy Academy certificate of completion. Some programmes may also lead to certification with recognised training or awarding partners; the awarding body, assessment and any separate exam fee depend on the programme and are confirmed before enrolment. No accreditation is claimed until confirmed.",
    keywords: ["certificate", "certification", "accredited", "recognised", "award", "qualification"],
    link: ACADEMY_LINK,
  },
  {
    id: "acad-verify", topic: "academy",
    question: "How can an employer verify a GET Energy Academy certificate?",
    answer: "Use the certificate verification page and enter the certificate details shown on the document.",
    keywords: ["verify", "check certificate", "employer", "authentic", "validation"],
    link: { label: "Verify a certificate", href: "/training-certification/verify" },
  },
  {
    id: "acad-practical", topic: "academy",
    question: "Is the training practical or only theory?",
    answer: "Technical programmes are designed to be practical, with hands-on sessions delivered with approved technical partners such as NAPTIN for selected programmes, subject to confirmation for each cohort. Business, entrepreneurship and professional-skills courses are delivered by GET Energy Academy.",
    keywords: ["practical", "hands-on", "theory", "naptin", "workshop", "lab"],
    link: ACADEMY_LINK,
  },
  {
    id: "acad-online", topic: "academy",
    question: "Can I take the training online?",
    answer: "Delivery mode depends on the programme: business and professional-skills courses suit online delivery, while technical programmes need in-person practical sessions. Tell us your preferred mode when you join the waiting list.",
    keywords: ["online", "virtual", "remote", "zoom", "in person", "physical", "location", "venue"],
    link: WAITLIST_LINK,
  },
  {
    id: "acad-entry", topic: "academy",
    question: "What qualifications do I need to join a programme?",
    answer: "Entry requirements depend on the programme. Most introductory and professional-skills courses are open to anyone with basic literacy; technical courses suit technicians, engineers, graduates and people with some electrical background. If you are unsure, tell us your background and goal and we will suggest suitable programmes.",
    keywords: ["requirement", "qualification", "eligible", "who can", "beginner", "experience", "background"],
    link: ACADEMY_LINK,
  },
  {
    id: "acad-choose", topic: "academy",
    question: "I don't know which course to take. Can you advise me?",
    answer: "Yes. Tell us your goal (a technical job, career growth, starting an energy business, becoming a technician, management skills or entering the green economy) and your background, and SOPHIA or the team will suggest two to four suitable programmes.",
    keywords: ["advise", "which course", "recommend", "career", "confused", "help me choose"],
    link: ACADEMY_LINK,
  },
  {
    id: "acad-corporate", topic: "academy",
    question: "Can you train our company staff?",
    answer: "Yes. GET Energy Academy offers corporate training tailored to your team: topic, number of participants, staff level, dates, delivery mode and whether certification or assessment is needed. Request corporate training to start scoping.",
    keywords: ["corporate", "staff", "company", "team", "in-house", "employees", "organisation"],
    link: CORPORATE_LINK,
  },
  {
    id: "acad-pay", topic: "academy",
    question: "How do I pay for a course?",
    answer: "Online payment for Academy programmes is not open yet. Join the waiting list; when your cohort is confirmed, the team will share the final fee and how to pay. Do not pay anyone claiming to collect Academy fees without written confirmation from GET Energy.",
    keywords: ["pay", "payment", "bank", "transfer", "register", "enrol", "enroll"],
    link: WAITLIST_LINK,
  },
  {
    id: "acad-jobs", topic: "academy",
    question: "Will the Academy guarantee me a job?",
    answer: "No job is guaranteed. The programmes are designed to build practical, in-demand green-energy skills, and the Green Jobs & Career Readiness course helps with CVs, interviews and career pathways.",
    keywords: ["job", "employment", "placement", "career", "work after"],
    link: { label: "Green Jobs & Career Readiness", href: "/training-certification/programmes/green-jobs-career-readiness" },
  },
  {
    id: "acad-entrepreneur", topic: "academy",
    question: "Do you have training for starting a green energy business?",
    answer: "Yes: Green Energy Entrepreneurship (5 days), GreenTech Entrepreneurship (5 days), the GET Energy GreenTech Launchpad (10–12 weeks) and the GreenTech Founder Pathway (8–12 weeks), covering customer discovery, business models, pricing, project finance and investor readiness.",
    keywords: ["business", "entrepreneur", "startup", "start my own", "founder", "launchpad"],
    link: { label: "GreenTech Launchpad", href: "/training-certification/programmes/get-energy-greentech-launchpad" },
  },
];
