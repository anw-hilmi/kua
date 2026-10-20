export default function DataTable({ data = [], loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-emerald-600 font-medium bg-white rounded-xl shadow-sm border border-gray-100">
        <svg
          className="animate-spin h-5 w-5 mr-3"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Memuat data...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-12 text-gray-500 font-medium bg-white rounded-xl shadow-sm border border-gray-100">
        Tidak ada data ditemukan.
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
      <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
        <thead className="bg-emerald-50/80 text-emerald-900 font-bold text-xs uppercase border-b border-gray-200">
          <tr>
            <th className="px-4 py-4 min-w-[50px] text-center">No</th>
            <th className="px-4 py-4 min-w-[120px]">Tanggal</th>
            <th className="px-4 py-4 min-w-[160px]">NIK</th>
            <th className="px-4 py-4 min-w-[200px]">Nama</th>
            <th className="px-4 py-4 min-w-[130px]">Jenis Kelamin</th>
            <th className="px-4 py-4 min-w-[150px]">Provinsi</th>
            <th className="px-4 py-4 min-w-[150px]">Kabupaten/Kota</th>
            <th className="px-4 py-4 min-w-[150px]">Kecamatan</th>
            <th className="px-4 py-4 min-w-[150px]">Desa/Kelurahan</th>
            <th className="px-4 py-4 min-w-[250px]">Alamat</th>
            <th className="px-4 py-4 min-w-[140px]">WhatsApp</th>
            <th className="px-4 py-4 min-w-[200px]">Layanan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr
              key={item.nik || index}
              className="hover:bg-emerald-50/30 transition-colors"
            >
              <td className="px-4 py-3 font-medium text-gray-900 text-center">
                {index + 1}
              </td>
              <td className="px-4 py-3 text-gray-500">{item.tanggal}</td>
              <td className="px-4 py-3 font-mono text-gray-700">{item.nik}</td>
              <td className="px-4 py-3 font-semibold text-gray-800">
                {item.nama}
              </td>
              <td className="px-4 py-3">{item.jenisKelamin}</td>
              <td className="px-4 py-3">{item.provinsi}</td>
              <td className="px-4 py-3">{item.kabupaten}</td>
              <td className="px-4 py-3">{item.kecamatan}</td>
              <td className="px-4 py-3">{item.desa}</td>
              <td
                className="px-4 py-3 truncate max-w-[250px]"
                title={item.alamatDetail}
              >
                {item.alamatDetail}
              </td>
              <td className="px-4 py-3">{item.whatsapp}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  {item.layanan}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
