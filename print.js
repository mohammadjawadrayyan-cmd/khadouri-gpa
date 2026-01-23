(() => {
  // حاول يقرأ من أكثر من مفتاح (عشان لو مفتاحك مختلف ما نخسر)
  const readAny = (keys) => {
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (raw) {
        try { return JSON.parse(raw); } catch (_) {}
      }
    }
    return null;
  };

  const DATA_KEYS = [
    "ptuk_gpa_data",
    "khadouri_gpa_data",
    "gpa_certificate_data",
    "certificateData"
  ];

  const data = readAny(DATA_KEYS) || {};

  // عناصر
  const elDate = document.getElementById("printDate");
  const tbody = document.getElementById("coursesTbody");
  const elSemAvg = document.getElementById("semesterAvg");
  const elSemMeta = document.getElementById("semesterMeta");
  const elCumAvg = document.getElementById("cumulativeAvg");
  const elCumMeta = document.getElementById("cumulativeMeta");
  const page = document.getElementById("page");

  // تاريخ بالإنجليزي (زي ما طلبت)
  const now = data.generatedAt ? new Date(data.generatedAt) : new Date();
  elDate.textContent = now.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });

  const clampNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const fmt = (v, d=2) => (v === null ? "—" : Number(v).toFixed(d));

  const ratingOf = (avg) => {
    if (avg === null) return { ar:"—", en:"—" };
    if (avg >= 90) return { ar:"ممتاز", en:"Excellent" };
    if (avg >= 80) return { ar:"جيد جداً", en:"Very Good" };
    if (avg >= 70) return { ar:"جيد", en:"Good" };
    if (avg >= 60) return { ar:"مقبول", en:"Pass" };
    return { ar:"راسب", en:"Fail" };
  };

  // كورسات
  const courses = Array.isArray(data.courses) ? data.courses : [];
  tbody.innerHTML = "";

  const makeTd = (txt, cls="") => {
    const td = document.createElement("td");
    td.textContent = txt;
    if (cls) td.className = cls;
    return td;
  };

  courses.forEach((c) => {
    const name = (c?.name ?? "").toString().trim() || "مادة";
    const credits = clampNum(c?.credits) ?? clampNum(c?.hours) ?? 0;
    const grade = clampNum(c?.grade);
    const repeated = !!c?.repeated;

    const pass = (grade !== null && grade >= 60);
    const tr = document.createElement("tr");

    tr.appendChild(makeTd(name));
    tr.appendChild(makeTd(credits ? String(credits) : "—"));
    tr.appendChild(makeTd(grade === null ? "—" : String(grade)));
    tr.appendChild(makeTd(pass ? "Pass / ناجح" : "Fail / راسب", pass ? "ok" : "bad"));
    tr.appendChild(makeTd(repeated ? "Yes / نعم" : "No / لا"));

    tbody.appendChild(tr);
  });

  // نتائج
  const semAvg = clampNum(data?.semester?.avg) ?? clampNum(data?.semesterAvg);
  const semCredits = clampNum(data?.semester?.credits) ?? clampNum(data?.semesterCredits);
  const semRating = ratingOf(semAvg);

  elSemAvg.textContent = (semAvg === null ? "—" : fmt(semAvg, 2));
  elSemMeta.textContent = semCredits
    ? `Credits: ${semCredits} • Rating: ${semRating.en} — الساعات: ${semCredits} • التقدير: ${semRating.ar}`
    : `Rating: ${semRating.en} — التقدير: ${semRating.ar}`;

  const cumAvg = clampNum(data?.cumulative?.avg) ?? clampNum(data?.cumulativeAvg);
  const totalCredits = clampNum(data?.cumulative?.totalCredits) ?? clampNum(data?.totalCredits);
  const prevAvg = clampNum(data?.cumulative?.prevAvg) ?? clampNum(data?.prevAvg);
  const improvementFromData = clampNum(data?.cumulative?.improvement) ?? clampNum(data?.improvement);

  let improvement = improvementFromData;
  if (improvement === null && cumAvg !== null && prevAvg !== null) {
    improvement = cumAvg - prevAvg;
  }

  const cumRating = ratingOf(cumAvg);

  elCumAvg.textContent = (cumAvg === null ? "—" : fmt(cumAvg, 2));

  // ✅ هنا بدلنا Δ إلى "تحسّن / Improvement"
  const impPart = (improvement === null)
    ? ""
    : ` • Improvement: ${improvement >= 0 ? "+" : ""}${fmt(improvement, 2)} — تحسّن: ${improvement >= 0 ? "+" : ""}${fmt(improvement, 2)}`;

  elCumMeta.textContent = totalCredits
    ? `Total credits: ${totalCredits} • Rating: ${cumRating.en}${impPart} — إجمالي الساعات: ${totalCredits} • التقدير: ${cumRating.ar}${impPart ? "" : ""}`
    : `Rating: ${cumRating.en}${impPart} — التقدير: ${cumRating.ar}${impPart ? "" : ""}`;

  // إذا المواد كثيرة: فعّل compact لتزيد فرصة صفحة وحدة
  if (courses.length >= 8) {
    page.classList.add("compact");
  }
})();
