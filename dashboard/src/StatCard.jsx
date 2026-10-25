export default function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-[var(--border)] flex items-center justify-between hover:shadow-md transition-all">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {title}
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
          {value}
        </h3>
        {trend && (
          <p className="text-xs text-[var(--primary-color)] font-medium">
            {trend}
          </p>
        )}
      </div>
      {Icon && (
        <div className="p-3.5 rounded-xl bg-[var(--stat-icon-bg)] text-[var(--stat-icon-color)] shrink-0">
          <Icon className="text-xl sm:text-2xl" />
        </div>
      )}
    </div>
  );
}
