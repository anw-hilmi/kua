# Aplikasi Pendaftaran Tamu dan Layanan KUA

Aplikasi ini digunakan untuk mencatat pendaftaran tamu dan layanan KUA. Pengunjung mengisi formulir melalui aplikasi **client**, sedangkan petugas dapat melihat dan mencari data melalui **dashboard admin**. Data pendaftaran disimpan di Google Sheets melalui **backend API**.

## Fitur

- Formulir pendaftaran dengan tanggal, NIK, nama, jenis kelamin, alamat, nomor WhatsApp, dan layanan.
- Pilihan provinsi, kabupaten/kota, kecamatan, dan desa yang dimuat dari API wilayah Indonesia.
- Validasi data formulir sebelum disimpan.
- Dashboard untuk melihat jumlah dan daftar pendaftar, serta mencari data.
- Penyimpanan data pendaftaran di Google Sheets.

## Teknologi

- React dan Vite untuk aplikasi client dan dashboard.
- Node.js dan Express untuk backend API.
- Google Sheets API sebagai penyimpanan data.

## Struktur proyek

```text
client/      Formulir pendaftaran
dashboard/   Dashboard admin
backend/     REST API dan integrasi Google Sheets
```

## Persiapan

Pastikan Node.js dan npm sudah terpasang. Siapkan juga Google Spreadsheet yang dapat diakses oleh service account:

1. Buat atau pilih Google Spreadsheet.
2. Buat tab bernama **DAFTAR HADIR**.
3. Aktifkan Google Sheets API dan siapkan service account dengan akses editor ke spreadsheet tersebut.
4. Catat ID spreadsheet dari URL dan email service account.

Buat file `backend/.env` dengan konfigurasi berikut:

```env
SPREADSHEET_ID=ID_SPREADSHEET_ANDA
GOOGLE_SERVICE_ACCOUNT_EMAIL=email-service-account
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nISI_PRIVATE_KEY_ANDA\n-----END PRIVATE KEY-----\n"
```

Jangan bagikan atau commit file `.env` maupun private key ke repositori publik.

Secara default, client dan dashboard mengakses backend di `http://localhost:5000`. Jika backend berjalan di alamat lain, buat file `.env` di folder `client` dan `dashboard` dengan isi:

```env
VITE_API_URL=http://localhost:5000
```

Gunakan alamat dasar backend tanpa garis miring di bagian akhir.

## Menjalankan secara lokal

Buka tiga terminal dari folder proyek, lalu jalankan perintah berikut.

**Backend**

```bash
cd backend
npm install
node server.js
```

Backend berjalan di `http://localhost:5000`.

**Formulir pendaftaran**

```bash
cd client
npm install
npm run dev
```

**Dashboard admin**

```bash
cd dashboard
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite di masing-masing terminal. Pastikan backend sudah berjalan dan konfigurasi Google Sheets sudah benar agar pengiriman serta pemuatan data berhasil.

## API

| Metode | Endpoint            | Keterangan                            |
| ------ | ------------------- | ------------------------------------- |
| `GET`  | `/`                 | Memeriksa status server               |
| `GET`  | `/api`              | Memeriksa status API                  |
| `POST` | `/api/layanan`      | Memvalidasi dan menyimpan pendaftaran |
| `GET`  | `/api/layanan`      | Mengambil seluruh data pendaftaran    |
| `GET`  | `/api/layanan/:nik` | Mencari data berdasarkan NIK          |

Data disimpan pada tab **DAFTAR HADIR**, kolom A sampai K dengan urutan: tanggal, NIK, nama, jenis kelamin, provinsi, kabupaten/kota, kecamatan, desa, detail alamat, WhatsApp, dan layanan.

## Catatan data pribadi

Formulir memproses NIK, alamat, dan nomor WhatsApp. Batasi akses ke dashboard dan Google Spreadsheet hanya kepada petugas yang berwenang, serta kelola data sesuai kebijakan privasi yang berlaku.
