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

// Fungsi helper untuk mendapatkan ID sheet berdasarkan nama
const getSheetId = async (sheetTitle) => {
  const res = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheet = res.data.sheets.find((s) => s.properties.title === sheetTitle);
  return sheet ? sheet.properties.sheetId : 0;
};

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

// Tambah baris baru di posisi paling atas (Baris ke-2)
export const insertSheetDataTop = async (rowValues) => {
  const sheetName = "DAFTAR HADIR";
  const sheetId = await getSheetId(sheetName);

  // 1. Sisipkan baris kosong baru di baris ke-2 (index 1)
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          insertDimension: {
            range: {
              sheetId: sheetId,
              dimension: "ROWS",
              startIndex: 1, // index 1 adalah baris 2
              endIndex: 2,
            },
            inheritFromBefore: false,
          },
        },
      ],
    },
  });

  // 2. Isi data pada baris ke-2 yang baru disisipkan
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${sheetName}'!A2:K2`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [rowValues],
    },
  });
};
