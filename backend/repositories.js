import { google } from "googleapis";
import "dotenv/config";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Ambil semua data dari Sheet (Kolom A s/d K)
export const getSheetData = async () => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "'DAFTAR HADIR'!A2:K",
  });
  const rows = res.data.values || [];
  return rows.map((row) => ({
    tanggal: row[0] || "",
    nik: row[1] || "",
    nama: row[2] || "",
    jenisKelamin: row[3] || "",
    provinsi: row[4] || "",
    kabupaten: row[5] || "",
    kecamatan: row[6] || "",
    desa: row[7] || "",
    alamatDetail: row[8] || "",
    whatsapp: row[9] || "",
    layanan: row[10] || "",
  }));
};

// Tambah baris baru ke Sheet
export const appendSheetData = async (data) => {
  // Jika memilih "Lainnya", gunakan isi dari layananLainnya
  const layananFinal =
    data.layanan === "Lainnya"
      ? data.layananLainnya || "Lainnya"
      : data.layanan;

  const rowValues = [
    data.tanggal,
    data.nik,
    data.nama,
    data.jenisKelamin,
    data.provinsi,
    data.kabupaten,
    data.kecamatan,
    data.desa,
    data.alamatDetail,
    data.whatsapp,
    layananFinal,
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "'DAFTAR HADIR'!A:K",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [rowValues],
    },
  });
};
