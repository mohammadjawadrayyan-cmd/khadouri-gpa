(() => {
  const SITE_URL = "https://mohammadjawadrayyan-cmd.github.io/khadouri-gpa/";

  const el = (id) => document.getElementById(id);

  const coursesWrap = el("courses");
  const repeatsWrap = el("repeats");

  const courseTpl = el("courseRowTpl");
  const repeatTpl = el("repeatRowTpl");

  const addCourseBtn = el("addCourseBtn");
  const calcSemesterBtn = el("calcSemesterBtn");

  const semesterAvgEl = el("semesterAvg");
  const semesterHoursEl = el("semesterHours");
  const semesterGradeEl = el("semesterGrade");

  const prevAvgEl = el("prevAvg");
  const prevHoursEl = el("prevHours");
  const currAvgEl = el("currAvg");
  const currHoursEl = el("currHours");

  const useSemesterBtn = el("useSemesterBtn");
  const calcCumulativeBtn = el("calcCumulativeBtn");

  const cumulativeAvgEl = el("cumulativeAvg");
  const cumulativeMetaEl = el("cumulativeMeta");
  const congratsMsgEl = el("congratsMsg");

  const repeatPolicyEl = el("repeatPolicy");
  const addRepeatBtn = el("addRepeatBtn");

  const printCertBtn = el("printCertBtn");

  // Print elements
  const qrImg = el("qrImg");
  const certMeta = el("certMeta");
  const stamp = el("stamp");
  const stampGrade = el("stampGrade");

  const pSemesterAvg = el("pSemesterAvg");
  const pSemesterGrade = el("pSemesterGrade");
  const pSemesterHours = el("pSemesterHours");

  const pCumulativeAvg = el("pCumulativeAvg");
  const pCumulativeGrade = el("pCumulativeGrade");

  const pNotes = el("pNotes");

  const pCoursesBody = el("pCoursesBody");
  const pTotalHours = el("pTotalHours");
  const pTotalPoints = el("pTotalPoints");

  const printUrl = el("printUrl");
  const printDate = el("printDate");

  function fmt(n, digits = 2) {
    if (!Number.isFinite(n)) return "—";
    return n.toFixed(digits);
  }

  function clamp(n, min, max){
    return Math.min(max, Math.max(min, n));
  }

  function gradeLabel(avg){
    if (!Number.isFinite(avg)) return "—";
    if (avg >= 90) return "ممتاز";
    if (avg >= 85) return "جيد جدًا";
    if (avg >= 75) return "جيد";
    if (avg >= 65) return "مقبول";
    return "راسب";
  }

  function stampClass(label){
    switch(label){
      case "ممتاز": return "stamp--excellent";
      case "جيد جدًا": return "stamp--vgood";
      case "جيد": return "stamp--good";
      case "مقبول": return "stamp--pass";
      default: return "stamp--fail";
    }
  }

  function parseNum(value){
    const n = Number(value);
    return Number.isFinite(n) ? n : NaN;
  }

  function rowValues(row){
    const name = row.querySelector(".row__name")?.value?.trim() || "";
    const grade = parseNum(row.querySelector(".row__grade")?.value);
    const credits = parseNum(row.querySelector(".row__credits")?.value);
    return { name, grade, credits };
  }

  function repeatValues(row){
    const name = row.querySelector(".row__name")?.value?.trim() || "";
    const oldgrade = parseNum(row.querySelector(".row__oldgrade")?.value);
    const credits = parseNum(row.querySelector(".row__credits")?.value);
    return { name, oldgrade, credits };
  }

  function addCourseRow(prefill = {}){
    const node = courseTpl.content.firstElementChild.cloneNode(true);
    if (prefill.name) node.querySelector(".row__name").value = prefill.name;
    if (Number.isFinite(prefill.grade)) node.querySelector(".row__grade").value = prefill.grade;
    if (Number.isFinite(prefill.credits)) node.querySelector(".row__credits").value = prefill.credits;

    node.querySelector("button").addEventListener("click", () => node.remove());
    coursesWrap.appendChild(node);
  }

  function addRepeatRow(prefill = {}){
    const node = repeatTpl.content.firstElementChild.cloneNode(true);
    if (prefill.name) node.querySelector(".row__name").value = prefill.name;
    if (Number.isFinite(prefill.oldgrade)) node.querySelector(".row__oldgrade").value = prefill.oldgrade;
    if (Number.isFinite(prefill.credits)) node.querySelector(".row__credits").value = prefill.credits;

    node.querySelector("button").addEventListener("click", () => node.remove());
    repeatsWrap.appendChild(node);
  }

  function getSemesterComputation(){
    const rows = [...coursesWrap.querySelectorAll(".row")];
    let points = 0;
    let hours = 0;
    const items = [];

    for (const r of rows){
      const { name, grade, credits } = rowValues(r);
      if (!Number.isFinite(grade) && !Number.isFinite(credits) && !name) continue;

      if (!Number.isFinite(grade) || grade < 0 || grade > 100) {
        r.querySelector(".row__grade").focus();
        throw new Error("تأكد أن العلامة بين 0 و 100.");
      }
      if (!Number.isFinite(credits) || credits <= 0) {
        r.querySelector(".row__credits").focus();
        throw new Error("تأكد أن الساعات رقم أكبر من 0.");
      }

      const g = clamp(grade, 0, 100);
      const c = credits;
      const p = g * c;

      points += p;
      hours += c;
      items.push({ name: name || "—", grade: g, credits: c, points: p });
    }

    if (hours <= 0) throw new Error("أدخل مادة واحدة على الأقل مع ساعاتها.");
    const avg = points / hours;

    return { avg, hours, points, items };
  }

  function getRepeats(){
    const rows = [...repeatsWrap.querySelectorAll(".row")];
    const repeats = [];

    for (const r of rows){
      const { name, oldgrade, credits } = repeatValues(r);
      if (!Number.isFinite(oldgrade) && !Number.isFinite(credits) && !name) continue;

      if (!Number.isFinite(oldgrade) || oldgrade < 0 || oldgrade > 100) {
        r.querySelector(".row__oldgrade").focus();
        throw new Error("في المواد المُعادة: تأكد أن العلامة القديمة بين 0 و 100.");
      }
      if (!Number.isFinite(credits) || credits <= 0) {
        r.querySelector(".row__credits").focus();
        throw new Error("في المواد المُعادة: تأكد أن الساعات رقم أكبر من 0.");
      }

      repeats.push({
        name: name || "—",
        oldgrade: clamp(oldgrade, 0, 100),
        credits
      });
    }
    return repeats;
  }

  function calcSemester(){
    try {
      const { avg, hours } = getSemesterComputation();
      semesterAvgEl.textContent = fmt(avg);
      semesterHoursEl.textContent = fmt(hours, 1);
      semesterGradeEl.textContent = gradeLabel(avg);
      return true;
    } catch (err){
      alert(err.message || "حدث خطأ.");
      return false;
    }
  }

  function calcCumulative(){
    try {
      const prevAvg = parseNum(prevAvgEl.value);
      const prevHours = parseNum(prevHoursEl.value);

      if (!Number.isFinite(prevAvg) || prevAvg < 0 || prevAvg > 100){
        prevAvgEl.focus();
        throw new Error("أدخل المعدل التراكمي السابق (0–100).");
      }
      if (!Number.isFinite(prevHours) || prevHours < 0){
        prevHoursEl.focus();
        throw new Error("أدخل عدد الساعات السابقة بشكل صحيح.");
      }

      const currAvg = parseNum(currAvgEl.value);
      const currHours = parseNum(currHoursEl.value);

      if (!Number.isFinite(currAvg) || currAvg < 0 || currAvg > 100){
        currAvgEl.focus();
        throw new Error("أدخل معدل الفصل الحالي (0–100) أو استخدم زر تعبئة الفصل.");
      }
      if (!Number.isFinite(currHours) || currHours <= 0){
        currHoursEl.focus();
        throw new Error("أدخل ساعات الفصل الحالي بشكل صحيح.");
      }

      const policy = repeatPolicyEl.value;
      const repeats = getRepeats();

      let prevPoints = prevAvg * prevHours;
      let adjPrevHours = prevHours;

      let removedPoints = 0;
      let removedHours = 0;

      if (policy === "replace" && repeats.length){
        for (const rep of repeats){
          removedPoints += rep.oldgrade * rep.credits;
          removedHours += rep.credits;
        }
        prevPoints -= removedPoints;
        adjPrevHours -= removedHours;
        if (adjPrevHours < 0) adjPrevHours = 0; // حماية
      }

      const currPoints = currAvg * currHours;
      const totalPoints = prevPoints + currPoints;
      const totalHours = adjPrevHours + currHours;

      if (totalHours <= 0) throw new Error("مجموع الساعات غير صحيح.");

      const newAvg = totalPoints / totalHours;

      cumulativeAvgEl.textContent = fmt(newAvg);
      const metaParts = [
        `ساعات سابقة بعد التعديل: ${fmt(adjPrevHours,1)}`,
        `ساعات الفصل الحالي: ${fmt(currHours,1)}`
      ];
      if (policy === "replace" && repeats.length){
        metaParts.push(`تم حذف أثر مواد مُعادة: ${fmt(removedHours,1)} ساعة`);
      }
      cumulativeMetaEl.textContent = metaParts.join(" • ");

      // Congrats message (تحسّن المعدل)
      const diff = newAvg - prevAvg;
      if (Number.isFinite(diff) && diff > 0.005){
        congratsMsgEl.style.display = "block";
        congratsMsgEl.textContent = `مبروك! لقد تحسّن معدلك بمقدار ${fmt(diff,2)} نقطة 🎉`;
      } else {
        congratsMsgEl.style.display = "none";
        congratsMsgEl.textContent = "";
      }

      return { newAvg, prevAvg, prevHours: adjPrevHours, currAvg, currHours, policy, repeats };
    } catch (err){
      alert(err.message || "حدث خطأ.");
      return null;
    }
  }

  function fillFromSemester(){
    try{
      const { avg, hours } = getSemesterComputation();
      currAvgEl.value = fmt(avg);
      currHoursEl.value = fmt(hours, 1);
    } catch (err){
      alert(err.message || "احسب الفصل أولاً.");
    }
  }

  function buildPrintCertificate(){
    // تأكد من حساب الفصل والتراكمي (حتى لو المستخدم ناسي)
    const semOk = calcSemester();
    if (!semOk) return;

    const cum = calcCumulative();
    if (!cum) return;

    // بيانات الفصل التفصيلية
    const sem = getSemesterComputation();

    const semLabel = gradeLabel(sem.avg);
    const cumLabel = gradeLabel(cum.newAvg);

    // QR
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(SITE_URL)}`;
    qrImg.src = qrUrl;

    // Header meta
    const now = new Date();
    const dateStr = now.toLocaleDateString("ar-PS", { year:"numeric", month:"2-digit", day:"2-digit" });
    certMeta.textContent = `تاريخ الإصدار: ${dateStr} • النظام: 100 • URL: ${SITE_URL}`;

    // Stamp: يعتمد على التراكمي (الأهم)
    stamp.className = `stamp ${stampClass(cumLabel)}`;
    stampGrade.textContent = cumLabel;

    // Print summary
    pSemesterAvg.textContent = fmt(sem.avg);
    pSemesterGrade.textContent = `التقدير: ${semLabel}`;
    pSemesterHours.textContent = fmt(sem.hours, 1);

    pCumulativeAvg.textContent = fmt(cum.newAvg);
    pCumulativeGrade.textContent = `التقدير: ${cumLabel}`;

    // Notes
    if (cum.policy === "replace" && cum.repeats.length){
      pNotes.textContent = `تم تطبيق استبدال المواد المُعادة (${cum.repeats.length})`;
    } else if (cum.policy === "both" && cum.repeats.length){
      pNotes.textContent = `تم اختيار احتساب المحاولتين (لم يتم حذف أثر القديم)`;
    } else {
      pNotes.textContent = `بدون مواد مُعادة`;
    }

    // Courses table
    pCoursesBody.innerHTML = "";
    for (const it of sem.items){
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(it.name)}</td>
        <td>${fmt(it.grade)}</td>
        <td>${fmt(it.credits,1)}</td>
        <td>${fmt(it.points,2)}</td>
      `;
      pCoursesBody.appendChild(tr);
    }

    pTotalHours.textContent = fmt(sem.hours, 1);
    pTotalPoints.textContent = fmt(sem.points, 2);

    printUrl.textContent = SITE_URL;
    printDate.textContent = `Printed: ${now.toLocaleString("en-GB")}`;
  }

  function escapeHtml(s){
    return String(s)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  // ===== Events =====
  addCourseBtn.addEventListener("click", () => addCourseRow());
  calcSemesterBtn.addEventListener("click", calcSemester);

  useSemesterBtn.addEventListener("click", fillFromSemester);
  calcCumulativeBtn.addEventListener("click", () => calcCumulative());

  addRepeatBtn.addEventListener("click", () => addRepeatRow());

  printCertBtn.addEventListener("click", () => {
    try{
      buildPrintCertificate();
      // اطبع بعد تجهيز الـ QR
      setTimeout(() => window.print(), 250);
    } catch (e){
      alert("تأكد من إدخال البيانات بشكل صحيح قبل الطباعة.");
    }
  });

  // ===== Init =====
  // 4 صفوف جاهزة كبداية
  addCourseRow();
  addCourseRow();
  addCourseRow();
  addCourseRow();

  // صف واحد للمواد المُعادة (اختياري) — تقدر تحذفه
  // addRepeatRow();
})();
