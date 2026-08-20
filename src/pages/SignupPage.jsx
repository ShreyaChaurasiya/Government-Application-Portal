import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PortalLogo from "../components/PortalLogo";
import inputClass from "../utils/inputClass";
import CaptchaField from "../components/CaptchaField";
import { signup as signupApi } from "../services/authService";
import { getApiErrorMessage } from "../utils/apiError";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", phoneNumber: "", password: "", companyName: "" });
  const [captchaId, setCaptchaId] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await signupApi({
        ...form,
        captchaId,
        captchaAnswer,
      });
      navigate("/verify-otp", {
        state: {
          userId: response.data.userId,
          emailOtp: response.data.emailOtp,
          phoneOtp: response.data.phoneOtp,
          message: response.data.message,
        },
      });
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not create your account."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen flex flex-col">
      <header className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5 w-fit">
            <PortalLogo size={28} />
            <span className="font-display font-semibold" style={{ color: "var(--ink)" }}>Application Portal</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "var(--brass)" }}>Step 1 — Sign up</p>
          <h1 className="font-display text-2xl font-semibold mb-2" style={{ color: "var(--ink)" }}>Create your account</h1>
          <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
            Register with email and mobile OTP verification for a secure portal account.
          </p>

          <form onSubmit={handleSubmit} className="card-panel p-6">
            <label className="block text-sm mb-1.5" style={{ color: "var(--ink-soft)" }}>Full name</label>
            <input required autoFocus className={inputClass(false)} value={form.name} onChange={set("name")} placeholder="Ananya Rao" />

            <label className="block text-sm mb-1.5 mt-4" style={{ color: "var(--ink-soft)" }}>Email</label>
            <input type="email" required className={inputClass(false)} value={form.email} onChange={set("email")} placeholder="name@company.com" />

            <label className="block text-sm mb-1.5 mt-4" style={{ color: "var(--ink-soft)" }}>Mobile number</label>
            <input
              required
              pattern="[0-9]{10}"
              maxLength={10}
              className={inputClass(false)}
              value={form.phoneNumber}
              onChange={set("phoneNumber")}
              placeholder="10-digit mobile number"
            />

            <label className="block text-sm mb-1.5 mt-4" style={{ color: "var(--ink-soft)" }}>Password</label>
            <input
              type="password"
              required
              minLength={8}
              className={inputClass(false)}
              value={form.password}
              onChange={set("password")}
              placeholder="At least 8 characters with letters and numbers"
            />

            <label className="block text-sm mb-1.5 mt-4" style={{ color: "var(--ink-soft)" }}>Company name (optional)</label>
            <input className={inputClass(false)} value={form.companyName} onChange={set("companyName")} placeholder="Your organisation" />

            <CaptchaField
              captchaId={captchaId}
              captchaAnswer={captchaAnswer}
              onCaptchaId={setCaptchaId}
              onCaptchaAnswer={setCaptchaAnswer}
            />

            {error && <p className="text-sm mt-3" style={{ color: "var(--reject)" }}>{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary w-full mt-6">
              {submitting ? "Creating account…" : "Continue to verification"}
            </button>
          </form>

          <p className="text-sm text-center mt-5" style={{ color: "var(--ink-soft)" }}>
            Already registered?{" "}
            <Link to="/login" className="font-medium" style={{ color: "var(--accent)" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
