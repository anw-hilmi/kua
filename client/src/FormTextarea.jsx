export default function FormTextarea({
  label,
  required = false,
  rows = 2,
  className = "", // Tangkap className
  ...props
}) {
  return (
    <div>
      {label && (
        <label className="block text-theme-label text-sm font-semibold mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        rows={rows}
        className={`w-full bg-white border border-theme-input rounded-lg p-3 resize-none text-sm !outline-none focus:!outline-none focus:ring-0 ${className}`}
        {...props}
      />
    </div>
  );
}
