export default function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
      </div>
      {Icon && (
        <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600">
          <Icon className="text-2xl" />
        </div>
      )}
    </div>
  );
}
