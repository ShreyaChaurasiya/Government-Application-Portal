import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PortalLogo from "../components/PortalLogo";
import { verifyEmail } from "../services/authService";
import { getApiErrorMessage } from "../utils/apiError";

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState(token ? "loading" : "error");
  const [message, setMessage] = useState(token ? "" : "Missing verification token.");

  useEffect(() => {
    if (!token) return;

    verifyEmail(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.data?.message || "Email verified. You can now sign in.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(getApiErrorMessage(err, "Could not verify your email."));
      });
  }, [token]);

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
        <div className="w-full max-w-sm card-panel p-6 text-center">
          {status === "loading" && (
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Verifying your email…</p>
          )}
          {status === "success" && (
            <>
              <p className="font-display text-lg font-semibold mb-2" style={{ color: "var(--approve)" }}>Email verified</p>
              <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>{message}</p>
              <Link to="/login" className="btn-primary">Sign in</Link>
            </>
          )}
          {status === "error" && (
            <>
              <p className="font-display text-lg font-semibold mb-2" style={{ color: "var(--reject)" }}>Verification failed</p>
              <p className="text-sm mb-6" style={{ color: "var(--ink-soft)" }}>{message}</p>
              <Link to="/signup" className="btn-outline">Back to sign up</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
