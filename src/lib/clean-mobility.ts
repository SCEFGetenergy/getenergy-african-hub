import type { FormField } from "@/lib/site";

// Clean Mobility & Transport Energy content (from the client's brief). All items are planned or
// under development unless stated; never present them as operating.

export type CMSection = { title: string; body?: string; items?: string[] };
export type CMForm = { requestType: string; serviceName: string; title: string; submitLabel: string; fields: FormField[]; note?: string };
export type CMPage = {
  slug: string;
  nav: string;
  title: string; // SEO title
  description: string;
  h1: string;
  intro: string;
  status: string;
  sections: CMSection[];
  cards?: { heading: string; items: string[] };
  steps?: { heading: string; items: string[] };
  notice?: string;
  cta: { label: string; href: string };
  form?: CMForm;
};

const C = (name: string, label: string, type: FormField["type"] = "text", required = false, options?: string[]): FormField => ({
  name, label, type, required, ...(options ? { options } : {}),
});
const CONTACT = [
  C("contact_name", "Name", "text", true),
  C("company_name", "Company"),
  C("contact_email", "Email", "email", true),
  C("contact_phone", "Phone", "tel", true),
];

export const CONVERSION_FORM: CMForm = {
  requestType: "cngbook", serviceName: "CNG Vehicle Conversion", title: "Request CNG Conversion Assessment", submitLabel: "Request CNG Conversion Assessment",
  fields: [...CONTACT, C("make", "Vehicle make", "text", true), C("model", "Vehicle model", "text", true), C("year", "Vehicle year", "number"),
    C("fuel", "Current fuel type", "select", false, ["Petrol", "Diesel", "Other"]), C("count", "Number of vehicles", "number"),
    C("location", "Location", "text", true), C("kind", "Individual / Fleet", "select", true, ["Individual", "Fleet"]), C("message", "Message", "textarea")],
  note: "Submitting does not book an inspection; our team will confirm suitability, timing and location.",
};

export const FLEET_FORM: CMForm = {
  requestType: "fleet-transition", serviceName: "Fleet Energy Transition", title: "Transition Your Fleet", submitLabel: "Request Fleet Assessment",
  fields: [C("company_name", "Organisation", "text", true), C("contact_name", "Contact person", "text", true), C("contact_email", "Email", "email", true), C("contact_phone", "Phone", "tel", true),
    C("size", "Fleet size", "number", true), C("types", "Vehicle types", "text", true), C("fuel", "Current fuel", "select", false, ["Petrol", "Diesel", "CNG", "Mixed"]),
    C("distance", "Average daily distance (km)", "number"), C("location", "Operating locations", "text"),
    ...(["CNG interest", "EV interest", "Charging requirement", "Conversion requirement", "Maintenance requirement", "Training requirement"].map((l, i) =>
      C(`r${i}`, l, "select", false, ["Yes", "No", "Not sure"]))),
    C("message", "Anything else", "textarea")],
};

export const HOST_FORM: CMForm = {
  requestType: "host-site", serviceName: "Host a Charging or Refuelling Facility", title: "Host a GETENERGY Charging or Refuelling Facility", submitLabel: "Submit potential location",
  fields: [C("company_name", "Owner / Organisation", "text", true), C("contact_name", "Contact person", "text", true), C("contact_email", "Email", "email", true), C("contact_phone", "Phone", "tel", true),
    C("address", "Property address", "text", true), C("location", "State", "text", true),
    C("ptype", "Property type", "select", true, ["Petrol station", "Hotel", "Mall", "University", "Hospital", "Transport terminal", "Industrial estate", "Fleet depot", "Government institution", "Commercial property", "Other"]),
    C("land", "Approximate land area"), C("power", "Existing power supply"), C("parking", "Parking capacity"), C("road", "Road access"),
    C("solution", "Preferred solution", "select", true, ["EV Charging", "CNG", "EV + CNG", "Solar/BESS", "Fleet Charging", "Not Sure"])],
  note: "Photos or documents: after you submit, email them to ccgetenergy@gmail.com quoting your reference. Submitting a site is not an agreement; every location is subject to assessment, approvals and a commercial agreement.",
};

export const PARTNER_CHARGING_FORM: CMForm = { ...HOST_FORM, title: "Become a Charging Location Partner", submitLabel: "Become a Charging Location Partner" };

const CNG_MAINT_FORM: CMForm = {
  requestType: "cng-maintenance", serviceName: "CNG Maintenance & Diagnostics", title: "Book CNG Technical Assessment", submitLabel: "Book CNG Technical Assessment",
  fields: [...CONTACT, C("kind", "Individual / Fleet", "select", true, ["Individual", "Fleet"]), C("vehicle", "Vehicle make & model", "text", true), C("count", "Number of vehicles", "number"), C("location", "Location", "text", true), C("message", "Describe the issue", "textarea")],
  note: "Submitting does not book a slot; our team will confirm availability.",
};

const EVH_FORM: CMForm = {
  requestType: "ev-hybrid-services", serviceName: "EV & Hybrid Vehicle Services", title: "Request EV / hybrid technical support", submitLabel: "Send request",
  fields: [...CONTACT, C("vehicle", "Vehicle make & model", "text", true), C("type", "Vehicle type", "select", true, ["Electric (EV)", "Hybrid", "Plug-in hybrid"]), C("count", "Number of vehicles", "number"), C("location", "Location", "text", true), C("message", "What do you need?", "textarea")],
};

const GENERAL_FORM = (serviceName: string, requestType: string, title: string): CMForm => ({
  requestType, serviceName, title, submitLabel: "Send enquiry",
  fields: [...CONTACT, C("location", "Location / State"), C("message", "Tell us about your needs", "textarea", true)],
});

export const CLEAN_MOBILITY_PAGES: CMPage[] = [
  {
    slug: "cng-refuelling", nav: "CNG Refuelling",
    title: "CNG Refuelling Nigeria | CNG Station Infrastructure | GETENERGY",
    description: "GETENERGY is developing CNG refuelling infrastructure in Nigeria for cars, buses, trucks and fleets — stations, integrated refuelling units and fleet supply. Proposed and under development.",
    h1: "CNG Refuelling Infrastructure & Services",
    intro: "GETENERGY is developing CNG refuelling infrastructure to serve private vehicles, taxis, ride-hailing vehicles, tricycles/kekes where technically applicable, buses, trucks, logistics, corporate and institutional fleets, and commercial transport operators.",
    status: "In development",
    sections: [
      { title: "CNG Refuelling Stations", body: "Planned refuelling stations on high-demand transport corridors." },
      { title: "Integrated Refuelling Units", body: "Modular compression and dispensing units sized to local demand." },
      { title: "CNG Daughter Stations", body: "Stations supplied by cascade from a mother station where pipeline gas is not available." },
      { title: "Mobile/Modular CNG Refuelling", body: "Relocatable refuelling for depots, projects and early-demand sites." },
      { title: "Fleet CNG Refuelling", body: "Dedicated refuelling arrangements for fleet operators." },
      { title: "CNG Infrastructure Development", body: "Site evaluation, design, approvals coordination and build." },
      { title: "CNG Station Operations", body: "Operating, safety and maintenance models for refuelling sites." },
      { title: "CNG Logistics & Cascade Supply", body: "Transport of compressed gas to daughter and fleet sites." },
      { title: "Integrated Refuelling Units (IRU)", body: "GETENERGY is evaluating modular integrated refuelling technologies suitable for different vehicle categories and demand levels.",
        items: ["IRU-1000 class — approximately 1,000 Sm³/hour compression capacity", "IRU-2000 class — approximately 2,000 Sm³/hour compression capacity, able to serve NGV1 (cars and lighter vehicles) and NGV2 (buses, trucks and heavy commercial vehicles)"] },
    ],
    cards: { heading: "GETENERGY CNG Refuelling Hub Network — planned concept", items: ["CNG Cars & Light Vehicles", "CNG Buses", "CNG Trucks", "Commercial Fleets", "Corporate Fleets", "Transport Operators"] },
    notice: "Any CAM InfraCo IRU arrangement is proposed and under evaluation, subject to commercial agreement, regulatory approval and site approval. GETENERGY does not own CAM InfraCo equipment and no IRU has been allocated. No refuelling site has been approved yet; any site named in future will be labelled “Proposed / Subject to Government, Regulatory and Commercial Approvals.”",
    cta: { label: "Enquire about CNG supply", href: "#enquire" },
    form: GENERAL_FORM("CNG Refuelling Services", "cng-refuelling", "CNG refuelling enquiry"),
  },
  {
    slug: "cng-conversion", nav: "CNG Conversion",
    title: "CNG Vehicle Conversion Nigeria | CNG Conversion Lagos | GETENERGY",
    description: "CNG vehicle conversion in Nigeria: suitability assessment, approved conversion kits, cylinder installation, safety and leak testing, and fleet conversion programmes. Request an assessment.",
    h1: "CNG Vehicle Conversion Services",
    intro: "Suitable petrol vehicles can be converted to run on compressed natural gas, usually in an approved bi-fuel configuration that keeps petrol as a backup — where technically appropriate. Every vehicle is assessed first.",
    status: "Opening soon",
    sections: [{ title: "What the service covers", items: ["Vehicle suitability assessment", "CNG conversion consultation", "Approved conversion-system installation", "Cylinder installation", "Fuel-system integration", "ECU/electronic configuration", "Safety testing", "Leak testing", "Post-conversion diagnostics", "Driver orientation", "Fleet conversion programmes", "Post-conversion maintenance"] }],
    notice: "Proposed conversion centres are not yet open. Conversion is only carried out where a vehicle passes assessment.",
    cta: { label: "Request CNG Conversion Assessment", href: "#enquire" },
    form: CONVERSION_FORM,
  },
  {
    slug: "cng-maintenance", nav: "CNG Maintenance",
    title: "CNG Maintenance Nigeria | CNG Vehicle Diagnostics | GETENERGY",
    description: "CNG vehicle maintenance and diagnostics in Nigeria: leak detection, regulator and injector checks, cylinder inspection, preventive and fleet maintenance. Book a technical assessment.",
    h1: "CNG Vehicle Maintenance & Technical Services",
    intro: "Technical services that keep CNG and bi-fuel vehicles safe and efficient — for individual owners and for fleets.",
    status: "In development",
    sections: [
      { title: "Individual vehicle services", items: ["CNG system diagnostics", "Leak detection", "Pressure-system inspection", "Regulator inspection", "Injector diagnostics", "Fuel-line inspection", "Cylinder-system inspection", "Electronic diagnostics", "Conversion-system troubleshooting", "Spare parts"] },
      { title: "Fleet maintenance services", items: ["Preventive maintenance", "Scheduled servicing", "Fleet maintenance programmes", "Emergency technical support", "Spare parts and after-sales support"] },
    ],
    cta: { label: "Book CNG Technical Assessment", href: "#enquire" },
    form: CNG_MAINT_FORM,
  },
  {
    slug: "ev-charging", nav: "EV Charging",
    title: "EV Charging Nigeria | EV Charging Stations Lagos | GETENERGY",
    description: "GETENERGY is developing EV charging infrastructure in Nigeria: AC destination charging, DC fast charging, fleet EV charging and solar-assisted charging. Become a charging location partner.",
    h1: "EV Charging Infrastructure & Services",
    intro: "GETENERGY is developing EV charging solutions for Nigeria and the wider African market.",
    status: "In development",
    sections: [
      { title: "AC charging", items: ["Homes", "Workplaces", "Hotels", "Malls", "Offices", "Residential estates", "Destination charging"] },
      { title: "DC fast charging", items: ["Highways", "Commercial charging hubs", "Fleet depots", "Transport terminals", "Petrol/service-station conversions", "High-utilisation locations"] },
      { title: "Fleet charging", items: ["Logistics fleets", "Ride-hailing", "Buses", "Corporate fleets", "Delivery vehicles", "Government/institutional fleets"] },
      { title: "Solar-assisted EV charging", items: ["Solar PV", "Battery energy storage", "Grid electricity", "Energy management systems", "Charging infrastructure"] },
      { title: "GETENERGY EV Charging Network", body: "GETENERGY’s strategic development programme targets up to 400 potential charging locations, subject to site acquisition, host partnerships, financing, technical feasibility and regulatory approvals. This is a strategic target — these stations do not exist yet." },
    ],
    cards: { heading: "Potential host locations", items: ["Fuel/service stations", "Shopping centres", "Hotels", "Hospitals", "Universities", "Airports", "Highways", "Transport terminals", "Corporate premises", "Residential estates", "Fleet depots", "Commercial properties"] },
    cta: { label: "Become a Charging Location Partner", href: "#enquire" },
    form: PARTNER_CHARGING_FORM,
  },
  {
    slug: "ev-hybrid-services", nav: "EV & Hybrid Services",
    title: "EV Maintenance Nigeria | Hybrid Vehicle Maintenance | GETENERGY",
    description: "EV and hybrid vehicle technical services in Nigeria: diagnostics, high-voltage inspection, battery health, charging-system repair and fleet maintenance. In development.",
    h1: "EV & Hybrid Vehicle Technical Services",
    intro: "Technical services for electric and hybrid vehicles and the chargers that support them.",
    status: "In development",
    sections: [
      { title: "Service areas", items: ["EV diagnostics", "Hybrid diagnostics", "High-voltage system inspection", "Battery health assessment", "Battery diagnostics", "Charging-system diagnostics", "Power electronics", "Electric motor diagnostics", "Thermal-management systems", "EV preventive maintenance", "Hybrid maintenance", "Charging-port repair", "Vehicle software diagnostics", "Fleet maintenance", "EV charger technical support"] },
      { title: "Future development (not yet available)", items: ["Battery module diagnostics", "Battery balancing", "Battery refurbishment", "Battery second-life applications"] },
    ],
    notice: "GETENERGY does not currently offer battery remanufacturing; future battery services will be announced only once commissioned.",
    cta: { label: "Request technical support", href: "#enquire" },
    form: EVH_FORM,
  },
  {
    slug: "fleet-energy-transition", nav: "Fleet Energy Transition",
    title: "CNG Fleet Conversion & Fleet EV Charging Nigeria | GETENERGY",
    description: "Fleet energy transition for Nigerian transport, logistics, ride-hailing, bus and government fleets: energy audit, CNG/EV suitability, infrastructure, training and maintenance.",
    h1: "Fleet Energy Transition Solutions",
    intro: "A structured path for fleets moving to CNG, EV or a mix — for transport and logistics companies, corporate, ride-hailing, government, bus, delivery and industrial fleets.",
    status: "Available on request",
    sections: [],
    steps: { heading: "Our process", items: ["Fleet Energy Audit", "Vehicle Assessment", "Energy-Cost Analysis", "CNG / EV Suitability Assessment", "Infrastructure Planning", "Conversion / Vehicle Transition Strategy", "Refuelling / Charging Infrastructure", "Driver & Technician Training", "Maintenance Programme", "Performance Monitoring"] },
    cta: { label: "Request Fleet Energy Assessment", href: "#enquire" },
    form: FLEET_FORM,
  },
  {
    slug: "clean-mobility-infrastructure", nav: "Clean Mobility Infrastructure",
    title: "Clean Mobility Infrastructure Nigeria | CNG + EV Hubs | GETENERGY",
    description: "GETENERGY's strategy for integrated clean-mobility hubs combining CNG refuelling, EV charging, solar, battery storage, technical services and training. Proposed concept.",
    h1: "Clean Mobility Infrastructure Development",
    intro: "GETENERGY's strategy is to develop integrated mobility-energy hubs that bring fuel, charging, power and services together on one site.",
    status: "Proposed",
    sections: [
      { title: "GETENERGY Clean Mobility Hub — illustrative model", body: "CNG + EV + SOLAR + BATTERY + TECHNICAL SERVICES + TRAINING" },
      { title: "Potential hub components", items: ["CNG refuelling", "EV charging", "Solar PV", "Battery energy storage", "Energy management", "CNG vehicle conversion", "CNG vehicle maintenance", "EV/hybrid maintenance", "Fleet services", "Technical training", "Customer facilities", "Smart payments", "Energy monitoring"] },
    ],
    notice: "This is an illustrative model. Actual components depend on site requirements, technical feasibility, approvals and the commercial model. No hub is operating yet.",
    cta: { label: "Host a facility on your site", href: "#enquire" },
    form: HOST_FORM,
  },
];

export const TRAINING_LINK = "/training-certification";

export const CERT_LANGUAGE = "GETENERGY training programmes may include proprietary GETENERGY certificates of completion and, where applicable, certification delivered in collaboration with approved or recognised industry, technical, OEM, training or awarding partners.";

export const PILLARS = [
  { title: "CNG Mobility & Technical Services", items: ["CNG refuelling", "CNG vehicle conversion", "CNG maintenance", "CNG diagnostics", "CNG fleet conversion", "Technical support", "CNG vehicle inspection support", "Spare parts and after-sales support"] },
  { title: "EV & Clean Energy Infrastructure", items: ["EV charging", "AC destination charging", "DC fast charging", "Fleet charging", "Charging hubs", "Solar-assisted charging", "Battery energy storage integration", "Smart energy management", "EV and hybrid technical services"] },
  { title: "Green Energy & Economy Skills", items: ["CNG technical training", "EV technical training", "EV charging infrastructure training", "Solar and battery training", "Clean mobility safety", "Energy management", "Green entrepreneurship", "Workforce development", "Industry certification partnerships"] },
];

export type PipelineStatus = "Concept" | "Feasibility" | "Partner engagement" | "Development" | "Under construction" | "Operational";
export type PipelineProject = { project: string; location: string; technology: string; capacity: string; services: string; status: PipelineStatus; partner: string; impact: string };

// Only management-approved entries belong here; each shows its real stage.
export const PIPELINE: PipelineProject[] = [
  { project: "CNG Refuelling Hub Network", location: "To be confirmed", technology: "CNG / IRU-class compression", capacity: "1,000–2,000 Sm³/h class (under evaluation)", services: "Refuelling for NGV1 and NGV2", status: "Concept", partner: "Under evaluation", impact: "Lower-cost, cleaner transport fuel" },
  { project: "EV Charging Network", location: "Nigeria — sites to be confirmed", technology: "AC, DC fast, solar-assisted", capacity: "Strategic target of up to 400 potential locations", services: "Public, destination and fleet charging", status: "Concept", partner: "Host partners being sought", impact: "Charging access for EV adoption" },
  { project: "Clean Mobility Hub", location: "To be confirmed", technology: "CNG + EV + solar + BESS", capacity: "To be confirmed", services: "Fuel, charging, maintenance, training", status: "Concept", partner: "Not yet engaged", impact: "Integrated clean-mobility services" },
];
