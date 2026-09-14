"""
auth_sheets.py - Skrip Satu Kali untuk Otorisasi Google Drive & Sheets
Jalankan perintah: py auth_sheets.py
"""

import os
import sys
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
import gspread

# Mengizinkan Google menormalisasi scope tanpa memicu Warning/Error
os.environ["OAUTHLIB_RELAX_TOKEN_SCOPE"] = "1"

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
CREDS_FILE = os.path.join(BASE_DIR, "credentials.json")
TOKEN_FILE = os.path.join(BASE_DIR, "token.json")
SPREADSHEET_NAME = "STIFIn_Data"
SPREADSHEET_ID = "1Hc1Xm1iTFpxwNe1mOsg5egx7I5wIc-sjCzTnX3-ZD5c"

def authenticate():
    if not os.path.exists(CREDS_FILE):
        print(f"[ERROR] File '{CREDS_FILE}' tidak ditemukan di folder ini.")
        return

    print("[INFO] Memulai proses otorisasi Google Account...")
    flow = InstalledAppFlow.from_client_secrets_file(CREDS_FILE, SCOPES)
    creds = flow.run_local_server(port=0)

    with open(TOKEN_FILE, "w", encoding="utf-8") as token:
        token.write(creds.to_json())

    print("[OK] Berhasil login! File 'token.json' telah dibuat.")

    # Uji koneksi ke Google Sheets
    print("[INFO] Menghubungkan ke Google Sheets...")
    client = gspread.authorize(creds)
    sh = None
    try:
        sh = client.open_by_key(SPREADSHEET_ID)
        print(f"[OK] Ditemukan spreadsheet target: '{sh.title}'")
    except Exception as err1:
        print(f"[WARN] Tidak bisa buka via key: {err1}. Mencoba via nama...")
        try:
            sh = client.open(SPREADSHEET_NAME)
            print(f"[OK] Ditemukan spreadsheet via nama: '{sh.title}'")
        except Exception as err2:
            print(f"[INFO] Membuat spreadsheet baru '{SPREADSHEET_NAME}'...")
            sh = client.create(SPREADSHEET_NAME)
            sheet = sh.sheet1
            sheet.append_row([
                "Nama", "Jawaban 1-10", "Geometri",
                "Total Poin", "Tipe Kepribadian", "Karakteristik Geometri"
            ])
            print(f"[OK] Berhasil membuat spreadsheet '{SPREADSHEET_NAME}'!")

    if sh:
        # Tambahkan header jika sheet kosong
        sheet = sh.sheet1
        if sheet.row_count == 0 or not sheet.row_values(1):
            sheet.append_row([
                "Nama", "Jawaban 1-10", "Geometri",
                "Total Poin", "Tipe Kepribadian", "Karakteristik Geometri"
            ])
            print("[OK] Header kolom telah dipasang di spreadsheet.")

    print("\n[SUKSES] Otorisasi selesai! Data kuesioner Anda sekarang akan otomatis masuk ke spreadsheet ini.")

if __name__ == "__main__":
    authenticate()
