import React, { useState } from "react";

export default function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left font-medium text-slate-800">
        {question}
        <span className="text-indigo-600 text-lg">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="text-sm text-slate-600 mt-2 leading-relaxed">{answer}</p>}
    </div>
  );
}
