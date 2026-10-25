export default function FormInput({
  label,
  icon: Icon,
  required = false,
  error,
  className = "",
  ...props
}) {
  return (
    <div>
      {label && (
        <label className="block text-theme-label text-sm font-semibold mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={`input-container ${
          error ? "border-red-500" : "border-theme-input"
        }`}
      >
        {Icon && (
          <Icon className="text-theme-icon mr-3 text-lg flex-shrink-0" />
        )}
        <input
          className={`w-full bg-transparent border-none text-theme-label text-sm placeholder:text-gray-400 !outline-none focus:!outline-none focus:ring-0 focus:border-none ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>
      )}
    </div>
  );
}
