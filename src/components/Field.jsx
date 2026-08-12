export default function Field({ label, error, required, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>
        {label} {required && <span style={{ color: "var(--reject)" }}>*</span>}
      </span>
      {children}
      {error && <span className="block text-xs mt-1" style={{ color: "var(--reject)" }}>{error}</span>}
    </label>
  );
}
