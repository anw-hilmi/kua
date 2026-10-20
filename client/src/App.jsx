import { useState } from "react";
import {
  FaIdCard,
  FaUser,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaList,
  FaUpload,
} from "react-icons/fa";
import "./index.css";

export default function FormulirLayanan() {
  const [formData, setFormData] = useState({
    ktp: null,
    nik: "",
    nama: "",
    alamat: "",
    whatsapp: "",
    layanan: "",
    layananLainnya: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data form:", formData);
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-100 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-emerald-700 text-center mb-6">
          Formulir Layanan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Scan KTP */}
          <div>
            <label className="block text-emerald-700 text-sm font-semibold mb-1">
              Scan KTP (Opsional)
            </label>
            <div className="flex items-center bg-white border border-emerald-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
              <FaUpload className="text-emerald-500 mr-3" />
              <input
                type="file"
                name="ktp"
                accept="image/*"
                capture="environment"
                onChange={handleChange}
                className="w-full text-sm outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 cursor-pointer"
              />
            </div>
          </div>

          {/* NIK */}
          <div>
            <label className="block text-emerald-700 text-sm font-semibold mb-1">
              NIK
            </label>
            <div className="flex items-center bg-white border border-emerald-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
              <FaIdCard className="text-emerald-500 mr-3" />
              <input
                type="number"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                required
                className="w-full outline-none"
                placeholder="Masukkan 16 digit NIK"
              />
            </div>
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block text-emerald-700 text-sm font-semibold mb-1">
              Nama Lengkap (Sesuai KTP)
            </label>
            <div className="flex items-center bg-white border border-emerald-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
              <FaUser className="text-emerald-500 mr-3" />
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                className="w-full outline-none"
                placeholder="Nama Lengkap"
              />
            </div>
          </div>

          {/* Alamat Lengkap */}
          <div>
            <label className="block text-emerald-700 text-sm font-semibold mb-1">
              Alamat Lengkap
            </label>
            <div className="flex items-start bg-white border border-emerald-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
              <FaMapMarkerAlt className="text-emerald-500 mr-3 mt-1" />
              <textarea
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                required
                rows="3"
                className="w-full outline-none resize-none"
                placeholder="Alamat lengkap domisili"
              />
            </div>
          </div>

          {/* No WhatsApp */}
          <div>
            <label className="block text-emerald-700 text-sm font-semibold mb-1">
              No. WhatsApp
            </label>
            <div className="flex items-center bg-white border border-emerald-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
              <FaWhatsapp className="text-emerald-500 mr-3" />
              <input
                type="number"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                required
                className="w-full outline-none"
                placeholder="Contoh: 08123456789"
              />
            </div>
          </div>

          {/* Layanan */}
          <div>
            <label className="block text-emerald-700 text-sm font-semibold mb-1">
              Layanan
            </label>
            <div className="flex items-center bg-white border border-emerald-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
              <FaList className="text-emerald-500 mr-3" />
              <select
                name="layanan"
                value={formData.layanan}
                onChange={handleChange}
                required
                className="w-full outline-none bg-transparent"
              >
                <option value="" disabled>
                  Pilih Layanan
                </option>
                <option value="Legalisir">Legalisir</option>
                <option value="Surat Keterangan Nikah Tercatat">
                  Surat Keterangan Nikah Tercatat
                </option>
                <option value="Surat Keterangan Nikah Tidak Tercatat/Pengantar Istbat Nikah">
                  Surat Keterangan Nikah Tidak Tercatat/Pengantar Istbat Nikah
                </option>
                <option value="Duplikat (Hilang/Rusak)">
                  Duplikat (Hilang/Rusak)
                </option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Layanan Lainnya */}
          {formData.layanan === "Lainnya" && (
            <div>
              <label className="block text-emerald-700 text-sm font-semibold mb-1">
                Sebutkan Layanan Lainnya
              </label>
              <input
                type="text"
                name="layananLainnya"
                value={formData.layananLainnya}
                onChange={handleChange}
                required
                className="w-full bg-white border border-emerald-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ketik nama layanan..."
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition duration-300 mt-6 shadow-md"
          >
            Kirim Formulir
          </button>
        </form>
      </div>
    </div>
  );
}
