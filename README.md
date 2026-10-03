# GetEnergy Connect

Build a corporate website for GET Energy Trading Services Ltd (brand: "GetEnergy"), an integrated energy company in Nigeria/Africa, subsidiary of Pancokrato Integrated Services (PKIS). Tagline: "Energy for Today. Cleaner Opportunities for Tomorrow." Design language: professional, energy-sector credible, deep corporate blue as primary, clean-energy green as secondary, white base, light grey/soft blue support. Mobile-first. Keep the recognisable Africa/lightbulb visual identity in the hero.

BRAND STORY (critical - use this real operating history, not a generic "we started as a digital platform" story):
From 2023 through August 2026, GetEnergy's core business was commercial diesel supply and community electricity vending. It served construction (Pernix Construction, Amasul), retail (Shoprite-related diesel supply across Lagos, Ogun, Delta, Enugu, Kaduna, Abuja, Ondo, Oyo/Ibadan, Onitsha), healthcare (Cedatel Hospitals), oil exploration (Halkin Exploration and Production Ltd, Lagos), and residential/community electricity vending for 400+ homes at Lekki Gardens through implementation partners. GetEnergy also attempted electricity-meter manufacturing through a technology partnership that did not progress into an actual manufacturing operation - present this transparently as a business-learning experience, not an achievement. From August 2026, the company began a Business Process Engineering & Digital Transformation phase, and is now expanding into green energy. Journey timeline: 2023 Operating Foundation -> 2023-Aug 2026 Market Experience -> Aug 2026 Business Process Engineering -> 2026 onward Green & Integrated Energy. Always distinguish clearly between what the company has done, is doing, is building, and plans to do (funder-friendly transparency principle). Include a disclaimer that historical engagement references do not imply current partnership or endorsement.

Transition model (use throughout as the core message): Reliable Energy Today -> Greater Efficiency -> Cleaner Fuels -> Smarter Infrastructure -> Renewable & Low-Carbon Energy.

Mission: "To provide reliable energy today while building practical pathways toward cleaner, smarter and more sustainable energy solutions for tomorrow."
Vision: "To build an integrated African energy-services ecosystem connecting reliable power, cleaner mobility, renewable energy, smart infrastructure, digital commerce and skilled people."
Values: Reliability, Integrity, Innovation, Customer Focus, Safety, Partnership, Sustainability, Learning.

11 SERVICE AREAS (each needs its own page with a lead-capture request form specific to that service - fields noted): 
1. Get Electricity - prepaid/postpaid token vending & bill payment (DisCo, meter/account number, amount, phone, email)
2. Diesel Supply Services (company, contact, email, phone, location, delivery address, litres, frequency, preferred date, application)
3. CNG Services (sourcing, logistics, refuelling, stations)
4. CNG Conversion Centres (vehicle type, manufacturer, model, year, engine, current fuel, fleet size, location, preferred date)
5. EV & Hybrid Mobility (cars, buses, tricycles, commercial vehicles, fleet electrification)
6. EV Charging & Battery Solutions (AC/DC charging, depot charging, battery swap)
7. Power as a Service (hospitals, hotels, factories, estates - requirement, assessment, proposal workflow)
8. Energy E-Commerce Africa (EEA) - marketplace pilot registration, links to eea.africa
9. Training & Certification (EV, CNG, solar, BESS, metering, energy management)
10. Smart Metering & Electricity Vending
11. Renewables, BESS, Generators & Distributed Power (location, property type, current power source, monthly electricity cost, generator capacity, load, operating hours)

OTHER PAGES: Home (hero + quick actions + 11 solutions grid + green energy teaser + journey timeline + sectors served + CTA), Green Energy (the 5-stage transition model + green energy category grid: EV mobility, hybrid mobility, CNG transition, solar, BESS, charging infrastructure, smart metering, energy management, energy-efficient products, green skills), About (full brand story above, mission/vision/values, selected historical engagements grid, journey timeline), Technology (diagram: Customers <-> GetEnergy <-> Shared Technology <-> EEA <-> Suppliers/OEMs/professionals), Industries We Serve (construction, retail, healthcare, hospitality, residential estates, oil & gas, transport/logistics, commercial fleets, education/government - each paired with relevant solution), Partners & Funders (company history, current capability, future pipeline, governance/due-diligence distinguishing done/doing/building/planned), FAQ, Careers (job listings + application form), Contact (contact form), Login/Register/Account dashboard.

REQUIRED FUNCTIONALITY (use a real backend/database, not local-only storage): user registration and login (individual and business account types), an account dashboard showing the logged-in customer's own profile and their submitted service requests with status, and every lead-capture form on every service page should create a real request/lead record tied to the account (or anonymous if not logged in) that a future admin view could review. Every form must show a confirmation/request-ID on submit - no dead-end forms, and do not fake payment completion anywhere (electricity token and bill payment should clearly state online payment is launching soon and route to a request instead).

Main navigation: Home, Electricity, Diesel, CNG, EV & Mobility, Green Energy, EEA, About, Partners, Contact, plus Technology and Industries reachable from footer/secondary nav. Primary CTA throughout: "Request an Energy Solution".

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://getenergy-african-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e4f63bca-9611-4b48-999c-df887db9c905).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
