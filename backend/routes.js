import { Router } from "express";
import { layananSchema } from "./validation.js"; // Pastikan file validasi tetap ada
import { createLayanan, getAllLayanan, getLayananByNik } from "./controller.js";

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

// Route Test Dasar
router.get("/", (req, res) => {
  res.json({ status: "success", message: "Server API Layanan Berjalan" });
});

router.get("/api", (req, res) => {
  res.json({
    status: "success",
    message: "API Endpoint Aktif. Gunakan /api/layanan",
  });
});

// 1. Tambah Data (Akan otomatis diletakkan di baris 2 Sheet)
router.post("/api/layanan", validateLayanan, createLayanan);

// 2. Dapatkan Semua Data
router.get("/api/layanan", getAllLayanan);

// 3. Dapatkan Data Spesifik NIK
router.get("/api/layanan/:nik", getLayananByNik);

export default router;
