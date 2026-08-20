import { useCallback, useEffect, useState } from "react";
import inputClass from "../utils/inputClass";
import { getCaptcha } from "../services/authService";
import { getApiErrorMessage } from "../utils/apiError";

export default function CaptchaField({ captchaId, captchaAnswer, onCaptchaId, onCaptchaAnswer, error }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCaptcha = useCallback((isRefresh = false) => {
    if (isRefresh) setLoading(true);

    getCaptcha()
      .then((res) => {
        onCaptchaId(res.data.captchaId);
        onCaptchaAnswer("");
        setQuestion(res.data.question);
      })
      .catch((err) => {
        setQuestion(getApiErrorMessage(err, "Could not load captcha."));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [onCaptchaAnswer, onCaptchaId]);

  useEffect(() => {
    let cancelled = false;

    getCaptcha()
      .then((res) => {
        if (cancelled) return;
        onCaptchaId(res.data.captchaId);
        onCaptchaAnswer("");
        setQuestion(res.data.question);
      })
      .catch((err) => {
        if (cancelled) return;
        setQuestion(getApiErrorMessage(err, "Could not load captcha."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [onCaptchaAnswer, onCaptchaId]);

  return (
    <div className="mt-4">
      <label className="block text-sm mb-1.5" style={{ color: "var(--ink-soft)" }}>
        Security check (captcha)
      </label>
      <div className="flex items-center gap-2 mb-2">
        <span className="font-mono text-sm px-3 py-2 rounded-sm" style={{ background: "var(--paper-card)", border: "1px solid var(--line)" }}>
          {loading ? "Loading…" : `What is ${question}?`}
        </span>
        <button type="button" onClick={() => loadCaptcha(true)} className="btn-outline text-xs py-1 px-2">
          Refresh
        </button>
      </div>
      <input
        required
        className={inputClass(error)}
        value={captchaAnswer}
        onChange={(e) => onCaptchaAnswer(e.target.value)}
        placeholder="Enter answer"
        disabled={!captchaId}
      />
      {error && <p className="text-xs mt-1" style={{ color: "var(--reject)" }}>{error}</p>}
    </div>
  );
}
