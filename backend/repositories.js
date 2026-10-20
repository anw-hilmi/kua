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

// Ambil semua data dari Sheet
export const getSheetData = async () => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "'DAFTAR HADIR'!A2:L",
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
    layananLainnya: row[11] || "",
  }));
};

// Tambah baris baru ke Sheet
export const appendSheetData = async (data) => {
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
    data.layanan,
    data.layananLainnya || "",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "'DAFTAR HADIR'!A:L",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [rowValues],
    },
  });
};
