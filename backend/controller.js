import { insertSheetDataTop, getSheetData } from "./repositories.js";

export const createLayanan = async (req, res) => {
  try {
    const data = req.body;

    // Jadikan kolom layanan dan layanan lainnya menjadi satu
    const layananFinal = (
      data.layanan === "Lainnya" ? data.layananLainnya : data.layanan
    ).toUpperCase();

    const rowValues = [
      data.tanggal,
      `'${data.nik}`,
      data.nama,
      data.jenisKelamin,
      data.provinsi,
      data.kabupaten,
      data.kecamatan,
      data.desa,
      data.alamatDetail,
      `'${data.whatsapp}`,
      layananFinal,
    ];

    // Simpan data ke baris ke-2
    await insertSheetDataTop(rowValues);

    res
      .status(201)
      .json({ status: "success", message: "Data berhasil disimpan" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const getAllLayanan = async (req, res) => {
  try {
    const data = await getSheetData();
    res.json({ status: "success", data });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const getLayananByNik = async (req, res) => {
  try {
    const data = await getSheetData();
    const result = data.filter(
      (item) => String(item.nik) === String(req.params.nik),
    );

    if (!result.length) {
      return res
        .status(404)
        .json({ status: "error", message: "NIK tidak ditemukan" });
    }

    res.json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
