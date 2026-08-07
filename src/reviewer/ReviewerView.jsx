import React, { useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";

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
    .sort((a, b) => (a.status === STATUS.SUBMITTED ? -1 : 1));
  const activeApp = applications.find((a) => a.id === activeId);

  const openApp = (id) => {
    setActiveId(id);
    setRemarks("");
  };

  
  const approve = () => {
    setApplications(applications.map((a) => (a.id === activeApp.id ? { ...a, status: STATUS.APPROVED, reviewerRemarks: remarks, updatedAt: new Date().toISOString() } : a)));
    showToast("Application approved.");
  };

  
  const reject = () => {
    setApplications(applications.map((a) => (a.id === activeApp.id ? { ...a, status: STATUS.REJECTED, reviewerRemarks: remarks, updatedAt: new Date().toISOString() } : a)));
    showToast("Application rejected.");
  };

  if (!activeApp) {
    return (
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-5">Submitted Applications</h2>
        {list.length === 0 ? (
          <div className="text-center text-slate-500 border border-dashed border-slate-300 rounded-lg py-12">
            No applications yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-slate-500 border-b border-slate-200">
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
                  className="border-b border-slate-100 hover:bg-sky-50 cursor-pointer transition"
                >
                  <td className="py-3 font-medium text-slate-800">{a.companyName || "Untitled Application"}</td>
                  <td className="py-3">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="py-3 text-slate-500">{new Date(a.updatedAt).toLocaleDateString()}</td>
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
      <button onClick={() => setActiveId(null)} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-4">
        <ArrowLeft size={15} /> Back to list
      </button>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-800">{activeApp.companyName || "Untitled Application"}</h2>
        <StatusBadge status={activeApp.status} />
      </div>

      <section className="mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Company Details</h3>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm bg-white/60 backdrop-blur-sm border border-white rounded-xl p-4 shadow-sm">
          <p><span className="text-slate-500">Address:</span> {activeApp.address || "—"}</p>
          <p><span className="text-slate-500">Country:</span> {activeApp.country || "—"}</p>
          <p><span className="text-slate-500">Email:</span> {activeApp.email || "—"}</p>
          <p><span className="text-slate-500">Place of Stay:</span> {activeApp.placeOfStay || "—"}</p>
          <p className="col-span-2"><span className="text-slate-500">Project Description:</span> {activeApp.projectDescription || "—"}</p>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Key Personnel</h3>
        {activeApp.personnel.length === 0 ? (
          <p className="text-sm text-slate-500">No personnel listed.</p>
        ) : (
          <div className="space-y-2">
            {activeApp.personnel.map((p) => (
              <div key={p.id} className="text-sm bg-white/60 backdrop-blur-sm border border-white rounded-xl p-3 grid grid-cols-4 gap-2 shadow-sm">
                <p>{p.name || "—"}</p>
                <p className="text-slate-500">{p.role || "—"}</p>
                <p className="text-slate-500">{p.nationality || "—"}</p>
                <p className="text-slate-500">{p.dob || "—"}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Declarations</h3>
        <div className="text-sm bg-white/60 backdrop-blur-sm border border-white rounded-xl p-4 space-y-1 shadow-sm">
          <p>Complies with local laws: <strong>{activeApp.declarations.compliesLaws || "—"}</strong></p>
          <p>Holds liability insurance: <strong>{activeApp.declarations.hasInsurance || "—"}</strong></p>
          <p>Self-declaration confirmed: <strong>{activeApp.selfDeclaration ? "Yes" : "No"}</strong></p>
        </div>
      </section>

      {activeApp.status === STATUS.SUBMITTED ? (
        <section className="border-t border-slate-200 pt-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Review Decision</h3>
          <textarea
            className={inputClass(false)}
            rows={3}
            placeholder="Optional remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
          <div className="flex gap-3 mt-3">
            <button onClick={approve} className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-md px-4 py-2 transition">
              <CheckCircle2 size={16} /> Approve
            </button>
            <button onClick={reject} className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-md px-4 py-2 transition">
              <XCircle size={16} /> Reject
            </button>
          </div>
        </section>
      ) : activeApp.reviewerRemarks ? (
        <section className="border-t border-slate-200 pt-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-1">Reviewer Remarks</h3>
          <p className="text-sm text-slate-600">{activeApp.reviewerRemarks}</p>
        </section>
      ) : null}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-4 py-2 rounded-md shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
