import express from "express";
import cors from "cors";
import { google } from "googleapis";
import "dotenv/config";
import { layananSchema } from "./validation.js";

const app = express();
app.use(cors());
app.use(express.json());

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

// Middleware Validasi Joi
const validateLayanan = (req, res, next) => {
  const { error } = layananSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((d) => d.message).join(", ");
    return res.status(400).json({ status: "error", message: errorMessages });
  }
  next();
};

// Helper: Ambil semua data dari sheet (Kolom A s/d K)
const getSheetData = async () => {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A2:K",
  });
  const rows = res.data.values || [];
  return rows.map((row) => ({
    nik: row[0] || "",
    nama: row[1] || "",
    jenisKelamin: row[2] || "",
    provinsi: row[3] || "",
    kabupaten: row[4] || "",
    kecamatan: row[5] || "",
    desa: row[6] || "",
    alamatDetail: row[7] || "",
    whatsapp: row[8] || "",
    layanan: row[9] || "",
    layananLainnya: row[10] || "",
  }));
};

// 1. Tambah Data (dengan middleware Joi)
app.post("/api/layanan", validateLayanan, async (req, res) => {
  try {
    const {
      nik,
      nama,
      jenisKelamin,
      provinsi,
      kabupaten,
      kecamatan,
      desa,
      alamatDetail,
      whatsapp,
      layanan,
      layananLainnya,
    } = req.body;

    const currentData = await getSheetData();

    if (currentData.some((item) => String(item.nik) === String(nik))) {
      return res
        .status(400)
        .json({ status: "error", message: "NIK sudah terdaftar" });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A:K",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            nik,
            nama,
            jenisKelamin,
            provinsi,
            kabupaten,
            kecamatan,
            desa,
            alamatDetail,
            whatsapp,
            layanan,
            layananLainnya || "",
          ],
        ],
      },
    });

    res
      .status(201)
      .json({ status: "success", message: "Data berhasil disimpan" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 2. Dapatkan Semua Data (Dashboard)
app.get("/api/layanan", async (req, res) => {
  try {
    const data = await getSheetData();
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 3. Dapatkan Data Spesifik NIK
app.get("/api/layanan/:nik", async (req, res) => {
  try {
    const data = await getSheetData();
    const result = data.find(
      (item) => String(item.nik) === String(req.params.nik),
    );
    if (!result)
      return res
        .status(404)
        .json({ status: "error", message: "NIK tidak ditemukan" });
    res.json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 4. Hapus Data Berdasarkan NIK
app.delete("/api/layanan/:nik", async (req, res) => {
  try {
    const { nik } = req.params;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Sheet1!A2:K",
    });
    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => String(row[0]) === String(nik));

    if (rowIndex === -1) {
      return res
        .status(404)
        .json({ status: "error", message: "NIK tidak ditemukan" });
    }

    const sheetInfo = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    const sheetId = sheetInfo.data.sheets[0].properties.sheetId;

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: rowIndex + 1,
                endIndex: rowIndex + 2,
              },
            },
          },
        ],
      },
    });

    res.json({
      status: "success",
      message: `Data NIK ${nik} berhasil dihapus`,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
