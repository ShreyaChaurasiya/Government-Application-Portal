const inputClass = (hasError) =>
  `w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-4 focus:ring-sky-200 ${
    hasError
      ? "border-rose-300 bg-rose-50"
      : "border-slate-200 bg-white/80 focus:border-sky-400 focus:bg-white hover:border-sky-200"
  }`;

export default inputClass;