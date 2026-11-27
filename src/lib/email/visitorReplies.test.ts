import { describe, expect, it } from "vitest";
import { renderVisitorReply, replyKind, serviceQuestions, visitorReplyAllowed } from "./visitorReplies";

describe("approved visitor reply templates", () => {
  const types = ["academy-waitlist", "careers", "contact", "electricity", "academy-corporate"];
  for (const type of types) {
    it(`${type} fills reference, drops missing phrases and has no leftover brackets`, () => {
      const table = type === "electricity" ? "electricity_token_requests" : "service_requests";
      for (const fields of [{}, { contact_name: "Ada Okafor", full_name: "Ada Okafor", service_name: "Solar", amount_ngn: 5000, meter_number: "12345678901", disco: "Ikeja Electric", preferred_contact_method: "WhatsApp", details: { course_title: "Solar PV", role: "Engineer", organisation: "Example Ltd" } }]) {
        const reply = renderVisitorReply(table, { request_type: type, reference: "GE-TEST-123", ...fields });
        expect(reply.subject).toContain("GE-TEST-123");
        expect(reply.text).toContain("Your reference is GE-TEST-123.");
        expect(reply.subject + reply.text + reply.html).not.toMatch(/[\[\]]/);
        expect(reply.text).toMatch(/Questions\? WhatsApp \+234 818 074 2835 or reply to this email\. GET Energy never asks for payment by email\.$/);
      }
    });
  }
  it("maps every lead form type without treating support as a registration", () => {
    for (const type of ["training", "academy-application", "academy-waitlist", "academy-certification"]) expect(replyKind("service_requests", { request_type: type })).toBe("academy");
    expect(replyKind("service_requests", { request_type: "academy-corporate" })).toBe("corporate");
    expect(replyKind("service_requests", { request_type: "careers" })).toBe("careers");
    for (const type of ["bills", "fuel", "community", "cngbook", "ev", "paas", "eea", "invest", "equipment", "contact", "whatsapp", "quote", "sophia", "academy-support", "cng-refuelling", "cng-maintenance", "ev-hybrid-services", "fleet-transition", "host-site"]) expect(replyKind("service_requests", { request_type: type })).toBe("service");
    expect(replyKind("electricity_token_requests", {})).toBe("electricity");
  });
  it("test mode sends only to the owner inbox", () => {
    expect(visitorReplyAllowed("ccgetenergy@gmail.com")).toBe(true);
    expect(visitorReplyAllowed(" CCGETENERGY@GMAIL.COM ")).toBe(true);
    expect(visitorReplyAllowed("visitor@example.com")).toBe(false);
    expect(visitorReplyAllowed("visitor@example.com", " ")).toBe(false);
  });
  it("configured sender enables visitor replies", () => {
    expect(visitorReplyAllowed("visitor@example.com", "GET Energy <hello@notify.getenergy.ng>")).toBe(true);
  });
  it("selects the seven service question sets", () => {
    for (const [type, first] of [["fuel", "Delivery address and site type?"], ["paas", "Site address and type (home, business, estate, community)?"], ["cngbook", "Vehicle make, model and year (or fleet size)?"], ["ev", "Are you a driver, a fleet or a property owner wanting to host chargers?"], ["smart-metering", "Disco and meter type?"], ["invest", "Your organisation and role?"], ["equipment", "Which equipment?"]]) expect(serviceQuestions({ request_type: type })[0]).toBe(first);
  });
  it("general and unknown enquiries omit questions and renumber next steps", () => {
    for (const type of ["contact", "whatsapp", "unknown", "academy-support", "bills"]) {
      const reply = renderVisitorReply("service_requests", { request_type: type });
      expect(reply.text).not.toContain("please reply with your answers:");
      expect(reply.text).not.toContain("before we call");
      expect(reply.text).toContain("1. A member of our team will contact you within 2 working days.");
    }
  });
  it("uses legacy Position lines for the career role", () => {
    const reply = renderVisitorReply("service_requests", { request_type: "careers", details: { lines: ["Position: Intern"] } });
    expect(reply.subject).toContain("— Intern");
  });
  it("uses quote form's label-keyed service and correct power questions", () => {
    const row = { request_type: "quote", service_name: "Energy Quote", details: { "What do you need?": "Power-as-a-Service" } };
    expect(renderVisitorReply("service_requests", row).subject).toContain("Power-as-a-Service");
    expect(serviceQuestions(row)[0]).toBe("Site address and type (home, business, estate, community)?");
  });
  it("uses stored course title and electricity request reference", () => {
    expect(renderVisitorReply("service_requests", { request_type: "academy-certification", details: { course_title: "GETS Solar" } }).subject).toContain("GETS Solar");
    const reply = renderVisitorReply("electricity_token_requests", { request_reference: "GETELEC-20261127-1234", amount_ngn: 5000, meter_number: "12345678901", disco: "Ikeja Electric", preferred_contact_method: "WhatsApp" });
    expect(reply.subject).toContain("GETELEC-20261127-1234");
    expect(reply.text).toContain("₦5000 token for meter 12345678901 (Ikeja Electric)");
    expect(reply.text).toContain("contact you on WhatsApp");
    expect(reply.text).toContain("No payment has been taken.");
  });
  it("escapes submitted content in HTML and never uses emails as names", () => {
    const reply = renderVisitorReply("service_requests", { contact_name: "owner@example.com", service_name: '<img src=x onerror="alert(1)">[unsafe]' });
    expect(reply.html).not.toContain("<img");
    expect(reply.html).toContain("&lt;img");
    expect(reply.text).toMatch(/^Hello,/);
    expect(reply.subject).not.toMatch(/[\[\]]/);
  });
  it('offers secure online answers while keeping email as an alternative',()=>{
    const reply=renderVisitorReply('service_requests',{request_type:'academy-waitlist',reference:'GE-TEST-123',service_name:'Solar'}, {onlineUrl:'https://getenergy.ng/r/GE-TEST-123?token=sample',questions:['Which city are you in?']});
    expect(reply.text).toContain('Answer online: https://getenergy.ng/r/GE-TEST-123?token=sample');
    expect(reply.html).toContain('>Answer online</a>');
    expect(reply.text).toContain('Or reply to this email');
    expect(reply.text).not.toContain('What is your highest qualification');
  });
  it('does not repeat questions already answered in chat',()=>{
    const reply=renderVisitorReply('service_requests',{request_type:'sophia',reference:'GE-TEST-123',service_name:'Solar course',details:{intake_service_key:'academy'}},{questions:[]});
    expect(reply.kind).toBe('academy');expect(reply.text).not.toContain('What is your highest qualification');
  });
});