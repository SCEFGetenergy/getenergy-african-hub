import { ACADEMY_CENTRE } from "@/lib/academy";

/** Room proportions are to scale; interior zones are schematic, not a seating layout. */
export function B16FloorPlan() {
  const { widthMetres, depthMetres } = ACADEMY_CENTRE.room;
  const width = widthMetres * 50;
  const depth = depthMetres * 50;
  return (
    <svg viewBox="0 0 460 455" role="img" aria-labelledby="b16-plan-title b16-plan-description" className="mx-auto block w-full max-w-xl text-brand-deep">
      <title id="b16-plan-title">B16 Training Centre proposed floor plan</title>
      <desc id="b16-plan-description">6.50 metre wide by 6.90 metre deep room. Presentation wall and screen at the front, instructor desk, front-corner green-screen media zone, generic student seating block for up to 24 learners, and rear entrance. Final seating layout is being confirmed.</desc>
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M70 30H395 M70 24V36 M395 24V36 M42 55V400 M36 55H48 M36 400H48" />
      </g>
      <g className="fill-brand-deep" fontSize="15" textAnchor="middle">
        <text x="232.5" y="20">{widthMetres.toFixed(2)} m wide</text>
        <text transform="translate(25 227.5) rotate(-90)">{depthMetres.toFixed(2)} m deep</text>
      </g>
      <rect x="70" y="55" width={width} height={depth} className="fill-background stroke-brand-deep" strokeWidth="2" />
      <rect x="95" y="68" width="210" height="25" className="fill-brand-deep" />
      <text x="200" y="85" textAnchor="middle" fontSize="13" className="fill-brand-foreground">Presentation wall + screen</text>
      <rect x="110" y="122" width="157" height="49" className="fill-surface stroke-border" />
      <text x="188.5" y="151" textAnchor="middle" fontSize="14" className="fill-brand-deep">Instructor desk</text>
      <rect x="290" y="105" width="90" height="91" className="fill-brand-green-soft stroke-brand-green" />
      <text x="335" y="130" textAnchor="middle" fontSize="13" className="fill-brand-deep">
        <tspan x="335">Green-screen</tspan><tspan x="335" dy="20">media corner</tspan><tspan x="335" dy="20">+ desk</tspan>
      </text>
      <rect x="95" y="220" width="275" height="124" rx="4" className="fill-surface stroke-brand-green" strokeDasharray="6 4" />
      <text x="232.5" y="265" textAnchor="middle" fontSize="16" className="fill-brand-deep">
        <tspan x="232.5">Student seating — up to 24</tspan>
        <tspan x="232.5" dy="25" fontSize="14">(layout being finalised)</tspan>
      </text>
      <path d="M209 400H256" className="stroke-background" strokeWidth="5" />
      <path d="M209 400V365 M256 400Q256 365 209 365" fill="none" className="stroke-brand-green" strokeWidth="2" />
      <text x="232.5" y="430" textAnchor="middle" fontSize="15" className="fill-brand-deep">Rear entrance</text>
    </svg>
  );
}