import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import PortalLogo from "../components/PortalLogo";
import { useAuth } from "../context/AuthContext";
import { getApplications } from "../services/applicationService";
import ApplicantView from "../applicant/ApplicantView";
import ReviewerView from "../reviewer/ReviewerView";
 
export default function Dashboard() {
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState([]);
 
  useEffect(() => {
    getApplications()
      .then((res) => setApplications(res.data))
      .catch((err) => console.error(err));
  }, []);
 
  const isReviewer = user?.role === "REVIEWER";
 
  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen">
      <header className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PortalLogo size={28} />
            <span className="font-display font-semibold" style={{ color: "var(--ink)" }}>Application Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: "var(--ink-soft)" }}>
              {user?.name} · <span className="font-mono text-xs">{isReviewer ? "Reviewer" : "Applicant"}</span>
            </span>
            <button onClick={logout} className="btn-outline inline-flex items-center gap-1.5">
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>
      </header>
 
      <main className="max-w-5xl mx-auto px-6 py-10">
        {isReviewer ? (
          <ReviewerView applications={applications} setApplications={setApplications} />
        ) : (
          <ApplicantView applications={applications} setApplications={setApplications} />
        )}
      </main>
    </div>
  );
}