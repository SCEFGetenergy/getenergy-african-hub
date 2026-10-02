// GETS proprietary professional certifications (10). Fees are not published until management approves them.
export type Certification = { code: string; name: string; purpose: string; competencies: string[]; modules: string[]; capstoneTitle: string; capstone: string[]; outputs: string[]; audience: string[]; notes: string[] };
export const CERT_VALIDITY_MONTHS = 24;
export const RENEWAL_REQUIREMENTS = ["40 CPD hours within 24 months","Evidence of relevant professional practice","Ethics declaration","Safety refresher","Technology update","Regulatory update where applicable","Short renewal assessment"];
export const CERT_STRUCTURE = ["GET Energy core curriculum","Selected contributing training modules","Practical competency assessment","Workplace productivity component","Capstone project","Final assessment","24-month certification validity"];
export const CERTIFICATIONS: Certification[] = [
 {
  "code": "CEOWP",
  "name": "GETS Certified Energy Operations & Workplace Productivity Professional",
  "purpose": "For professionals who must combine reliable energy operations with workplace productivity, digital capability and operational discipline.",
  "competencies": [
   "Energy Operations Fundamentals",
   "HSE & Workplace Safety",
   "Maintenance & Reliability",
   "Energy Efficiency",
   "Digital Productivity",
   "Data & Reporting",
   "Customer / Stakeholder Management",
   "Process Improvement",
   "Workplace Communication",
   "Supervisory Effectiveness"
  ],
  "modules": [
   "Power Systems Operations & Maintenance",
   "Generator & Distributed Power Operations",
   "Energy Audit & Energy Management",
   "HSE",
   "Digital Productivity",
   "Data & Reporting",
   "Customer Service",
   "Leadership & Team Management"
  ],
  "capstoneTitle": "Workplace Productivity Improvement Project",
  "capstone": [
   "The candidate must identify and improve a measurable workplace issue such as:",
   "downtime",
   "energy waste",
   "generator consumption",
   "process delay",
   "maintenance inefficiency",
   "service response",
   "reporting quality",
   "customer service"
  ],
  "outputs": [],
  "audience": [
   "Engineers",
   "Technicians",
   "Operations Staff",
   "Facility Managers",
   "Supervisors",
   "Industrial Professionals"
  ],
  "notes": []
 },
 {
  "code": "CDESP",
  "name": "GETS Certified Distributed Energy Systems Professional",
  "purpose": "Prepare professionals to evaluate, design, deploy and manage distributed-energy systems.",
  "competencies": [
   "Solar PV",
   "BESS",
   "Mini-Grids",
   "Hybrid Power",
   "Load Assessment",
   "Smart Metering",
   "Energy Management",
   "O&M",
   "Commercial Fundamentals"
  ],
  "modules": [
   "Solar PV Installation & Supervision",
   "Solar-Plus-Storage",
   "BESS",
   "Mini-Grid Design & Development",
   "Smart Metering",
   "Energy Audit & Management",
   "Distributed Renewable Energy Systems"
  ],
  "capstoneTitle": "Capstone project",
  "capstone": [
   "Design a complete distributed-energy system for one approved case:",
   "Hotel",
   "Estate",
   "SME",
   "School",
   "Hospital",
   "Factory",
   "Community",
   "Commercial Facility"
  ],
  "outputs": [
   "load profile",
   "technology selection",
   "system configuration",
   "energy-storage requirement",
   "metering",
   "preliminary economics",
   "O&M strategy"
  ],
  "audience": [],
  "notes": []
 },
 {
  "code": "CSBMP",
  "name": "GETS Certified Solar, BESS & Mini-Grid Professional",
  "purpose": "Advanced technical certification for integrated renewable-energy systems.",
  "competencies": [
   "Solar PV",
   "Battery Storage",
   "Inverters",
   "Electrical Protection",
   "Load Modelling",
   "Mini-Grid Architecture",
   "Smart Metering",
   "System Integration",
   "Commissioning",
   "O&M",
   "Safety"
  ],
  "modules": [
   "Solar PV Installation & Supervision",
   "Solar-Plus-Storage",
   "BESS",
   "Mini-Grid Design",
   "Electrical Safety",
   "Smart Metering"
  ],
  "capstoneTitle": "Capstone project",
  "capstone": [
   "Practical assessment",
   "Technical design capstone"
  ],
  "outputs": [],
  "audience": [],
  "notes": [
   "Future certification levels: Level 1 — Technician; Level 2 — Professional; Level 3 — Lead Designer / Supervisor"
  ]
 },
 {
  "code": "CSEMP",
  "name": "GETS Certified Smart Energy & Metering Professional",
  "purpose": "Develop professionals capable of working across smart metering, digital energy, energy monitoring and revenue-management systems.",
  "competencies": [
   "Smart Metering",
   "Prepaid Metering",
   "AMI Concepts",
   "Sub-Metering",
   "Revenue Assurance",
   "Customer Billing",
   "IoT",
   "Remote Monitoring",
   "Energy Dashboards",
   "Data Management",
   "Energy Management"
  ],
  "modules": [
   "Smart Metering & Digital Energy Management",
   "Energy Management Systems & IoT",
   "Energy Audit & Energy Management",
   "Data & Reporting",
   "Digital Productivity"
  ],
  "capstoneTitle": "Capstone project",
  "capstone": [
   "Design a smart-metering and energy-monitoring solution for an estate, commercial building or industrial facility."
  ],
  "outputs": [],
  "audience": [],
  "notes": [
   "Do NOT state that this replaces NEMSA statutory competency certification.",
   "NEMSA-related competency pathways may apply separately."
  ]
 },
 {
  "code": "CGMAP",
  "name": "GETS Certified Green Mobility & Alternative Fuels Professional",
  "purpose": "Build integrated competence across EV charging, hybrid mobility, CNG and alternative-fuel infrastructure.",
  "competencies": [
   "EV Fundamentals",
   "EV Charging",
   "AC Charging",
   "DC Fast Charging",
   "Fleet Charging",
   "Hybrid Vehicles",
   "CNG",
   "Fleet Transition",
   "Charging Site Assessment",
   "Safety",
   "Infrastructure Economics"
  ],
  "modules": [
   "EV Charging Infrastructure",
   "EV & Hybrid Vehicle Fundamentals",
   "Green Mobility Infrastructure",
   "CNG Technical Fundamentals",
   "CNG Vehicle & Fleet Transition",
   "CNG Refuelling Infrastructure",
   "HSE"
  ],
  "capstoneTitle": "50-Vehicle Corporate Fleet",
  "capstone": [
   "Design the energy and commercial transition of a:",
   "or equivalent approved project."
  ],
  "outputs": [
   "current fleet energy profile",
   "transition pathway",
   "charging / CNG infrastructure",
   "energy requirement",
   "safety",
   "preliminary economics",
   "implementation phases"
  ],
  "audience": [],
  "notes": []
 },
 {
  "code": "CEPCM",
  "name": "GETS Certified Energy Project & Commercial Manager",
  "purpose": "Professional certification for people responsible for developing, financing, procuring and managing commercial energy projects.",
  "competencies": [
   "Energy Project Development",
   "Project Management",
   "Procurement",
   "Contracts",
   "PPAs",
   "Power-as-a-Service",
   "Project Finance",
   "Unit Economics",
   "Negotiation",
   "Risk",
   "ESG",
   "Stakeholder Management",
   "Commercial Strategy"
  ],
  "modules": [
   "Renewable Energy Project Development",
   "Energy Project Finance & Unit Economics",
   "Project Management for Energy Professionals",
   "Green Procurement & Energy Supply Chains",
   "Climate Finance & Fundraising",
   "Power-as-a-Service",
   "ESG & Impact Measurement",
   "Energy Business Development"
  ],
  "capstoneTitle": "Capstone project",
  "capstone": [
   "Develop a complete Investment-Ready Energy Project"
  ],
  "outputs": [
   "project concept",
   "customer/offtaker",
   "technical scope",
   "CAPEX/OPEX",
   "revenue model",
   "financing structure",
   "implementation plan",
   "risk register",
   "ESG metrics",
   "investment presentation"
  ],
  "audience": [],
  "notes": []
 },
 {
  "code": "CGEVB",
  "name": "GETS Certified GreenTech Entrepreneur & Venture Builder",
  "purpose": "Develop founders capable of building investable and scalable GreenTech ventures.",
  "competencies": [
   "Problem Discovery",
   "Customer Discovery",
   "MVP",
   "Pilot Design",
   "Market Validation",
   "Business Models",
   "Pricing",
   "Unit Economics",
   "ESG",
   "Regulatory Readiness",
   "Project Finance",
   "Climate Finance",
   "Fundraising",
   "Investor Readiness",
   "Pitching",
   "Scale Strategy"
  ],
  "modules": [
   "GreenTech Launchpad",
   "GreenTech Entrepreneurship",
   "Green Energy Entrepreneurship",
   "Energy Project Finance",
   "Climate Finance",
   "ESG",
   "Proposal Development",
   "Business Development"
  ],
  "capstoneTitle": "90-Day Venture Building Project",
  "capstone": [],
  "outputs": [
   "validated problem",
   "customer interviews",
   "business model",
   "MVP/pilot concept",
   "pricing model",
   "financial model",
   "ESG framework",
   "pitch deck",
   "pilot proposal",
   "investment-readiness review"
  ],
  "audience": [],
  "notes": []
 },
 {
  "code": "CIPOEP",
  "name": "GETS Certified Industrial Productivity & Operational Excellence Professional",
  "purpose": "Employer-focused certification combining industrial operations, workplace productivity and energy productivity.",
  "competencies": [
   "Lean Operations",
   "Process Improvement",
   "Root-Cause Analysis",
   "Quality",
   "Maintenance",
   "Energy Efficiency",
   "Energy Productivity",
   "Workplace Productivity",
   "Digital Productivity",
   "Data",
   "Supply Chain",
   "Operations",
   "Leadership"
  ],
  "modules": [
   "Operations Management",
   "Energy Efficiency",
   "Energy Audit",
   "Procurement",
   "Digital Productivity",
   "Data & Reporting",
   "Leadership & Team Management",
   "Project Coordination",
   "Technical Documentation"
  ],
  "capstoneTitle": "Capstone project",
  "capstone": [
   "Solve a measurable operational problem in a real or approved simulated workplace."
  ],
  "outputs": [
   "downtime reduction",
   "process improvement",
   "energy-use reduction",
   "maintenance improvement",
   "inventory improvement",
   "workflow improvement",
   "productivity improvement"
  ],
  "audience": [],
  "notes": [
   "GET Energy differentiation: People Productivity + Energy Productivity + Industrial Productivity"
  ]
 },
 {
  "code": "CEHRCP",
  "name": "GETS Certified Energy HSE, Reliability & Compliance Professional",
  "purpose": "Combine safety, reliability, energy operations and compliance into one professional competency framework.",
  "competencies": [
   "HSE",
   "Electrical Safety",
   "Energy Infrastructure Safety",
   "Risk Assessment",
   "Reliability",
   "Preventive Maintenance",
   "Regulatory Awareness",
   "Incident Prevention",
   "Compliance",
   "Technical Documentation"
  ],
  "modules": [
   "HSE",
   "Electrical Safety & Statutory Regulations",
   "Fire Safety",
   "Power Systems Operations & Maintenance",
   "Generator & Distributed Power Operations",
   "Technical Documentation"
  ],
  "capstoneTitle": "Capstone project",
  "capstone": [
   "Develop an HSE, reliability and compliance improvement plan for an energy or industrial facility."
  ],
  "outputs": [],
  "audience": [],
  "notes": []
 },
 {
  "code": "CTTLS",
  "name": "GETS Certified Technical Team Leader & Workforce Supervisor",
  "purpose": "Bridge the gap between technical competence and effective workforce supervision.",
  "competencies": [
   "Technical Supervision",
   "Team Leadership",
   "HSE",
   "Work Planning",
   "Maintenance Coordination",
   "Communication",
   "Digital Reporting",
   "Problem Solving",
   "Customer / Stakeholder Management",
   "Productivity",
   "Performance Management"
  ],
  "modules": [
   "Leadership & Team Management",
   "Project Coordination",
   "Workplace Communication",
   "HSE",
   "Operations Management",
   "Digital Productivity",
   "Data & Reporting",
   "Customer Service"
  ],
  "capstoneTitle": "Supervisory Workplace Improvement Project",
  "capstone": [],
  "outputs": [],
  "audience": [],
  "notes": []
 }
];
export const getCertification = (code: string) => CERTIFICATIONS.find((c) => c.code.toLowerCase() === code.toLowerCase());
