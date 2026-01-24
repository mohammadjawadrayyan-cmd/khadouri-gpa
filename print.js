const yearNow = document.getElementById("yearNow");
yearNow.textContent = String(new Date().getFullYear());

function fmtDateEnglish(iso){
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString("en-US", { year:"numeric", month:"long", day:"2-digit" });
}

function ratingOf(avg){
  if (!Number.isFinite(avg)) return { ar:"—", en:"—" };
  if (avg >= 90) return { ar:"ممتاز", en:"Excellent" };
  if (avg >= 80) return { ar:"جيد جداً", en:"Very Good" };
  if (avg >= 70) return { ar:"جيد", en:"Good" };
  if (avg >= 60) return { ar:"مقبول", en:"Pass" };
  return { ar:"راسب", en:"Fail" };
}

function safe(n, digits=2){
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

function getPayload(){
  const qs = new URLSearchParams(location.search);
  const key = qs.get("k"); // ✅ أهم شيء
  if (!key) return null;

  try{
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  }catch{
    return null;
  }
}

function render(){
  const data = getPayload();
  if (!data){
    // إذا فتح صفحة الطباعة بدون بيانات
    document.getElementById("dateEn").textContent = fmtDateEnglish();
    document.getElementById("tbody").innerHTML =
      `<tr><td colspan="5" style="padding:12px;font-weight:900;">No data found. ارجع واحسب ثم افتح الطباعة من الموقع.</td></tr>`;
    return;
  }

  document.getElementById("dateEn").textContent = fmtDateEnglish(data.generatedAt);
  document.getElementById("uniEn").textContent = data?.university?.en || "Palestine Technical University – Kadoorie";
  document.getElementById("uniAr").textContent = data?.university?.ar || "جامعة فلسطين التقنية – خضوري";

  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  const courses = Array.isArray(data.courses) ? data.courses : [];
  courses.forEach(c=>{
    const tr = document.createElement("tr");

    const tdCourse = document.createElement("td");
    tdCourse.textContent = c.name || "Course";
    tdCourse.style.direction = "auto";

    const tdCr = document.createElement("td");
    tdCr.textContent = Number.isFinite(c.credits) ? String(c.credits) : "—";

    const tdG = document.createElement("td");
    tdG.textContent = Number.isFinite(c.grade) ? String(c.grade) : "—";

    const tdR = document.createElement("td");
    const pass = Number.isFinite(c.grade) && c.grade >= 60;
    tdR.textContent = pass ? "Pass / ناجح" : "Fail / راسب";
    tdR.className = pass ? "pass" : "fail";

    const tdRep = document.createElement("td");
    tdRep.textContent = c.repeated ? "Yes / نعم" : "No / لا";

    tr.append(tdCourse, tdCr, tdG, tdR, tdRep);
    tbody.appendChild(tr);
  });

  // Semester
  const sem = data.semester || {};
  const semAvg = Number(sem.avg);
  const semCredits = Number(sem.credits);
  const semRate = ratingOf(semAvg);

  document.getElementById("semV").textContent = safe(semAvg, 2);
  document.getElementById("semM").textContent =
    `Credits: ${Number.isFinite(semCredits)?semCredits:"—"} • Rating: ${semRate.en} — الساعات: ${Number.isFinite(semCredits)?semCredits:"—"} • التقدير: ${semRate.ar}`;

  // Cumulative
  const cum = data.cumulative;
  if (cum && Number.isFinite(Number(cum.avg))){
    const cumAvg = Number(cum.avg);
    const totalCredits = Number(cum.totalCredits);
    const imp = (cum.improvement === null || cum.improvement === undefined) ? null : Number(cum.improvement);
    const cumRate = ratingOf(cumAvg);

    document.getElementById("cumV").textContent = safe(cumAvg, 2);

    let impTxt = "";
    if (Number.isFinite(imp)){
      // ✅ بدل Δ
      impTxt = ` • Improvement: ${imp>=0?"+":""}${safe(imp,2)} — تحسّن: ${imp>=0?"+":""}${safe(imp,2)}`;
    }

    document.getElementById("cumM").textContent =
      `Total credits: ${Number.isFinite(totalCredits)?totalCredits:"—"} • Rating: ${cumRate.en}${impTxt} — إجمالي الساعات: ${Number.isFinite(totalCredits)?totalCredits:"—"} • التقدير: ${cumRate.ar}${impTxt}`;
  } else {
    document.getElementById("cumV").textContent = "—";
    document.getElementById("cumM").textContent = "Compute cumulative first / احسب التراكمي أولًا";
  }
}

document.addEventListener("DOMContentLoaded", render);
document.getElementById("btnPrint").addEventListener("click", ()=> window.print());
