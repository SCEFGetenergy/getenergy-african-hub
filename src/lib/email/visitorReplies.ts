export type ReplyKind = "academy" | "careers" | "service" | "electricity" | "corporate";
type Lead = Record<string, unknown>;
export const REPLY_INBOX = "ccgetenergy@gmail.com";
const FOOTER = "Questions? WhatsApp +234 818 074 2835 or reply to this email. GET Energy never asks for payment by email.";

const QUESTIONS = {
  diesel: ["Delivery address and site type?", "Litres needed per delivery and how often?", "Tank size and access for a tanker?", "Current supplier and price per litre, if you'd like a comparison?"],
  power: ["Site address and type (home, business, estate, community)?", "Average monthly electricity and diesel spend?", "Main appliances or equipment, and hours of use?", "Do you own the site or the roof?", "Preferred model: buy outright, pay monthly, or pay-as-you-use?"],
  cng: ["Vehicle make, model and year (or fleet size)?", "Daily distance driven?", "Where are the vehicles based?", "Petrol or diesel today?"],
  ev: ["Are you a driver, a fleet or a property owner wanting to host chargers?", "Location and parking available?", "Number and type of vehicles?", "Power supply at the site?"],
  metering: ["Disco and meter type?", "Number of meters or units?", "What problem are you trying to solve (billing, theft, estimated bills)?"],
  partners: ["Your organisation and role?", "Which GET Energy line interests you?", "What would you bring (capital, sites, technology, distribution)?", "Your timeline?"],
  equipment: ["Which equipment?", "Quantity and site?", "Delivery or installation needed?"],
};

function clean(value: unknown): string {
  return typeof value === "string" || typeof value === "number" ? String(value).replace(/[\[\]\r\n]/g, " ").trim() : "";
}
function detailsOf(row: Lead): Lead {
  const details = row["details"];
  return details && typeof details === "object" && !Array.isArray(details) ? details as Lead : {};
}
function field(row: Lead, keys: string[], labels: string[] = []): string {
  const details = detailsOf(row);
  for (const key of keys) {
    const value = clean(row[key]) || clean(details[key]);
    if (value) return value;
  }
  for (const [key, value] of Object.entries(details)) {
    if (labels.some((label) => key.trim().toLowerCase() === label.toLowerCase())) {
      const text = clean(value);
      if (text) return text;
    }
  }
  const lines = details["lines"];
  if (Array.isArray(lines)) for (const line of lines) {
    if (typeof line !== "string") continue;
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const label = line.slice(0, colon).trim().toLowerCase().replace(/\s*\*$/, "");
    if (labels.some((candidate) => label === candidate.toLowerCase())) return clean(line.slice(colon + 1));
  }
  return "";
}
export function replyKind(table: string, row: Lead): ReplyKind {
  if (table === "electricity_token_requests") return "electricity";
  const type = clean(row["request_type"]).toLowerCase();
  if (type === "academy-corporate") return "corporate";
  if (["academy-application", "academy-waitlist", "academy-certification", "training"].includes(type)) return "academy";
  if (type === "careers") return "careers";
  return "service";
}
export function serviceQuestions(row: Lead): string[] {
  const type = clean(row["request_type"]).toLowerCase();
  if (["contact", "whatsapp", "academy-support", "bills"].includes(type)) return [];
  const service = field(row, ["service", "service_interest", "interest", "need"], ["Service", "Service of interest", "Interested in", "Solution required", "What do you need?", "Preferred solution"]);
  const context = `${type} ${clean(row["service_name"])} ${service}`.toLowerCase();
  if (/equipment|energy-saving/.test(context)) return QUESTIONS.equipment;
  if (/partner|invest|\beea\b|e-commerce/.test(context)) return QUESTIONS.partners;
  if (/meter/.test(context)) return QUESTIONS.metering;
  if (/cng/.test(context)) return QUESTIONS.cng;
  if (/\bev\b|ev-|charging|fleet|host-site/.test(context)) return QUESTIONS.ev;
  if (/diesel|\bfuel\b/.test(context)) return QUESTIONS.diesel;
  if (/paas|power.as.a.service|electricity.as.a.service|solar|renewables|bess|mini.grid|community|battery storage/.test(context)) return QUESTIONS.power;
  return [];
}
const numbered = (items: string[]) => items.map((item, index) => `${index + 1}. ${item}`).join("\n");
const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export function visitorReplyAllowed(email: string, configuredSender?: string): boolean {
  return !!configuredSender?.trim() || email.trim().toLowerCase() === REPLY_INBOX;
}

export function renderVisitorReply(table: string, row: Lead) {
  const kind = replyKind(table, row);
  const reference = field(row, ["request_reference", "reference"]);
  const refSubject = reference ? ` (${reference})` : "";
  const refSentence = reference ? ` Your reference is ${reference}.` : "";
  const name = field(row, ["full_name", "contact_name", "name", "contact"]);
  const firstName = name && !name.includes("@") ? name.split(/\s+/)[0] : "";
  const hello = firstName ? `Hello ${firstName},` : "Hello,";
  const email = field(row, [table === "electricity_token_requests" ? "email" : "contact_email"]).toLowerCase();
  let subject: string;
  let body: string;
  if (kind === "academy") {
    const course = field(row, ["course_title", "course_name"], ["Programme", "Selected programme", "Certification", "Course", "Programme of interest"]) || clean(row["service_name"]);
    subject = `You're on the GET Academy waiting list${course ? ` — ${course}` : ""}${refSubject}`;
    body = `Thank you for registering${course ? ` for ${course}` : ""}. Your place on the waiting list is confirmed.${refSentence}\n\nWhat happens next\n1. Reply to this email with your answers to the questions below. It takes about 5 minutes.\n2. Our team reviews your answers and may invite you to a short 10–15 minute call to confirm the right course level for you.\n3. When the next cohort's dates, venue and final fee are confirmed, we'll email you first, before places open to the public.\nNo payment is taken at this stage. Final fees are confirmed with each cohort.\n\nPlease reply with your answers:\n${numbered([
      "What is your highest qualification, and in what field?",
      "Do you have any hands-on electrical, solar, mechanical or automotive experience? If yes, how many years and what kind of work?",
      "What do you want this training to help you do: get a job, grow in your current job, start your own business, or something else?",
      "Are you currently employed? If yes, what is your role, and is your employer likely to sponsor your training?",
      "Which city are you in, and can you attend practical sessions in person at our B16 Training Centre?",
      "Which days and times suit you best: weekdays, weekends, or evenings?",
      "Would you need a scholarship, sponsorship or loan to take part?",
      "Is there anything we should know to support you during training, such as accessibility needs?",
    ])}\n\nWe look forward to training with you.\nGET Academy team`;
  } else if (kind === "careers") {
    const role = field(row, ["role", "position", "job_role"], ["Role", "Role of interest", "Position", "Position applied for"]);
    subject = `We've received your application${role ? ` — ${role}` : ""}${refSubject}`;
    body = `Thank you for applying${role ? ` for ${role}` : ""} at GET Energy Trading Services.${refSentence}\n\nWhat happens next\n1. Reply to this email with your answers to the screening questions below, within 7 days.\n2. We review every application. Shortlisted candidates are invited to an interview, usually by video call first.\n3. If you're not shortlisted, we'll still let you know.\nWe never charge candidates a fee at any stage of recruitment.\n\nScreening questions — please reply with your answers:\n${numbered([
      "Why do you want to work in energy, and why with GET Energy?",
      "Describe a project or job where you solved a practical problem. What did you do, and what was the result?",
      "Which of these have you worked with: solar PV, batteries or inverters, generators, metering, CNG or fuel, EVs, customer service, sales? Give one example.",
      "How do you keep yourself and others safe at work? Give a real example.",
      "Where are you based, and are you willing to travel to sites?",
      "When could you start, and what notice period do you have?",
      "What salary range are you expecting?",
    ])}\n\nGET Energy recruitment team`;
  } else if (kind === "corporate") {
    const organisation = field(row, ["company_name", "organisation", "organization"], ["Organisation", "Company / organisation"]);
    subject = `Your corporate training request${organisation ? ` — ${organisation}` : ""}${refSubject}`;
    body = `Thank you for asking GET Academy to train your team.${refSentence}\n\nWhat happens next\n1. Reply with your answers to the scoping questions below.\n2. We'll suggest the right programmes and a draft outline within 5 working days.\n3. We'll agree dates, venue (your site or our B16 Training Centre) and a written quotation before anything is booked.\n\nScoping questions — please reply with your answers:\n${numbered([
      "Which topics do you need (for example solar, electrical safety, energy audit, CNG, EV, HSE, leadership)?",
      "How many staff, and in what roles?",
      "What should they be able to do after the training?",
      "Do they need an assessment, a certificate of completion, or preparation for an external certification?",
      "Preferred dates, duration and delivery mode (on-site, at B16, online)?",
      "Who approves training spend, and is there a budget range?",
    ])}\n\nGET Academy team`;
  } else if (kind === "electricity") {
    const amount = field(row, ["amount_ngn"]);
    const meter = field(row, ["meter_number"]);
    const disco = field(row, ["disco"]);
    const method = field(row, ["preferred_contact_method"]);
    subject = `Electricity token request received${refSubject}`;
    body = `We've received your request${amount ? ` for a ₦${amount} token` : ""}${meter ? ` for meter ${meter}` : ""}${disco ? ` (${disco})` : ""}.${refSentence}\n\nWhat happens next\n1. Our team will contact you${method ? ` on ${method}` : ""} to complete your request.\n2. Please check the meter number${meter ? " above" : ""}. If it's wrong, reply to this email straight away.\nNo payment has been taken. Only pay through the method our team confirms with you, and never share your card PIN or OTP.\nGET Energy team`;
  } else {
    const service = field(row, ["service", "service_interest", "interest", "need"], ["Service", "Service of interest", "Interested in", "Solution required", "What do you need?", "Preferred solution"]) || clean(row["service_name"]);
    const questions = serviceQuestions(row);
    subject = `We've received your${service ? ` ${service}` : ""} request${refSubject}`;
    const steps = [
      ...(questions.length ? ["Reply to this email with answers to the questions below, so we can prepare options before we call."] : []),
      "A member of our team will contact you within 2 working days.",
      "Where a site visit is needed, we'll agree a time with you. Any quotation is given in writing; nothing is charged before you accept it.",
    ];
    body = `Thank you for contacting GET Energy${service ? ` about ${service}` : ""}.${refSentence}\n\nWhat happens next\n${numbered(steps)}${questions.length ? `\n\nQuestions for your request — please reply with your answers:\n${numbered(questions)}` : ""}\nGET Energy team`;
  }
  const text = `${hello}\n\n${body}\n\n${FOOTER}`;
  const html = `<!doctype html><html lang="en"><body>${text.split("\n\n").map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`).join("")}</body></html>`;
  return { kind, to: email, subject, text, html };
}