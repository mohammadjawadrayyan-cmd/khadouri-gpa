const qs = new URLSearchParams(location.search);
const key = qs.get("k");

document.getElementById("yearNow").textContent = String(new Date().getFullYear());

function fmtDateEnglish(iso){
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString("en-US", { year:"numeric", month:"long", day:"2-digit" });
}

function ratingEN(avg){
  if (!Number.isFinite(avg)) return "—";
  if (avg >= 90) return "Excellent";
  if (avg >= 80) return "Very Good";
  if (avg >= 70) return "Good";
  if (avg >= 60) return "Pass";
  return "Fail";
}
function ratingAR(avg){
  if (!Number.isFinite(avg)) return "—";
  if (avg >= 90) return "ممتاز";
  if (avg >= 80) return "جيد جداً";
  if (avg >= 70) return "جيد";
  if (avg >= 60) return "مقبول";
  return "راسب";
}

function safe(n, digits=2){ return Number.isFinite(n) ? n.toFixed(digits) : "—"; }

function loadPayload(){
  if (!key) return null;
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }catch{
    return null;
  }
}

function render(){
  const data = loadPayload();

  if (!data){
    document.getElementById("dateEn").textContent = fmtDateEnglish();
    document.getElementById("tbody").innerHTML =
      `<tr><td colspan="5" style="padding:12px;font-weight:900;">No data found. ارجع للموقع واحسب ثم افتح الطباعة من جديد.</td></tr>`;
    return;
  }

  document.documentElement.lang = data.lang || "ar";
  document.documentElement.dir = (data.lang === "en") ? "ltr" : "rtl";

  document.getElementById("dateEn").textContent = fmtDateEnglish(data.generatedAt);
  document.getElementById("uniEn").textContent = data.university?.en || "Palestine Technical University – Kadoorie";
  document.getElementById("uniAr").textContent = data.university?.ar || "جامعة فلسطين التقنية – خضوري";

  // جدول المواد
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  const courses = Array.isArray(data.courses) ? data.courses : [];

  courses.forEach(c=>{
    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.textContent = c.name || "Course";
    td1.style.direction = "auto";

    const td2 = document.createElement("td");
    td2.textContent = Number.isFinite(c.credits) ? String(c.credits) : "—";

    const td3 = document.createElement("td");
    td3.textContent = Number.isFinite(c.grade) ? String(c.grade) : "—";

    const td4 = document.createElement("td");
    const pass = Number.isFinite(c.grade) && c.grade >= 60;
    td4.textContent = pass ? "Pass / ناجح" : "Fail / راسب";
    td4.className = pass ? "pass" : "fail";

    const td5 = document.createElement("td");
    td5.textContent = c.repeated ? "Yes / نعم" : "No / لا";

    tr.append(td1, td2, td3, td4, td5);
    tbody.appendChild(tr);
  });

  // Semester
  const sem = data.semester || {};
  const semAvg = Number(sem.avg);
  const semCredits = Number(sem.credits);

  document.getElementById("semV").textContent = safe(semAvg, 2);
  document.getElementById("semM").textContent =
    `Credits: ${Number.isFinite(semCredits)?semCredits:"—"} • Rating: ${ratingEN(semAvg)} — الساعات: ${Number.isFinite(semCredits)?semCredits:"—"} • التقدير: ${ratingAR(semAvg)}`;

  // Cumulative
  const cum = data.cumulative;
  if (cum && Number.isFinite(Number(cum.avg))){
    const cumAvg = Number(cum.avg);
    const totalCredits = Number(cum.totalCredits);
    const imp = (cum.improvement === null || cum.improvement === undefined) ? null : Number(cum.improvement);

    document.getElementById("cumV").textContent = safe(cumAvg, 2);

    let impTxt = "";
    if (Number.isFinite(imp)){
      const vv = `${imp>=0?"+":""}${safe(imp,2)}`;
      impTxt = ` • Improvement: ${vv} — تحسن: ${vv}`;
    }

    document.getElementById("cumM").textContent =
      `Total credits: ${Number.isFinite(totalCredits)?totalCredits:"—"} • Rating: ${ratingEN(cumAvg)}${impTxt} — إجمالي الساعات: ${Number.isFinite(totalCredits)?totalCredits:"—"} • التقدير: ${ratingAR(cumAvg)}${impTxt}`;
  } else {
    document.getElementById("cumV").textContent = "—";
    document.getElementById("cumM").textContent = "Compute cumulative first / احسب التراكمي أولًا";
  }
}

document.addEventListener("DOMContentLoaded", render);
document.getElementById("btnPrint").addEventListener("click", ()=> window.print());
