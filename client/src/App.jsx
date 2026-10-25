import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaIdCard,
  FaUser,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaList,
  FaVenusMars,
} from "react-icons/fa";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormTextarea from "./FormTextarea";
import "./index.css";

export default function FormulirLayanan() {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("formData_layanan");
    return saved
      ? JSON.parse(saved)
      : {
          tanggal: today,
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
      tanggal: formData.tanggal,
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
        localStorage.removeItem("formData_layanan");
        setFormData({
          tanggal: today,
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
          {/* Tanggal */}
          <FormInput
            label="Tanggal"
            icon={FaCalendarAlt}
            type="date"
            name="tanggal"
            value={formData.tanggal}
            onChange={handleChange}
            readOnly
            required
          />

          {/* NIK */}
          <FormInput
            label="NIK"
            icon={FaIdCard}
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
            placeholder="Masukkan 16 digit NIK"
            error={
              formData.nik && formData.nik.length < 16
                ? `NIK harus berjumlah 16 digit (${formData.nik.length}/16)`
                : null
            }
          />

          {/* Nama Lengkap */}
          <FormInput
            label="Nama Lengkap (Sesuai KTP)"
            icon={FaUser}
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

          {/* Jenis Kelamin */}
          <FormSelect
            label="Jenis Kelamin"
            icon={FaVenusMars}
            name="jenisKelamin"
            value={formData.jenisKelamin}
            onChange={handleChange}
            required
            placeholder="Pilih Jenis Kelamin"
            options={[
              { id: "Laki-laki", name: "Laki-laki" },
              { id: "Perempuan", name: "Perempuan" },
            ]}
          />

          {/* Alamat Wilayah Indonesia */}
          <div className="space-y-3">
            <label className="block text-theme-label text-sm font-semibold">
              Alamat Lengkap (Sesuai KTP){" "}
              <span className="text-red-500">*</span>
            </label>

            <FormSelect
              icon={FaMapMarkerAlt}
              onChange={handleProvinsiChange}
              required
              placeholder="Pilih Provinsi"
              options={listProvinsi}
            />

            <FormSelect
              onChange={handleKabupatenChange}
              required
              disabled={!listKabupaten.length}
              placeholder="Pilih Kabupaten/Kota"
              options={listKabupaten}
            />

            <FormSelect
              onChange={handleKecamatanChange}
              required
              disabled={!listKecamatan.length}
              placeholder="Pilih Kecamatan"
              options={listKecamatan}
            />

            <FormSelect
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
              placeholder="Pilih Kelurahan/Desa"
              options={listDesa}
            />

            <FormTextarea
              name="alamatDetail"
              value={formData.alamatDetail}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
                handleChange(e);
              }}
              required
              rows="2"
              className="uppercase"
              placeholder="NAMA JALAN, NO. RUMAH, RT/RW"
            />
          </div>

          {/* No WhatsApp */}
          <FormInput
            label="No. WhatsApp"
            icon={FaWhatsapp}
            type="text"
            inputMode="numeric"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              handleChange({ target: { name: "whatsapp", value } });
            }}
            required
            placeholder="Contoh: 08123456789"
          />

          {/* Layanan */}
          <FormSelect
            label="Layanan"
            icon={FaList}
            name="layanan"
            value={formData.layanan}
            onChange={handleChange}
            required
            placeholder="Pilih Layanan"
            options={[
              "Legalisir",
              "Surat Keterangan Nikah Tercatat",
              "Surat Keterangan Nikah Tidak Tercatat/Pengantar Istbat Nikah",
              "Duplikat (Hilang/Rusak)",
              "Lainnya",
            ]}
          />

          {/* Layanan Lainnya */}
          {formData.layanan === "Lainnya" && (
            <FormInput
              label="Sebutkan Layanan Lainnya"
              type="text"
              name="layananLainnya"
              value={formData.layananLainnya}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
                handleChange(e);
              }}
              required
              className="uppercase"
              placeholder="KETIK NAMA LAYANAN..."
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-theme-btn hover:bg-theme-btn-hover text-white font-bold py-3 rounded-xl transition duration-300 mt-6 shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Mengirim..." : "Kirim Formulir"}
          </button>
        </form>
      </div>
    </div>
  );
}
