import { useState, useEffect, useCallback } from "react";
import { FaUsers, FaSearch, FaSync } from "react-icons/fa";
import StatCard from "./StatCard";
import DataTable from "./DataTable";
import "./index.css";

export default function AdminDashboard() {
  // 1. Ambil data awal dari localStorage (jika ada)
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("layananData");
    return savedData ? JSON.parse(savedData) : [];
  });

  // 2. Loading false jika data sudah ada di localStorage, true jika kosong
  const [loading, setLoading] = useState(() => {
    const savedData = localStorage.getItem("layananData");
    return !savedData;
  });

  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/layanan`);
      const result = await res.json();
      if (res.ok) {
        const fetchedData = result.data || [];
        setData(fetchedData);
        // 3. Simpan data baru ke localStorage
        localStorage.setItem("layananData", JSON.stringify(fetchedData));
      } else {
        alert(`Gagal: ${result.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi ke server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initData = async () => {
      await fetchData();
    };

    initData();
  }, [fetchData]);

  const filteredData = data.filter(
    (item) =>
      item.nama?.toLowerCase().includes(search.toLowerCase()) ||
      item.nik?.includes(search) ||
      item.layanan?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Dashboard Admin
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola data pendaftaran tamu dan layanan dengan mudah.
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all font-semibold text-sm shadow-sm disabled:opacity-70"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
            {loading ? "Memuat..." : "Refresh Data"}
          </button>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Pendaftar"
            value={data.length}
            icon={FaUsers}
          />
          {/* Anda bisa menambahkan StatCard lain di sini nantinya */}
        </div>

        {/* Tabel Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 px-1">
              Daftar Tamu
            </h2>
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-200 w-full max-w-sm shadow-sm focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
              <FaSearch className="text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Pencarian..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <DataTable data={filteredData} loading={loading} />
        </div>
      </div>
    </div>
  );
}
