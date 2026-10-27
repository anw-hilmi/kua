export default function FormSelect({
  label,
  icon: Icon,
  required = false,
  options = [],
  placeholder = "Pilih...",
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-theme-label text-sm font-semibold mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="input-container border-theme-input">
        {Icon && (
          <Icon className="text-theme-icon mr-3 text-lg flex-shrink-0" />
        )}
        <select
          className="w-full outline-none bg-transparent text-theme-label text-sm disabled:opacity-50"
          {...props}
        >
          <option value="">{placeholder}</option>
          {(Array.isArray(options) ? options : []).map((opt) => (
            <option
              key={opt.id || opt.value || opt}
              value={opt.id || opt.value || opt}
            >
              {opt.name || opt.label || opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
