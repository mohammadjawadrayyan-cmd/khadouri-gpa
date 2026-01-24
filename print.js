const LS_PAYLOAD = "ptuk_gpa_print";

function fmtEnglishDate(iso){
  const d = iso ? new Date(iso) : new Date();
  try{
    return new Intl.DateTimeFormat("en-US", {year:"numeric", month:"long", day:"2-digit"}).format(d);
  }catch(e){
    return d.toDateString();
  }
}

function rating(score){
  if (!Number.isFinite(score)) return {ar:"—", en:"—"};
  if (score >= 90) return {ar:"ممتاز", en:"Excellent"};
  if (score >= 80) return {ar:"جيد جدًا", en:"Very Good"};
  if (score >= 70) return {ar:"جيد", en:"Good"};
  if (score >= 60) return {ar:"مقبول", en:"Pass"};
  return {ar:"راسب", en:"Fail"};
}

function resultText(score){
  if (!Number.isFinite(score)) return {ar:"—", en:"—", cls:""};
  if (score >= 60) return {ar:"ناجح", en:"Pass", cls:"pass"};
  return {ar:"راسب", en:"Fail", cls:"fail"};
}

function el(id){ return document.getElementById(id); }

function render(payload){
  el("yearNow").textContent = String(new Date().getFullYear());

  if (!payload || !payload.courses || !payload.semester){
    el("emptyState").hidden = false;
    el("pDate").textContent = fmtEnglishDate();
    el("pTableBody").innerHTML = "";
    el("pSemAvg").textContent = "—";
    el("pSemMeta").textContent = "—";
    el("pCumAvg").textContent = "—";
    el("pCumMeta").textContent = "—";
    return;
  }

  el("emptyState").hidden = true;
  el("pDate").textContent = fmtEnglishDate(payload.generatedAt);

  const tbody = el("pTableBody");
  tbody.innerHTML = "";

  const courses = payload.courses || [];
  courses.forEach(c=>{
    const tr = document.createElement("tr");

    const name = document.createElement("td");
    name.textContent = c.name || "Course";

    const cr = document.createElement("td");
    cr.textContent = Number.isFinite(c.credits) ? String(c.credits) : "—";

    const gr = document.createElement("td");
    gr.textContent = Number.isFinite(c.grade) ? String(c.grade) : "—";

    const res = resultText(Number(c.grade));
    const rs = document.createElement("td");
    rs.innerHTML = `<span class="${res.cls}">${res.en} / ${res.ar}</span>`;

    const rep = document.createElement("td");
    rep.textContent = (c.repeated ? "Yes / نعم" : "No / لا");

    tr.append(name, cr, gr, rs, rep);
    tbody.appendChild(tr);
  });

  if (courses.length > 10){
    document.body.classList.add("compact");
  }else{
    document.body.classList.remove("compact");
  }

  const semAvg = Number(payload.semester.avg);
  const semCredits = payload.semester.credits;
  const semRate = rating(semAvg);

  el("pSemAvg").textContent = Number.isFinite(semAvg) ? semAvg.toFixed(2) : "—";
  el("pSemMeta").textContent =
    `Credits: ${semCredits ?? "—"} • Rating: ${semRate.en} — ${semRate.ar}`;

  if (payload.cumulative && Number.isFinite(Number(payload.cumulative.avg))){
    const cumAvg = Number(payload.cumulative.avg);
    const total = payload.cumulative.totalCredits;
    const cumRate = rating(cumAvg);

    el("pCumAvg").textContent = cumAvg.toFixed(2);

    const parts = [];
    parts.push(`Total credits: ${total ?? "—"}`);
    parts.push(`Rating: ${cumRate.en} — ${cumRate.ar}`);

    const d = payload.cumulative.delta;
    if (d !== null && d !== undefined && Number.isFinite(Number(d))){
      const dd = Number(d);
      parts.push(`Improvement: ${dd>=0?"+":""}${dd.toFixed(2)}`);
    }

    el("pCumMeta").textContent = parts.join(" • ");
  }else{
    el("pCumAvg").textContent = "—";
    el("pCumMeta").textContent = "—";
  }
}

function loadAndRender(){
  let payload = null;
  try{
    payload = JSON.parse(localStorage.getItem(LS_PAYLOAD) || "null");
  }catch(e){
    payload = null;
  }
  render(payload);
}

document.addEventListener("visibilitychange", ()=>{
  if (!document.hidden) loadAndRender();
});
document.getElementById("refreshBtn").addEventListener("click", loadAndRender);
loadAndRender();
