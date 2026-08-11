import React from "react";
import { FileText, ClipboardList } from "lucide-react";
import PortalLogo from "./PortalLogo";

export default function SiteHeader({ mode, setMode }) {
  return (
    <header className="bg-white/70 backdrop-blur-xl border-b border-white sticky top-0 z-10 shadow-sm">
      {/* Top bar */}
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PortalLogo size={40} />
          <div>
            <p className="font-semibold text-slate-800 text-[15px] leading-tight bg-gradient-to-r from-indigo-700 via-sky-600 to-fuchsia-600 bg-clip-text text-transparent">
              Company Application Portal
            </p>
            <p className="text-xs text-slate-500">A unit of C-DAC &nbsp;•&nbsp; MVP — Task 0</p>
          </div>
        </div>

        <div className="flex items-center bg-white/70 border border-white rounded-full p-1 shadow-inner">
          <button
            onClick={() => setMode("applicant")}
            className={`inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-3.5 py-1.5 transition-all duration-200 ${
              mode === "applicant"
                ? "bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 text-white shadow-md"
                : "text-slate-500 hover:text-indigo-600"
            }`}
          >
            <FileText size={15} /> Applicant
          </button>
          <button
            onClick={() => setMode("reviewer")}
            className={`inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-3.5 py-1.5 transition-all duration-200 ${
              mode === "reviewer"
                ? "bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 text-white shadow-md"
                : "text-slate-500 hover:text-indigo-600"
            }`}
          >
            <ClipboardList size={15} /> Reviewer
          </button>
        </div>
      </div>

      {/* Nav strip */}
      <div className="border-t border-white/60 bg-white/40">
        <nav className="max-w-5xl mx-auto px-6 h-10 flex items-center gap-6 text-sm text-slate-600">
          <a href="#" className="text-indigo-700 font-semibold">Home Page</a>
        </nav>
      </div>
    </header>
  );
}
