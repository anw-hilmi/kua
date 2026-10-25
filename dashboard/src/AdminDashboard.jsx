import { useState, useEffect, useCallback, useMemo } from "react";
import { FaUsers, FaSearch } from "react-icons/fa";
import StatCard from "./StatCard";
import DataTable from "./DataTable";
import "./index.css";

export default function AdminDashboard() {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("layananData");
    return savedData ? JSON.parse(savedData) : [];
  });

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

  const filteredData = useMemo(() => {
    if (!search) return data;
    const query = search.toLowerCase();

    return data.filter((item) =>
      Object.values(item).some(
        (value) => value != null && String(value).toLowerCase().includes(query),
      ),
    );
  }, [data, search]);

  return (
    <div className="min-h-screen bg-[var(--bg)] p-4 sm:p-6 lg:p-8 font-sans text-[var(--text)]">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[var(--border)]">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
              Dashboard Admin
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Kelola data pendaftaran tamu dan layanan secara terpusat.
            </p>
          </div>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Pendaftar"
            value={data.length}
            icon={FaUsers}
            trend="Seluruh data tamu"
          />
        </div>

        {/* Tabel Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-lg font-bold text-[var(--text)] px-1">
              Daftar Tamu ({filteredData.length})
            </h2>
            <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-[var(--border)] w-full sm:w-80 shadow-sm focus-within:ring-2 focus-within:ring-[var(--primary-color)]/20 focus-within:border-[var(--primary-color)] transition-all">
              <FaSearch className="text-[var(--muted)] text-sm shrink-0" />
              <input
                type="text"
                placeholder="Cari NIK, Nama, Layanan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-[var(--text)] placeholder-[var(--muted)]"
              />
            </div>
          </div>

          <DataTable data={filteredData} loading={loading} />
        </div>
      </div>
    </div>
  );
}
