export default function FormTextarea({
  label,
  required = false,
  rows = 2,
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
        className="w-full bg-white border border-theme-input rounded-lg p-3 outline-none resize-none focus:ring-2 focus:ring-emerald-500 text-sm"
        {...props}
      />
    </div>
  );
}
