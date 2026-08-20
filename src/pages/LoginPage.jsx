import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PortalLogo from "../components/PortalLogo";
import inputClass from "../utils/inputClass";
import CaptchaField from "../components/CaptchaField";
import { login as loginApi } from "../services/authService";
import { getApiErrorMessage } from "../utils/apiError";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await loginApi({ email, password, captchaId, captchaAnswer });
      login(response.data);
      navigate("/app");
    } catch (err) {
      setError(getApiErrorMessage(err, "Incorrect email or password."));
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
          <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "var(--brass)" }}>Step 2 — Log in</p>
          <h1 className="font-display text-2xl font-semibold mb-2" style={{ color: "var(--ink)" }}>Welcome back</h1>
          <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>
            Sign in with captcha protection to access your dashboard.
          </p>

          {successMessage && (
            <p className="text-sm mb-4 card-panel p-3" style={{ color: "var(--approve)" }}>{successMessage}</p>
          )}

          <form onSubmit={handleSubmit} className="card-panel p-6">
            <label className="block text-sm mb-1.5" style={{ color: "var(--ink-soft)" }}>Email</label>
            <input type="email" required autoFocus className={inputClass(false)} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />

            <label className="block text-sm mb-1.5 mt-4" style={{ color: "var(--ink-soft)" }}>Password</label>
            <input type="password" required className={inputClass(false)} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

            <CaptchaField
              captchaId={captchaId}
              captchaAnswer={captchaAnswer}
              onCaptchaId={setCaptchaId}
              onCaptchaAnswer={setCaptchaAnswer}
            />

            {error && <p className="text-sm mt-3" style={{ color: "var(--reject)" }}>{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary w-full mt-6">
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-center mt-4" style={{ color: "var(--ink-soft)" }}>
            <Link to="/forgot-password" className="font-medium" style={{ color: "var(--accent)" }}>Forgot password?</Link>
          </p>
          <p className="text-sm text-center mt-3" style={{ color: "var(--ink-soft)" }}>
            No account yet?{" "}
            <Link to="/signup" className="font-medium" style={{ color: "var(--accent)" }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
