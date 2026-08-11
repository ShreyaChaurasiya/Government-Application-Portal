import React from "react";
import { CheckCircle2 } from "lucide-react";
 
export default function StepIndicator({ step }) {
  const steps = ["Company Details", "Key Personnel", "Declarations"];
  return (
    <div className="flex items-center mb-8">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5 min-w-[90px]">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition"
                style={{
                  background: done ? "var(--ink)" : "white",
                  borderColor: done || active ? "var(--ink)" : "var(--line)",
                  color: done ? "var(--paper)" : active ? "var(--ink)" : "var(--ink-soft)",
                }}
              >
                {done ? <CheckCircle2 size={18} /> : n}
              </div>
              <span
                className="text-xs text-center font-mono"
                style={{ color: active ? "var(--ink)" : "var(--ink-soft)", fontWeight: active ? 600 : 400 }}
              >
                {label}
              </span>
            </div>
            {n < steps.length && (
              <div className="flex-1 h-px mx-1 mb-5" style={{ background: done ? "var(--ink)" : "var(--line)" }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}