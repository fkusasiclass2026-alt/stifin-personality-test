FROM python:3.11-slim

# Hugging Face Spaces requires a user with UID 1000
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin: \
    PYTHONUNBUFFERED=1

WORKDIR C:\Users\User/app

# Salin dependencies dan install
COPY --chown=user requirements.txt C:\Users\User/app/
RUN pip install --no-cache-dir -r requirements.txt

# Salin seluruh aplikasi
COPY --chown=user . C:\Users\User/app

# Port standar Hugging Face Spaces
EXPOSE 7860

CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--workers", "2", "--timeout", "120", "app:app"]
