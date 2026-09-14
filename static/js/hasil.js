/**
 * hasil.js – Logic Halaman Hasil Penilaian Diri STIFIn
 * Menampilkan:
 * 1. Duo Grid: Kemudi (Introvert/Extrovert) & Mesin Berpikir (Geometri) Bersebelahan
 * 2. Ulasan Menyeluruh 5 Aspek: Umum, Belajar, Profesi, Bisnis, & Rekan Bisnis Cocok
 * 3. Rekap Jawaban Kuesioner
 * 4. Chatbot Asisten Psikologi AI (RAG)
 */

// ─── Deskripsi Kemudi Kecerdasan ──────────────────────────────────────────────
const DESKRIPSI_KEMUDI = {
  Introvert: {
    icon: "🌙",
    tag: "Kemudi dari Dalam (Internal Drive)",
    narasi:
      "Kemudi kecerdasan Anda beroperasi dari lapisan dalam (lapisan putih/otak padat). " +
      "Energi dan motivasi Anda bersumber dari dalam diri (self-driven). Anda cenderung fokus, " +
      "mandiri, menyerap pengalaman secara mendalam, serta membutuhkan ketenangan internal " +
      "untuk menghasilkan karya terbaik.",
    lapisan: "Lapisan Putih (Bagian Dalam Otak)",
    karakter_kemudi: "Mandiri, ulet, fokus internal, tidak mudah terdistraksi lingkungan luar.",
  },
  Ekstrovert: {
    icon: "🌟",
    tag: "Kemudi dari Luar (External Drive)",
    narasi:
      "Kemudi kecerdasan Anda beroperasi dari lapisan luar (lapisan abu-abu/permukaan otak). " +
      "Energi Anda terpacu oleh stimulasi lingkungan, momentum sosial, dan tantangan nyata di luar. " +
      "Anda aktif, adaptif terhadap situasi sosial, senang berkolaborasi, dan cepat merespons peluang.",
    lapisan: "Lapisan Abu-Abu (Permukaan Otak)",
    karakter_kemudi: "Responsif, dinamis, terbuka pada peluang luar, termotivasi oleh apresiasi lingkungan.",
  },
  Ambivert: {
    icon: "⚖️",
    tag: "Kemudi Seimbang (Adaptive Balance)",
    narasi:
      "Skor introvert dan ekstrovert Anda seimbang. Anda memiliki kelenturan adaptasi ganda: " +
      "mampu bekerja mandiri dalam fokus mendalam (introvert) sekaligus lincah menjalin relasi " +
      "dan memanfaatkan peluang sosial (ekstrovert) sesuai tuntutan situasi.",
    lapisan: "Sintesis Lapisan Otak Fleksibel",
    karakter_kemudi: "Fleksibel, adaptif situasional, penyeimbang dinamika internal dan eksternal.",
  },
};

// ─── Metadata Mesin Berpikir Geometri ─────────────────────────────────────────
const MESIN_METADATA = {
  sensing: {
    nama: "Sensing (S)",
    singkat: "S",
    gambar: "sensing.png",
    otak: "Limbik Kiri (Otak Bawah Kiri)",
    kecerdasan: "MQ – Memory Quotient",
    badgeKecerdasan: "MQ",
    unsur: "Harta / Tanah",
    peran: "Pemain Lapangan & Eksekutor Volume",
  },
  thinking: {
    nama: "Thinking (T)",
    singkat: "T",
    gambar: "thinking.png",
    otak: "Otak Besar Kiri (Korteks Kiri)",
    kecerdasan: "TQ – Technical & Logical Quotient",
    badgeKecerdasan: "TQ",
    unsur: "Tahta / Api",
    peran: "Pakar Sistem, Analis & Manajer Pengendali",
  },
  intuiting: {
    nama: "Intuiting (I)",
    singkat: "I",
    gambar: "intuiting.png",
    otak: "Otak Besar Kanan (Korteks Kanan)",
    kecerdasan: "CQ – Creativity & Spatial Quotient",
    badgeKecerdasan: "CQ",
    unsur: "Kata / Gagasan / Angin",
    peran: "Konseptor Visioner & Inovator Disrupsi",
  },
  feeling: {
    nama: "Feeling (F)",
    singkat: "F",
    gambar: "feeling.png",
    otak: "Limbik Kanan (Otak Bawah Kanan)",
    kecerdasan: "EQ – Emotional & Social Quotient",
    badgeKecerdasan: "EQ",
    unsur: "Cinta / Air",
    peran: "Pemimpin Karismatik & Penggerak Komunitas",
  },
  instinct: {
    nama: "Instinct / Insting (In)",
    singkat: "In",
    gambar: "instinct.png",
    otak: "Otak Tengah (Midbrain / Reptilian Brain)",
    kecerdasan: "AQ – Altruist Quotient",
    badgeKecerdasan: "AQ",
    unsur: "Bahagia / Naluri & Refleks",
    peran: "Mediator Damai, Penolong Serba Bisa & Penjaga Harmoni",
  },
};

// ─── Database Komprehensif 9 Tipe STIFIn (Buku Farid Poniman) ────────────────
const STIFIN_KOMPREHENSIF = {
  // ── 1. Sensing Introvert (Si) ──
  Si: {
    kode: "Si",
    tipeLengkap: "Sensing Introvert (Si)",
    mesinKey: "sensing",
    ulasanUmum: `
      <p><strong>Sensing Introvert (Si)</strong> adalah pribadi yang berbasiskan kecerdasan panca indera yang dikemudikan dari dalam ke luar. Anda memiliki daya ingat fotografis dan detail yang sangat kuat, stamina fisik yang kokoh, dan ketekunan yang mengagumkan.</p>
      <p>Kekuatan terbesar Anda terletak pada kemampuan mereplikasi proses dengan presisi tinggi dan melipatgandakan volume hasil kerja secara konsisten. Anda bekerja paling nyaman dengan fakta nyata, data kronologis, dan langkah-langkah terstruktur.</p>
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">💎 DNA Keberhasilan: Harta (Tanah)</span>
          Menghasilkan kekayaan nyata melalui kepiawaian memperbesar kuantitas, disiplin menabung, dan manajemen aset fisik.
        </div>
        <div class="point-card point-amber">
          <span class="point-card-title">⚠️ Hal Perlu Diwaspadai:</span>
          Cenderung mudah cemas jika rencana meleset, sensitif terhadap detail kecil (bisa terjebak menjadi bawel/micro-managing), dan memerlukan lawan tanding (sparring partner) nyata agar motivasinya terus menyala.
        </div>
      </div>
    `,
    caraBelajar: `
      <p>Pola belajar terbaik bagi tipe Si adalah <strong>belajar sambil bergerak (kinestetik)</strong> dan <strong>pengulangan (repetisi latihan soal)</strong>.</p>
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">📖 Metode & Media Belajar:</span>
          Gunakan alat peraga fisik, tabel data konkret, rekaman hafalan, dan perbanyak drilling latihan soal secara teratur.
        </div>
        <div class="point-card point-emerald">
          <span class="point-card-title">🎯 Kunci Pendorong Motivasi:</span>
          Hadirkan <em>sparring partner</em> nyata (teman sebaya atau pesaing sehat). Tipe Si tidak mempan dengan pesaing imajiner—harus ada tarikan kompetisi nyata di depan mata.
        </div>
        <div class="point-card">
          <span class="point-card-title">🏢 Lingkungan Optimal:</span>
          Ruang belajar yang rapi, teratur, terjadwal pasti, dan bebas dari distraksi teori-teori abstrak yang bertele-tele.
        </div>
      </div>
    `,
    profesi: `
      <p>Tipe Si sangat unggul dalam profesi yang mengandalkan daya ingat presisi, ketelitian data, stamina fisik prima, dan kehadiran di panggung/lapangan langsung:</p>
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">🏥 Medis & Klinis:</span>
          Dokter spesialis bedah/klinisi, apoteker, teknisi laboratorium medis, radiolog.
        </div>
        <div class="point-card">
          <span class="point-card-title">📊 Keuangan & Administrasi:</span>
          Bankir, akuntan audit, bendahara, staf kepatuhan (compliance), birokrat terstandar.
        </div>
        <div class="point-card">
          <span class="point-card-title">🏃 Lapangan & Ketangkasan:</span>
          Atlit kompetisi, pelatih olahraga fisik, polisi, perwira militer, inspektur lapangan, reporter jurnalis berita kronologis.
        </div>
      </div>
    `,
    usahaBisnis: `
      <p>Model bisnis ideal bagi tipe Si adalah bisnis yang <strong>berbasis perputaran omzet cepat, volume masif, dan barang berwujud (tangible goods)</strong>:</p>
      <div class="point-grid">
        <div class="point-card point-emerald">
          <span class="point-card-title">🚀 Sektor Bisnis Unggulan:</span>
          Retail kebutuhan pokok (FMCG), franchise makanan/minuman (F&B), logistik & transportasi armada, agrobisnis/perkebunan, properti komersial sewa.
        </div>
        <div class="point-card">
          <span class="point-card-title">📈 Peran Kunci Wirausaha:</span>
          Sebagai <em>Chief Operating Officer (COO)</em> atau Penguasa Operasional Lapangan. Si piawai mengontrol stok barang, menjaga kualitas harian, dan memastikan target kuantitas penjualan harian tercapai.
        </div>
      </div>
    `,
    rekanBisnis: `
      <p>Berdasarkan sirkulasi hubungan STIFIn, tipe Si memerlukan mitra yang melengkapi kelemahan dalam perencanaan strategis abstrak dan perancangan sistem:</p>
      <div class="mitra-box-grid">
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Thinking (T)</span>
            <span class="mitra-status-tag">Mitra Sinergi Utama</span>
          </div>
          <p class="mitra-desc">Thinking membangun SOP, perhitungan cash flow, struktur legalitas, dan sistem otomasi korporasi, sementara Si fokus mengeksekusi operasional dan omzet lapangan.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: T merancang sistem, Si melipatgandakan hasil.</div>
        </div>
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Intuiting (I)</span>
            <span class="mitra-status-tag">Pemasok Inovasi</span>
          </div>
          <p class="mitra-desc">Intuiting memasok ide produk baru, diferensiasi merek, dan visi masa depan. Si berperan membumikan ide tersebut menjadi produk nyata yang laku keras di pasar.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: I mendesain konsep, Si memproduksi & mendistribusikan.</div>
        </div>
      </div>
    `,
  },

  // ── 2. Sensing Extrovert (Se) ──
  Se: {
    kode: "Se",
    tipeLengkap: "Sensing Extrovert (Se)",
    mesinKey: "sensing",
    ulasanUmum: `
      <p><strong>Sensing Extrovert (Se)</strong> adalah pribadi berbasis panca indera yang dikemudikan dari luar ke dalam. Anda memiliki ketahanan fisik (PQ – Physical Quotient) yang luar biasa, gesit menangkap peluang ekonomi, dan pandai menjalin relasi transaksional.</p>
      <p>Sosok Se dikenal sebagai <em>penangkap momentum</em>. Di mana ada peluang bisnis yang menghasilkan pendapatan langsung, di situlah Anda bergerak cepat. Anda sangat royal dan dermawan saat berhasil, yang pada gilirannya membuka jaringan bisnis semakin luas.</p>
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">💎 DNA Keberhasilan: Peluang Bisnis (Momentum Income)</span>
          Keberanian mencoba langsung, memanfaatkan peluang pasar tercepat, dan menjadi jaminan sukses pelaksanaan proyek kerja sama.
        </div>
        <div class="point-card point-amber">
          <span class="point-card-title">⚠️ Hal Perlu Diwaspadai:</span>
          Bisa bersikap terlalu oportunistik atau melompat-lompat dari satu proyek ke proyek lain sebelum proyek sebelumnya tuntas matang.
        </div>
      </div>
    `,
    caraBelajar: `
      <p>Proses belajar terbaik bagi Se adalah <strong>mencoba langsung (learning by doing)</strong> dan visualisasi nyata:</p>
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">📖 Metode & Media Belajar:</span>
          Studi tur lapangan, video simulasi praktis, bedah studi kasus nyata, dan insentif hadiah langsung atas capaian nilai.
        </div>
        <div class="point-card point-emerald">
          <span class="point-card-title">🎯 Kunci Pendorong Motivasi:</span>
          Adanya target hadiah (reward) berwujud nyata atau prospek manfaat ekonomi yang jelas dari ilmu yang dipelajarinya.
        </div>
      </div>
    `,
    profesi: `
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">🏢 Sales & Kemitraan Komersial:</span>
          Direktur penjualan (Head of Sales), agen real estate, broker komoditas, manajer akuisisi merchant.
        </div>
        <div class="point-card">
          <span class="point-card-title">✈️ Pariwisata & Hospitality:</span>
          Manajer perhotelan, pemandu ekspedisi wisata, perencana event festival, konsultan perjalanan.
        </div>
        <div class="point-card">
          <span class="point-card-title">🍳 Kuliner & Gaya Hidup:</span>
          Executive chef, pengusaha resto/cafe trendy, atlet kompetisi profesional.
        </div>
      </div>
    `,
    usahaBisnis: `
      <div class="point-grid">
        <div class="point-card point-emerald">
          <span class="point-card-title">🚀 Sektor Bisnis Unggulan:</span>
          Trading & perdagangan umum, bisnis kuliner cepat saji, perhotelan/guest house, rental kendaraan/alat berat, event production.
        </div>
        <div class="point-card">
          <span class="point-card-title">📈 Peran Kunci Wirausaha:</span>
          Penggerak pasar & deal-maker. Se piawai menegosiasikan kontrak dagang dan mengunci kesepakatan kerjasama komersial.
        </div>
      </div>
    `,
    rekanBisnis: `
      <div class="mitra-box-grid">
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Thinking (T)</span>
            <span class="mitra-status-tag">Pengendali Keuangan</span>
          </div>
          <p class="mitra-desc">Thinking menjaga agar Se tidak berspekulasi berlebihan, menghitung margin profit secara presisi, dan menjaga pembukuan kas tetap sehat.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: Se membawa deal & omzet, T mengunci profit & audit.</div>
        </div>
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Feeling (F)</span>
            <span class="mitra-status-tag">Pengikat Relasi</span>
          </div>
          <p class="mitra-desc">Feeling merawat hubungan jangka panjang dengan klien besar sehingga peluang yang dibuka Se berubah menjadi loyalitas pelanggan seumur hidup.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: Se membuka pintu peluang, F merawat kesetiaan mitra.</div>
        </div>
      </div>
    `,
  },

  // ── 3. Thinking Introvert (Ti) ──
  Ti: {
    kode: "Ti",
    tipeLengkap: "Thinking Introvert (Ti)",
    mesinKey: "thinking",
    ulasanUmum: `
      <p><strong>Thinking Introvert (Ti)</strong> adalah kepribadian berbasis logika tajam yang dikemudikan dari dalam ke luar. Otak kiri Anda bekerja mendalam untuk menuntaskan problem rumit, merancang arsitektur sistem, dan menganalisis sebab-akibat secara komprehensif.</p>
      <p>Anda dikenal bertangan dingin: rasional, mandiri, objektif, dan memiliki keahlian mendalam (expertise) yang diakui luas. Anda menghargai kebenaran data di atas opini emosional.</p>
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">💎 DNA Keberhasilan: Tahta (Pakar & Manajemen)</span>
          Kekuasaan dan kemandirian finansial diraih melalui kepakaran spesifik yang sulit digantikan oleh orang lain.
        </div>
        <div class="point-card point-amber">
          <span class="point-card-title">⚠️ Hal Perlu Diwaspadai:</span>
          Cenderung dingin atau kaku dalam komunikasi antar-pribadi, perfeksionis pada kalkulasi logis, dan enggan mendelegasikan tugas jika merasa orang lain kurang kompeten.
        </div>
      </div>
    `,
    caraBelajar: `
      <p>Pola belajar terbaik bagi Ti adalah <strong>belajar mandiri secara konseptual dan logis</strong>:</p>
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">📖 Metode & Media Belajar:</span>
          Membaca literatur mendalam, menyusun diagram alur (flowchart), menganalisis skema sebab-akibat, dan menyelesaikan simulasi pemrograman atau hitungan kuantitatif.
        </div>
        <div class="point-card point-emerald">
          <span class="point-card-title">🎯 Kunci Pendorong Motivasi:</span>
          Tantangan intelektual yang memicu rasa penasaran, serta pengakuan (recognisi) atas kepakarannya dari figur ahli yang dihormatinya.
        </div>
        <div class="point-card">
          <span class="point-card-title">🏢 Lingkungan Optimal:</span>
          Ruangan hening, minim gangguan sosial, di mana Ti dapat berkonsentrasi penuh berpikir keras secara mendalam.
        </div>
      </div>
    `,
    profesi: `
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">💻 Teknologi & Rekayasa:</span>
          Software engineer, software architect, data scientist, insinyur teknik rekayasa mesin/elektro, spesialis keamanan siber.
        </div>
        <div class="point-card">
          <span class="point-card-title">📈 Riset & Analisis:</span>
          Peneliti sains terapan, analis sistem, konsultan manajemen strategis, analis kebijakan publik.
        </div>
        <div class="point-card">
          <span class="point-card-title">⚖️ Tata Kelola & Hukum:</span>
          Auditor keuangan/forensik, konsultan pajak terdaftar, hakim, ahli tata kelola korporasi.
        </div>
      </div>
    `,
    usahaBisnis: `
      <div class="point-grid">
        <div class="point-card point-emerald">
          <span class="point-card-title">🚀 Sektor Bisnis Unggulan:</span>
          Software house / SaaS IT, kantor konsultan manajemen & perpajakan, laboratorium riset presisi, manufaktur berbasis rekayasa teknologi tinggi, firma audit.
        </div>
        <div class="point-card">
          <span class="point-card-title">📈 Peran Kunci Wirausaha:</span>
          <em>Chief Technology Officer (CTO)</em> atau Perancang Sistem Utama. Ti menjamin keunggulan teknologi, efisiensi operasional berbasis data, dan standardisasi kualitas tingkat tinggi.
        </div>
      </div>
    `,
    rekanBisnis: `
      <div class="mitra-box-grid">
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Feeling (F)</span>
            <span class="mitra-status-tag">Mitra Komplementer Emas</span>
          </div>
          <p class="mitra-desc">Feeling adalah pasangan paling ideal bagi Thinking. Feeling menangani komunikasi, PR, pitching klien, dan manajemen kebahagiaan tim—bidang yang paling dihindari oleh Ti.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: Ti memimpin sistem & angka, F merajut hati manusia.</div>
        </div>
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Sensing (S)</span>
            <span class="mitra-status-tag">Eksekutor Penjualan</span>
          </div>
          <p class="mitra-desc">Sensing bekerja ulet di lapangan menjual produk dalam volume besar berdasarkan SOP dan platform canggih yang dirancang oleh Ti.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: Ti membangun mesin bisnis, Si tancap gas di jalanan.</div>
        </div>
      </div>
    `,
  },

  // ── 4. Thinking Extrovert (Te) ──
  Te: {
    kode: "Te",
    tipeLengkap: "Thinking Extrovert (Te)",
    mesinKey: "thinking",
    ulasanUmum: `
      <p><strong>Thinking Extrovert (Te)</strong> adalah pemimpin manajemen berbasis logika yang dikemudikan dari luar ke dalam. Anda memiliki kapasitas melipatgandakan otoritas, disiplin operasional, dan kepemimpinan korporasi yang tegas.</p>
      <p>Bagi Te, kekuasaan dan hasil nyata diukur dari efektivitas struktur organisasi. Anda sangat lihai mengoordinasikan sumber daya, mengevaluasi kinerja tim secara obyektif, dan memenangkan persaingan pasar.</p>
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">💎 DNA Keberhasilan: Tahta & Komando</span>
          Menguasai pasar melalui sistem birokrasi yang rapi, manajemen terstruktur, dan penegakan regulasi yang tegas.
        </div>
        <div class="point-card point-amber">
          <span class="point-card-title">⚠️ Hal Perlu Diwaspadai:</span>
          Gaya kepemimpinan yang dapat terkesan otoriter atau terlalu dominan, menuntut kepatuhan kaku tanpa mempertimbangkan suasana hati tim.
        </div>
      </div>
    `,
    caraBelajar: `
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">📖 Metode & Media Belajar:</span>
          Diskusi komparatif data, debat ilmiah rasional, bagan alur bertingkat, dan kurikulum yang memiliki jenjang peringkat kemenangan yang jelas.
        </div>
        <div class="point-card point-emerald">
          <span class="point-card-title">🎯 Kunci Pendorong Motivasi:</span>
          Target peringkat puncak, tantangan kepemimpinan kelas, dan kemenangan kompetisi akademik terukur.
        </div>
      </div>
    `,
    profesi: `
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">🏛️ Eksekutif Korporasi:</span>
          Chief Executive Officer (CEO), Chief Operating Officer (COO), direktur pelaksana, general manager pabrik.
        </div>
        <div class="point-card">
          <span class="point-card-title">⚖️ Birokrasi & Pertahanan:</span>
          Komandan militer, perwira birokrat pengambil kebijakan, jaksa penuntut umum, konsultan hukum korporat.
        </div>
        <div class="point-card">
          <span class="point-card-title">🏗️ Industri & Proyek Skala Besar:</span>
          Manajer proyek infrastruktur, direktur operasional industri manufaktur dan pertambangan.
        </div>
      </div>
    `,
    usahaBisnis: `
      <div class="point-grid">
        <div class="point-card point-emerald">
          <span class="point-card-title">🚀 Sektor Bisnis Unggulan:</span>
          Kontraktor konstruksi & infrastruktur, pabrik manufaktur skala menengah-besar, lembaga sertifikasi mutu, jaringan logistik terintegrasi.
        </div>
        <div class="point-card">
          <span class="point-card-title">📈 Peran Kunci Wirausaha:</span>
          Direktur Utama pengendali perusahaan. Te menetapkan target KPI, menegakkan disiplin kerja, dan memperluas skala korporasi secara terstruktur.
        </div>
      </div>
    `,
    rekanBisnis: `
      <div class="mitra-box-grid">
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Instinct (In) / Feeling (F)</span>
            <span class="mitra-status-tag">Peredam Ketegangan</span>
          </div>
          <p class="mitra-desc">Instinct atau Feeling memberikan kehangatan dan kenyamanan manusiawi bagi karyawan di bawah kepemimpinan Te yang sangat tegas dan berorientasi hasil.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: Te menjaga ketegasan target, In/F merawat keharmonisan tim.</div>
        </div>
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Intuiting (I)</span>
            <span class="mitra-status-tag">Arsitek Visi Masa Depan</span>
          </div>
          <p class="mitra-desc">Intuiting menyuntikkan ide produk masa depan dan diferensiasi kreatif, sementara Te mengeksekusinya menjadi korporasi yang menguntungkan.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: I melihat tren masa depan, Te memimpin penaklukan pasar.</div>
        </div>
      </div>
    `,
  },

  // ── 5. Intuiting Introvert (Ii) ──
  Ii: {
    kode: "Ii",
    tipeLengkap: "Intuiting Introvert (Ii)",
    mesinKey: "intuiting",
    ulasanUmum: `
      <p><strong>Intuiting Introvert (Ii)</strong> adalah pribadi pencipta ide murni dan penemu (inventor) yang dikemudikan dari dalam ke luar. Anda dianugerahi imajinasi spasial tanpa batas, daya cipta orisinil, dan kemampuan melihat gambaran masa depan jauh melampaui zaman sekarang.</p>
      <p>Anda hanya akan puas jika karya cipta Anda menghasilkan perubahan signifikan yang berkelas dan orisinil. Anda senang membedah filosofi dasar, teori abstrak, dan menemukan solusi yang belum pernah dipikirkan orang lain.</p>
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">💎 DNA Keberhasilan: Kata (Gagasan & Inovasi Murni)</span>
          Menghasilkan nilai ekonomi tinggi melalui hak kekayaan intelektual (paten/royalti), inovasi disrupsi, dan desain berkelas premium.
        </div>
        <div class="point-card point-amber">
          <span class="point-card-title">⚠️ Hal Perlu Diwaspadai:</span>
          Bisa terjebak dalam lorong waktu khayalan (*time tunnel*), ide melompat-lompat tanpa rem, dan enggan mengurus detail teknis administratif yang membosankan.
        </div>
      </div>
    `,
    caraBelajar: `
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">📖 Metode & Media Belajar:</span>
          Gunakan mind-mapping grafis, video animasi/film dokumenter inspiratif, ilustrasi visual konseptual, dan eksplorasi teori bebas tanpa kekangan hafalan kaku.
        </div>
        <div class="point-card point-emerald">
          <span class="point-card-title">🎯 Kunci Pendorong Motivasi:</span>
          Tantangan menciptakan masa depan yang lebih baik, apresiasi atas orisinalitas gagasannya, dan dosen/guru yang atraktif serta ekspresif.
        </div>
      </div>
    `,
    profesi: `
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">🎨 Desain & Arsitektur:</span>
          Arsitek lansekap/bangunan, desainer produk konseptual, sutradara film, art director, penulis fiksi/skenario.
        </div>
        <div class="point-card">
          <span class="point-card-title">💡 Penemuan & Sains Murni:</span>
          Inventor penemu teknologi, peneliti sains murni (fisika/bioteknologi teoretis), peramal tren bisnis (*futurist*).
        </div>
        <div class="point-card">
          <span class="point-card-title">🚀 Inovasi Digital:</span>
          Product visionary / founder startup teknologi disrupsi, perancang kurikulum masa depan.
        </div>
      </div>
    `,
    usahaBisnis: `
      <div class="point-grid">
        <div class="point-card point-emerald">
          <span class="point-card-title">🚀 Sektor Bisnis Unggulan:</span>
          Riset & Pengembangan (R&D Lab), creative agency, studio arsitektur & desain interior berkelas, startup produk inovasi paten, penerbitan konten kreatif.
        </div>
        <div class="point-card">
          <span class="point-card-title">📈 Peran Kunci Wirausaha:</span>
          <em>Chief Innovation Officer (CIO)</em> atau Visionary Founder. Ii fokus menemukan formula produk unik dan strategi diferensiasi yang membuat kompetitor tidak relevan.
        </div>
      </div>
    `,
    rekanBisnis: `
      <div class="mitra-box-grid">
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Thinking (T)</span>
            <span class="mitra-status-tag">Pembangun Model Bisnis</span>
          </div>
          <p class="mitra-desc">Thinking adalah mitra paling krusial bagi Ii. Thinking mengubah konsep liar Ii menjadi struktur kelayakan finansial, kontrak hukum, dan SOP operasional terukur.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: Ii menciptakan produk revolusioner, T membangun struktur bisnisnya.</div>
        </div>
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Sensing (S)</span>
            <span class="mitra-status-tag">Pabrikasi & Penjualan</span>
          </div>
          <p class="mitra-desc">Sensing mengambil alih pekerjaan produksi massal dan mendistribusikan karya cipta Ii ke ribuan toko dan konsumen di lapangan.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: Ii mendesain prototipe, S memproduksi & menjual secara massal.</div>
        </div>
      </div>
    `,
  },

  // ── 6. Intuiting Extrovert (Ie) ──
  Ie: {
    kode: "Ie",
    tipeLengkap: "Intuiting Extrovert (Ie)",
    mesinKey: "intuiting",
    ulasanUmum: `
      <p><strong>Intuiting Extrovert (Ie)</strong> adalah perakit bisnis masa depan dan pengusaha alami yang dikemudikan dari luar ke dalam. Anda memiliki kapasitas meramu berbagai ide terpisah menjadi peluang bisnis yang sangat bernilai komersial tinggi.</p>
      <p>Anda selalu berpikir beberapa langkah di depan tren pasar. Gaya komunikasi Anda memukau, penuh optimisme, dan mampu meyakinkan investor serta tim untuk mengejar mimpi-besar bersama Anda.</p>
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">💎 DNA Keberhasilan: Pengusaha Multibisnis (Assembling Ide)</span>
          Menciptakan kekayaan dengan merakit konsep-konsep baru, mendisrupsi pasar lama, dan mengekspansi lini bisnis masa depan.
        </div>
        <div class="point-card point-amber">
          <span class="point-card-title">⚠️ Hal Perlu Diwaspadai:</span>
          Bisa terlalu cepat bosan saat bisnis sudah stabil dan memasuki fase administrasi rutin, sehingga sering tergoda berpindah ke ide baru sebelum fondasi kokoh.
        </div>
      </div>
    `,
    caraBelajar: `
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">📖 Metode & Media Belajar:</span>
          Diskusi tren masa depan, eksplorasi video multimedia, simulasi kompetisi inovasi (hackathon/pitching), dan keterlibatan langsung dalam proyek kreatif.
        </div>
        <div class="point-card point-emerald">
          <span class="point-card-title">🎯 Kunci Pendorong Motivasi:</span>
          Prospek cerah masa depan dan kebebasan mengekspresikan ide tanpa birokrasi akademis yang mengekang.
        </div>
      </div>
    `,
    profesi: `
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">🚀 Kewirausahaan & Startup:</span>
          Founder serial entrepreneur, Chief Marketing Officer (CMO), perancang model bisnis, venture capitalist/angel investor.
        </div>
        <div class="point-card">
          <span class="point-card-title">🎬 Industri Kreatif & Media:</span>
          Produser film/musik, creative director biro iklan, event organizer akbar, desainer konsep tematik.
        </div>
      </div>
    `,
    usahaBisnis: `
      <div class="point-grid">
        <div class="point-card point-emerald">
          <span class="point-card-title">🚀 Sektor Bisnis Unggulan:</span>
          Digital marketing agency, startup teknologi platform, industri hiburan & perfilman, properti tematik/wisata edukatif, bisnis franchise konsep unik.
        </div>
        <div class="point-card">
          <span class="point-card-title">📈 Peran Kunci Wirausaha:</span>
          Chief Visionary & Fundraiser. Ie mahir mempresentasikan visi bisnis, menggalang pendanaan modal ventura, dan memimpin branding korporasi.
        </div>
      </div>
    `,
    rekanBisnis: `
      <div class="mitra-box-grid">
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Sensing (S)</span>
            <span class="mitra-status-tag">Pengontrol Realitas</span>
          </div>
          <p class="mitra-desc">Sensing menjadi jangkar operasional yang membumikan ide besar Ie, mengurus logistik, dan menjaga cashflow harian tetap disiplin.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: Ie menerbangkan visi ke langit, S menjaga fondasi di bumi.</div>
        </div>
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Thinking (T)</span>
            <span class="mitra-status-tag">Penjaga Legalitas & Struktur</span>
          </div>
          <p class="mitra-desc">Thinking mengunci perjanjian kerja sama, audit keuangan, dan kepatuhan hukum agar ekspansi agresif Ie tetap aman dan berkelanjutan.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: Ie mengekspansi pasar, T memperkuat benteng pertahanan bisnis.</div>
        </div>
      </div>
    `,
  },

  // ── 7. Feeling Introvert (Fi) ──
  Fi: {
    kode: "Fi",
    tipeLengkap: "Feeling Introvert (Fi)",
    mesinKey: "feeling",
    ulasanUmum: `
      <p><strong>Feeling Introvert (Fi)</strong> adalah pribadi berjiwa pemimpin karismatik berbasis getaran batin dan empati mendalam yang dikemudikan dari dalam ke luar. Anda memiliki kepekaan emosional tingkat tinggi dan ketulusan hati yang mampu menyentuh jiwa orang lain.</p>
      <p>Sosok Fi dikenal memiliki <em>daya magnetis kepemimpinan</em> alami. Orang lain rela mengikuti dan berkorban untuk Anda karena keteladanan, kebijaksanaan moral, dan rasa hormat yang Anda pancarkan.</p>
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">💎 DNA Keberhasilan: Cinta & Kharisma (Air)</span>
          Meraih sukses melalui kepemimpinan moral, membangun loyalitas komunitas militan, dan kemampuan menginspirasi orang banyak.
        </div>
        <div class="point-card point-amber">
          <span class="point-card-title">⚠️ Hal Perlu Diwaspadai:</span>
          Sangat dipengaruhi oleh suasana hati (mood), mudah tersinggung jika merasa tidak dihargai, dan terkadang enggan bersikap tegas karena tidak tega menyakiti orang lain.
        </div>
      </div>
    `,
    caraBelajar: `
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">📖 Metode & Media Belajar:</span>
          Belajar dalam atmosfer tenang, membaca diiringi musik lembut, dan berdiskusi dari hati ke hati dengan guru/dosen yang ia sukai dan hormati karakternya.
        </div>
        <div class="point-card point-emerald">
          <span class="point-card-title">🎯 Kunci Pendorong Motivasi:</span>
          Apresiasi personal, pelukan/sentuhan emosional yang tulus, dan keselarasan materi pelajaran dengan nilai-nilai kemanusiaan.
        </div>
      </div>
    `,
    profesi: `
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">🌱 Pengembangan Diri & Konseling:</span>
          Psikolog klinis, konselor keluarga, life coach, motivator pengembangan diri, pembina spiritual.
        </div>
        <div class="point-card">
          <span class="point-card-title">🤝 Kepemimpinan & Diplomasi:</span>
          Pemimpin organisasi sosial, diplomat perdamaian, pendidik karakter, direktur pengembangan talenta SDM (People & Culture).
        </div>
      </div>
    `,
    usahaBisnis: `
      <div class="point-grid">
        <div class="point-card point-emerald">
          <span class="point-card-title">🚀 Sektor Bisnis Unggulan:</span>
          Lembaga pelatihan & coaching leadership, institusi pendidikan alternatif/sekolah karakter, yayasan filantropi & kewirausahaan sosial (social enterprise), butik wellness & kesehatan mental.
        </div>
        <div class="point-card">
          <span class="point-card-title">📈 Peran Kunci Wirausaha:</span>
          Chief Culture Officer & Inspirator Brand. Fi membangun ikatan emosional yang tak tergoyahkan antara konsumen dengan brand perusahaan.
        </div>
      </div>
    `,
    rekanBisnis: `
      <div class="mitra-box-grid">
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Thinking (T)</span>
            <span class="mitra-status-tag">Rem Logika & Keuangan</span>
          </div>
          <p class="mitra-desc">Thinking bertindak sebagai pengingat objektif saat Fi terlalu baper atau kasihan dalam mengambil keputusan bisnis. T menjaga cashflow dan kalkulasi keuntungan.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: Fi mengumpulkan hati manusia, T mengamankan rasionalitas bisnis.</div>
        </div>
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Sensing (S)</span>
            <span class="mitra-status-tag">Pelaksana Administrasi</span>
          </div>
          <p class="mitra-desc">Sensing menangani ketepatan administrasi, penagihan piutang, dan rantai pasok agar program yang dipimpin Fi berjalan rapi tanpa celah operasional.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: Fi menginspirasi arah, S membereskan urusan lapangan.</div>
        </div>
      </div>
    `,
  },

  // ── 8. Feeling Extrovert (Fe) ──
  Fe: {
    kode: "Fe",
    tipeLengkap: "Feeling Extrovert (Fe)",
    mesinKey: "feeling",
    ulasanUmum: `
      <p><strong>Feeling Extrovert (Fe)</strong> adalah pemimpin massa dan komunikator sosial ulung yang dikemudikan dari luar ke dalam. Anda memiliki kemampuan persuasi verbal yang luar biasa, diplomatis, pandai mencairkan suasana, dan mudah menggerakkan ribuan orang untuk bersatu.</p>
      <p>Anda bersinar paling terang di tengah komunitas. Jaringan pertemanan Anda sangat luas dari berbagai kalangan, dan Anda memiliki insting alami untuk menengahi friksi sosial serta membangun koalisi besar.</p>
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">💎 DNA Keberhasilan: Pengaruh Sosial & Pemimpin Massa</span>
          Menghasilkan pengaruh dan rezeki besar melalui jejaring networking, public speaking, dan kemitraan kolaboratif lintas sektor.
        </div>
        <div class="point-card point-amber">
          <span class="point-card-title">⚠️ Hal Perlu Diwaspadai:</span>
          Bisa terlalu ingin menyenangkan semua pihak (*people pleaser*), mudah terpancing gosip atau dinamika politik kantor, dan terkadang menaruh rasa percaya terlalu cepat pada orang baru.
        </div>
      </div>
    `,
    caraBelajar: `
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">📖 Metode & Media Belajar:</span>
          Diskusi kelompok interaktif, presentasi di depan kelas, belajar bersama teman sebaya (*peer learning*), dan metode studi tanya jawab verbal.
        </div>
        <div class="point-card point-emerald">
          <span class="point-card-title">🎯 Kunci Pendorong Motivasi:</span>
          Pujian di depan publik, apresiasi dari lingkungan pergaulan, dan suasana belajar yang hangat penuh keakraban tanpa ketegangan dingin.
        </div>
      </div>
    `,
    profesi: `
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">🎙️ Komunikasi Publik & Media:</span>
          Public speaker, juru bicara (spokesperson), presenter TV/broadcaster, public relations (PR) director, konsultan kampanye publik.
        </div>
        <div class="point-card">
          <span class="point-card-title">🏛️ Politik & Diplomasi:</span>
          Politisi, diplomat kedutaan, negosiator kemitraan strategis, direktur hubungan antar-lembaga.
        </div>
      </div>
    `,
    usahaBisnis: `
      <div class="point-grid">
        <div class="point-card point-emerald">
          <span class="point-card-title">🚀 Sektor Bisnis Unggulan:</span>
          Agensi Public Relations & komunikasi krisis, Event Organizing skala akbar & konser, perusahaan hospitality & tourism, industri MICE (Meeting, Incentive, Convention, Exhibition).
        </div>
        <div class="point-card">
          <span class="point-card-title">📈 Peran Kunci Wirausaha:</span>
          Chief Relations Officer & Chief Partnership. Fe membuka jalan bagi kontrak-kontrak kerja sama strategis dengan instansi pemerintah, BUMN, dan korporasi raksasa.
        </div>
      </div>
    `,
    rekanBisnis: `
      <div class="mitra-box-grid">
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Thinking (T)</span>
            <span class="mitra-status-tag">Pengendali Kontrak & Audit</span>
          </div>
          <p class="mitra-desc">Thinking memastikan bahwa setiap janji kemitraan dan diplomasi yang disepakati Fe dituangkan dalam klausul kontrak hukum yang aman dan menguntungkan secara finansial.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: Fe membuka jaringan, T menyusun kontrak dan tata kelola.</div>
        </div>
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Instinct (In)</span>
            <span class="mitra-status-tag">Mitra Kerja Fleksibel</span>
          </div>
          <p class="mitra-desc">Instinct bergerak cepat mengatasi kebutuhan teknis dadakan di lapangan sehingga agenda acara dan program besar yang dipromosikan Fe berlangsung mulus.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: Fe menjaga panggung depan, In mengamankan dapur operasional.</div>
        </div>
      </div>
    `,
  },

  // ── 9. Instinct (In) ──
  In: {
    kode: "In",
    tipeLengkap: "Instinct / Insting (In)",
    mesinKey: "instinct",
    ulasanUmum: `
      <p><strong>Instinct (In)</strong> adalah tipe kepribadian berbasis naluri alami (indera ketujuh) yang dikendalikan oleh otak tengah (midbrain). Tipe ini tidak memiliki kemudi introvert atau ekstrovert karena sifatnya yang serba bisa, spontan, dan adaptif di segala situasi.</p>
      <p>Anda adalah pribadi yang rela berkorban (altruis), berpikiran serba bisa (generalis), memiliki refleks fisik dan reaksi naluriah yang sangat cepat, serta terpanggil menjaga keharmonisan dan kedamaian lingkungan di sekitar Anda.</p>
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">💎 DNA Keberhasilan: Bahagia & Pengorbanan Tulus (Naluri)</span>
          Orang In calon orang paling bahagia bila hidupnya banyak memberi manfaat, menolong sesama, dan menjaga perdamaian tanpa pamrih berlebihan.
        </div>
        <div class="point-card point-amber">
          <span class="point-card-title">⚠️ Hal Perlu Diwaspadai:</span>
          Terkadang ragu-ragu dalam mengambil keputusan spesifik, mudah sungkan meminta hak/tagihan pembayaran, dan generalis yang berisiko serba tanggung jika tidak fokus.
        </div>
      </div>
    `,
    caraBelajar: `
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">📖 Metode & Media Belajar:</span>
          Gunakan <strong>pola belajar deduktif</strong> (pahami dulu kesimpulan atau intisari besarnya, baru kemudian menguraikan detail rantingnya).
        </div>
        <div class="point-card point-emerald">
          <span class="point-card-title">🎯 Kunci Pendorong Motivasi:</span>
          Suasana hening dan damai (tidak bising), diselingi musik relaksasi instrumental, dan waktu istirahat sejenak untuk menenangkan naluri batinnya.
        </div>
      </div>
    `,
    profesi: `
      <div class="point-grid">
        <div class="point-card">
          <span class="point-card-title">🕊️ Mediasi & Perdamaian:</span>
          Juru runding damai, mediator konflik bisnis/hukum, konsultan hubungan industrial, koordinator kemanusiaan/relawan bencana.
        </div>
        <div class="point-card">
          <span class="point-card-title">⚡ Tanggap Darurat & Generalis:</span>
          Manajer krisis, jurnalis investigasi tanggap cepat, koordinator operasional lintas divisi, manajer General Affair (GA).
        </div>
      </div>
    `,
    usahaBisnis: `
      <div class="point-grid">
        <div class="point-card point-emerald">
          <span class="point-card-title">🚀 Sektor Bisnis Unggulan:</span>
          Jasa mediasi & kompromi bisnis, penyedia layanan satu pintu (one-stop business service), penanganan darurat & pemulihan bisnis, industri kuliner/seni tradisional, usaha sosial kemasyarakatan.
        </div>
        <div class="point-card">
          <span class="point-card-title">📈 Peran Kunci Wirausaha:</span>
          Chief Harmony & Operational Support. In menjamin bisnis berjalan damai, menyelesaikan kebuntuan internal, dan menjaga kepuasan mitra kerja.
        </div>
      </div>
    `,
    rekanBisnis: `
      <div class="mitra-box-grid">
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Thinking (T) / Sensing (S)</span>
            <span class="mitra-status-tag">Pemandu Target Laba</span>
          </div>
          <p class="mitra-desc">Thinking atau Sensing membantu Insting untuk tetap tegas mematok harga jasa dan mengejar keuntungan komersial, sehingga kebaikan hati Insting tidak dimanfaatkan secara sepihak.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: T/S mengunci target keuntungan, In memastikan kepuasan & kelancaran pelayanan.</div>
        </div>
        <div class="mitra-box">
          <div class="mitra-box-header">
            <span class="mitra-nama">Intuiting (I) / Feeling (F)</span>
            <span class="mitra-status-tag">Pemberi Arah Visi</span>
          </div>
          <p class="mitra-desc">Intuiting dan Feeling memberikan arahan gagasan mulia yang membuat energi pengabdian dan serba-bisa milik Insting tersalurkan secara terarah.</p>
          <div class="mitra-kunci-sinergi">Kunci Sinergi: I/F menyalakan visi, In mengeksekusi dengan kesetiaan dan kelenturan tinggi.</div>
        </div>
      </div>
    `,
  },
};

// ─── Helper Ambivert Sintesis ────────────────────────────────────────────────
function dapatkanDataProfil(mesinKey, kemudiTipe) {
  if (mesinKey === "instinct") {
    return STIFIN_KOMPREHENSIF["In"];
  }

  const hurufAwal = mesinKey.charAt(0).toUpperCase(); // S, T, I, F
  if (kemudiTipe === "Introvert") {
    const key = hurufAwal + "i";
    return STIFIN_KOMPREHENSIF[key] || STIFIN_KOMPREHENSIF["Si"];
  } else if (kemudiTipe === "Ekstrovert") {
    const key = hurufAwal + "e";
    return STIFIN_KOMPREHENSIF[key] || STIFIN_KOMPREHENSIF["Se"];
  }

  // Jika Ambivert (keseimbangan Introvert & Ekstrovert): gabungkan kedua dimensi
  const keyI = hurufAwal + "i";
  const keyE = hurufAwal + "e";
  const dI = STIFIN_KOMPREHENSIF[keyI] || {};
  const dE = STIFIN_KOMPREHENSIF[keyE] || {};

  return {
    kode: hurufAwal + "-Ambi",
    tipeLengkap: `${MESIN_METADATA[mesinKey].nama} Ambivert (${hurufAwal}a)`,
    mesinKey: mesinKey,
    ulasanUmum: `
      <p>Anda memiliki mesin berpikir <strong>${MESIN_METADATA[mesinKey].nama}</strong> dengan kemudi <strong>Ambivert</strong> (keseimbangan seimbang antara dorongan internal dan eksternal).</p>
      <p>Anda memiliki fleksibilitas strategis: saat diperlukan perenungan dan fokus mendalam, Anda dapat mengaktifkan mode introvert (${hurufAwal}i). Saat dibutuhkan gerak cepat, sosialisasi, dan penangkapan momentum di lapangan, Anda dapat beralih ke mode ekstrovert (${hurufAwal}e).</p>
      <div class="point-grid">
        <div class="point-card point-emerald">
          <span class="point-card-title">⚖️ Keunggulan Ambivert:</span>
          Mampu menjadi jembatan antara perencana mendalam dan eksekutor lapangan. Fleksibilitas ini membuat Anda mandiri sekaligus kolaboratif.
        </div>
      </div>
    `,
    caraBelajar: `
      <p>Kombinasi terbaik antara belajar mandiri terfokus dan diskusi interaktif:</p>
      ${dI.caraBelajar || ""}
    `,
    profesi: dI.profesi || dE.profesi || "",
    usahaBisnis: dE.usahaBisnis || dI.usahaBisnis || "",
    rekanBisnis: dI.rekanBisnis || dE.rekanBisnis || "",
  };
}

// ─── Init Halaman Hasil ───────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const raw = sessionStorage.getItem("hasilTest");
  if (!raw) {
    window.location.href = "/";
    return;
  }

  const data = JSON.parse(raw);
  tampilkanHasil(data);
  tampilkanRekap(data.jawaban || []);
});

// ─── Render Hasil Utama & Ulasan Menyeluruh ───────────────────────────────────
function tampilkanHasil(data) {
  const { nama, tipe, poin_ekstrovert: pE = 0, poin_introvert: pI = 0, geometri } = data;

  const geoKey = (geometri || "sensing").toLowerCase();
  const mesinMeta = MESIN_METADATA[geoKey] || MESIN_METADATA.sensing;
  const kemudiInfo = DESKRIPSI_KEMUDI[tipe] || DESKRIPSI_KEMUDI.Ambivert;

  // Profil komprehensif STIFIn
  const profil = dapatkanDataProfil(geoKey, tipe);

  // 1. Header Card
  const headerBadge = document.getElementById("header-tipe-singkat");
  if (headerBadge) headerBadge.textContent = profil.kode;

  const namaEl = document.getElementById("hasil-nama");
  if (namaEl) namaEl.textContent = `Halo, ${nama || "Responden"}!`;

  const identitasEl = document.getElementById("hasil-identitas");
  if (identitasEl) {
    const nimStr = data.nim ? `NIM: ${data.nim}` : "";
    const emailStr = data.email ? `Email: ${data.email}` : "";
    identitasEl.textContent = [nimStr, emailStr].filter(Boolean).join(" • ");
  }

  const tipeGabunganEl = document.getElementById("hasil-tipe-gabungan");
  if (tipeGabunganEl) tipeGabunganEl.textContent = profil.tipeLengkap;

  // 2. Kartu Kiri: Kemudi Introvert / Ekstrovert
  const iconEl = document.getElementById("hasil-icon");
  if (iconEl) iconEl.textContent = kemudiInfo.icon;

  const hasilTipeEl = document.getElementById("hasil-tipe");
  if (hasilTipeEl) hasilTipeEl.textContent = tipe;

  const hasilDescEl = document.getElementById("hasil-deskripsi");
  if (hasilDescEl) hasilDescEl.textContent = kemudiInfo.narasi;

  const barI = document.getElementById("bar-i");
  const barE = document.getElementById("bar-e");
  const numI = document.getElementById("num-i");
  const numE = document.getElementById("num-e");

  if (barI) barI.style.width = `${(pI / 10) * 100}%`;
  if (barE) barE.style.width = `${(pE / 10) * 100}%`;
  if (numI) numI.textContent = `${pI} Poin`;
  if (numE) numE.textContent = `${pE} Poin`;

  const kemudiTambahanEl = document.getElementById("kemudi-tambahan");
  if (kemudiTambahanEl) {
    kemudiTambahanEl.innerHTML = `<strong>Sistem Lapisan:</strong> ${kemudiInfo.lapisan}<br><em>${kemudiInfo.karakter_kemudi}</em>`;
  }

  // 3. Kartu Kanan: Mesin Berpikir (Geometri)
  const geoImg = document.getElementById("geo-result-img");
  if (geoImg) {
    geoImg.src = `/static/images/${mesinMeta.gambar}`;
    geoImg.alt = mesinMeta.nama;
  }

  const geoBadge = document.getElementById("geo-mini-badge");
  if (geoBadge) geoBadge.textContent = mesinMeta.badgeKecerdasan;

  const geoLabel = document.getElementById("geo-result-label");
  if (geoLabel) geoLabel.textContent = mesinMeta.nama;

  const geoDesc = document.getElementById("geo-result-desc");
  if (geoDesc) geoDesc.textContent = mesinMeta.kecerdasan;

  const attrOtak = document.getElementById("attr-otak");
  if (attrOtak) attrOtak.textContent = mesinMeta.otak;

  const attrKec = document.getElementById("attr-kecerdasan");
  if (attrKec) attrKec.textContent = mesinMeta.kecerdasan;

  const attrUnsur = document.getElementById("attr-unsur");
  if (attrUnsur) attrUnsur.textContent = mesinMeta.unsur;

  const attrPeran = document.getElementById("attr-peran");
  if (attrPeran) attrPeran.textContent = mesinMeta.peran;

  // 4. Bagian Ulasan Menyeluruh (5 Modul)
  const umumEl = document.getElementById("ulasan-umum-content");
  if (umumEl) umumEl.innerHTML = profil.ulasanUmum || "";

  const belajarEl = document.getElementById("ulasan-belajar-content");
  if (belajarEl) belajarEl.innerHTML = profil.caraBelajar || "";

  const profesiEl = document.getElementById("ulasan-profesi-content");
  if (profesiEl) profesiEl.innerHTML = profil.profesi || "";

  const bisnisEl = document.getElementById("ulasan-bisnis-content");
  if (bisnisEl) bisnisEl.innerHTML = profil.usahaBisnis || "";

  const rekanEl = document.getElementById("ulasan-rekan-content");
  if (rekanEl) rekanEl.innerHTML = profil.rekanBisnis || "";

  // Animasi fade in
  const headerSection = document.getElementById("section-header");
  if (headerSection) headerSection.classList.add("fade-in");
}

// ─── Rekap Jawaban ────────────────────────────────────────────────────────────
function tampilkanRekap(jawabanArr) {
  const list = document.getElementById("rekap-list");
  if (!list) return;
  list.innerHTML = "";

  if (!jawabanArr || jawabanArr.length === 0) {
    list.innerHTML = `<p class="section-desc">Tidak ada data rekap jawaban.</p>`;
    return;
  }

  jawabanArr.forEach((item) => {
    const isIntrovertSoal = item.kunci === "I";
    const indikator = item.kunci || (isIntrovertSoal ? "I" : "E");
    const labelIndikator = isIntrovertSoal ? "Introvert" : "Ekstrovert";

    let iconText = "";
    let cssClass = "";
    const jwb = item.jawaban;

    if (jwb === "Setuju") {
      iconText = "✓ Setuju";
      cssClass = "jwb-benar";
    } else if (jwb === "Tidak Setuju") {
      iconText = "✗ Tidak Setuju";
      cssClass = "jwb-salah";
    } else {
      iconText = "○ Ragu-ragu";
      cssClass = "jwb-ragu";
    }

    const row = document.createElement("div");
    row.className = "rekap-row";
    row.innerHTML = `
      <div class="rekap-no">${item.no}</div>
      <div class="rekap-text">${item.pertanyaan}</div>
      <div class="rekap-tag tag-${indikator.toLowerCase()}">${labelIndikator}</div>
      <div class="rekap-jawaban ${cssClass}">
        ${iconText}
      </div>`;
    list.appendChild(row);
  });
}

// ─── Chatbot RAG ──────────────────────────────────────────────────────────────
function handleChatKey(e) {
  if (e.key === "Enter") kirimChat();
}

async function kirimChat() {
  const input = document.getElementById("chat-input");
  const win = document.getElementById("chat-window");
  if (!input || !win) return;

  const pertanyaan = input.value.trim();
  if (!pertanyaan) return;

  appendBubble(win, pertanyaan, "user");
  input.value = "";
  input.disabled = true;
  const btnSend = document.getElementById("btn-send");
  if (btnSend) btnSend.disabled = true;

  const loadingId = "bubble-loading-" + Date.now();
  appendBubble(win, "⏳ Asisten sedang menganalisis buku referensi STIFIn…", "bot loading", loadingId);
  win.scrollTop = win.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pertanyaan }),
    });
    const json = await res.json();

    document.getElementById(loadingId)?.remove();
    appendBubble(win, json.jawaban || "Maaf, belum dapat menemukan jawaban yang tepat.", "bot");
  } catch {
    document.getElementById(loadingId)?.remove();
    appendBubble(win, "❌ Terjadi kendala saat menghubungi server. Silakan coba lagi.", "bot error");
  } finally {
    input.disabled = false;
    if (btnSend) btnSend.disabled = false;
    input.focus();
    win.scrollTop = win.scrollHeight;
  }
}

// ─── Markdown Parser Helper ──────────────────────────────────────────────────
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMarkdown(text) {
  if (!text) return "";

  // Gunakan library marked.js jika tersedia dari CDN
  if (typeof marked !== "undefined" && typeof marked.parse === "function") {
    try {
      return marked.parse(text);
    } catch (e) {
      console.warn("marked.parse error, menggunakan fallback parser:", e);
    }
  }

  // Fallback Custom Parser
  let html = escapeHtml(text);

  // Headings
  html = html.replace(/^### (.*$)/gim, "<h4>$1</h4>");
  html = html.replace(/^## (.*$)/gim, "<h4>$1</h4>");
  html = html.replace(/^# (.*$)/gim, "<h4>$1</h4>");

  // Divider
  html = html.replace(/^---$/gim, "<hr>");
  html = html.replace(/^\*\*\*$/gim, "<hr>");

  // Bold & Italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic
  html = html.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");
  html = html.replace(/_([^_\n]+)_/g, "<em>$1</em>");

  // Lists and paragraphs
  const lines = html.split("\n");
  const result = [];
  let inUl = false;
  let inOl = false;

  for (let line of lines) {
    const trimmed = line.trim();

    const ulMatch = trimmed.match(/^[-*]\s+(.*)$/);
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);

    if (ulMatch) {
      if (inOl) { result.push("</ol>"); inOl = false; }
      if (!inUl) { result.push("<ul>"); inUl = true; }
      result.push(`<li>${ulMatch[1]}</li>`);
    } else if (olMatch) {
      if (inUl) { result.push("</ul>"); inUl = false; }
      if (!inOl) { result.push("<ol>"); inOl = true; }
      result.push(`<li>${olMatch[2]}</li>`);
    } else {
      if (inUl) { result.push("</ul>"); inUl = false; }
      if (inOl) { result.push("</ol>"); inOl = false; }

      if (trimmed.length > 0) {
        if (trimmed.startsWith("<h4") || trimmed.startsWith("<hr")) {
          result.push(trimmed);
        } else {
          result.push(`<p>${trimmed}</p>`);
        }
      }
    }
  }

  if (inUl) result.push("</ul>");
  if (inOl) result.push("</ol>");

  return result.join("\n");
}

function appendBubble(container, text, type, id = null) {
  const isBot = type.includes("bot");
  const row = document.createElement("div");
  row.className = `chat-row ${isBot ? "bot-row" : "user-row"}`;
  if (id) row.id = id;

  const avatar = document.createElement("div");
  avatar.className = `chat-avatar ${isBot ? "bot-avatar" : "user-avatar"}`;
  avatar.textContent = isBot ? "🤖" : "👤";

  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${type}`;

  if (isBot && !type.includes("loading") && !type.includes("error")) {
    bubble.innerHTML = formatMarkdown(text);
  } else if (type.includes("loading")) {
    bubble.textContent = text;
  } else {
    bubble.innerHTML = escapeHtml(text).replace(/\n/g, "<br>");
  }

  if (isBot) {
    row.appendChild(avatar);
    row.appendChild(bubble);
  } else {
    row.appendChild(bubble);
    row.appendChild(avatar);
  }

  container.appendChild(row);
}
