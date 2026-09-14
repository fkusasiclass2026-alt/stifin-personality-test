"""
ingest.py - Proses buku rujukan PDF → Vector Database (FAISS)
Jalankan SEKALI sebelum menjalankan server:  py ingest.py
"""

import os
import glob
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
VECTOR_DB_PATH = "vector_db"

def main():
    # Cari semua PDF di folder utama
    pdf_files = glob.glob("*.pdf") + glob.glob("docs/*.pdf")
    if not pdf_files:
        print("❌ Tidak ada file PDF ditemukan. Letakkan buku_rujukan.pdf di folder utama.")
        return

    print(f"📚 Memproses {len(pdf_files)} file PDF: {pdf_files}")

    all_docs = []
    for pdf_path in pdf_files:
        print(f"  → Memuat: {pdf_path}")
        loader = PyPDFLoader(pdf_path)
        docs   = loader.load()
        all_docs.extend(docs)

    print(f"📄 Total halaman dimuat: {len(all_docs)}")

    # Pecah teks menjadi chunk
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=150,
        length_function=len,
    )
    chunks = splitter.split_documents(all_docs)
    print(f"✂️  Total chunk: {len(chunks)}")

    # Buat embeddings dan simpan ke FAISS
    print("🔢 Membuat embeddings (ini mungkin butuh beberapa menit)...")
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=GEMINI_API_KEY,
    )
    vectorstore = FAISS.from_documents(chunks, embeddings)
    vectorstore.save_local(VECTOR_DB_PATH)

    print(f"✅ Vector DB berhasil disimpan ke '{VECTOR_DB_PATH}/'")
    print("🚀 Sekarang Anda bisa menjalankan server: py app.py")


if __name__ == "__main__":
    main()
