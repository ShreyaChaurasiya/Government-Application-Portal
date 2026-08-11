import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PortalLogo from "../components/PortalLogo";
import inputClass from "../utils/inputClass";
import { signup as signupApi } from "../services/authService";
import { useAuth } from "../context/AuthContext";
 
export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "APPLICANT" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
 
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await signupApi(form);
      login(response.data);
      navigate("/app");
    } catch (err) {
      const message = err?.response?.data?.message || "Could not create your account.";
      setError(message);
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
          <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "var(--brass)" }}>Register</p>
          <h1 className="font-display text-2xl font-semibold mb-6" style={{ color: "var(--ink)" }}>
            Create your account
          </h1>
 
          <form onSubmit={handleSubmit} className="card-panel p-6">
            <label className="block text-sm mb-1.5" style={{ color: "var(--ink-soft)" }}>Full name</label>
            <input required autoFocus className={inputClass(false)} value={form.name} onChange={set("name")} placeholder="Ananya Rao" />
 
            <label className="block text-sm mb-1.5 mt-4" style={{ color: "var(--ink-soft)" }}>Email</label>
            <input type="email" required className={inputClass(false)} value={form.email} onChange={set("email")} placeholder="name@company.com" />
 
            <label className="block text-sm mb-1.5 mt-4" style={{ color: "var(--ink-soft)" }}>Password</label>
            <input type="password" required minLength={6} className={inputClass(false)} value={form.password} onChange={set("password")} placeholder="At least 6 characters" />
 
            <label className="block text-sm mb-1.5 mt-4" style={{ color: "var(--ink-soft)" }}>Account type</label>
            <div className="flex gap-4">
              {[
                { value: "APPLICANT", label: "Applicant" },
                { value: "REVIEWER", label: "Reviewer" },
              ].map((opt) => (
                <label key={opt.value} className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--ink)" }}>
                  <input
                    type="radio"
                    name="role"
                    value={opt.value}
                    checked={form.role === opt.value}
                    onChange={set("role")}
                    style={{ accentColor: "var(--accent)" }}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
 
            {error && <p className="text-sm mt-3" style={{ color: "var(--reject)" }}>{error}</p>}
 
            <button type="submit" disabled={submitting} className="btn-primary w-full mt-6">
              {submitting ? "Creating account…" : "Create account"}
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