"""
ingest.py - Ingest STIFIn documents (PDF Books & YouTube Video Transcripts) into FAISS Vector Database
Fitur cerdas:
- Auto-resume (melanjutkan dari chunk terakhir yang belum tersimpan)
- Otomatis menunggu jika terkena Rate Limit Gemini API (429)
- Simpan berkala setiap batch agar aman dari interupsi
"""

import os
import sys
import glob
import time
import argparse
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
VECTOR_DB_PATH = "vector_db"

def load_pdf_documents():
    pdf_files = list(set(glob.glob("*.pdf") + glob.glob("docs/*.pdf")))
    docs = []
    if pdf_files:
        print(f"[PDF] Memproses {len(pdf_files)} file PDF...")
        for pdf in pdf_files:
            try:
                print(f"  -> Memuat PDF: {pdf}")
                loader = PyPDFLoader(pdf)
                docs.extend(loader.load())
            except Exception as e:
                print(f"  ! Gagal memuat {pdf}: {e}")
        print(f"[PDF] Total halaman PDF dimuat: {len(docs)}")
    return docs

def load_youtube_documents():
    yt_files = glob.glob("docs/transkrip_youtube/*.txt")
    docs = []
    if yt_files:
        print(f"[YOUTUBE] Memproses {len(yt_files)} file transkrip YouTube...")
        for ytf in yt_files:
            try:
                loader = TextLoader(ytf, encoding="utf-8")
                docs.extend(loader.load())
            except Exception as e:
                print(f"  ! Gagal memuat {ytf}: {e}")
        print(f"[YOUTUBE] Total transkrip YouTube dimuat: {len(docs)}")
    elif os.path.exists("docs/koleksi_transkrip_youtube_stifin.txt"):
        print("[YOUTUBE] Memuat file kompilasi transkrip YouTube...")
        loader = TextLoader("docs/koleksi_transkrip_youtube_stifin.txt", encoding="utf-8")
        docs.extend(loader.load())
    return docs

def add_documents_resumable(vectorstore, chunks, batch_size=10, delay_sec=8):
    total = len(chunks)
    print(f"Memproses {total} chunk YouTube (batch: {batch_size}, jeda aman: {delay_sec}s)...")

    # Cek chunk yang sudah tersimpan
    existing_chunk_ids = set()
    for doc in vectorstore.docstore._dict.values():
        if "chunk_id" in doc.metadata:
            existing_chunk_ids.add(doc.metadata["chunk_id"])

    remaining = [c for c in chunks if c.metadata.get("chunk_id") not in existing_chunk_ids]
    print(f"  Chunk sudah ada: {len(existing_chunk_ids)} | Chunk baru yang perlu diproses: {len(remaining)}")

    if not remaining:
        print("  Semua chunk YouTube sudah tersimpan di Vector DB.")
        return

    for i in range(0, len(remaining), batch_size):
        batch = remaining[i:i + batch_size]
        print(f"  Mengirim batch {i + 1} - {min(i + batch_size, len(remaining))} dari {len(remaining)}...")

        success = False
        attempts = 0
        while not success and attempts < 5:
            try:
                vectorstore.add_documents(batch)
                vectorstore.save_local(VECTOR_DB_PATH)  # Simpan langsung ke disk
                success = True
            except Exception as e:
                attempts += 1
                err_str = str(e)
                if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                    print(f"    [429 Quota] Menunggu 45 detik pendinginan kuota API... (percobaan {attempts}/5)")
                    time.sleep(45)
                else:
                    print(f"    [Error] {e}")
                    raise e

        if i + batch_size < len(remaining):
            time.sleep(delay_sec)

    print(f"[SUKSES] Semua {len(remaining)} chunk berhasil disimpan ke Vector DB!")

def main():
    parser = argparse.ArgumentParser(description="Ingest STIFIn knowledge base")
    parser.add_argument("--rebuild", action="store_true", help="Bangun ulang database dari nol")
    args = parser.parse_args()

    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=GEMINI_API_KEY
    )

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)

    db_exists = os.path.exists(VECTOR_DB_PATH) and os.path.exists(os.path.join(VECTOR_DB_PATH, "index.faiss"))

    if db_exists and not args.rebuild:
        print(f"Vector DB ditemukan di '{VECTOR_DB_PATH}'.")
        vectorstore = FAISS.load_local(
            VECTOR_DB_PATH, embeddings, allow_dangerous_deserialization=True
        )
        print(f"Dokumen saat ini di DB: {len(vectorstore.docstore._dict)} chunk.")

        yt_docs = load_youtube_documents()
        if not yt_docs:
            print("Tidak ada file transkrip YouTube ditemukan di docs/transkrip_youtube/")
            return

        yt_chunks = text_splitter.split_documents(yt_docs)
        # Beri unique chunk_id pada setiap chunk
        for idx, c in enumerate(yt_chunks):
            src = os.path.basename(c.metadata.get("source", "yt"))
            c.metadata["chunk_id"] = f"{src}_{idx}"

        add_documents_resumable(vectorstore, yt_chunks, batch_size=10, delay_sec=8)
        print(f"Total akhir chunk di Vector DB: {len(vectorstore.docstore._dict)}")
        return

    # Jika membuat dari nol (--rebuild)
    print("\n>> Membangun Vector DB dari awal...")
    pdf_docs = load_pdf_documents()
    yt_docs = load_youtube_documents()
    
    pdf_chunks = text_splitter.split_documents(pdf_docs)
    yt_chunks = text_splitter.split_documents(yt_docs)
    for idx, c in enumerate(yt_chunks):
        src = os.path.basename(c.metadata.get("source", "yt"))
        c.metadata["chunk_id"] = f"{src}_{idx}"

    all_chunks = pdf_chunks + yt_chunks
    print(f"Total PDF chunks: {len(pdf_chunks)}, YouTube chunks: {len(yt_chunks)}")

    batch_size = 10
    print(f"Menginisialisasi index awal ({min(batch_size, len(all_chunks))} chunk)...")
    vectorstore = FAISS.from_documents(all_chunks[:batch_size], embeddings)
    vectorstore.save_local(VECTOR_DB_PATH)
    time.sleep(8)

    add_documents_resumable(vectorstore, all_chunks[batch_size:], batch_size=10, delay_sec=8)
    print(f"[SUKSES] Vector DB lengkap berhasil dibuat: {len(vectorstore.docstore._dict)} chunk.")

if __name__ == "__main__":
    main()
