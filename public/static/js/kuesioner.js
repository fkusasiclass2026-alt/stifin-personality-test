/**
 * kuesioner.js
 * Data soal diambil dari: docs/Test_introvert_extrovert.md
 *
 * Logika Scoring:
 *   - Soal ganjil  (1,3,5,7,9)  → Benar = +1 poin INTROVERT
 *   - Soal genap   (2,4,6,8,10) → Benar = +1 poin EKSTROVERT
 *   - Mayoritas Ekstrovert (>5)  → "Ekstrovert"
 *   - Mayoritas Introvert  (>5)  → "Introvert"
 *   - Seimbang (5 vs 5)          → "Ambivert"
 */

// ─── Data Soal ───────────────────────────────────────────────────────────────
const SOAL = [
  {
    no: 1,
    teks: "Saya merasa lebih berenergi setelah menghabiskan waktu sendirian dibandingkan setelah berada di tengah keramaian.",
    kunci: "I",
  },
  {
    no: 2,
    teks: "Saya memiliki lingkaran pertemanan yang sangat kecil namun intim, dibandingkan memiliki banyak teman namun hanya sebatas kenalan.",
    kunci: "I",
  },
  {
    no: 3,
    teks: "Saya sering menjadi orang pertama yang berinisiatif memulai percakapan dengan orang asing di suatu acara sosial.",
    kunci: "E",
  },
  {
    no: 4,
    teks: "Saya lebih memilih berkomunikasi melalui pesan tertulis (chat/email) daripada berbicara langsung melalui telepon.",
    kunci: "I",
  },
  {
    no: 5,
    teks: "Saya cenderung berpikir sambil berbicara dan suka mematangkan ide dengan cara mendiskusikannya secara verbal bersama orang lain.",
    kunci: "E",
  },
  {
    no: 6,
    teks: "Saya sangat menikmati dan merasa nyaman ketika menjadi pusat perhatian dalam sebuah kelompok.",
    kunci: "E",
  },
  {
    no: 7,
    teks: "Saya merasa bosan, gelisah, atau kehilangan semangat jika terlalu lama tidak berinteraksi dengan orang lain.",
    kunci: "E",
  },
  {
    no: 8,
    teks: "Saya merasa cepat terkuras secara mental ketika menghadiri acara sosial yang berlangsung lama, meskipun saya menikmati acara tersebut.",
    kunci: "I",
  },
  {
    no: 9,
    teks: "Sebelum merespons pertanyaan atau mengambil keputusan, saya biasanya membutuhkan waktu jeda untuk merenungkannya terlebih dahulu di dalam kepala.",
    kunci: "I",
  },
  {
    no: 10,
    teks: "Saya merasa lebih hidup dan produktif saat bekerja di lingkungan yang dinamis dan penuh interaksi dibandingkan di ruangan yang sunyi.",
    kunci: "E",
  },
];

// ─── Data Geometri (STIFIn) ───────────────────────────────────────────────────
const GEOMETRI = [
  {
    id: "sensing",
    label: "Sensing",
    img: "/static/images/sensing.png",
    deskripsi: "Berpikir konkret, detail, dan berbasis fakta",
  },
  {
    id: "thinking",
    label: "Thinking",
    img: "/static/images/thinking.png",
    deskripsi: "Analitis, logis, dan berorientasi sistem",
  },
  {
    id: "intuiting",
    label: "Intuiting",
    img: "/static/images/intuiting.png",
    deskripsi: "Visioner, inovatif, dan berpikir big-picture",
  },
  {
    id: "feeling",
    label: "Feeling",
    img: "/static/images/feeling.png",
    deskripsi: "Empatik, harmonis, dan people-oriented",
  },
  {
    id: "instinct",
    label: "Instinct",
    img: "/static/images/instinct.png",
    deskripsi: "Intuitif, adaptif, dan mengandalkan naluri",
  },
];

// ─── State ────────────────────────────────────────────────────────────────────
const jawaban = {};        // { 1: "Benar"|"Salah", ... }
let geoTerpilih = null;    // id geometri
let currentGeoIdx = 0;     // index geometri yang sedang aktif ditampilkan
let geoTimer = null;       // timer interval looping
const DURATION_MS = 3000;  // durasi tampil setiap simbol: 3 detik

function renderSoal() {
  const wrapper = document.getElementById("questions-wrapper");
  wrapper.innerHTML = "";

  SOAL.forEach((soal) => {
    const item = document.createElement("div");
    item.className = "question-item";
    item.id = `q-item-${soal.no}`;
    item.innerHTML = `
      <div class="question-number">
        <span class="q-badge">${soal.no}</span>
      </div>
      <div class="question-body">
        <p class="question-text">${soal.teks}</p>
        <div class="btn-group" role="group" aria-label="Jawaban soal ${soal.no}">
          <button
            id="btn-${soal.no}-setuju"
            class="btn-answer"
            data-no="${soal.no}"
            data-val="Setuju"
            onclick="pilihJawaban(${soal.no}, 'Setuju')"
          >Setuju</button>
          <button
            id="btn-${soal.no}-ragu-ragu"
            class="btn-answer"
            data-no="${soal.no}"
            data-val="Ragu-ragu"
            onclick="pilihJawaban(${soal.no}, 'Ragu-ragu')"
          >Ragu-ragu</button>
          <button
            id="btn-${soal.no}-tidak-setuju"
            class="btn-answer"
            data-no="${soal.no}"
            data-val="Tidak Setuju"
            onclick="pilihJawaban(${soal.no}, 'Tidak Setuju')"
          >Tidak Setuju</button>
        </div>
      </div>`;
    wrapper.appendChild(item);
  });
}

// ─── Interactive Geometri Showcase (Looping 3 Detik dengan Zoom-In) ───────────
function initGeometriShowcase() {
  renderGeoDots();
  tampilkanGeo(currentGeoIdx);
  startGeoTimer();

  // Aksesibilitas keyboard pada showcase card
  const card = document.getElementById("geo-focus-card");
  if (card) {
    card.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pilihGeoCurrent();
      }
    };
  }
}

function renderGeoDots() {
  const container = document.getElementById("geo-dot-indicators");
  if (!container) return;
  container.innerHTML = "";

  GEOMETRI.forEach((geo, idx) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "geo-dot" + (idx === currentGeoIdx ? " active" : "");
    dot.setAttribute("aria-label", `Lihat simbol ${geo.label}`);
    dot.onclick = () => {
      currentGeoIdx = idx;
      tampilkanGeo(currentGeoIdx);
      startGeoTimer(); // reset timer 3 detik saat manual klik
    };
    container.appendChild(dot);
  });
}

function startGeoTimer() {
  if (geoTimer) clearInterval(geoTimer);

  const bar = document.getElementById("geo-timer-bar");
  if (bar) {
    bar.classList.remove("running");
    void bar.offsetWidth; // trigger reflow restart CSS animation
    bar.classList.add("running");
  }

  geoTimer = setInterval(() => {
    nextGeo(false);
  }, DURATION_MS);
}

function tampilkanGeo(idx) {
  const geo = GEOMETRI[idx];
  if (!geo) return;

  const img = document.getElementById("geo-focus-img");
  const label = document.getElementById("geo-focus-label");
  const card = document.getElementById("geo-focus-card");
  const statusEl = document.getElementById("geo-focus-status");

  if (img) {
    img.classList.remove("zoom-in");
    void img.offsetWidth; // trigger reflow restart zoom-in animation
    img.src = geo.img;
    img.alt = geo.label;
    img.classList.add("zoom-in");
  }

  if (label) {
    label.classList.remove("zoom-in");
    void label.offsetWidth;
    label.textContent = geo.label;
    label.classList.add("zoom-in");
  }

  // Update visual jika simbol ini adalah yang sedang dipilih
  const isSelected = geoTerpilih === geo.id;
  if (card) {
    card.classList.toggle("is-selected", isSelected);
  }

  if (statusEl) {
    if (isSelected) {
      statusEl.innerHTML = `<span class="status-selected">✓ Simbol Ini Telah Anda Pilih</span>`;
    } else {
      statusEl.innerHTML = `<span class="status-hint">👆 Klik simbol ini jika cocok dengan Anda</span>`;
    }
  }

  // Update dots active & chosen indicator
  const dots = document.querySelectorAll(".geo-dot");
  dots.forEach((d, i) => {
    d.classList.toggle("active", i === idx);
    d.classList.toggle("chosen", GEOMETRI[i].id === geoTerpilih);
  });
}

function pilihGeoCurrent() {
  const geo = GEOMETRI[currentGeoIdx];
  if (!geo) return;

  geoTerpilih = geo.id;

  // Render visual update
  tampilkanGeo(currentGeoIdx);

  const summary = document.getElementById("geo-choice-summary");
  const summaryText = document.getElementById("geo-choice-text");
  if (summary && summaryText) {
    summary.style.display = "flex";
    summaryText.textContent = `Simbol Terpilih: ${geo.label}`;
    summary.classList.remove("badge-pop");
    void summary.offsetWidth;
    summary.classList.add("badge-pop");
  }

  showToast(`✨ Anda memilih simbol: ${geo.label}`);
}

function nextGeo(manual = true) {
  currentGeoIdx = (currentGeoIdx + 1) % GEOMETRI.length;
  tampilkanGeo(currentGeoIdx);
  if (manual) startGeoTimer();
}

function prevGeo(manual = true) {
  currentGeoIdx = (currentGeoIdx - 1 + GEOMETRI.length) % GEOMETRI.length;
  tampilkanGeo(currentGeoIdx);
  if (manual) startGeoTimer();
}

// ─── Interaksi Jawaban ────────────────────────────────────────────────────────
function pilihJawaban(no, val) {
  jawaban[no] = val;

  // Update tombol visual
  ["Setuju", "Ragu-ragu", "Tidak Setuju"].forEach((v) => {
    const idVal = v.toLowerCase().replace(" ", "-");
    const btn = document.getElementById(`btn-${no}-${idVal}`);
    if (v === val) {
      btn.classList.add("selected");
      btn.setAttribute("aria-pressed", "true");
    } else {
      btn.classList.remove("selected");
      btn.setAttribute("aria-pressed", "false");
    }
  });

  // Update item border
  const item = document.getElementById(`q-item-${no}`);
  item.classList.add("answered");

  updateProgress();
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function updateProgress() {
  const total    = SOAL.length;
  const dijawab  = Object.keys(jawaban).length;
  const pct      = (dijawab / total) * 100;

  document.getElementById("progress-fill").style.width = `${pct}%`;
  document.getElementById("progress-label").textContent =
    `${dijawab} / ${total} dijawab`;
}

// ─── Hitung Hasil ─────────────────────────────────────────────────────────────
function hitungHasil() {
  let poinE = 0;
  let poinI = 0;

  SOAL.forEach((soal) => {
    const j = jawaban[soal.no];
    if (j === "Setuju") {
      if (soal.kunci === "E") poinE++;
      else poinI++;
    } else if (j === "Tidak Setuju") {
      if (soal.kunci === "E") poinI++;
      else poinE++;
    }
    // "Ragu-ragu" tidak menambah poin ke manapun (0 poin)
  });

  let tipe;
  if (poinE > poinI)       tipe = "Ekstrovert";
  else if (poinI > poinE)  tipe = "Introvert";
  else                     tipe = "Ambivert";

  return { poinE, poinI, tipe };
}

// ─── Submit ───────────────────────────────────────────────────────────────────
async function submitKuesioner() {
  // Validasi data responden
  const nama  = document.getElementById("input-nama").value.trim();
  const nim   = document.getElementById("input-nim").value.trim();
  const email = document.getElementById("input-email").value.trim();

  if (!nama) {
    showToast("⚠️ Mohon isi nama lengkap Anda terlebih dahulu.");
    document.getElementById("input-nama").focus();
    return;
  }
  if (!nim) {
    showToast("⚠️ Mohon isi NIM Anda terlebih dahulu.");
    document.getElementById("input-nim").focus();
    return;
  }
  if (!email || !email.includes("@")) {
    showToast("⚠️ Mohon isi email aktif yang valid.");
    document.getElementById("input-email").focus();
    return;
  }

  // Validasi soal
  if (Object.keys(jawaban).length < SOAL.length) {
    const belum = SOAL.length - Object.keys(jawaban).length;
    showToast(`⚠️ Masih ada ${belum} pertanyaan yang belum dijawab.`);
    // Scroll ke soal pertama yang belum dijawab
    const belumNo = SOAL.find((s) => !jawaban[s.no])?.no;
    document.getElementById(`q-item-${belumNo}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Validasi geometri
  if (!geoTerpilih) {
    showToast("⚠️ Mohon pilih simbol geometri yang mencerminkan diri Anda.");
    document.getElementById("card-geometri").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const { poinE, poinI, tipe } = hitungHasil();
  const geoData = GEOMETRI.find((g) => g.id === geoTerpilih);

  const payload = {
    nama,
    nim,
    email,
    jawaban: SOAL.map((s) => ({ no: s.no, pertanyaan: s.teks, jawaban: jawaban[s.no] || "Tidak dijawab", kunci: s.kunci })),
    geometri: geoData.label,
    poin_ekstrovert: poinE,
    poin_introvert: poinI,
    tipe,
    karakteristik_geometri: geoData.deskripsi,
  };

  // Tampilkan loading
  const btnText   = document.querySelector(".btn-text");
  const btnLoader = document.querySelector(".btn-loader");
  const btnSubmit = document.getElementById("btn-submit");
  btnText.classList.add("hidden");
  btnLoader.classList.remove("hidden");
  btnSubmit.disabled = true;

  // Simpan hasil di sessionStorage untuk halaman hasil
  sessionStorage.setItem("hasilTest", JSON.stringify(payload));

  // Simpan ke Google Sheets (tunggu respon server sebelum pindah halaman)
  try {
    await fetch("/api/simpan", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
  } catch (e) {
    console.warn("Gagal menyimpan ke Google Sheets:", e);
  }

  window.location.href = "/hasil";
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById("toast-notif");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-notif";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3500);
}

// ─── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderSoal();
  initGeometriShowcase();
  updateProgress();
});
