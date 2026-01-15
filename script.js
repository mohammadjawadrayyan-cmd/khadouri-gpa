function clamp(n, min, max) {
  if (Number.isNaN(n)) return NaN;
  return Math.min(max, Math.max(min, n));
}

function toFixedSmart(x) {
  if (!Number.isFinite(x)) return "—";
  return `${x.toFixed(2)}%`;
}

function getArabicGradeLabel(avg) {
  if (!Number.isFinite(avg)) return "—";
  if (avg >= 90) return "ممتاز";
  if (avg >= 80) return "جيد جداً";
  if (avg >= 70) return "جيد";
  if (avg >= 60) return "مقبول";
  return "راسب";
}

function parseNum(v) {
  const n = parseFloat(String(v ?? "").trim());
  return Number.isFinite(n) ? n : NaN;
}

// ===== Semester (courses) =====
const coursesDiv = document.getElementById("courses");
const courseTpl = document.getElementById("courseRowTpl");

const addCourseBtn = document.getElementById("addCourseBtn");
const calcSemesterBtn = document.getElementById("calcSemesterBtn");

const semesterAvgEl = document.getElementById("semesterAvg");
const semesterHoursEl = document.getElementById("semesterHours");
const semesterGradeEl = document.getElementById("semesterGrade");

// ===== Cumulative =====
const prevAvg = document.getElementById("prevAvg");
const prevHours = document.getElementById("prevHours");
const currAvg = document.getElementById("currAvg");
const currHours = document.getElementById("currHours");
const useSemesterBtn = document.getElementById("useSemesterBtn");
const calcCumulativeBtn = document.getElementById("calcCumulativeBtn");
const cumulativeAvgEl = document.getElementById("cumulativeAvg");
const cumulativeMetaEl = document.getElementById("cumulativeMeta");

// ===== Repeats =====
const repeatsDiv = document.getElementById("repeats");
const repeatTpl = document.getElementById("repeatRowTpl");
const addRepeatBtn = document.getElementById("addRepeatBtn");
const repeatPolicy = document.getElementById("repeatPolicy");

function addCourseRow(initial = {}) {
  const node = courseTpl.content.cloneNode(true);
  const row = node.querySelector(".row");
  const name = node.querySelector(".row__name");
  const grade = node.querySelector(".row__grade");
  const credits = node.querySelector(".row__credits");
  const del = node.querySelector(".iconbtn");

  name.value = initial.name ?? "";
  grade.value = initial.grade ?? "";
  credits.value = initial.credits ?? "";

  del.addEventListener("click", () => {
    row.remove();
    computeSemester(false);
  });

  [grade, credits].forEach((el) => el.addEventListener("input", () => computeSemester(false)));

  coursesDiv.appendChild(node);
}

function addRepeatRow(initial = {}) {
  const node = repeatTpl.content.cloneNode(true);
  const row = node.querySelector(".row");
  const name = node.querySelector(".row__name");
  const oldgrade = node.querySelector(".row__oldgrade");
  const credits = node.querySelector(".row__credits");
  const del = node.querySelector(".iconbtn");

  name.value = initial.name ?? "";
  oldgrade.value = initial.oldgrade ?? "";
  credits.value = initial.credits ?? "";

  del.addEventListener("click", () => {
    row.remove();
  });

  repeatsDiv.appendChild(node);
}

function getCourseRows() {
  const rows = coursesDiv.querySelectorAll(".row");
  const result = [];
  rows.forEach((row) => {
    const name = row.querySelector(".row__name").value.trim();
    const grade = parseNum(row.querySelector(".row__grade").value);
    const credits = parseNum(row.querySelector(".row__credits").value);
    result.push({ name, grade, credits, row });
  });
  return result;
}

function getRepeatRows() {
  const rows = repeatsDiv.querySelectorAll(".row");
  const result = [];
  rows.forEach((row) => {
    const name = row.querySelector(".row__name").value.trim();
    const oldgrade = parseNum(row.querySelector(".row__oldgrade").value);
    const credits = parseNum(row.querySelector(".row__credits").value);
    result.push({ name, oldgrade, credits, row });
  });
  return result;
}

function computeSemester(showAlerts = true) {
  const courses = getCourseRows();
  let totalQP = 0;
  let totalHrs = 0;

  let hasAny = false;
  let bad = false;

  courses.forEach((c) => {
    const g = clamp(c.grade, 0, 100);
    const cr = c.credits;

    const gradeEl = c.row.querySelector(".row__grade");
    const credEl = c.row.querySelector(".row__credits");
    gradeEl.style.borderColor = "rgba(255,255,255,.14)";
    credEl.style.borderColor = "rgba(255,255,255,.14)";

    if (Number.isFinite(g) || Number.isFinite(cr)) hasAny = true;

    if (!Number.isFinite(g) || !Number.isFinite(cr) || cr <= 0) {
      if (Number.isFinite(c.grade) || Number.isFinite(cr)) {
        bad = true;
        if (!Number.isFinite(g)) gradeEl.style.borderColor = "rgba(255,107,107,.55)";
        if (!Number.isFinite(cr) || cr <= 0) credEl.style.borderColor = "rgba(255,107,107,.55)";
      }
      return;
    }

    totalQP += g * cr;
    totalHrs += cr;
  });

  if (!hasAny) {
    semesterAvgEl.textContent = "—";
    semesterHoursEl.textContent = "—";
    semesterGradeEl.textContent = "—";
    return { avg: NaN, hours: NaN, qp: NaN, bad: false };
  }

  if (bad || totalHrs <= 0) {
    semesterAvgEl.textContent = "—";
    semesterHoursEl.textContent = "—";
    semesterGradeEl.textContent = "—";
    if (showAlerts) alert("تأكد من إدخال علامة (0–100) وساعات أكبر من صفر لكل مادة.");
    return { avg: NaN, hours: NaN, qp: NaN, bad: true };
  }

  const avg = totalQP / totalHrs;
  semesterAvgEl.textContent = toFixedSmart(avg);
  semesterHoursEl.textContent = `${totalHrs}`;
  semesterGradeEl.textContent = getArabicGradeLabel(avg);

  return { avg, hours: totalHrs, qp: totalQP, bad: false };
}

function useSemesterResult() {
  const s = computeSemester(false);
  if (!Number.isFinite(s.avg) || !Number.isFinite(s.hours)) {
    alert("احسب المعدل الفصلي أولاً (أو أدخل مواد الفصل بشكل صحيح) ثم اضغط: استخدم نتيجة الفصل الحالي.");
    return;
  }
  currAvg.value = s.avg.toFixed(2);
  currHours.value = s.hours;
}

function computeCumulative() {
  const pAvg = clamp(parseNum(prevAvg.value), 0, 100);
  const pHrs = parseNum(prevHours.value);

  // if current fields empty, try use semester result softly
  let cAvg = clamp(parseNum(currAvg.value), 0, 100);
  let cHrs = parseNum(currHours.value);

  if ((!Number.isFinite(cAvg) || !Number.isFinite(cHrs)) && Number.isFinite(pAvg) && Number.isFinite(pHrs)) {
    const s = computeSemester(false);
    if (Number.isFinite(s.avg) && Number.isFinite(s.hours)) {
      cAvg = s.avg;
      cHrs = s.hours;
      currAvg.value = s.avg.toFixed(2);
      currHours.value = s.hours;
    }
  }

  const fields = [
    { el: prevAvg, ok: Number.isFinite(pAvg) },
    { el: prevHours, ok: Number.isFinite(pHrs) && pHrs >= 0 },
    { el: currAvg, ok: Number.isFinite(cAvg) },
    { el: currHours, ok: Number.isFinite(cHrs) && cHrs >= 0 }
  ];
  fields.forEach(f => f.el.style.borderColor = f.ok ? "rgba(255,255,255,.14)" : "rgba(255,107,107,.55)");

  if (!fields.every(f => f.ok)) {
    cumulativeAvgEl.textContent = "—";
    cumulativeMetaEl.textContent = "";
    alert("تأكد من إدخال القيم المطلوبة بشكل صحيح (المعدل 0–100، والساعات رقم غير سالب).");
    return;
  }

  // Repeats handling
  const repeats = getRepeatRows();
  let subQP = 0;
  let subHrs = 0;

  // reset repeat field borders
  repeats.forEach(r => {
    const gEl = r.row.querySelector(".row__oldgrade");
    const cEl = r.row.querySelector(".row__credits");
    gEl.style.borderColor = "rgba(255,255,255,.14)";
    cEl.style.borderColor = "rgba(255,255,255,.14)";
  });

  if (repeats.length > 0 && repeatPolicy.value === "replace") {
    let badRepeat = false;

    repeats.forEach(r => {
      const g = clamp(r.oldgrade, 0, 100);
      const cr = r.credits;

      if (!Number.isFinite(g) || !Number.isFinite(cr) || cr <= 0) {
        badRepeat = true;
        const gEl = r.row.querySelector(".row__oldgrade");
        const cEl = r.row.querySelector(".row__credits");
        if (!Number.isFinite(g)) gEl.style.borderColor = "rgba(255,107,107,.55)";
        if (!Number.isFinite(cr) || cr <= 0) cEl.style.borderColor = "rgba(255,107,107,.55)";
        return;
      }

      subQP += g * cr;
      subHrs += cr;
    });

    if (badRepeat) {
      cumulativeAvgEl.textContent = "—";
      cumulativeMetaEl.textContent = "";
      alert("في قسم المواد المعادة: تأكد من إدخال العلامة القديمة (0–100) والساعات بشكل صحيح.");
      return;
    }

    if (subHrs > pHrs) {
      cumulativeAvgEl.textContent = "—";
      cumulativeMetaEl.textContent = "";
      alert("مجموع ساعات المواد المعادة أكبر من الساعات السابقة! راجع إدخالاتك.");
      return;
    }
  }

  const prevQP = pAvg * pHrs;
  const currQP = cAvg * cHrs;

  const totalQP = prevQP + currQP - subQP;
  const totalHrs = pHrs + cHrs - subHrs;

  if (totalHrs <= 0) {
    cumulativeAvgEl.textContent = "—";
    cumulativeMetaEl.textContent = "";
    alert("مجموع الساعات لازم يكون أكبر من صفر.");
    return;
  }

  const newAvg = totalQP / totalHrs;

  cumulativeAvgEl.textContent = toFixedSmart(newAvg);

  const repeatText = (repeats.length > 0)
    ? (repeatPolicy.value === "replace"
      ? `تم طرح أثر ${subHrs} ساعة (مواد معادة) من الرصيد السابق ثم إضافة هذا الفصل.`
      : `تم احتساب المحاولتين معًا (بدون طرح العلامات القديمة).`)
    : "بدون مواد معادة.";

  cumulativeMetaEl.textContent =
    `الدمج: ${pHrs} ساعة سابقة + ${cHrs} ساعة لهذا الفصل. ${repeatText} (التقدير للمعلومة: ${getArabicGradeLabel(newAvg)})`;
}

// Wire events
addCourseBtn.addEventListener("click", () => addCourseRow());
calcSemesterBtn.addEventListener("click", () => computeSemester(true));
useSemesterBtn.addEventListener("click", useSemesterResult);
calcCumulativeBtn.addEventListener("click", computeCumulative);
addRepeatBtn.addEventListener("click", () => addRepeatRow());

// Starter rows
addCourseRow();
addCourseRow();
