import inputClass from "../utils/inputClass";

export default function OtpInput({ value, onChange, label = "Enter 6-digit OTP" }) {
  return (
    <div>
      <label className="block text-sm mb-1.5" style={{ color: "var(--ink-soft)" }}>{label}</label>
      <input
        required
        maxLength={6}
        pattern="[0-9]{6}"
        className={inputClass(false)}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 6))}
        placeholder="000000"
        autoComplete="one-time-code"
      />
    </div>
  );
}
