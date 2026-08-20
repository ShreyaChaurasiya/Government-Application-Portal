import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PortalLogo from "../components/PortalLogo";
import inputClass from "../utils/inputClass";
import OtpInput from "../components/OtpInput";
import { resetPassword } from "../services/authService";
import { getApiErrorMessage } from "../utils/apiError";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await resetPassword({ email, code, newPassword });
      navigate("/login", { state: { message: "Password updated. Sign in with your new password." } });
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not reset password."));
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
        <div className="w-full max-w-sm card-panel p-6">
          <h1 className="font-display text-xl font-semibold mb-2" style={{ color: "var(--ink)" }}>Reset password</h1>
          {location.state?.message && (
            <p className="text-sm mb-4" style={{ color: "var(--ink-soft)" }}>{location.state.message}</p>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block text-sm mb-1.5" style={{ color: "var(--ink-soft)" }}>Email</label>
            <input type="email" required className={inputClass(false)} value={email} onChange={(e) => setEmail(e.target.value)} />

            <div className="mt-4">
              <OtpInput value={code} onChange={setCode} label="Reset OTP from email" />
            </div>

            <label className="block text-sm mb-1.5 mt-4" style={{ color: "var(--ink-soft)" }}>New password</label>
            <input type="password" required minLength={8} className={inputClass(false)} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

            {error && <p className="text-sm mt-3" style={{ color: "var(--reject)" }}>{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary w-full mt-6">
              {submitting ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
