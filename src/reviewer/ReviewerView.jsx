import { useState } from "react";
import {
  approveApplication,
  rejectApplication,
  getApplications
} from "../services/applicationService";
 
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
 
import StatusBadge from "../components/StatusBadge";
import inputClass from "../utils/inputClass";
import { STATUS } from "../utils/constants";
 
export default function ReviewerView({ applications, setApplications }) {
  const [activeId, setActiveId] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [toast, setToast] = useState(null);
 
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };
 
  const list = applications
    .filter((a) => a.status !== STATUS.DRAFT)
    .sort((a, b) => {
      if (a.status === STATUS.SUBMITTED && b.status !== STATUS.SUBMITTED) return -1;
      if (b.status === STATUS.SUBMITTED && a.status !== STATUS.SUBMITTED) return 1;
      return 0;
    });
  const activeApp = applications.find((a) => a.id === activeId);
 
  const openApp = (id) => {
    setActiveId(id);
    setRemarks("");
  };
 
  const approve = async () => {
    try {
      await approveApplication(activeApp.id, remarks);
      const response = await getApplications();
      setApplications(response.data);
      setActiveId(null);
      showToast("Application approved.");
    } catch (error) {
      console.error(error);
      showToast("Failed to approve application.");
    }
  };
 
  const reject = async () => {
    try {
      await rejectApplication(activeApp.id, remarks);
      const response = await getApplications();
      setApplications(response.data);
      setActiveId(null);
      showToast("Application rejected.");
    } catch (error) {
      console.error(error);
      showToast("Failed to reject application.");
    }
  };
 
  if (!activeApp) {
    return (
      <div>
        <h2 className="font-display text-lg font-semibold mb-5" style={{ color: "var(--ink)" }}>Submitted Applications</h2>
        {list.length === 0 ? (
          <div className="text-center border border-dashed rounded py-12" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
            No applications yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase font-mono border-b" style={{ color: "var(--ink-soft)", borderColor: "var(--line)" }}>
                <th className="pb-2 font-semibold">Company</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 font-semibold">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr
                  key={a.id}
                  onClick={() => openApp(a.id)}
                  className="border-b cursor-pointer transition hover:bg-[var(--paper-card)]"
                  style={{ borderColor: "var(--line)" }}
                >
                  <td className="py-3 font-medium" style={{ color: "var(--ink)" }}>{a.companyName || "Untitled Application"}</td>
                  <td className="py-3"><StatusBadge status={a.status} /></td>
                  <td className="py-3 font-mono text-xs" style={{ color: "var(--ink-soft)" }}>{new Date(a.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
 
  return (
    <div>
      <button onClick={() => setActiveId(null)} className="inline-flex items-center gap-1.5 text-sm mb-4" style={{ color: "var(--ink-soft)" }}>
        <ArrowLeft size={15} /> Back to list
      </button>
 
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-lg font-semibold" style={{ color: "var(--ink)" }}>{activeApp.companyName || "Untitled Application"}</h2>
        <StatusBadge status={activeApp.status} />
      </div>
 
      <section className="mb-6">
        <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--ink)" }}>Company Details</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm card-panel p-4">
          <p><span style={{ color: "var(--ink-soft)" }}>Address:</span> {activeApp.address || "—"}</p>
          <p><span style={{ color: "var(--ink-soft)" }}>Country:</span> {activeApp.country || "—"}</p>
          <p><span style={{ color: "var(--ink-soft)" }}>Email:</span> {activeApp.email || "—"}</p>
          <p><span style={{ color: "var(--ink-soft)" }}>Place of Stay:</span> {activeApp.placeOfStay || "—"}</p>
          <p className="col-span-2"><span style={{ color: "var(--ink-soft)" }}>Project Description:</span> {activeApp.projectDescription || "—"}</p>
        </div>
      </section>
 
      <section className="mb-6">
        <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--ink)" }}>Key Personnel</h3>
        {(!activeApp.personnel || activeApp.personnel.length === 0) ? (
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>No personnel listed.</p>
        ) : (
          <div className="space-y-2">
            {(activeApp.personnel || []).map((p, index) => (
              <div key={p.id || index} className="text-sm card-panel p-3 grid grid-cols-4 gap-2">
                <p>{p.name || "—"}</p>
                <p style={{ color: "var(--ink-soft)" }}>{p.role || "—"}</p>
                <p style={{ color: "var(--ink-soft)" }}>{p.nationality || "—"}</p>
                <p style={{ color: "var(--ink-soft)" }}>{p.dob || "—"}</p>
              </div>
            ))}
          </div>
        )}
      </section>
 
      <section className="mb-6">
        <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--ink)" }}>Declarations</h3>
        <div className="text-sm card-panel p-4 space-y-1">
          <p>Complies with local laws: <strong>{activeApp.declarations?.compliesLaws || "—"}</strong></p>
          <p>Holds liability insurance: <strong>{activeApp.declarations?.hasInsurance || "—"}</strong></p>
          <p>Self-declaration confirmed: <strong>{activeApp.selfDeclaration ? "Yes" : "No"}</strong></p>
        </div>
      </section>
 
      {activeApp.status === STATUS.SUBMITTED ? (
        <section className="border-t pt-5" style={{ borderColor: "var(--line)" }}>
          <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--ink)" }}>Review Decision</h3>
          <textarea
            className={inputClass(false)}
            rows={3}
            placeholder="Optional remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          <div className="flex gap-3 mt-3">
            <button onClick={approve} className="btn-approve inline-flex items-center gap-1.5">
              <CheckCircle2 size={16} /> Approve
            </button>
            <button onClick={reject} className="btn-reject inline-flex items-center gap-1.5">
              <XCircle size={16} /> Reject
            </button>
          </div>
        </section>
      ) : (activeApp.reviewerRemarks || activeApp.remarks) ? (
        <section className="border-t pt-5" style={{ borderColor: "var(--line)" }}>
          <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--ink)" }}>Reviewer Remarks</h3>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>{activeApp.reviewerRemarks || activeApp.remarks}</p>
        </section>
      ) : null}
 
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-sm px-4 py-2 rounded shadow-lg" style={{ background: "var(--ink)", color: "var(--paper)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}