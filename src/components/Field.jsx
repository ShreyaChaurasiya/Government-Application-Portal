export default function Field({ label, error, required, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-rose-600">*</span>}
      </span>
      {children}
      {error && <span className="block text-xs text-rose-600 mt-1">{error}</span>}
    </label>
  );
}