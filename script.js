/* Khadouri GPA — bilingual + repeats in semester + print report */
const $ = (sel, root=document) => root.querySelector(sel);

const STORAGE_KEY = "kgpa:lastReport";
const LANG_KEY = "kgpa:lang";

const I18N = {
  ar: {
    appTitle: "حساب المعدل التراكمي خضوري",
    appSubtitleAr: "حاسبة المعدل الفصلي والتراكمي — جامعة فلسطين التقنية – خضوري",
    appSubtitleEn: "Semester & Cumulative Calculator — Palestine Technical University (Kadoorie)",
    systemChip: "النظام: 100",
    printChip: "شهادة الطباعة",
    printChipHint: "يفتح صفحة جديدة",

    heroTitle: "حاسبة المعدل الفصلي والتراكمي (نظام 100)",
    heroDesc: "أدخل موادك (العلامة + الساعات) لتحصل على المعدل الفصلي، ثم احسب المعدل التراكمي بإضافة معدلك وساعاتك السابقة.",
    heroB1: "بدون تسجيل دخول — يعمل محليًا.",
    heroB2: "يدعم المساقات المعادة (استبدال العلامة القديمة).",
    heroB3: "شهادة طباعة أنيقة بصفحة منفصلة.",

    semTitle: "حساب المعدل الفصلي",
    semDesc: "أدخل علامة كل مادة (0–100) وعدد ساعاتها. إذا المادة معادة فعّل (معادة؟) وأدخل العلامة السابقة.",
    repeatBadge: "الإعادة",
    repeatHint: "إذا كانت العلامة القديمة محسوبة ضمن معدلك السابق، فعّل (معادة؟) وأدخل العلامة السابقة.",

    colName: "اسم المادة",
    colGrade: "العلامة %",
    colCredits: "الساعات",
    colRepeat: "معادة؟",
    colOldGrade: "العلامة السابقة",

    addCourse: "إضافة مادة",
    calcSem: "احسب المعدل الفصلي",

    semAvg: "المعدل الفصلي",
    semHours: "مجموع ساعات الفصل",
    semHoursSub: "Semester Hours",

    cumTitle: "حساب المعدل التراكمي",
    cumDesc: "أدخل معدلك وساعاتك السابقة، ثم دمجها مع نتائج هذا الفصل (مع دعم الاستبدال للمساقات المعادة).",
    prevAvg: "المعدل التراكمي السابق (%)",
    prevHours: "عدد الساعات السابقة",
    currAvg: "معدل الفصل الحالي (%)",
    currHours: "ساعات الفصل الحالي",
    useSem: "استخدم نتيجة الفصل الحالي",
    calcCum: "احسب المعدل التراكمي",
    newCum: "المعدل التراكمي الجديد",

    congratsTitle: "مبروك! 🎉",
    improvedText: (d)=>`لقد تحسن معدلك التراكمي بمقدار ${d.toFixed(2)} نقطة — استمر!`,
    notImprovedText: "معلومة: لم يتحسن المعدل مقارنةً بالسابق (لا بأس).",

    repeatNoteTitle: "ملاحظة الإعادة:",
    repeatNoteText: "نحسب المساق المعاد على أساس الاستبدال: نطرح أثر العلامة القديمة ثم نضيف علامة هذا الفصل.",

    faqTitle: "أسئلة شائعة",
    faqQ1: "كيف أحسب المعدل الفصلي؟",
    faqA1: "نجمع (العلامة × الساعات) لكل المواد ثم نقسم على مجموع الساعات.",
    faqQ2: "متى أستخدم خيار “معادة؟”؟",
    faqA2: "إذا كانت العلامة القديمة للمساق محسوبة ضمن معدلك التراكمي السابق الذي أدخلته، فعّل (معادة؟) وأدخل العلامة السابقة.",
    faqQ3: "هل يتم حفظ بياناتي؟",
    faqA3: "لا يتم إرسال أي بيانات. الحفظ محلي على جهازك فقط لتجهيز شهادة الطباعة.",

    footerHint: "هذه الأداة غير رسمية ولا تتبع للجامعة.",

    errFix: "رجاءً صحح الأخطاء المظللة بالأحمر.",
    errGradeRange: "العلامة يجب أن تكون بين 0 و100",
    errCredits: "الساعات يجب أن تكون أكبر من 0",
    errOldRequired: "أدخل العلامة السابقة للمساق المعاد",
    okSaved: "تم تجهيز شهادة الطباعة — افتحها من زر (شهادة الطباعة).",

    gradeExcellent: "ممتاز",
    gradeVeryGood: "جيد جداً",
    gradeGood: "جيد",
    gradePass: "مقبول",
    gradeFail: "راسب",
    passWord: "ناجح",
    failWord: "راسب"
  },
  en: {
    appTitle: "Khadouri GPA Calculator",
    appSubtitleAr: "Semester & Cumulative Calculator — PTUK (Khadouri)",
    appSubtitleEn: "Palestine Technical University (Kadoorie)",
    systemChip: "System: 100",
    printChip: "Print Certificate",
    printChipHint: "opens new page",

    heroTitle: "Semester & Cumulative GPA (100 Scale)",
    heroDesc: "Enter courses (grade + credits) to get semester GPA, then calculate cumulative GPA using previous GPA and hours.",
    heroB1: "No login — runs locally.",
    heroB2: "Supports repeated courses (replacement).",
    heroB3: "Elegant print certificate in a separate page.",

    semTitle: "Semester GPA",
    semDesc: "Enter grade (0–100) and credits. If repeated, enable (Repeated?) and enter old grade.",
    repeatBadge: "Repeat",
    repeatHint: "If the old attempt is included in your previous cumulative, mark it as repeated and enter the old grade.",

    colName: "Course name",
    colGrade: "Grade %",
    colCredits: "Credits",
    colRepeat: "Repeated?",
    colOldGrade: "Old grade",

    addCourse: "Add course",
    calcSem: "Calculate semester",

    semAvg: "Semester GPA",
    semHours: "Semester hours",
    semHoursSub: "Semester Hours",

    cumTitle: "Cumulative GPA",
    cumDesc: "Enter previous GPA & hours, then combine with this semester (with replacement for repeated courses).",
    prevAvg: "Previous cumulative GPA (%)",
    prevHours: "Previous hours",
    currAvg: "Current semester GPA (%)",
    currHours: "Current semester hours",
    useSem: "Use semester result",
    calcCum: "Calculate cumulative",
    newCum: "New cumulative GPA",

    congratsTitle: "Congrats! 🎉",
    improvedText: (d)=>`Your cumulative GPA improved by ${d.toFixed(2)} points — keep going!`,
    notImprovedText: "Info: GPA did not improve compared to previous.",

    repeatNoteTitle: "Repeat note:",
    repeatNoteText: "We calculate repeats as replacement: subtract old grade impact, then add this semester grade.",

    faqTitle: "FAQ",
    faqQ1: "How is semester GPA calculated?",
    faqA1: "We sum (grade × credits) for all courses then divide by total credits.",
    faqQ2: "When should I mark a course as repeated?",
    faqA2: "If the old attempt is included in the previous cumulative GPA you entered, mark it as repeated and enter the old grade.",
    faqQ3: "Do you store my data?",
    faqA3: "No data is sent anywhere. We only keep local data to generate the print certificate.",

    footerHint: "Unofficial tool — not affiliated with PTUK.",

    errFix: "Please fix the fields highlighted in red.",
    errGradeRange: "Grade must be between 0 and 100",
    errCredits: "Credits must be greater than 0",
    errOldRequired: "Old grade is required for repeated course",
    okSaved: "Print report is ready — open it from the Print button.",

    gradeExcellent: "Excellent",
    gradeVeryGood: "Very Good",
    gradeGood: "Good",
    gradePass: "Pass",
    gradeFail: "Fail",
    passWord: "Pass",
    failWord: "Fail"
  }
};

let LANG = localStorage.getItem(LANG_KEY) || "ar";

function t(key, ...args){
  const val = I18N[LANG][key];
  return (typeof val === "function") ? val(...args) : val;
}

function setLang(next){
  LANG = next;
  localStorage.setItem(LANG_KEY, LANG);

  const html = document.documentElement;
  html.lang = LANG === "ar" ? "ar" : "en";
  html.dir  = LANG === "ar" ? "rtl" : "ltr";
  document.body.classList.toggle("is-en", LANG === "en");

  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const k = el.getAttribute("data-i18n");
    el.textContent = t(k);
  });

  // One example only (course name placeholder) depending on language
  const firstName = document.querySelector(".row__name");
  if(firstName){
    firstName.placeholder = (LANG === "ar") ? "مثال: رياضيات متقطعة" : "e.g., Discrete Math";
  }
}

function gradeLabel(avg){
  if(avg >= 90) return {ar: t("gradeExcellent"), en: I18N.en.gradeExcellent};
  if(avg >= 80) return {ar: t("gradeVeryGood"), en: I18N.en.gradeVeryGood};
  if(avg >= 70) return {ar: t("gradeGood"), en: I18N.en.gradeGood};
  if(avg >= 60) return {ar: t("gradePass"), en: I18N.en.gradePass};
  return {ar: t("gradeFail"), en: I18N.en.gradeFail};
}

function passFail(grade){
  const pass = grade >= 60;
  return pass ? {ar: t("passWord"), en: I18N.en.passWord} : {ar: t("failWord"), en: I18N.en.failWord};
}

function showAlert(el, msg, kind="warn"){
  el.textContent = msg;
  el.classList.add("is-show");
  el.classList.toggle("is-warn", kind === "warn");
  el.classList.toggle("is-ok", kind === "ok");
}

function hideAlert(el){
  el.classList.remove("is-show","is-warn","is-ok");
  el.textContent = "";
}

function addCourseRow({name="", grade="", credits="", repeated=false, oldGrade=""} = {}){
  const tpl = $("#courseRowTpl");
  const node = tpl.content.firstElementChild.cloneNode(true);

  const nameEl = node.querySelector(".row__name");
  const gradeEl = node.querySelector(".row__grade");
  const creditsEl = node.querySelector(".row__credits");
  const repEl = node.querySelector(".row__repeat");
  const oldEl = node.querySelector(".row__oldgrade");
  const delBtn = node.querySelector(".iconbtn");

  nameEl.value = name;
  gradeEl.value = grade;
  creditsEl.value = credits;
  repEl.checked = repeated;
  oldEl.value = oldGrade;

  function updateRepeatUI(){
    const on = repEl.checked;
    oldEl.disabled = !on;
    oldEl.style.opacity = on ? "1" : ".65";
    oldEl.parentElement.style.display = on ? "flex" : "none";
    if(!on){
      oldEl.value = "";
      oldEl.classList.remove("is-invalid");
      oldEl.parentElement.querySelector(".err").textContent = "";
    }
  }
  updateRepeatUI();
  repEl.addEventListener("change", updateRepeatUI);

  delBtn.addEventListener("click", ()=>{
    node.remove();
  });

  // On input, clear red state
  [nameEl, gradeEl, creditsEl, oldEl].forEach(inp=>{
    inp.addEventListener("input", ()=>{
      inp.classList.remove("is-invalid");
      const err = inp.parentElement.querySelector(".err");
      if(err) err.textContent = "";
    });
  });

  $("#courses").appendChild(node);

  // one example only on very first row
  const rows = document.querySelectorAll("#courses .row");
  if(rows.length === 1){
    nameEl.placeholder = (LANG === "ar") ? "مثال: رياضيات متقطعة" : "e.g., Discrete Math";
  }else{
    nameEl.placeholder = (LANG === "ar") ? "اسم المادة" : "Course name";
  }
}

function readCourses(){
  const rows = Array.from(document.querySelectorAll("#courses .row"));
  return rows.map(r=>{
    const name = r.querySelector(".row__name").value.trim();
    const grade = parseFloat(r.querySelector(".row__grade").value);
    const credits = parseFloat(r.querySelector(".row__credits").value);
    const repeated = r.querySelector(".row__repeat").checked;
    const oldGrade = parseFloat(r.querySelector(".row__oldgrade").value);
    return {row:r, name, grade, credits, repeated, oldGrade};
  });
}

function validateCourses(courses){
  let ok = true;

  courses.forEach(c=>{
    const gradeEl = c.row.querySelector(".row__grade");
    const creditsEl = c.row.querySelector(".row__credits");
    const oldEl = c.row.querySelector(".row__oldgrade");

    // grade
    if(!Number.isFinite(c.grade) || c.grade < 0 || c.grade > 100){
      ok = false;
      gradeEl.classList.add("is-invalid");
      gradeEl.parentElement.querySelector(".err").textContent = t("errGradeRange");
    }

    // credits
    if(!Number.isFinite(c.credits) || c.credits <= 0){
      ok = false;
      creditsEl.classList.add("is-invalid");
      creditsEl.parentElement.querySelector(".err").textContent = t("errCredits");
    }

    // repeated old grade
    if(c.repeated){
      if(!Number.isFinite(c.oldGrade) || c.oldGrade < 0 || c.oldGrade > 100){
        ok = false;
        oldEl.classList.add("is-invalid");
        oldEl.parentElement.querySelector(".err").textContent = t("errOldRequired");
      }
    }
  });

  return ok;
}

function calcSemester(){
  const semAlert = $("#semAlert");
  hideAlert(semAlert);

  const courses = readCourses();
  if(courses.length === 0){
    showAlert(semAlert, t("errFix"), "warn");
    return null;
  }

  if(!validateCourses(courses)){
    showAlert(semAlert, t("errFix"), "warn");
    return null;
  }

  let points = 0;
  let hours = 0;

  courses.forEach(c=>{
    points += c.grade * c.credits;
    hours  += c.credits;
  });

  const avg = points / hours;
  const g = gradeLabel(avg);

  $("#semesterAvg").textContent = avg.toFixed(2);
  $("#semesterHours").textContent = hours.toFixed(2).replace(/\.00$/,"");
  $("#semesterGrade").textContent =
    (LANG === "ar")
      ? `${g.ar} (${I18N.en[Object.keys(I18N.en).find(k => I18N.en[k] === g.en)] || g.en})`
      : `${g.en} (${I18N.ar[Object.keys(I18N.ar).find(k => I18N.ar[k] === g.ar)] || g.ar})`;

  // fill cumulative fields helper
  $("#currAvg").value = avg.toFixed(2);
  $("#currHours").value = hours.toFixed(2).replace(/\.00$/,"");

  // save for print
  saveReport({ courses, semesterAvg: avg, semesterHours: hours });

  showAlert(semAlert, t("okSaved"), "ok");
  return {avg, hours, courses};
}

function calcCumulative(){
  const cumAlert = $("#cumAlert");
  hideAlert(cumAlert);

  // Ensure we have semester data
  const sem = calcSemesterSilently();
  if(!sem){
    showAlert(cumAlert, t("errFix"), "warn");
    return;
  }

  const prevAvg = parseFloat($("#prevAvg").value);
  const prevHours = parseFloat($("#prevHours").value);

  if(!Number.isFinite(prevAvg) || prevAvg < 0 || prevAvg > 100 || !Number.isFinite(prevHours) || prevHours < 0){
    showAlert(cumAlert, t("errFix"), "warn");
    return;
  }

  // Replacement logic: remove old attempt from previous totals when repeated is checked
  const repeats = sem.courses.filter(c=>c.repeated);
  let prevPoints = prevAvg * prevHours;
  let prevHoursAdj = prevHours;

  repeats.forEach(c=>{
    prevPoints -= c.oldGrade * c.credits;
    prevHoursAdj -= c.credits; // removing old attempt credits
  });

  // Prevent negative hours in edge cases
  if(prevHoursAdj < 0) prevHoursAdj = 0;

  const newPoints = prevPoints + sem.semesterAvg * sem.semesterHours;
  const newHours = prevHoursAdj + sem.semesterHours;

  const newAvg = (newHours > 0) ? (newPoints / newHours) : 0;
  const g = gradeLabel(newAvg);

  $("#cumulativeAvg").textContent = newAvg.toFixed(2);
  $("#cumulativeMeta").textContent =
    (LANG === "ar")
      ? `${t("prevHours")} ${prevHoursAdj.toFixed(2).replace(/\.00$/,"")} + ${t("currHours")} ${sem.semesterHours.toFixed(2).replace(/\.00$/,"")} = ${newHours.toFixed(2).replace(/\.00$/,"")} • ${g.ar} (${g.en})`
      : `${t("prevHours")} ${prevHoursAdj.toFixed(2).replace(/\.00$/,"")} + ${t("currHours")} ${sem.semesterHours.toFixed(2).replace(/\.00$/,"")} = ${newHours.toFixed(2).replace(/\.00$/,"")} • ${g.en} (${g.ar})`;

  // Congrats
  const improveBox = $("#improveBox");
  const improveText = $("#improveText");
  const diff = newAvg - prevAvg;

  if(diff > 0.01){
    improveBox.hidden = false;
    improveText.textContent = t("improvedText", diff);
  }else{
    improveBox.hidden = false;
    improveText.textContent = t("notImprovedText");
  }

  // save for print
  saveReport({
    courses: sem.courses,
    semesterAvg: sem.semesterAvg,
    semesterHours: sem.semesterHours,
    prevAvg,
    prevHours,
    prevHoursAdjusted: prevHoursAdj,
    cumulativeAvg: newAvg,
    cumulativeHours: newHours,
    diff
  });

  showAlert(cumAlert, "OK", "ok");
}

function calcSemesterSilently(){
  const semAlert = $("#semAlert");
  hideAlert(semAlert);

  const courses = readCourses();
  if(courses.length === 0) return null;
  if(!validateCourses(courses)) return null;

  let points = 0;
  let hours = 0;

  courses.forEach(c=>{
    points += c.grade * c.credits;
    hours  += c.credits;
  });

  const avg = points / hours;
  return { semesterAvg: avg, semesterHours: hours, courses };
}

function saveReport(payload){
  const courses = payload.courses.map(c=>{
    const pf = passFail(c.grade);
    return {
      name: c.name || (LANG === "ar" ? "مادة" : "Course"),
      grade: c.grade,
      credits: c.credits,
      repeated: !!c.repeated,
      oldGrade: c.repeated ? c.oldGrade : null,
      passAr: pf.ar,
      passEn: pf.en
    };
  });

  const report = {
    createdAt: Date.now(),
    lang: LANG,
    courses,
    semesterAvg: payload.semesterAvg ?? null,
    semesterHours: payload.semesterHours ?? null,
    prevAvg: payload.prevAvg ?? null,
    prevHours: payload.prevHours ?? null,
    prevHoursAdjusted: payload.prevHoursAdjusted ?? null,
    cumulativeAvg: payload.cumulativeAvg ?? null,
    cumulativeHours: payload.cumulativeHours ?? null,
    diff: payload.diff ?? null
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(report));
}

function openPrint(){
  // Ensure we have a fresh report
  const sem = calcSemester();
  if(!sem) return;
  // open separate page
  window.open("print.html", "_blank", "noopener,noreferrer");
}

function bind(){
  $("#yearNow").textContent = new Date().getFullYear();

  $("#langToggle").addEventListener("click", ()=>{
    setLang(LANG === "ar" ? "en" : "ar");
    // After lang switch, update placeholders (one example only)
    const rows = document.querySelectorAll("#courses .row");
    rows.forEach((r, i)=>{
      const name = r.querySelector(".row__name");
      name.placeholder = (i === 0)
        ? (LANG === "ar" ? "مثال: رياضيات متقطعة" : "e.g., Discrete Math")
        : (LANG === "ar" ? "اسم المادة" : "Course name");
    });
  });

  $("#addCourseBtn").addEventListener("click", ()=> addCourseRow());
  $("#calcSemesterBtn").addEventListener("click", calcSemester);
  $("#useSemesterBtn").addEventListener("click", ()=>{
    const sem = calcSemester();
    if(!sem) return;
    $("#currAvg").value = sem.avg.toFixed(2);
    $("#currHours").value = sem.hours.toFixed(2).replace(/\.00$/,"");
  });
  $("#calcCumulativeBtn").addEventListener("click", calcCumulative);
  $("#printOpenBtn").addEventListener("click", openPrint);

  // initial rows
  addCourseRow();
  addCourseRow();
  addCourseRow();
}

setLang(LANG);
bind();
