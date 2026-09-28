// @ts-nocheck
/* Ported verbatim from the supplied GetEnergy site script; only routing and form submission are wired to the app. */

/* Developer settings: switch on once a licensed payment provider, a token/VTU
   aggregator and customer accounts are connected, then implement startPayment(). */
export var CONFIG={paymentsLive:false,accountsLive:false,boardEndpoint:null,
  email:{sales:"sales@getenergy.ng",support:"sales@getenergy.ng",careers:"sales@getenergy.ng",training:"sales@getenergy.ng"}};
function startPayment(request){ /* INTEGRATION POINT */ }

export function initLegacy(api){

  var DISCOS=["Abuja Electricity (AEDC)","Benin Electricity (BEDC)","Eko Electricity (EKEDC)","Enugu Electricity (EEDC)","Ibadan Electricity (IBEDC)","Ikeja Electric (IE)","Jos Electricity (JED)","Kaduna Electric (KAEDCO)","Kano Electricity (KEDCO)","Port Harcourt Electricity (PHED)","Yola Electricity (YEDC)","Aba Power"];
  [].forEach.call(document.querySelectorAll("select[data-disco]"),function(s){s.innerHTML='<option value="">Select your DISCO</option>'+DISCOS.map(function(d){return "<option>"+d+"</option>"}).join("")});
  var BILLS={
    airtime:{label:"Airtime",prov:["MTN","Airtel","Glo","9mobile"],id:"Phone number to recharge"},
    data:{label:"Data",prov:["MTN","Airtel","Glo","9mobile"],id:"Phone number to recharge",plan:"Data plan"},
    cable:{label:"Cable TV",prov:["DStv","GOtv","StarTimes","Showmax"],id:"Smartcard or IUC number",plan:"Package"},
    exams:{label:"Exams",prov:["WAEC","NECO","JAMB","NABTEB"],id:"Candidate phone number or profile code",plan:"Number of PINs"},
    water:{label:"Water",prov:null,id:"Customer account number"},
    government:{label:"Government payments",prov:["Remita"],id:"Remita retrieval reference (RRR)"},
    religious:{label:"Religious institutions",prov:null,id:"Purpose of payment"},
    betting:{label:"Betting and lottery",prov:null,id:"Betting account ID"}
  };
  var cat=document.getElementById("bl-cat");
  cat.innerHTML='<option value="">Select bill type</option>'+Object.keys(BILLS).map(function(k){return '<option value="'+k+'">'+BILLS[k].label+"</option>"}).join("");
  function setBill(k){
    var b=BILLS[k],pw=document.getElementById("bl-prov-wrap"),tw=document.getElementById("bl-provtxt-wrap"),plw=document.getElementById("bl-plan-wrap"),pt=document.getElementById("bl-provtxt");
    if(!b){pw.hidden=false;tw.hidden=true;plw.hidden=true;pt.required=false;return}
    if(b.prov){pw.hidden=false;tw.hidden=true;pt.required=false;document.getElementById("bl-prov").innerHTML=b.prov.map(function(p){return "<option>"+p+"</option>"}).join("")}
    else{pw.hidden=true;tw.hidden=false;pt.required=true}
    document.getElementById("bl-id-label").textContent=b.id;plw.hidden=!b.plan;if(b.plan)document.getElementById("bl-plan-label").textContent=b.plan;
  }
  cat.addEventListener("change",function(){setBill(cat.value)});setBill("");

  // our services page mirrors home list
  document.getElementById("svc-copy").innerHTML=[].map.call(document.querySelectorAll("[data-page=home] .sol"),function(s){return s.innerHTML}).join("");

  /* ---------- Energy Desk ----------
     In production, CONFIG.boardEndpoint points to the backend (e.g. /api/energy-desk/today),
     which the AI desk refreshes daily. Without it, the embedded SAMPLE is shown and labelled. */
  var SAMPLE={
    live:false,
    updated:"Snapshot prepared 25 September 2026",
    news:[
      {region:"Africa",title:"African Energy Week 2026 runs in Cape Town from 12 to 16 October, with Sierra Leone's petroleum directorate joining as a strategic partner",source:"African Energy Chamber",url:"https://aecweek.com/news-media/latest-news"},
      {region:"Africa",title:"NSIA and Africa50 launch a $300 million fund for mini-grids and commercial solar in Nigeria, backed by the World Bank Group",source:"Energy News Network",url:"https://energy-news-network.com/"},
      {region:"Africa",title:"Petrobras signs eight production-sharing contracts for offshore blocks in Côte d'Ivoire",source:"Energy News Network",url:"https://energy-news-network.com/"},
      {region:"Africa",title:"Kenya's grid carries a record 2,549 MW as KenGen plans major renewable additions by 2034",source:"Energy News Network",url:"https://energy-news-network.com/"},
      {region:"Africa",title:"DR Congo and the World Bank sign financing agreements worth $2 billion",source:"Africa Energy Portal",url:"https://africa-energy-portal.org/news"},
      {region:"Africa",title:"Mozambique, Nigeria and Congo expand LNG exports as small-scale LNG networks grow",source:"African Energy Chamber",url:"https://aecweek.com/news-media/latest-news"},
      {region:"World",title:"Conflict in the Middle East keeps oil markets volatile, lifting European energy shares",source:"Energy Connects",url:"https://www.energyconnects.com/world/africa/"}
    ],
    brief:[
      "Gas is the story in Africa: LNG exports are growing in Mozambique, Nigeria and Congo.",
      "A new $300 million fund targets mini-grids and commercial solar in Nigeria, good news for distributed power demand.",
      "Oil prices remain volatile on Middle East supply risk, so watch depot prices for diesel and petrol."
    ],
    white:[
      {p:"Diesel (AGO)",depot:"—",lagos:"—",abuja:"—",ch:0},
      {p:"Petrol (PMS)",depot:"—",lagos:"—",abuja:"—",ch:0},
      {p:"Kerosene (DPK)",depot:"—",lagos:"—",abuja:"—",ch:0},
      {p:"Aviation fuel (ATK)",depot:"—",lagos:"—",abuja:"—",ch:0},
      {p:"Cooking gas (LPG), per kg",depot:"—",lagos:"—",abuja:"—",ch:0}
    ],
    eea:[
      {p:"Solar panel, 550W mono",price:"—",n:"—",ch:0},
      {p:"Hybrid inverter, 5 kVA",price:"—",n:"—",ch:0},
      {p:"Lithium battery, 5 kWh",price:"—",n:"—",ch:0},
      {p:"Diesel generator, 20 kVA",price:"—",n:"—",ch:0},
      {p:"Prepaid smart meter, single phase",price:"—",n:"—",ch:0},
      {p:"CNG conversion kit, car",price:"—",n:"—",ch:0}
    ],
    comm:[
      {m:"Brent crude ($/bbl)",v:"—",ch:0},{m:"WTI crude ($/bbl)",v:"—",ch:0},{m:"Henry Hub gas ($/MMBtu)",v:"—",ch:0},{m:"USD/NGN",v:"—",ch:0}
    ],
    stocks:[
      {c:"Seplat Energy",x:"NGX",v:"—",ch:0},{c:"Aradel Holdings",x:"NGX",v:"—",ch:0},{c:"Oando",x:"NGX",v:"—",ch:0},
      {c:"TotalEnergies Marketing Nigeria",x:"NGX",v:"—",ch:0},{c:"Conoil",x:"NGX",v:"—",ch:0},{c:"MRS Oil Nigeria",x:"NGX",v:"—",ch:0}
    ]
  };
  function chg(v){if(v===null||v===undefined||v===0)return '<span class="flat">—</span>';return '<span class="'+(v>0?"up":"down")+'">'+(v>0?"▲ ":"▼ ")+Math.abs(v).toFixed(2)+"%</span>"}
  function esc(s){var d=document.createElement("div");d.textContent=s==null?"":String(s);return d.innerHTML}
  function renderDesk(D){
    var mode=document.getElementById("desk-mode");
    mode.textContent=D.live?"Live":"Sample data";mode.classList.toggle("live",!!D.live);
    document.getElementById("desk-updated").textContent=D.updated||"";
    var nf=(document.querySelector("input[name=nf]:checked")||{}).value||"all";
    document.getElementById("desk-news").innerHTML=D.news.filter(function(n){return nf==="all"||n.region===nf}).map(function(n){
      return '<li><span class="tag">'+esc(n.region)+'</span><a href="'+esc(n.url)+'" target="_blank" rel="noopener noreferrer">'+esc(n.title)+'</a><span class="src">'+esc(n.source)+'</span></li>'}).join("")||'<li>No stories in this category yet.</li>';
    document.getElementById("desk-brief").innerHTML=D.brief.map(function(b){return "<li>"+esc(b)+"</li>"}).join("");
    document.querySelector("#desk-white tbody").innerHTML=D.white.map(function(r){return "<tr><td>"+esc(r.p)+"</td><td>"+esc(r.depot)+"</td><td>"+esc(r.lagos)+"</td><td>"+esc(r.abuja)+"</td><td>"+chg(r.ch)+"</td></tr>"}).join("");
    document.querySelector("#desk-eea tbody").innerHTML=D.eea.map(function(r){return "<tr><td>"+esc(r.p)+"</td><td>"+esc(r.price)+"</td><td>"+esc(r.n)+"</td><td>"+chg(r.ch)+"</td></tr>"}).join("");
    document.querySelector("#desk-comm tbody").innerHTML=D.comm.map(function(r){return "<tr><td>"+esc(r.m)+"</td><td>"+esc(r.v)+"</td><td>"+chg(r.ch)+"</td></tr>"}).join("");
    document.querySelector("#desk-stocks tbody").innerHTML=D.stocks.map(function(r){return "<tr><td>"+esc(r.c)+"</td><td>"+esc(r.x)+"</td><td>"+esc(r.v)+"</td><td>"+chg(r.ch)+"</td></tr>"}).join("");
    var tick=D.white.slice(0,3).map(function(r){return "<span><b>"+esc(r.p)+"</b>depot "+esc(r.depot)+" "+chg(r.ch)+"</span>"})
      .concat(D.comm.map(function(r){return "<span><b>"+esc(r.m)+"</b>"+esc(r.v)+" "+chg(r.ch)+"</span>"}))
      .concat(D.stocks.map(function(r){return "<span><b>"+esc(r.c)+"</b>"+esc(r.v)+" "+chg(r.ch)+"</span>"}));
    document.getElementById("desk-ticker").innerHTML=tick.join("");
    document.getElementById("desk-foot").innerHTML=D.live?"Updated daily by the GetEnergy AI desk from licensed news, price and market data feeds.":
      "Preview: news items are real recent stories linked to their sources. Prices, markets and stocks appear when the Energy Desk backend and its data feeds are switched on.";
  }
  var DESK=SAMPLE;
  if(document.getElementById("desk-mode")){
    [].forEach.call(document.querySelectorAll("input[name=nf]"),function(r){r.addEventListener("change",function(){renderDesk(DESK)})});
    renderDesk(DESK);
    if(CONFIG.boardEndpoint){
      fetch(CONFIG.boardEndpoint).then(function(r){return r.json()}).then(function(d){DESK=d;renderDesk(d)}).catch(function(){/* keep last good data */});
      setInterval(function(){fetch(CONFIG.boardEndpoint).then(function(r){return r.json()}).then(function(d){DESK=d;renderDesk(d)}).catch(function(){})},15*60*1000);
    }
  }

  // router (driven by the app router)
  var pages=[].slice.call(document.querySelectorAll("[data-page]")),links=[].slice.call(document.querySelectorAll("nav.main a"));
  var aliases={"about-us":"about","invest":"home","paas":"power-as-a-service","eea":"energy-ecommerce","diesel":"get-fuel","cng-ev":"cng","cng-conversion":"cng"};
  function show(name){
    pages=[].slice.call(document.querySelectorAll("[data-page]"));links=[].slice.call(document.querySelectorAll("nav.main a"));
    name=aliases[name]||name;
    var pg=pages.filter(function(p){return p.dataset.page===name})[0]||(name===null?null:pages.filter(function(p){return p.dataset.page==="notfound"})[0]);
    pages.forEach(function(p){p.classList.toggle("on",p===pg)});
    links.forEach(function(a){var n=a.getAttribute("href").replace(/^\/?/,"")||"home";if(pg&&n===pg.dataset.page)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")});
    if(pg&&location.hash){var el=document.getElementById(location.hash.slice(1));if(el){el.scrollIntoView();return}}
  }
  var t=document.querySelector(".menu-toggle"),n=document.getElementById("nav");
  t.addEventListener("click",function(){var o=n.classList.toggle("open");t.setAttribute("aria-expanded",o)});
  var solutions=n.querySelector(".solutions-nav details");
  n.addEventListener("click",function(e){if(e.target.closest("a")){n.classList.remove("open");t.setAttribute("aria-expanded","false");solutions.open=false}});
  document.addEventListener("click",function(e){if(!solutions.contains(e.target))solutions.open=false});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"){solutions.open=false;n.classList.remove("open");t.setAttribute("aria-expanded","false")}});

  [].forEach.call(document.querySelectorAll("[role=tablist]"),function(list){
    var tabs=[].slice.call(list.querySelectorAll("[role=tab]"));
    function sel(tab){tabs.forEach(function(b){var on=b===tab;b.setAttribute("aria-selected",on);b.tabIndex=on?0:-1;var p=document.getElementById(b.getAttribute("aria-controls"));p.hidden=!on;p.classList.toggle("on",on)})}
    tabs.forEach(function(b,i){b.addEventListener("click",function(){sel(b)});b.addEventListener("keydown",function(e){var j=null;if(e.key==="ArrowRight")j=(i+1)%tabs.length;if(e.key==="ArrowLeft")j=(i-1+tabs.length)%tabs.length;if(j!==null){e.preventDefault();sel(tabs[j]);tabs[j].focus()}})});
  });
  [].forEach.call(document.querySelectorAll("[data-centre]"),function(b){b.addEventListener("click",function(){document.getElementById("cb-centre").value=b.dataset.centre;document.getElementById("book-conversion").scrollIntoView({behavior:"smooth"});document.getElementById("cb-name").focus({preventScroll:true})})});
  [].forEach.call(document.querySelectorAll("[data-apply]"),function(b){b.addEventListener("click",function(){document.getElementById("ap-pos").value=b.dataset.apply;document.getElementById("apply").scrollIntoView({behavior:"smooth"});document.getElementById("ap-name").focus({preventScroll:true})})});

  function check(el){
    var v=el.type==="checkbox"?(el.checked?"y":""):el.value.trim(),ok=!!v;
    if(ok&&el.type==="email")ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    if(ok&&el.type==="tel")ok=v.replace(/\D/g,"").length>=10;
    if(ok&&el.type==="url")ok=/^https?:\/\/\S+\.\S+/.test(v);
    if(ok&&el.dataset.digits){var r=el.dataset.digits.split(","),d=v.replace(/\D/g,"");ok=d===v.replace(/\s/g,"")&&d.length>=+r[0]&&d.length<=+r[1]}
    if(ok&&el.type==="number"&&el.min)ok=+v>=+el.min;
    if(ok&&el.minLength>0)ok=v.length>=el.minLength;
    var w=el.closest(".f");if(w)w.classList.toggle("invalid",!ok);el.setAttribute("aria-invalid",!ok);return ok;
  }
  function collect(form){
    var lines=[];
    [].forEach.call(form.querySelectorAll(".f"),function(w){
      if(w.hidden||w.closest("[hidden]"))return;
      if(w.tagName==="FIELDSET"){var leg=w.querySelector("legend").childNodes[0].textContent.trim();var vals=[].map.call(w.querySelectorAll("input:checked"),function(i){return i.value});if(vals.length)lines.push(leg+": "+vals.join(", "));return}
      var el=w.querySelector("input,select,textarea");if(!el||el.type==="password"||el.type==="checkbox"||el.value==="")return;
      var v=el.tagName==="SELECT"?el.options[el.selectedIndex].text:el.value.trim();if(!v)return;
      lines.push(w.querySelector("label").childNodes[0].textContent.trim()+": "+v);
    });return lines;
  }
  var KINDS={
    electricity:{title:"Review your token purchase",to:"support",subject:"Electricity token request",pay:true,note:"Online token payment is launching soon. Send this request to our team and we will contact you to complete your purchase."},
    bills:{title:"Review your bill payment",to:"support",subject:"Bill payment request",pay:true,note:"Online bill payment is launching soon. Send this request to our team and we will contact you to complete it."},
    fuel:{title:"Your fuel quote request is ready",to:"sales",subject:"Fuel quote request",note:"Your request has been recorded. Our team will review your volume and location before quoting; you can also send a copy by email."},
    cngbook:{title:"Your CNG assessment request is ready",to:"sales",subject:"CNG assessment enquiry",note:"Your interest has been recorded, not booked. The proposed centres are not open yet. We will contact you about availability and next steps; you can also send a copy by email."},
    ev:{title:"Your EV proposal request is ready",to:"sales",subject:"EV proposal request",note:"Your request has been recorded. Our EV offering is in development; we will assess your requirements and contact you about feasible next steps. You can also send a copy by email."},
    paas:{title:"Your Power as a Service request is ready",to:"sales",subject:"Power as a Service request",note:"Send it to our team and we will prepare a proposal for your site."},
    training:{title:"Your training registration is ready",to:"training",subject:"Training interest",note:"Send it to our team and we will contact you about the next programme."},
    community:{title:"Your community registration is ready",to:"sales",subject:"Community electricity vending",note:"Send it to our team and we will contact your representative."},
    eea:{title:"Your pilot registration is ready",to:"sales",subject:"EEA pilot registration",note:"Send it to complete your registration for the Lagos pilot."},
    contact:{title:"Your message is ready to send",to:"support",subject:"Website enquiry",note:"Send it by email and we will reply within one business day."},
    careers:{title:"Your application is ready to send",to:"careers",subject:"Job application",note:"Send it by email to complete your application."},
    register:{title:"Check your email to finish",nosend:true,note:"We sent a confirmation link to your email. Click it to activate your account, then log in to track your requests."},
    whatsapp:{title:"Your WhatsApp subscription is ready",to:"sales",subject:"Energy Desk WhatsApp subscription",note:"Send it to our team to confirm your subscription. Once the Energy Desk goes live, the daily brief arrives on WhatsApp automatically."},
    login:{title:"Accounts are not open yet",nosend:true,note:"Online accounts open when our platform goes live. You can still buy tokens, pay bills and request quotes without an account."}
  };
  function showResult(form,kind,lines,reference,error){
    var k=KINDS[kind];var box=document.createElement("div");box.className="result";box.setAttribute("role","status");box.tabIndex=-1;
    var body=lines.join("\n"),subj=k.subject+(lines[0]?" - "+lines[0].split(": ").slice(1).join(": "):"");
    var h='<h3></h3><p class="note"></p>'+(k.nosend?"":"<pre></pre>")+'<div class="row">';
    if(k.pay)h+='<button class="btn primary paybtn" type="button"'+(CONFIG.paymentsLive?"":" disabled")+'>Pay now</button>';
    if(!k.nosend)h+='<a class="btn navy mail" href="#">Send to our team</a><button class="btn ghost copy" type="button">Copy</button>';
    h+='<button class="btn ghost edit" type="button">'+(k.nosend?"Back":"Edit")+"</button></div>";
    box.innerHTML=h;box.querySelector("h3").textContent=error?"We couldn't send this request":k.title;box.querySelector(".note").textContent=error?error:k.note;
    if(reference){var rp=document.createElement("p");rp.className="note";rp.innerHTML='Your request reference: <strong></strong>';rp.querySelector("strong").textContent=reference;box.insertBefore(rp,box.querySelector(".note"));body="Reference: "+reference+"\n"+body;}
    if(!k.nosend){box.querySelector("pre").textContent=body;box.querySelector(".mail").href="mailto:"+CONFIG.email[k.to]+"?subject="+encodeURIComponent(subj)+"&body="+encodeURIComponent(body);
      var c=box.querySelector(".copy");c.addEventListener("click",function(){if(navigator.clipboard)navigator.clipboard.writeText(body).then(function(){c.textContent="Copied"},function(){c.textContent="Select the text to copy"});else c.textContent="Select the text to copy"})}
    if(k.pay&&CONFIG.paymentsLive)box.querySelector(".paybtn").addEventListener("click",function(){startPayment({kind:kind,lines:lines})});
    box.querySelector(".edit").addEventListener("click",function(){box.remove();form.hidden=false;var f=form.querySelector("input,select");if(f)f.focus()});
    form.hidden=true;form.parentNode.insertBefore(box,form.nextSibling);box.focus();
  }
  [].forEach.call(document.querySelectorAll("form.gf"),function(form){
    [].forEach.call(form.querySelectorAll("[required]"),function(el){el.addEventListener("blur",function(){if(el.value)check(el)})});
    form.addEventListener("submit",function(e){
      e.preventDefault();
      var bad=[].slice.call(form.querySelectorAll("[required]")).filter(function(el){return !el.closest("[hidden]")}).filter(function(el){return !check(el)});
      if(bad.length){bad[0].focus();return}
      var kind=form.dataset.kind,lines=collect(form);
      if(kind==="eea")lines.unshift("EEA pilot registration");
      var btn=form.querySelector("[type=submit]");if(btn){btn.disabled=true}
      api.submit(form,kind,lines).then(function(res){
        if(btn)btn.disabled=false;
        if(res&&res.done)return;
        showResult(form,kind,lines,res&&res.reference,res&&res.error);
      });
    });
  });
  return {show:show};
}
