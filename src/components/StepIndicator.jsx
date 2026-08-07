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
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition ${
                  done
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : active
                    ? "border-indigo-600 text-indigo-600 bg-white"
                    : "border-slate-300 text-slate-400 bg-white"
                }`}
              >
                {done ? <CheckCircle2 size={18} /> : n}
              </div>
              <span className={`text-xs text-center ${active ? "text-indigo-700 font-semibold" : "text-slate-500"}`}>{label}</span>
            </div>
            {n < steps.length && <div className={`flex-1 h-0.5 mx-1 mb-5 ${done ? "bg-indigo-600" : "bg-slate-200"}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
