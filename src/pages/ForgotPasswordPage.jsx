import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PortalLogo from "../components/PortalLogo";
import inputClass from "../utils/inputClass";
import CaptchaField from "../components/CaptchaField";
import { forgotPassword } from "../services/authService";
import { getApiErrorMessage } from "../utils/apiError";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      await forgotPassword({ email, captchaId, captchaAnswer });
      navigate("/reset-password", { state: { email, message: "Enter the OTP sent to your email." } });
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not send reset OTP."));
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
          <h1 className="font-display text-2xl font-semibold mb-2" style={{ color: "var(--ink)" }}>Forgot password</h1>
          <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>We will send a one-time code to your registered email.</p>

          <form onSubmit={handleSubmit} className="card-panel p-6">
            <label className="block text-sm mb-1.5" style={{ color: "var(--ink-soft)" }}>Email</label>
            <input type="email" required className={inputClass(false)} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />

            <CaptchaField captchaId={captchaId} captchaAnswer={captchaAnswer} onCaptchaId={setCaptchaId} onCaptchaAnswer={setCaptchaAnswer} />

            {error && <p className="text-sm mt-3" style={{ color: "var(--reject)" }}>{error}</p>}
            {message && <p className="text-sm mt-3" style={{ color: "var(--approve)" }}>{message}</p>}

            <button type="submit" disabled={submitting} className="btn-primary w-full mt-6">
              {submitting ? "Sending…" : "Send reset OTP"}
            </button>
          </form>

          <p className="text-sm text-center mt-5">
            <Link to="/login" style={{ color: "var(--accent)" }}>Back to sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
