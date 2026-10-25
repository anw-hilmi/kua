import { useState } from "react";
import { FaInbox } from "react-icons/fa";

export default function DataTable({ data = [], loading }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [prevDataLength, setPrevDataLength] = useState(data.length);
  const itemsPerPage = 10;

  // Reset ke halaman 1 jika jumlah data berubah (menggantikan useEffect)
  if (data.length !== prevDataLength) {
    setCurrentPage(1);
    setPrevDataLength(data.length);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16 text-[var(--primary-color)] font-medium bg-white rounded-2xl shadow-sm border border-[var(--border)]">
        <svg
          className="animate-spin h-6 w-6 mr-3"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Memuat data...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-[var(--muted)] bg-white rounded-2xl shadow-sm border border-[var(--border)]">
        <FaInbox className="text-4xl mb-2 opacity-40" />
        <p className="font-medium text-sm">Tidak ada data ditemukan.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[var(--text)] whitespace-nowrap">
          <thead className="bg-[var(--table-header-bg)] text-[var(--primary-dark-color)] font-bold text-xs uppercase border-b border-[var(--border)]">
            <tr className="divide-x divide-[var(--border)]">
              <th className="px-4 py-3.5 text-center w-12">No</th>
              <th className="px-4 py-3.5">Tanggal</th>
              <th className="px-4 py-3.5">NIK</th>
              <th className="px-4 py-3.5">Nama</th>
              <th className="px-4 py-3.5">Jenis Kelamin</th>
              <th className="px-4 py-3.5">Provinsi</th>
              <th className="px-4 py-3.5">Kabupaten/Kota</th>
              <th className="px-4 py-3.5">Kecamatan</th>
              <th className="px-4 py-3.5">Desa/Kelurahan</th>
              <th className="px-4 py-3.5">Alamat</th>
              <th className="px-4 py-3.5">WhatsApp</th>
              <th className="px-4 py-3.5">Layanan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {currentData.map((item, index) => (
              <tr
                // PERBAIKAN: Gunakan key unik kombinasi startIndex dan index
                key={`row-${startIndex}-${index}`}
                className="hover:bg-[var(--table-row-hover)] transition-colors divide-x divide-[var(--border)]"
              >
                <td className="px-4 py-3 font-medium text-center text-xs text-[var(--muted)]">
                  {startIndex + index + 1}
                </td>
                <td className="px-4 py-3 text-xs">{item.tanggal}</td>
                <td className="px-4 py-3 font-mono text-xs">{item.nik}</td>
                <td className="px-4 py-3 font-semibold">{item.nama}</td>
                <td className="px-4 py-3 text-xs">{item.jenisKelamin}</td>
                <td className="px-4 py-3 text-xs">{item.provinsi}</td>
                <td className="px-4 py-3 text-xs">{item.kabupaten}</td>
                <td className="px-4 py-3 text-xs">{item.kecamatan}</td>
                <td className="px-4 py-3 text-xs">{item.desa}</td>
                <td
                  className="px-4 py-3 text-xs truncate max-w-[200px]"
                  title={item.alamatDetail}
                >
                  {item.alamatDetail}
                </td>
                <td className="px-4 py-3 text-xs font-mono">{item.whatsapp}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--badge-bg)] text-[var(--badge-text)]">
                    {item.layanan}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer & Paginasi */}
      <div className="px-5 py-3 bg-[var(--table-header-bg)]/40 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-3">
        <span className="text-xs text-[var(--muted)]">
          Menampilkan <strong>{startIndex + 1}</strong> -{" "}
          <strong>{Math.min(startIndex + itemsPerPage, data.length)}</strong>{" "}
          dari <strong>{data.length}</strong> data
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-[var(--text)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--table-row-hover)] transition-all font-medium"
            >
              Prev
            </button>
            <span className="text-xs font-semibold text-[var(--primary-dark-color)] px-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-[var(--text)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--table-row-hover)] transition-all font-medium"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
