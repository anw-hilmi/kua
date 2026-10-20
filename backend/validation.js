import Joi from "joi";

export const layananSchema = Joi.object({
  tanggal: Joi.string().allow("").optional(),
  nik: Joi.string().length(16).pattern(/^\d+$/).required().messages({
    "string.length": "NIK harus berjumlah 16 digit",
    "string.pattern.base": "NIK harus berupa angka",
    "any.required": "NIK wajib diisi",
  }),
  nama: Joi.string().trim().required().messages({
    "any.required": "Nama wajib diisi",
  }),
  jenisKelamin: Joi.string()
    .valid("Laki-laki", "Perempuan")
    .required()
    .messages({
      "any.only": "Jenis kelamin harus Laki-laki atau Perempuan",
      "any.required": "Jenis kelamin wajib diisi",
    }),
  provinsi: Joi.string().trim().required().messages({
    "any.required": "Provinsi wajib diisi",
  }),
  kabupaten: Joi.string().trim().required().messages({
    "any.required": "Kabupaten/Kota wajib diisi",
  }),
  kecamatan: Joi.string().trim().required().messages({
    "any.required": "Kecamatan wajib diisi",
  }),
  desa: Joi.string().trim().required().messages({
    "any.required": "Kelurahan/Desa wajib diisi",
  }),
  alamatDetail: Joi.string().trim().required().messages({
    "any.required": "Detail alamat wajib diisi",
  }),
  whatsapp: Joi.string().pattern(/^\d+$/).required().messages({
    "string.pattern.base": "Nomor WhatsApp harus berupa angka",
    "any.required": "Nomor WhatsApp wajib diisi",
  }),
  layanan: Joi.string().trim().required().messages({
    "any.required": "Layanan wajib diisi",
  }),
  layananLainnya: Joi.string().allow("").optional(),
});
