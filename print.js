const LS_PAYLOAD = "ptuk_gpa_payload";
const payloadRaw = localStorage.getItem(LS_PAYLOAD);

const yearNow = document.getElementById("yearNow");
yearNow.textContent = String(new Date().getFullYear());

function fmtDateEnglish(iso){
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleDateString("en-US", { year:"numeric", month:"long", day:"2-digit" });
}

function gradeLabel(score){
  if (!Number.isFinite(score)) return "—";
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 60) return "Pass";
  return "Fail";
}

function safe(n, digits=2){
  return Number.isFinite(n) ? n.toFixed(digits) : "—";
}

function renderEmpty(){
  document.getElementById("titleMain").textContent = "No data to print";
  document.getElementById("titleDesc").textContent = "Go back to the calculator and open print certificate again.";
}

if (!payloadRaw){
  renderEmpty();
} else {
  const data = JSON.parse(payloadRaw);

  // date in ENGLISH only
  document.getElementById("dateEn").textContent = fmtDateEnglish(data.generatedAt);

  // Fill course table
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";

  const courses = Array.isArray(data.courses) ? data.courses : [];
  courses.forEach(c=>{
    const tr = document.createElement("tr");

    const course = document.createElement("td");
    course.textContent = c.name || "Course";

    const credits = document.createElement("td");
    credits.textContent = String(c.credits ?? "—");

    const grade = document.createElement("td");
    grade.textContent = String(Number.isFinite(c.grade) ? c.grade : "—");

    const result = document.createElement("td");
    const pass = Number.isFinite(c.grade) && c.grade >= 60;
    result.textContent = pass ? "Pass / ناجح" : "Fail / راسب";
    result.className = pass ? "pass" : "fail";

    const rep = document.createElement("td");
    rep.textContent = (c.repeated ? "Yes / نعم" : "No / لا");

    tr.appendChild(course);
    tr.appendChild(credits);
    tr.appendChild(grade);
    tr.appendChild(result);
    tr.appendChild(rep);
    tbody.appendChild(tr);
  });

  // Semester summary
  const sem = data.semester || {};
  document.getElementById("semV").textContent = safe(sem.avg, 2);
  document.getElementById("semM").textContent =
    `Credits: ${sem.credits ?? "—"} • Rating: ${gradeLabel(sem.avg)}`;

  // Cumulative summary (if exists)
  const cum = data.cumulative;
  if (cum && Number.isFinite(cum.avg)){
    document.getElementById("cumV").textContent = safe(cum.avg, 2);

    const parts = [];
    parts.push(`Total credits: ${cum.totalHours ?? "—"}`);
    parts.push(`Rating: ${gradeLabel(cum.avg)}`);
    if (Number.isFinite(cum.delta)) parts.push(`Δ: ${cum.delta >= 0 ? "+" : ""}${cum.delta.toFixed(2)}`);
    document.getElementById("cumM").textContent = parts.join(" • ");
  } else {
    document.getElementById("cumV").textContent = "—";
    document.getElementById("cumM").textContent = "Compute cumulative first (optional).";
  }
}

// buttons
document.getElementById("btnBack").addEventListener("click", ()=> window.close());
document.getElementById("btnPrint").addEventListener("click", ()=> window.print());
