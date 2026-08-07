export default function StatusBadge({ status }) {
  const styles = {
    DRAFT: "bg-slate-100 text-slate-700 border-slate-300",
    SUBMITTED: "bg-amber-50 text-amber-800 border-amber-300",
    APPROVED: "bg-emerald-50 text-emerald-800 border-emerald-300",
    REJECTED: "bg-rose-50 text-rose-800 border-rose-300",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {status}
    </span>
  );
}