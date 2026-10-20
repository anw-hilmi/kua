import { useState, useEffect } from "react";
import {
  FaIdCard,
  FaUser,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaList,
  FaVenusMars,
} from "react-icons/fa";
import "./index.css";

export default function FormulirLayanan() {
  // Inisialisasi state dari localStorage jika ada data tersimpan
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("formData_layanan");
    return saved
      ? JSON.parse(saved)
      : {
          nik: "",
          nama: "",
          jenisKelamin: "",
          provinsi: "",
          kabupaten: "",
          kecamatan: "",
          desa: "",
          alamatDetail: "",
          whatsapp: "",
          layanan: "",
          layananLainnya: "",
        };
  });

  const [loading, setLoading] = useState(false);

  const [listProvinsi, setListProvinsi] = useState([]);
  const [listKabupaten, setListKabupaten] = useState([]);
  const [listKecamatan, setListKecamatan] = useState([]);
  const [listDesa, setListDesa] = useState([]);

  // Simpan otomatis ke localStorage setiap formData berubah
  useEffect(() => {
    localStorage.setItem("formData_layanan", JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((res) => res.json())
      .then((data) => setListProvinsi(data))
      .catch((err) => console.error("Gagal mengambil data provinsi:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProvinsiChange = (e) => {
    const provId = e.target.value;
    const provSelected = listProvinsi.find((p) => p.id === provId);

    setFormData((prev) => ({
      ...prev,
      provinsi: provSelected?.name || "",
      kabupaten: "",
      kecamatan: "",
      desa: "",
    }));
    setListKabupaten([]);
    setListKecamatan([]);
    setListDesa([]);

    if (provId) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provId}.json`,
      )
        .then((res) => res.json())
        .then((data) => setListKabupaten(data));
    }
  };

  const handleKabupatenChange = (e) => {
    const kabId = e.target.value;
    const kabSelected = listKabupaten.find((k) => k.id === kabId);

    setFormData((prev) => ({
      ...prev,
      kabupaten: kabSelected?.name || "",
      kecamatan: "",
      desa: "",
    }));
    setListKecamatan([]);
    setListDesa([]);

    if (kabId) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${kabId}.json`,
      )
        .then((res) => res.json())
        .then((data) => setListKecamatan(data));
    }
  };

  const handleKecamatanChange = (e) => {
    const kecId = e.target.value;
    const kecSelected = listKecamatan.find((kc) => kc.id === kecId);

    setFormData((prev) => ({
      ...prev,
      kecamatan: kecSelected?.name || "",
      desa: "",
    }));
    setListDesa([]);

    if (kecId) {
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${kecId}.json`,
      )
        .then((res) => res.json())
        .then((data) => setListDesa(data));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi Wajib Isi Seluruh Kolom
    if (formData.nik.length !== 16) {
      alert("NIK harus tepat 16 digit angka.");
      return;
    }

    if (
      !formData.provinsi ||
      !formData.kabupaten ||
      !formData.kecamatan ||
      !formData.desa ||
      !formData.alamatDetail.trim()
    ) {
      alert("Harap lengkapi seluruh kolom alamat wilayah.");
      return;
    }

    if (formData.layanan === "Lainnya" && !formData.layananLainnya.trim()) {
      alert("Harap isi nama layanan lainnya.");
      return;
    }

    setLoading(true);

    const payload = {
      nik: formData.nik,
      nama: formData.nama,
      jenisKelamin: formData.jenisKelamin,
      provinsi: formData.provinsi,
      kabupaten: formData.kabupaten,
      kecamatan: formData.kecamatan,
      desa: formData.desa,
      alamatDetail: formData.alamatDetail,
      whatsapp: formData.whatsapp,
      layanan: formData.layanan,
      layananLainnya: formData.layananLainnya,
    };

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/layanan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Data berhasil disimpan ke Google Sheets!");
        // Hapus draf formulir di localStorage setelah sukses kirim
        localStorage.removeItem("formData_layanan");
        setFormData({
          nik: "",
          nama: "",
          jenisKelamin: "",
          provinsi: "",
          kabupaten: "",
          kecamatan: "",
          desa: "",
          alamatDetail: "",
          whatsapp: "",
          layanan: "",
          layananLainnya: "",
        });
        setListKabupaten([]);
        setListKecamatan([]);
        setListDesa([]);
      } else {
        alert(`Gagal: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Terjadi kesalahan jaringan atau server mati.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-page flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-theme-card p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-theme-title text-center mb-6">
          Daftar Tamu
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NIK */}
          <div>
            <label className="block text-theme-label text-sm font-semibold mb-1">
              NIK <span className="text-red-500">*</span>
            </label>
            <div
              className={`input-container ${
                formData.nik && formData.nik.length < 16
                  ? "border-red-500"
                  : "border-theme-input"
              }`}
            >
              <FaIdCard className="text-theme-icon mr-3" />
              <input
                type="text"
                inputMode="numeric"
                name="nik"
                value={formData.nik}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 16);
                  handleChange({ target: { name: "nik", value } });
                }}
                required
                minLength={16}
                maxLength={16}
                className="w-full outline-none"
                placeholder="Masukkan 16 digit NIK"
              />
            </div>
            {formData.nik && formData.nik.length < 16 && (
              <p className="text-red-500 text-xs mt-1 font-medium">
                NIK harus berjumlah 16 digit ({formData.nik.length}/16)
              </p>
            )}
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block text-theme-label text-sm font-semibold mb-1">
              Nama Lengkap (Sesuai KTP) <span className="text-red-500">*</span>
            </label>
            <div className="input-container border-theme-input">
              <FaUser className="text-theme-icon mr-3" />
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  handleChange(e);
                }}
                required
                className="w-full outline-none uppercase"
                placeholder="NAMA LENGKAP"
              />
            </div>
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block text-theme-label text-sm font-semibold mb-1">
              Jenis Kelamin <span className="text-red-500">*</span>
            </label>
            <div className="input-container border-theme-input">
              <FaVenusMars className="text-theme-icon mr-3" />
              <select
                name="jenisKelamin"
                value={formData.jenisKelamin}
                onChange={handleChange}
                required
                className="w-full outline-none bg-transparent text-gray-700"
              >
                <option value="" disabled>
                  Pilih Jenis Kelamin
                </option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          {/* Alamat Wilayah Indonesia */}
          <div className="space-y-3">
            <label className="block text-theme-label text-sm font-semibold">
              Alamat Lengkap (Sesuai KTP){" "}
              <span className="text-red-500">*</span>
            </label>

            {/* Provinsi */}
            <div className="input-container border-theme-input">
              <FaMapMarkerAlt className="text-theme-icon mr-3" />
              <select
                onChange={handleProvinsiChange}
                required
                className="w-full outline-none bg-transparent text-gray-700"
              >
                <option value="">Pilih Provinsi</option>
                {listProvinsi.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Kabupaten / Kota */}
            <div className="input-container border-theme-input">
              <select
                onChange={handleKabupatenChange}
                required
                disabled={!listKabupaten.length}
                className="w-full outline-none bg-transparent text-gray-700 disabled:opacity-50"
              >
                <option value="">Pilih Kabupaten/Kota</option>
                {listKabupaten.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Kecamatan */}
            <div className="input-container border-theme-input">
              <select
                onChange={handleKecamatanChange}
                required
                disabled={!listKecamatan.length}
                className="w-full outline-none bg-transparent text-gray-700 disabled:opacity-50"
              >
                <option value="">Pilih Kecamatan</option>
                {listKecamatan.map((kc) => (
                  <option key={kc.id} value={kc.id}>
                    {kc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Kelurahan / Desa */}
            <div className="input-container border-theme-input">
              <select
                name="desa"
                onChange={(e) => {
                  const desaObj = listDesa.find((d) => d.id === e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    desa: desaObj?.name || "",
                  }));
                }}
                required
                disabled={!listDesa.length}
                className="w-full outline-none bg-transparent text-gray-700 disabled:opacity-50"
              >
                <option value="">Pilih Kelurahan/Desa</option>
                {listDesa.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Detail Jalan / RT / RW */}
            <textarea
              name="alamatDetail"
              value={formData.alamatDetail}
              onChange={handleChange}
              required
              rows="2"
              className="w-full bg-white border border-theme-input rounded-lg p-3 outline-none resize-none focus:ring-2 focus:ring-emerald-500 text-sm"
              placeholder="Nama Jalan, No. Rumah, RT/RW"
            />
          </div>

          {/* No WhatsApp */}
          <div>
            <label className="block text-theme-label text-sm font-semibold mb-1">
              No. WhatsApp <span className="text-red-500">*</span>
            </label>
            <div className="input-container border-theme-input">
              <FaWhatsapp className="text-theme-icon mr-3" />
              <input
                type="text"
                inputMode="numeric"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  handleChange({ target: { name: "whatsapp", value } });
                }}
                required
                className="w-full outline-none"
                placeholder="Contoh: 08123456789"
              />
            </div>
          </div>

          {/* Layanan */}
          <div>
            <label className="block text-theme-label text-sm font-semibold mb-1">
              Layanan <span className="text-red-500">*</span>
            </label>
            <div className="input-container border-theme-input">
              <FaList className="text-theme-icon mr-3" />
              <select
                name="layanan"
                value={formData.layanan}
                onChange={handleChange}
                required
                className="w-full outline-none bg-transparent text-gray-700"
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
              <label className="block text-theme-label text-sm font-semibold mb-1">
                Sebutkan Layanan Lainnya <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="layananLainnya"
                value={formData.layananLainnya}
                onChange={handleChange}
                required
                className="w-full bg-white border border-theme-input rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ketik nama layanan..."
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-theme-btn text-white font-bold py-3 rounded-xl transition duration-300 mt-6 shadow-md disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim Formulir"}
          </button>
        </form>
      </div>
    </div>
  );
}
