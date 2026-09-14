"""
Aplikasi Penilaian Diri STIFIn - Backend Flask
Fitur: Kuesioner, Google Sheets (OAuth 2.0), RAG Chatbot (FAISS + Gemini)
"""

import os
import json
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import gspread
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from google import genai

load_dotenv()

app = Flask(__name__)

BASE_DIR          = os.path.dirname(os.path.abspath(__file__))
GEMINI_API_KEY    = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL      = os.getenv("GEMINI_MODEL", "gemini-3.1-flash-lite")
SHEETS_CREDS_FILE = os.path.join(BASE_DIR, os.getenv("GOOGLE_SHEETS_CREDS_JSON", "credentials.json"))
TOKEN_FILE        = os.path.join(BASE_DIR, "token.json")
SPREADSHEET_NAME  = os.getenv("SPREADSHEET_NAME", "STIFIn_Data")
SPREADSHEET_ID    = os.getenv("SPREADSHEET_ID", "1Hc1Xm1iTFpxwNe1mOsg5egx7I5wIc-sjCzTnX3-ZD5c")
VECTOR_DB_PATH    = os.path.join(BASE_DIR, "vector_db")

# ─── Google Sheets (OAuth 2.0 Desktop) ──────────────────────────────────────
os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "1"

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]

def get_sheets_client():
    # 1. Coba muat dari environment variable / secret (untuk cloud deployment)
    token_env = os.getenv("GOOGLE_TOKEN_JSON")
    if token_env:
        try:
            token_data = json.loads(token_env)
            creds = Credentials.from_authorized_user_info(token_data, SCOPES)
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            return gspread.authorize(creds)
        except Exception as e:
            app.logger.error(f"Error memuat GOOGLE_TOKEN_JSON dari env: {e}")

    # 2. Coba muat dari file lokal token.json
    if not os.path.exists(TOKEN_FILE):
        app.logger.warning(f"File otentikasi {TOKEN_FILE} belum ditemukan.")
        return None

    try:
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
            try:
                with open(TOKEN_FILE, "w") as token:
                    token.write(creds.to_json())
            except Exception:
                pass
        return gspread.authorize(creds)
    except Exception as e:
        app.logger.error(f"Error memuat token Google Sheets: {e}")
        return None


def save_to_sheets(data: dict):
    try:
        client = get_sheets_client()
        if not client:
            app.logger.warning("Google Sheets client belum terautentikasi (jalankan `py auth_sheets.py`).")
            return False

        try:
            sh = client.open_by_key(SPREADSHEET_ID)
        except Exception:
            try:
                sh = client.open(SPREADSHEET_NAME)
            except gspread.exceptions.SpreadsheetNotFound:
                app.logger.info(f"Spreadsheet '{SPREADSHEET_NAME}' belum ada, membuatnya secara otomatis...")
                sh = client.create(SPREADSHEET_NAME)

        sheet = sh.sheet1
        headers = [
            "Waktu", "Nama", "NIM", "Email",
            "Tipe Kepribadian", "Poin Introvert", "Poin Ekstrovert",
            "Geometri", "Karakteristik Geometri", "Detail Jawaban"
        ]
        # Buat header jika sheet masih kosong
        if sheet.row_count == 0 or not sheet.row_values(1):
            sheet.append_row(headers)

        from datetime import datetime
        waktu_sekarang = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        sheet.append_row([
            waktu_sekarang,
            data.get("nama", ""),
            data.get("nim", ""),
            data.get("email", ""),
            data.get("tipe", ""),
            data.get("poin_introvert", 0),
            data.get("poin_ekstrovert", 0),
            data.get("geometri", ""),
            data.get("karakteristik_geometri", ""),
            json.dumps(data.get("jawaban", []), ensure_ascii=False),
        ])
        return True
    except Exception as e:
        app.logger.error(f"Google Sheets error: {e}")
        return False


# ─── RAG Chatbot ─────────────────────────────────────────────────────────────
_vectorstore = None
_genai_client = None

def get_vectorstore():
    global _vectorstore
    if _vectorstore is not None:
        return _vectorstore

    if not os.path.exists(VECTOR_DB_PATH):
        return None

    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=GEMINI_API_KEY,
    )
    _vectorstore = FAISS.load_local(
        VECTOR_DB_PATH, embeddings, allow_dangerous_deserialization=True
    )
    return _vectorstore


def get_genai_client():
    global _genai_client
    if _genai_client is None:
        _genai_client = genai.Client(api_key=GEMINI_API_KEY)
    return _genai_client


# ─── Routes ──────────────────────────────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/hasil")
def hasil():
    return render_template("hasil.html")


@app.route("/api/simpan", methods=["POST"])
def api_simpan():
    """Terima hasil kuesioner dan simpan ke Google Sheets."""
    data = request.get_json(force=True)
    berhasil = save_to_sheets(data)
    return jsonify({"status": "ok" if berhasil else "error"})


@app.route("/api/chat", methods=["POST"])
def api_chat():
    """RAG Chatbot endpoint berbasis buku rujukan STIFIn."""
    body = request.get_json(force=True)
    pertanyaan = body.get("pertanyaan", "").strip()
    if not pertanyaan:
        return jsonify({"jawaban": "Pertanyaan tidak boleh kosong."})

    vs = get_vectorstore()
    if vs is None:
        return jsonify({
            "jawaban": (
                "Basis pengetahuan belum tersedia. "
                "Jalankan `py ingest.py` terlebih dahulu untuk memproses buku rujukan."
            )
        })

    try:
        # 1. Similarity Search pada vector DB
        docs = vs.similarity_search(pertanyaan, k=5)
        context = "\n\n".join(doc.page_content for doc in docs)

        # 2. Prompt yang disesuaikan dengan instruksi pemformatan rapi
        prompt = (
            "Anda adalah Asisten Pakar Psikologi STIFIn yang ramah, komunikatif, dan berwawasan luas.\n"
            "Tugas Anda adalah menjawab pertanyaan pengguna secara komprehensif, aplikatif, dan terstruktur rapi berdasarkan konteks rujukan (buku dan materi video STIFIn) di bawah ini.\n\n"
            "PANDUAN PEMFORMATAN TAMPILAN (SANGAT PENTING):\n"
            "1. Gunakan teks tebal (**kata/frasa penting**) untuk menonjolkan poin inti, istilah penting, judul konsep, atau kata kunci utama.\n"
            "2. Gunakan teks miring (*istilah khusus*) untuk istilah asing/psikologi/STIFIn (contoh: *learning by doing*, *sparing partner*, *memory quotient*, *chemistry*, dll).\n"
            "3. Gunakan daftar bernomor (1., 2., 3.) untuk tahapan, langkah-langkah sistematis, rekomendasi berurutan, atau prioritas tindakan.\n"
            "4. Gunakan poin peluru (- atau *) untuk rincian karakteristik, contoh, atau sub-poin penjelasan.\n"
            "5. Gunakan sub-judul (### Judul Bagian) untuk membagi jawaban menjadi bagian-bagian yang jelas dan mudah dipahami pembaca.\n"
            "6. Hindari teks panjang yang menumpuk dalam satu paragraf besar; buat paragraf-paragraf pendek yang nyaman dibaca.\n"
            "7. Jika jawaban tidak ada dalam konteks rujukan, sampaikan dengan santun bahwa informasi tersebut belum tersedia di basis data STIFIn saat ini.\n\n"
            f"Konteks Rujukan:\n{context}\n\n"
            f"Pertanyaan Pengguna: {pertanyaan}\n\n"
            "Jawaban Terstruktur:"
        )

        # 3. Generate response menggunakan client modern dengan model fallback
        client = get_genai_client()
        models_to_try = [GEMINI_MODEL, "gemini-3.5-flash-lite", "gemini-3.6-flash"]
        models_to_try = list(dict.fromkeys(models_to_try))
        
        jawaban_teks = None
        for m in models_to_try:
            try:
                resp = client.models.generate_content(model=m, contents=prompt)
                jawaban_teks = resp.text.strip()
                break
            except Exception as err:
                app.logger.warning(f"Percobaan model {m} gagal: {err}")
                continue

        if not jawaban_teks:
            return jsonify({"jawaban": "Maaf, sistem AI sedang mengalami beban tinggi. Silakan coba sesaat lagi."})

        return jsonify({"jawaban": jawaban_teks})
    except Exception as e:
        app.logger.error(f"Chatbot error: {e}")
        return jsonify({"jawaban": f"Maaf, terjadi kendala saat memproses jawaban: {e}"})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
