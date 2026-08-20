import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PortalLogo from "../components/PortalLogo";
import OtpInput from "../components/OtpInput";
import { verifyOtp, resendOtp } from "../services/authService";
import { getApiErrorMessage } from "../utils/apiError";

export default function VerifyOtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;
  const [step, setStep] = useState("EMAIL");
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [devEmailOtp, setDevEmailOtp] = useState(location.state?.emailOtp || "");
  const [devPhoneOtp, setDevPhoneOtp] = useState(location.state?.phoneOtp || "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--paper)" }}>
        <div className="card-panel p-6 max-w-sm text-center">
          <p className="mb-4" style={{ color: "var(--ink-soft)" }}>Start from sign up to verify your account.</p>
          <Link to="/signup" className="btn-primary">Go to sign up</Link>
        </div>
      </div>
    );
  }

  const handleVerify = async (type, code, nextStep) => {
    setError("");
    setSubmitting(true);
    try {
      await verifyOtp({ userId, type, code });
      if (nextStep) {
        setStep(nextStep);
      } else {
        navigate("/login", { state: { message: "Verification complete. Sign in to continue." } });
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not verify OTP."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async (type) => {
    setError("");
    try {
      const res = await resendOtp({ userId, type });
      if (res.data?.otp) {
        if (type === "EMAIL") setDevEmailOtp(res.data.otp);
        if (type === "PHONE") setDevPhoneOtp(res.data.otp);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not resend OTP."));
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
          <p className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "var(--brass)" }}>
            Step 1b — Verify account
          </p>
          <h1 className="font-display text-xl font-semibold mb-2" style={{ color: "var(--ink)" }}>
            {step === "EMAIL" ? "Email OTP verification" : "Mobile OTP verification"}
          </h1>
          <p className="text-sm mb-4" style={{ color: "var(--ink-soft)" }}>
            {step === "EMAIL"
              ? "Enter the 6-digit code sent to your email."
              : "Enter the 6-digit code sent to your mobile number."}
          </p>

          {devEmailOtp && step === "EMAIL" && (
            <p className="text-xs mb-3 font-mono p-2 rounded" style={{ background: "var(--approve-soft)", color: "var(--approve)" }}>
              Demo OTP (email): {devEmailOtp}
            </p>
          )}
          {devPhoneOtp && step === "PHONE" && (
            <p className="text-xs mb-3 font-mono p-2 rounded" style={{ background: "var(--approve-soft)", color: "var(--approve)" }}>
              Demo OTP (SMS): {devPhoneOtp}
            </p>
          )}

          {step === "EMAIL" ? (
            <OtpInput value={emailOtp} onChange={setEmailOtp} label="Email OTP" />
          ) : (
            <OtpInput value={phoneOtp} onChange={setPhoneOtp} label="Mobile OTP" />
          )}

          {error && <p className="text-sm mt-3" style={{ color: "var(--reject)" }}>{error}</p>}

          <button
            type="button"
            disabled={submitting}
            className="btn-primary w-full mt-6"
            onClick={() =>
              step === "EMAIL"
                ? handleVerify("EMAIL", emailOtp, "PHONE")
                : handleVerify("PHONE", phoneOtp, null)
            }
          >
            {submitting ? "Verifying…" : step === "EMAIL" ? "Verify email" : "Verify mobile & finish"}
          </button>

          <button
            type="button"
            className="btn-outline w-full mt-3"
            onClick={() => handleResend(step)}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}
