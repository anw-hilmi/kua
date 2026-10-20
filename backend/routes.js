import { Router } from "express";
import { layananSchema } from "./validation.js";
import { getSheetData, appendSheetData } from "./repositories.js";

const router = Router();

// Middleware Validasi Joi
const validateLayanan = (req, res, next) => {
  const { error } = layananSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((d) => d.message).join(", ");
    return res.status(400).json({ status: "error", message: errorMessages });
  }
  next();
};

// Route Test
router.get("/", (req, res) => {
  res.json({ status: "success", message: "Server API Layanan Berjalan" });
});

router.get("/api", (req, res) => {
  res.json({
    status: "success",
    message: "API Endpoint Aktif. Gunakan /api/layanan",
  });
});

// 1. Tambah Data
router.post("/api/layanan", validateLayanan, async (req, res) => {
  try {
    const currentData = await getSheetData();

    if (currentData.some((item) => String(item.nik) === String(req.body.nik))) {
      return res
        .status(400)
        .json({ status: "error", message: "NIK sudah terdaftar" });
    }

    await appendSheetData(req.body);

    res
      .status(201)
      .json({ status: "success", message: "Data berhasil disimpan" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 2. Dapatkan Semua Data
router.get("/api/layanan", async (req, res) => {
  try {
    const data = await getSheetData();
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// 3. Dapatkan Data Spesifik NIK
router.get("/api/layanan/:nik", async (req, res) => {
  try {
    const data = await getSheetData();
    const result = data.find(
      (item) => String(item.nik) === String(req.params.nik),
    );
    if (!result) {
      return res
        .status(404)
        .json({ status: "error", message: "NIK tidak ditemukan" });
    }
    res.json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default router;
