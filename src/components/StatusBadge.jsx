export default function StatusBadge({ status }) {
  const styles = {
    DRAFT: "text-[var(--ink-soft)]",
    SUBMITTED: "text-[var(--brass)]",
    APPROVED: "text-[var(--approve)]",
    REJECTED: "text-[var(--reject)]",
  };
  return <span className={`stamp -rotate-2 ${styles[status]}`}>{status}</span>;
}