import { useState } from "react";
 
export default function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-panel p-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left font-medium"
        style={{ color: "var(--ink)" }}
      >
        {question}
        <span className="font-mono text-lg" style={{ color: "var(--accent)" }}>{open ? "−" : "+"}</span>
      </button>
      {open && <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--ink-soft)" }}>{answer}</p>}
    </div>
  );
}