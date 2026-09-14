"""
Aplikasi Penilaian Diri STIFIn - Backend Flask
Fitur: Kuesioner, Google Sheets, RAG Chatbot (FAISS + Gemini)
"""

import os
import json
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import gspread
from google.oauth2.service_account import Credentials
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

load_dotenv()

app = Flask(__name__)

# ─── Konfigurasi ────────────────────────────────────────────────────────────
GEMINI_API_KEY   = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL     = os.getenv("GEMINI_MODEL", "gemini-2.5-pro")
SHEETS_CREDS_FILE = os.getenv("GOOGLE_SHEETS_CREDS_JSON", "credentials.json")
SPREADSHEET_NAME  = os.getenv("SPREADSHEET_NAME", "STIFIn_Data")
VECTOR_DB_PATH    = "vector_db"

# ─── Google Sheets ───────────────────────────────────────────────────────────
def get_sheets_client():
    scopes = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive",
    ]
    creds = Credentials.from_service_account_file(SHEETS_CREDS_FILE, scopes=scopes)
    return gspread.authorize(creds)


def save_to_sheets(data: dict):
    try:
        client = get_sheets_client()
        sheet  = client.open(SPREADSHEET_NAME).sheet1
        # Header jika sheet kosong
        if sheet.row_count == 0 or not sheet.row_values(1):
            sheet.append_row([
                "Nama", "Jawaban 1-10", "Geometri",
                "Total Poin", "Tipe Kepribadian", "Karakteristik Geometri",
            ])
        sheet.append_row([
            data.get("nama", ""),
            json.dumps(data.get("jawaban", [])),
            data.get("geometri", ""),
            data.get("total_poin", 0),
            data.get("tipe", ""),
            data.get("karakteristik_geometri", ""),
        ])
        return True
    except Exception as e:
        app.logger.error(f"Google Sheets error: {e}")
        return False


# ─── RAG Chatbot ─────────────────────────────────────────────────────────────
_qa_chain = None

def get_qa_chain():
    global _qa_chain
    if _qa_chain is not None:
        return _qa_chain

    if not os.path.exists(VECTOR_DB_PATH):
        return None

    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=GEMINI_API_KEY,
    )
    vectorstore = FAISS.load_local(
        VECTOR_DB_PATH, embeddings, allow_dangerous_deserialization=True
    )
    retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

    prompt_template = """Anda adalah Asisten Psikologi yang ramah dan berpengetahuan luas.
Jawab pertanyaan pengguna HANYA berdasarkan konteks buku rujukan yang diberikan di bawah ini.
Jika jawaban tidak ditemukan dalam konteks, katakan bahwa Anda tidak memiliki informasi tentang itu.

Konteks:
{context}

Pertanyaan: {question}
Jawaban:"""

    PROMPT = PromptTemplate(
        template=prompt_template, input_variables=["context", "question"]
    )

    llm = ChatGoogleGenerativeAI(
        model=GEMINI_MODEL,
        google_api_key=GEMINI_API_KEY,
        temperature=0.3,
    )

    _qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        chain_type_kwargs={"prompt": PROMPT},
        return_source_documents=False,
    )
    return _qa_chain


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
    """RAG Chatbot endpoint."""
    body = request.get_json(force=True)
    pertanyaan = body.get("pertanyaan", "").strip()
    if not pertanyaan:
        return jsonify({"jawaban": "Pertanyaan tidak boleh kosong."})

    chain = get_qa_chain()
    if chain is None:
        return jsonify({
            "jawaban": (
                "Basis pengetahuan belum tersedia. "
                "Jalankan `py ingest.py` terlebih dahulu untuk memproses buku rujukan."
            )
        })

    result = chain.invoke({"query": pertanyaan})
    return jsonify({"jawaban": result.get("result", "Maaf, terjadi kesalahan.")})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
