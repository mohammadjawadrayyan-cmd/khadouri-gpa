/* Khadouri GPA Calculator (100) - Mohammad Jawad */

const $ = (sel) => document.querySelector(sel);

const coursesEl = $("#courses");
const tpl = $("#courseRowTpl");
const alertBox = $("#alertBox");

const semesterAvgEl = $("#semesterAvg");
const semesterHoursEl = $("#semesterHours");
const semesterGradeEl = $("#semesterGrade");

const prevAvgEl = $("#prevAvg");
const prevHoursEl = $("#prevHours");

const cumulativeAvgEl = $("#cumulativeAvg");
const cumulativeMetaEl = $("#cumulativeMeta");

const addCourseBtn = $("#addCourseBtn");
const calcSemesterBtn = $("#calcSemesterBtn");
const useSemesterBtn = $("#useSemesterBtn");
const calcCumulativeBtn = $("#calcCumulativeBtn");
const openPrintBtn = $("#openPrintBtn");

function showAlert(msg){
  alertBox.hidden = false;
  alertBox.textContent = msg;
}
function hideAlert(){
  alertBox.hidden = true;
  alertBox.textContent = "";
}

function toNum(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}
function round2(n){
  return Math.round(n * 100) / 100;
}
function gradeLabel(avg){
  if (!Number.isFinite(avg)) return "—";
  if (avg >= 90) return "ممتاز (Excellent)";
  if (avg >= 80) return "جيد جدًا (Very Good)";
  if (avg >= 70) return "جيد (Good)";
  if (avg >= 60) return "مقبول (Pass)";
  return "راسب (Fail)";
}

function addCourseRow(prefill = {}){
  const node = tpl.content.firstElementChild.cloneNode(true);

  const nameEl = node.querySelector(".input--name");
  const gradeEl = node.querySelector(".grade");
  const creditsEl = node.querySelector(".credits");
  const repeatEl = node.querySelector(".repeat");
  const oldGradeEl = node.querySelector(".oldgrade");
  const delBtn = node.querySelector(".iconbtn");

  if (prefill.name) nameEl.value = prefill.name;
  if (prefill.grade != null) gradeEl.value = prefill.grade;
  if (prefill.credits != null) creditsEl.value = prefill.credits;
  if (prefill.repeat) repeatEl.checked = true;
  if (prefill.oldgrade != null) oldGradeEl.value = prefill.oldgrade;

  oldGradeEl.disabled = !repeatEl.checked;

  repeatEl.addEventListener("change", () => {
    oldGradeEl.disabled = !repeatEl.checked;
    if (!repeatEl.checked) oldGradeEl.value = "";
  });

  delBtn.addEventListener("click", () => {
    node.remove();
  });

  coursesEl.appendChild(node);
}

function readCourses(){
  const rows = [...coursesEl.querySelectorAll(".trow")];
  return rows.map(r => {
    const name = r.querySelector(".input--name").value.trim();
    const grade = toNum(r.querySelector(".grade").value);
    const credits = toNum(r.querySelector(".credits").value);
    const repeat = r.querySelector(".repeat").checked;
    const oldgrade = toNum(r.querySelector(".oldgrade").value);
    return { name, grade, credits, repeat, oldgrade };
  });
}

function calcSemester(courses){
  let points = 0;
  let hours = 0;

  for (const c of courses){
    if (!Number.isFinite(c.grade) || !Number.isFinite(c.credits)) continue;
    if (c.credits <= 0) continue;
    if (c.grade < 0 || c.grade > 100) continue;

    points += c.grade * c.credits;
    hours += c.credits;
  }

  if (hours <= 0) return { ok:false, msg:"أدخل على الأقل مادة واحدة (علامة + ساعات) عشان نحسب المعدل." };

  const avg = points / hours;
  return { ok:true, avg, hours, points };
}

function buildCertificateData(){
  const courses = readCourses();

  const sem = calcSemester(courses);
  const prevAvg = toNum(prevAvgEl.value);
  const prevHours = toNum(prevHoursEl.value);

  const now = new Date();
  const dateStr = now.toLocaleDateString("ar-PS", { year:"numeric", month:"2-digit", day:"2-digit" });

  let cumulative = null;

  if (Number.isFinite(prevAvg) && Number.isFinite(prevHours) && prevHours >= 0){
    cumulative = calcCumulativeFromCourses(courses, prevAvg, prevHours);
  }

  return {
    site: "PTUK - Khadouri GPA",
    date: dateStr,
    url: "https://mohammadjawadrayyan-cmd.github.io/khadouri-gpa/",
    prev: {
      avg: Number.isFinite(prevAvg) ? prevAvg : null,
      hours: Number.isFinite(prevHours) ? prevHours : null
    },
    semester: sem.ok ? {
      avg: round2(sem.avg),
      hours: round2(sem.hours),
      label: gradeLabel(sem.avg)
    } : null,
    cumulative,
    courses: courses
      .filter(c => Number.isFinite(c.grade) && Number.isFinite(c.credits) && c.credits > 0)
      .map(c => ({
        name: c.name || "مادة",
        grade: round2(c.grade),
        credits: round2(c.credits),
        repeat: !!c.repeat,
        oldgrade: Number.isFinite(c.oldgrade) ? round2(c.oldgrade) : null,
        status: (c.grade >= 60 ? "ناجح" : "راسب")
      }))
  };
}

function calcCumulativeFromCourses(courses, prevAvg, prevHours){
  // طريقة الاستبدال فقط:
  // prevPoints = prevAvg * prevHours
  // غير المعاد: نضيف grade*credits و نضيف credits للساعات
  // المعاد: نضيف (grade - oldgrade)*credits و لا نضيف ساعات (لأنه محسوب سابقاً)
  let prevPoints = prevAvg * prevHours;
  let totalHours = prevHours;

  for (const c of courses){
    if (!Number.isFinite(c.grade) || !Number.isFinite(c.credits) || c.credits <= 0) continue;
    if (c.grade < 0 || c.grade > 100) continue;

    if (c.repeat){
      if (!Number.isFinite(c.oldgrade)){
        return {
          ok:false,
          msg:`في مادة معلّمها "مُعادة؟" لكن بدون "العلامة السابقة". اكتب العلامة السابقة عشان نحسب التراكمي صح.`
        };
      }
      if (c.oldgrade < 0 || c.oldgrade > 100){
        return { ok:false, msg:`العلامة السابقة لازم تكون بين 0 و 100.` };
      }
      prevPoints += (c.grade - c.oldgrade) * c.credits;
      // totalHours لا تتغير
    } else {
      prevPoints += c.grade * c.credits;
      totalHours += c.credits;
    }
  }

  if (totalHours <= 0){
    return { ok:false, msg:"الساعات الإجمالية طلعت 0. تأكد من إدخالاتك." };
  }

  const newAvg = prevPoints / totalHours;
  return {
    ok:true,
    avg: round2(newAvg),
    hours: round2(totalHours),
    label: gradeLabel(newAvg),
    improved: (newAvg > prevAvg + 0.005),
    delta: round2(newAvg - prevAvg)
  };
}

/* Events */
addCourseBtn.addEventListener("click", () => {
  addCourseRow();
});

calcSemesterBtn.addEventListener("click", () => {
  hideAlert();
  const courses = readCourses();
  const sem = calcSemester(courses);

  if (!sem.ok){
    showAlert(sem.msg);
    semesterAvgEl.textContent = "—";
    semesterHoursEl.textContent = "—";
    semesterGradeEl.textContent = "—";
    return;
  }

  semesterAvgEl.textContent = round2(sem.avg).toFixed(2);
  semesterHoursEl.textContent = round2(sem.hours).toFixed(1).replace(".0","");
  semesterGradeEl.textContent = gradeLabel(sem.avg);

  // نخزن آخر نتائج للفصل
  const data = buildCertificateData();
  localStorage.setItem("khadouri_gpa_data", JSON.stringify(data));
});

useSemesterBtn.addEventListener("click", () => {
  hideAlert();
  const courses = readCourses();
  const sem = calcSemester(courses);
  if (!sem.ok){
    showAlert("احسب المعدل الفصلي أولاً (أو أدخل مواد الفصل) ثم اضغط استخدام نتيجة الفصل.");
    return;
  }
  // ما في خانات currAvg/currHours بهذا الإصدار—بس نخزن ونجهّز للطباعة
  semesterAvgEl.textContent = round2(sem.avg).toFixed(2);
  semesterHoursEl.textContent = round2(sem.hours).toFixed(1).replace(".0","");
  semesterGradeEl.textContent = gradeLabel(sem.avg);

  const data = buildCertificateData();
  localStorage.setItem("khadouri_gpa_data", JSON.stringify(data));
});

calcCumulativeBtn.addEventListener("click", () => {
  hideAlert();

  const prevAvg = toNum(prevAvgEl.value);
  const prevHours = toNum(prevHoursEl.value);

  if (!Number.isFinite(prevAvg) || !Number.isFinite(prevHours)){
    showAlert("اكتب المعدل التراكمي السابق + عدد الساعات السابقة (أرقام فقط).");
    return;
  }
  if (prevAvg < 0 || prevAvg > 100){
    showAlert("المعدل السابق لازم يكون بين 0 و 100.");
    return;
  }
  if (prevHours < 0){
    showAlert("الساعات السابقة لازم تكون 0 أو أكثر.");
    return;
  }

  const courses = readCourses();
  const sem = calcSemester(courses);
  if (!sem.ok){
    showAlert("لازم تدخل مواد هذا الفصل (علامة + ساعات) عشان نحسب التراكمي.");
    return;
  }

  const cum = calcCumulativeFromCourses(courses, prevAvg, prevHours);
  if (!cum.ok){
    showAlert(cum.msg);
    cumulativeAvgEl.textContent = "—";
    cumulativeMetaEl.textContent = "—";
    return;
  }

  cumulativeAvgEl.textContent = cum.avg.toFixed(2);
  const msg = cum.improved
    ? `مبروك! لقد تحسن معدلك التراكمي (+${cum.delta.toFixed(2)}).`
    : `التقدير: ${cum.label} — (فرق: ${cum.delta.toFixed(2)})`;

  cumulativeMetaEl.textContent = `إجمالي الساعات بعد الحساب: ${cum.hours} — ${msg}`;

  // خزّن للطباعة
  const data = buildCertificateData();
  data.cumulative = cum;
  localStorage.setItem("khadouri_gpa_data", JSON.stringify(data));
});

openPrintBtn.addEventListener("click", () => {
  const raw = localStorage.getItem("khadouri_gpa_data");
  if (!raw){
    showAlert("احسب الفصل/التراكمي أولاً ثم افتح صفحة الطباعة.");
    return;
  }
  window.open("print.html", "_blank", "noopener");
});

/* init */
(function init(){
  // صفوف افتراضية أنيقة
  for (let i=0; i<4; i++) addCourseRow();
})();
