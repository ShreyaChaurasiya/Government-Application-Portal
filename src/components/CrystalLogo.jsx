export default function CrystalLogo({ size = 40 }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-2xl shadow-lg shadow-indigo-200 bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-400"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0.5 rounded-2xl bg-gradient-to-tl from-white/40 via-transparent to-white/10" />
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" className="relative">
        <path d="M12 2 L20 9 L12 22 L4 9 Z" fill="white" fillOpacity="0.92" />
        <path d="M12 2 L20 9 L12 12 Z" fill="white" fillOpacity="0.55" />
        <path d="M4 9 L12 12 L12 22 Z" fill="white" fillOpacity="0.7" />
      </svg>
    </div>
  );
}
