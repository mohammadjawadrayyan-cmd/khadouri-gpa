const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

const LS_LANG = "ptuk_lang";
const LS_PAYLOAD = "ptuk_gpa_print"; // ✅ مفتاح واحد ثابت للطباعة

const I18N = {
  ar: {
    print_cert: "شهادة الطباعة",
    opens_new_tab: "يفتح صفحة جديدة",
    system_100: "النظام: 100",
    site_title: "حساب المعدل التراكمي خضوري",
    uni_name_ar: "جامعة فلسطين التقنية – خضوري",
    subtitle: "حاسبة المعدل الفصلي والتراكمي (نظام 100)",
    hero_title: "حاسبة سريعة ودقيقة",
    hero_desc: "أدخل العلامات والساعات، واحصل على المعدل الفصلي والتراكمي فورًا. (الطباعة تظهر كشهادة مرتبة)",
    note_tip: "ملاحظة",
    note_tip_text: "خيار الإعادة = استبدال القديمة بالجديدة (إذا كانت القديمة محسوبة ضمن السابق).",

    semester_title: "حساب المعدل الفصلي",
    semester_desc: "أدخل علامة كل مادة (0–100) وعدد ساعاتها. إذا المادة معادة، فعّل “معادة؟” وسيظهر حقل العلامة السابقة.",
    course_name: "اسم المادة",
    grade_pct: "العلامة %",
    credits: "الساعات",
    repeated_q: "معادة؟",
    old_grade: "العلامة السابقة",
    add_course: "إضافة مادة",
    calc_semester: "احسب المعدل الفصلي",
    semester_avg: "المعدل الفصلي",
    semester_hours: "مجموع ساعات الفصل",
    grade_label: "التقدير",
    semester_note: "لن تُحسب الصفوف الفارغة. لازم (علامة + ساعات) لكل مادة.",

    cum_title: "حساب المعدل التراكمي",
    cum_desc: "أدخل المعدل والساعات السابقة. ثم ادمج مع نتائج هذا الفصل. (الإعادة تستبدل العلامة القديمة).",
    prev_avg: "المعدل التراكمي السابق (%)",
    prev_hours: "عدد الساعات السابقة",
    curr_avg: "معدل الفصل الحالي (%)",
    curr_hours: "ساعات الفصل الحالي",
    best_use_sem: "أفضل خيار: اضغط “استخدم نتيجة الفصل الحالي”.",
    use_sem: "استخدم نتيجة الفصل الحالي",
    calc_cum: "احسب المعدل التراكمي",
    new_cum: "المعدل التراكمي الجديد",
    open_print: "فتح شهادة الطباعة (صفحة جديدة)",
    copyright: "All rights reserved.",
    yes: "نعم",

    err_no_courses: "أضف مواد (علامة + ساعات) أولًا.",
    err_bad_grade: "تأكد أن العلامات بين 0 و 100، والساعات ليست صفر.",
    ok_sem_done: "تم حساب المعدل الفصلي بنجاح.",
    ok_cum_done: "تم حساب المعدل التراكمي بنجاح.",

    grade_excellent: "ممتاز",
    grade_verygood: "جيد جداً",
    grade_good: "جيد",
    grade_acceptable: "مقبول",
    grade_fail: "راسب",

    congrats: "مبروك! 🎉 لقد تحسن معدلك التراكمي — استمر!"
  },
  en: {
    print_cert: "Print Certificate",
    opens_new_tab: "opens new tab",
    system_100: "System: 100",
    site_title: "PTUK GPA Calculator (100)",
    uni_name_ar: "Palestine Technical University – Kadoorie",
    subtitle: "Semester & Cumulative (100-point)",
    hero_title: "Fast & Accurate",
    hero_desc: "Enter grades & credits to get semester and cumulative results instantly. (Print as a certificate)",
    note_tip: "Note",
    note_tip_text: "Repeat policy: replaces old grade with the new one (if old is counted in previous GPA).",

    semester_title: "Semester GPA",
    semester_desc: "Enter each course grade (0–100) and credits. If repeated, enable “Repeated?” then old grade field appears.",
    course_name: "Course",
    grade_pct: "Grade %",
    credits: "Credits",
    repeated_q: "Repeated?",
    old_grade: "Old Grade",
    add_course: "Add course",
    calc_semester: "Calculate semester",
    semester_avg: "Semester GPA",
    semester_hours: "Semester Credits",
    grade_label: "Rating",
    semester_note: "Empty rows are ignored. Each course needs (grade + credits).",

    cum_title: "Cumulative GPA",
    cum_desc: "Enter previous GPA and credits, then merge with current semester. (Repeats replace old grade).",
    prev_avg: "Previous cumulative GPA (%)",
    prev_hours: "Previous credits",
    curr_avg: "Current semester GPA (%)",
    curr_hours: "Current semester credits",
    best_use_sem: "Best: click “Use semester result”.",
    use_sem: "Use semester result",
    calc_cum: "Calculate cumulative",
    new_cum: "New cumulative GPA",
    open_print: "Open print certificate (new tab)",
    copyright: "All rights reserved.",
    yes: "Yes",

    err_no_courses: "Add courses (grade + credits) first.",
    err_bad_grade: "Make sure grades are 0–100 and credits are not zero.",
    ok_sem_done: "Semester GPA calculated successfully.",
    ok_cum_done: "Cumulative GPA calculated successfully.",

    grade_excellent: "Excellent",
    grade_verygood: "Very Good",
    grade_good: "Good",
    grade_acceptable: "Pass",
    grade_fail: "Fail",

    congrats: "Congrats! 🎉 Your cumulative GPA improved — keep going!"
  }
};

let lang = localStorage.getItem(LS_LANG) || "ar";

const coursesEl = $("#courses");
const tpl = $("#courseRowTpl");

const semesterAvgEl = $("#semesterAvg");
const semesterHoursEl = $("#semesterHours");
const semesterGradeEl = $("#semesterGrade");
const semesterAlertEl = $("#semesterAlert");

const prevAvgEl = $("#prevAvg");
const prevHoursEl = $("#prevHours");
const currAvgEl = $("#currAvg");
const currHoursEl = $("#currHours");

const cumAvgEl = $("#cumulativeAvg");
const cumMetaEl = $("#cumulativeMeta");
const congratsEl = $("#cumCongrats");

$("#yearNow").textContent = String(new Date().getFullYear());

function t(key){
  return (I18N[lang] && I18N[lang][key]) || key;
}

function setLang(newLang){
  lang = newLang;
  localStorage.setItem(LS_LANG, lang);

  const html = document.documentElement;
  html.lang = lang;
  html.dir = (lang === "ar") ? "rtl" : "ltr";
  document.body.style.fontFamily = (lang === "ar")
    ? `"Cairo", system-ui, -apple-system, Segoe UI, Arial, sans-serif`
    : `"Inter", system-ui, -apple-system, Segoe UI, Arial, sans-serif`;

  $("#langLabel").textContent = (lang === "ar") ? "AR" : "EN";

  $$("[data-i18n]").forEach(el=>{
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  refreshPlaceholders();

  if (lastSemester) renderSemester(lastSemester);
  if (lastCumulative) renderCumulative(lastCumulative);
}

function gradeLabel(score){
  if (!Number.isFinite(score)) return "—";
  if (score >= 90) return `${t("grade_excellent")} (${lang === "ar" ? "Excellent" : "Excellent"})`;
  if (score >= 80) return `${t("grade_verygood")} (${lang === "ar" ? "Very Good" : "Very Good"})`;
  if (score >= 70) return `${t("grade_good")} (${lang === "ar" ? "Good" : "Good"})`;
  if (score >= 60) return `${t("grade_acceptable")} (${lang === "ar" ? "Pass" : "Pass"})`;
  return `${t("grade_fail")} (${lang === "ar" ? "Fail" : "Fail"})`;
}

function showAlert(msg){
  semesterAlertEl.hidden = false;
  semesterAlertEl.textContent = msg;
}
function hideAlert(){
  semesterAlertEl.hidden = true;
  semesterAlertEl.textContent = "";
}
function clearInvalid(){
  $$(".is-invalid").forEach(el=>el.classList.remove("is-invalid"));
}

function addCourseRow(prefill = {}){
  const node = tpl.content.cloneNode(true);
  const row = node.querySelector(".row");

  const name = row.querySelector(".row__name");
  const grade = row.querySelector(".row__grade");
  const credits = row.querySelector(".row__credits");
  const repeat = row.querySelector(".row__repeat");
  const old = row.querySelector(".row__oldgrade");
  const del = row.querySelector(".iconbtn");

  name.value = prefill.name || "";
  grade.value = (prefill.grade ?? "") === "" ? "" : String(prefill.grade);
  credits.value = prefill.credits || "";
  repeat.checked = !!prefill.repeated;
  old.value = (prefill.oldGrade ?? "") === "" ? "" : String(prefill.oldGrade);

  function syncOldVisibility(){
    if (repeat.checked){
      old.hidden = false;
    } else {
      old.hidden = true;
      old.value = "";
    }
  }
  repeat.addEventListener("change", syncOldVisibility);
  syncOldVisibility();

  del.addEventListener("click", ()=>{
    row.remove();
    refreshPlaceholders();
  });

  coursesEl.appendChild(node);
  refreshPlaceholders();
}

function refreshPlaceholders(){
  const rows = $$(".row", coursesEl);
  rows.forEach((row, idx)=>{
    const name = row.querySelector(".row__name");
    const grade = row.querySelector(".row__grade");

    if (lang === "ar"){
      name.placeholder = (idx === 0) ? "مثال: رياضيات متقطعة" : "اسم المادة";
      grade.placeholder = (idx === 0) ? "مثال: 95" : "";
    } else {
      name.placeholder = (idx === 0) ? "e.g., Discrete Math" : "Course name";
      grade.placeholder = (idx === 0) ? "e.g., 95" : "";
    }
  });
}

function getCourses(){
  const rows = $$(".row", coursesEl);
  const out = [];

  rows.forEach(row=>{
    const name = row.querySelector(".row__name").value.trim();
    const gradeStr = row.querySelector(".row__grade").value.trim();
    const creditsStr = row.querySelector(".row__credits").value.trim();
    const repeated = row.querySelector(".row__repeat").checked;
    const oldStr = row.querySelector(".row__oldgrade").value.trim();

    if (!gradeStr && !creditsStr && !name) return;

    const grade = Number(gradeStr);
    const credits = Number(creditsStr);
    const oldGrade = oldStr === "" ? null : Number(oldStr);

    out.push({ name: name || (lang === "ar" ? "مادة" : "Course"), grade, credits, repeated, oldGrade });
  });

  return out;
}

function validateCourses(courses){
  let ok = true;
  const rows = $$(".row", coursesEl);

  let cursor = 0;
  rows.forEach(r=>{
    const g = r.querySelector(".row__grade").value.trim();
    const cr = r.querySelector(".row__credits").value.trim();
    const nm = r.querySelector(".row__name").value.trim();
    if (g || cr || nm) cursor++;
  });

  courses.forEach((c, idx)=>{
    const row = rows.filter(r=>{
      const g = r.querySelector(".row__grade").value.trim();
      const cr = r.querySelector(".row__credits").value.trim();
      const nm = r.querySelector(".row__name").value.trim();
      return (g || cr || nm);
    })[idx];

    const gradeInput = row.querySelector(".row__grade");
    const creditsInput = row.querySelector(".row__credits");
    const oldInput = row.querySelector(".row__oldgrade");

    if (!(Number.isFinite(c.grade) && c.grade >= 0 && c.grade <= 100)){
      gradeInput.classList.add("is-invalid");
      ok = false;
    }
    if (!(Number.isFinite(c.credits) && c.credits > 0)){
      creditsInput.classList.add("is-invalid");
      ok = false;
    }
    if (c.repeated && c.oldGrade !== null){
      if (!(Number.isFinite(c.oldGrade) && c.oldGrade >= 0 && c.oldGrade <= 100)){
        oldInput.classList.add("is-invalid");
        ok = false;
      }
    }
  });

  return ok;
}

let lastSemester = null;
let lastCumulative = null;

function calcSemester(){
  hideAlert();
  clearInvalid();

  const courses = getCourses();
  if (!courses.length){
    showAlert(t("err_no_courses"));
    return null;
  }
  if (!validateCourses(courses)){
    showAlert(t("err_bad_grade"));
    return null;
  }

  const totalCredits = courses.reduce((s,c)=>s + c.credits, 0);
  const totalPoints = courses.reduce((s,c)=>s + (c.grade * c.credits), 0);
  const avg = totalPoints / totalCredits;

  const res = {
    courses,
    semesterAvg: avg,
    semesterCredits: totalCredits,
    semesterLabel: gradeLabel(avg)
  };
  lastSemester = res;
  renderSemester(res);
  showAlert(t("ok_sem_done"));

  currAvgEl.value = avg.toFixed(2);
  currHoursEl.value = String(totalCredits);

  return res;
}

function renderSemester(res){
  semesterAvgEl.textContent = Number.isFinite(res.semesterAvg) ? res.semesterAvg.toFixed(2) : "—";
  semesterHoursEl.textContent = Number.isFinite(res.semesterCredits) ? String(res.semesterCredits) : "—";
  semesterGradeEl.textContent = res.semesterLabel || "—";
}

function calcCumulative(){
  clearInvalid();
  congratsEl.hidden = true;
  congratsEl.textContent = "";

  const sem = lastSemester || calcSemester();
  if (!sem) return null;

  const prevAvg = Number(prevAvgEl.value);
  const prevHours = Number(prevHoursEl.value);

  const currAvg = Number(currAvgEl.value || sem.semesterAvg);
  const currHours = Number(currHoursEl.value || sem.semesterCredits);

  if (!(Number.isFinite(currAvg) && currAvg >= 0 && currAvg <= 100)) {
    currAvgEl.classList.add("is-invalid");
    return null;
  }
  if (!(Number.isFinite(currHours) && currHours > 0)) {
    currHoursEl.classList.add("is-invalid");
    return null;
  }

  const hasPrev = (Number.isFinite(prevAvg) && prevAvg >= 0 && prevAvg <= 100 && Number.isFinite(prevHours) && prevHours >= 0);

  let prevPoints = hasPrev ? (prevAvg * prevHours) : 0;
  let adjPrevHours = hasPrev ? prevHours : 0;

  // replace old grade if repeated and old grade entered
  sem.courses.forEach(c=>{
    if (c.repeated && c.oldGrade !== null && Number.isFinite(c.oldGrade) && Number.isFinite(c.credits) && c.credits > 0){
      prevPoints -= (c.oldGrade * c.credits);
      adjPrevHours -= c.credits;
    }
  });

  if (adjPrevHours < 0) adjPrevHours = 0;

  const currPoints = currAvg * currHours;
  const totalHours = adjPrevHours + currHours;
  const totalPoints = prevPoints + currPoints;
  const newAvg = totalHours > 0 ? (totalPoints / totalHours) : currAvg;

  const res = {
    prevAvg: hasPrev ? prevAvg : null,
    prevHours: hasPrev ? prevHours : null,
    adjPrevHours,
    currAvg,
    currHours,
    newAvg,
    totalHours,
    label: gradeLabel(newAvg),
    improved: hasPrev ? (newAvg > prevAvg + 1e-9) : false,
    delta: hasPrev ? (newAvg - prevAvg) : null,
    courses: sem.courses,
    sem
  };

  lastCumulative = res;
  renderCumulative(res);

  if (res.improved){
    congratsEl.hidden = false;
    congratsEl.textContent = t("congrats");
  }
  return res;
}

function renderCumulative(res){
  cumAvgEl.textContent = Number.isFinite(res.newAvg) ? res.newAvg.toFixed(2) : "—";

  const parts = [];
  if (Number.isFinite(res.totalHours)) parts.push(`${lang==="ar"?"إجمالي الساعات":"Total credits"}: ${res.totalHours}`);
  if (res.label) parts.push(`${lang==="ar"?"التقدير":"Rating"}: ${res.label}`);
  if (res.delta !== null) parts.push(`${lang==="ar"?"تحسّن":"Improvement"}: ${res.delta >= 0 ? "+" : ""}${res.delta.toFixed(2)}`);

  cumMetaEl.textContent = parts.join(" • ");
}

// ✅✅ إصلاح الطباعة النهائي: يحفظ آخر نتيجة + يفتح تبويب جديد كل مرة + يكسر الكاش
function saveAndOpenPrint(){
  const sem = lastSemester || calcSemester();
  if (!sem) return;

  const cum = lastCumulative || calcCumulative(); // إذا ما حسبت تراكمي، بحاول يحسبه من المدخلات
  const payload = {
    lang,
    generatedAt: new Date().toISOString(),
    system: 100,
    author: "Mohammad Jawad",
    university: {
      ar: "جامعة فلسطين التقنية – خضوري",
      en: "Palestine Technical University – Kadoorie"
    },
    courses: sem.courses,
    semester: {
      avg: sem.semesterAvg,
      credits: sem.semesterCredits,
      label: sem.semesterLabel
    },
    cumulative: (cum && Number.isFinite(cum.newAvg)) ? {
      prevAvg: cum.prevAvg,
      prevHours: cum.prevHours,
      avg: cum.newAvg,
      totalCredits: cum.totalHours,
      label: cum.label,
      improvement: (cum.delta === null ? null : cum.delta)
    } : null
  };

  localStorage.setItem(LS_PAYLOAD, JSON.stringify(payload));

  // 🔥 أهم سطر: ts= يكسر الكاش ويفتح نسخة جديدة دائمًا
  window.open(`print.html?ts=${Date.now()}`, "_blank", "noopener");
}

// events
$("#addCourseBtn").addEventListener("click", ()=> addCourseRow());
$("#calcSemesterBtn").addEventListener("click", calcSemester);
$("#useSemesterBtn").addEventListener("click", ()=>{
  const sem = lastSemester || calcSemester();
  if (!sem) return;
  currAvgEl.value = sem.semesterAvg.toFixed(2);
  currHoursEl.value = String(sem.semesterCredits);
});
$("#calcCumulativeBtn").addEventListener("click", ()=>{
  const res = calcCumulative();
  if (res) showAlert(t("ok_cum_done"));
});

$("#openPrintBtn").addEventListener("click", saveAndOpenPrint);
$("#openPrintTop").addEventListener("click", saveAndOpenPrint);

$("#langToggle").addEventListener("click", ()=>{
  setLang(lang === "ar" ? "en" : "ar");
});

// init
addCourseRow(); addCourseRow(); addCourseRow(); addCourseRow();
setLang(lang);
