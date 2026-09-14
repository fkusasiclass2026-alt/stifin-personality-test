# Walkthrough - Restorasi Flask & Konfigurasi OAuth 2.0 Google Sheets

Telah diselesaikan restorasi arsitektur aplikasi berbasis Flask dan konfigurasi autentikasi Google Sheets menggunakan OAuth 2.0 Desktop App.

## Perubahan yang Dilakukan

### 1. Backend ([app.py](file:///D:/%23ANTIGRAVITY/Agen%20Stifin/app.py))
- **Pemulihan Flask Framework:** Mengembalikan seluruh rute web (`/`, `/hasil`, `/api/simpan`, `/api/chat`).
- **Otentikasi OAuth 2.0 Desktop:** 
  - Menggantikan autentikasi Service Account (yang diblokir oleh kebijakan organisasi) dengan `InstalledAppFlow` (`google-auth-oauthlib`).
  - Menggunakan file kredensial `credentials.json` tipe Desktop App yang telah Anda unduh.
  - Alur otomatis menyimpan dan memuat token pengguna ke `token.json` tanpa perlu login berulang kali.
- **Penyelarasan Model Embedding:**
  - Mengarahkan `GoogleGenerativeAIEmbeddings` di `app.py` menggunakan model `models/gemini-embedding-001` agar selaras 100% dengan `vector_db` yang sudah di-generate.

### 2. Dependensi ([requirements.txt](file:///D:/%23ANTIGRAVITY/Agen%20Stifin/requirements.txt))
- Menambahkan dependensi `google-auth-oauthlib` dan memverifikasi seluruh modul terpasang dengan baik.

---

## Cara Menjalankan & Menguji Aplikasi

### Jalankan Server:
Buka terminal / PowerShell di folder proyek dan jalankan:
```powershell
py app.py
```
Aplikasi akan berjalan di: `http://localhost:5000`

### Pengujian Alur:
1. Buka browser dan akses `http://localhost:5000`.
2. Isi Nama, jawab 10 pernyataan objektif (*Setuju / Ragu-ragu / Tidak Setuju*), dan pilih bentuk Geometrik STIFIn.
3. Klik tombol **Lihat Hasil Analisis**.
4. **Saat pertama kali menyimpan data ke Google Sheets:** Jendela browser Google Login akan otomatis terbuka meminta Anda menyetujui izin akses Google Drive/Sheets.
5. Setelah login disetujui, token disimpan ke `token.json` dan data kuesioner akan langsung tercatat di file spreadsheet `STIFIn_Data` Anda.
6. Halaman hasil akan menampilkan tipe kepribadian, bar skor, ulasan mendalam mesin berpikir STIFIn, rekap jawaban, dan fitur chatbot RAG.
