const inputClass = (hasError) =>
  `w-full rounded border px-3 py-2.5 text-sm outline-none transition-colors duration-150 ${
    hasError
      ? "border-[var(--reject)] bg-[var(--reject-soft)]"
      : "border-[var(--line)] bg-white focus:border-[var(--ink)]"
  }`;
 
export default inputClass;