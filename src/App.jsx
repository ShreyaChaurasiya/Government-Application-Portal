import React, { useState } from "react";
import { Plus, Trash2, ChevronLeft, ChevronRight, CheckCircle2, XCircle, FileText, ClipboardList, ArrowLeft, Mail, Phone, MapPin, HelpCircle } from "lucide-react";


const STATUS = { DRAFT: "DRAFT", SUBMITTED: "SUBMITTED", APPROVED: "APPROVED", REJECTED: "REJECTED" };

const seedApplications = [
  {
    id: "app-1",
    companyName: "Nimbus Robotics Pvt Ltd",
    address: "14 MG Road, Sector 5",
    country: "India",
    projectDescription: "Autonomous warehouse drone pilot program.",
    email: "contact@nimbusrobotics.io",
    placeOfStay: "",
    personnel: [
      { id: "p-1", name: "Ananya Rao", role: "Project Lead", nationality: "Indian", dob: "1990-03-14" },
    ],
    declarations: { compliesLaws: "yes", hasInsurance: "no" },
    selfDeclaration: false,
    status: STATUS.DRAFT,
    reviewerRemarks: "",
    createdAt: "2026-08-01T09:00:00Z",
    updatedAt: "2026-08-01T09:00:00Z",
  },
  {
    id: "app-2",
    companyName: "Solara Energy Systems",
    address: "22 Industrial Estate, Whitefield",
    country: "India",
    projectDescription: "Rooftop solar micro-grid deployment for rural clusters.",
    email: "info@solaraenergy.com",
    placeOfStay: "Bengaluru, Karnataka",
    personnel: [
      { id: "p-2", name: "Rahul Mehta", role: "Chief Engineer", nationality: "Indian", dob: "1985-07-22" },
      { id: "p-3", name: "Li Wei", role: "Technical Advisor", nationality: "Chinese", dob: "1988-11-02" },
    ],
    declarations: { compliesLaws: "yes", hasInsurance: "yes" },
    selfDeclaration: true,
    status: STATUS.SUBMITTED,
    reviewerRemarks: "",
    createdAt: "2026-07-28T09:00:00Z",
    updatedAt: "2026-07-30T09:00:00Z",
  },
];

let idCounter = 100;
const nextId = (prefix) => `${prefix}-${idCounter++}`;

function blankApplication() {
  return {
    id: nextId("app"),
    companyName: "",
    address: "",
    country: "",
    projectDescription: "",
    email: "",
    placeOfStay: "",
    personnel: [],
    declarations: { compliesLaws: "", hasInsurance: "" },
    selfDeclaration: false,
    status: STATUS.DRAFT,
    reviewerRemarks: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}



function validateApplication(app) {
  const errors = {};
  if (!app.companyName.trim()) errors.companyName = "Company name is required.";
  if (!app.address.trim()) errors.address = "Address is required.";
  if (!app.country.trim()) errors.country = "Country is required.";
  if (!app.projectDescription.trim()) errors.projectDescription = "Project description is required.";
  if (!app.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(app.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!app.placeOfStay.trim()) errors.placeOfStay = "Place of stay is required.";
  if (app.personnel.length === 0) errors.personnel = "Add at least one key personnel entry.";
  if (!app.selfDeclaration) errors.selfDeclaration = "You must confirm the self-declaration to submit.";
  return errors;
}

// Same rules as validateApplication, but scoped to just the current step's fields
function validateStep(step, app) {
  const errors = {};
  if (step === 1) {
    if (!app.companyName.trim()) errors.companyName = "Company name is required.";
    if (!app.address.trim()) errors.address = "Address is required.";
    if (!app.country.trim()) errors.country = "Country is required.";
    if (!app.projectDescription.trim()) errors.projectDescription = "Project description is required.";
    if (!app.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(app.email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!app.placeOfStay.trim()) errors.placeOfStay = "Place of stay is required.";
  }
  if (step === 2) {
    if (app.personnel.length === 0) errors.personnel = "Add at least one key personnel entry.";
  }
  if (step === 3) {
    if (!app.selfDeclaration) errors.selfDeclaration = "You must confirm the self-declaration to continue.";
  }
  return errors;
}

function Field({ label, error, required, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-rose-600">*</span>}
      </span>
      {children}
      {error && <span className="block text-xs text-rose-600 mt-1">{error}</span>}
    </label>
  );
}

const inputClass = (hasError) =>
  `w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-4 focus:ring-sky-200 ${
    hasError
      ? "border-rose-300 bg-rose-50"
      : "border-slate-200 bg-white/80 focus:border-sky-400 focus:bg-white hover:border-sky-200"
  }`;


function CrystalLogo({ size = 40 }) {
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

function StatusBadge({ status }) {
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

function StepIndicator({ step }) {
  const steps = ["Company Details", "Key Personnel", "Declarations"];
  return (
    <div className="flex items-center mb-8">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5 min-w-[90px]">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition ${
                  done
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : active
                    ? "border-indigo-600 text-indigo-600 bg-white"
                    : "border-slate-300 text-slate-400 bg-white"
                }`}
              >
                {done ? <CheckCircle2 size={18} /> : n}
              </div>
              <span className={`text-xs text-center ${active ? "text-indigo-700 font-semibold" : "text-slate-500"}`}>{label}</span>
            </div>
            {n < steps.length && <div className={`flex-1 h-0.5 mx-1 mb-5 ${done ? "bg-indigo-600" : "bg-slate-200"}`} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}


// APPLICANT WIZARD STEPS

function StepCompany({ app, setApp, errors, readOnly }) {
  const set = (field) => (e) => setApp({ ...app, [field]: e.target.value });
  return (
    <div>
      <Field label="Company Name" required error={errors.companyName}>
        <input disabled={readOnly} className={inputClass(errors.companyName)} value={app.companyName} onChange={set("companyName")} placeholder="e.g. Nimbus Robotics Pvt Ltd" />
      </Field>
      <Field label="Address" required error={errors.address}>
        <textarea disabled={readOnly} rows={2} className={inputClass(errors.address)} value={app.address} onChange={set("address")} placeholder="Registered office address" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Country" required error={errors.country}>
          <input disabled={readOnly} className={inputClass(errors.country)} value={app.country} onChange={set("country")} placeholder="e.g. India" />
        </Field>
        <Field label="Email" required error={errors.email}>
          <input disabled={readOnly} type="email" className={inputClass(errors.email)} value={app.email} onChange={set("email")} placeholder="name@company.com" />
        </Field>
      </div>
      <Field label="Project Description" required error={errors.projectDescription}>
        <textarea disabled={readOnly} rows={3} className={inputClass(errors.projectDescription)} value={app.projectDescription} onChange={set("projectDescription")} placeholder="Briefly describe the project" />
      </Field>
      <Field label="Place of Stay" required error={errors.placeOfStay}>
        <input disabled={readOnly} className={inputClass(errors.placeOfStay)} value={app.placeOfStay} onChange={set("placeOfStay")} placeholder="City, State" />
      </Field>
    </div>
  );
}

function StepPersonnel({ app, setApp, errors, readOnly }) {
  const addRow = () =>
    setApp({ ...app, personnel: [...app.personnel, { id: nextId("p"), name: "", role: "", nationality: "", dob: "" }] });
  const removeRow = (id) => setApp({ ...app, personnel: app.personnel.filter((p) => p.id !== id) });
  const updateRow = (id, field, value) =>
    setApp({ ...app, personnel: app.personnel.map((p) => (p.id === id ? { ...p, [field]: value } : p)) });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Key Personnel</h3>
        {!readOnly && (
          <button
            onClick={addRow}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 border border-indigo-600/40 hover:border-indigo-600 rounded-md px-3 py-1.5 transition"
          >
            <Plus size={16} /> Add Person
          </button>
        )}
      </div>

      {errors.personnel && <p className="text-xs text-rose-600 mb-3">{errors.personnel}</p>}

      {app.personnel.length === 0 ? (
        <div className="text-sm text-slate-500 border border-dashed border-slate-300 rounded-md py-8 text-center">
          No key personnel added yet.
        </div>
      ) : (
        <div className="space-y-3">
          {app.personnel.map((p, idx) => (
            <div key={p.id} className="border border-white bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">Person {idx + 1}</span>
                {!readOnly && (
                  <button onClick={() => removeRow(p.id)} className="text-rose-500 hover:text-rose-700" aria-label="Remove person">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input disabled={readOnly} className={inputClass(false)} placeholder="Full name" value={p.name} onChange={(e) => updateRow(p.id, "name", e.target.value)} />
                <input disabled={readOnly} className={inputClass(false)} placeholder="Role" value={p.role} onChange={(e) => updateRow(p.id, "role", e.target.value)} />
                <input disabled={readOnly} className={inputClass(false)} placeholder="Nationality" value={p.nationality} onChange={(e) => updateRow(p.id, "nationality", e.target.value)} />
                <input disabled={readOnly} type="date" className={inputClass(false)} value={p.dob} onChange={(e) => updateRow(p.id, "dob", e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepDeclarations({ app, setApp, errors, readOnly }) {
  const setDecl = (key) => (e) => setApp({ ...app, declarations: { ...app.declarations, [key]: e.target.value } });
  const questions = [
    { key: "compliesLaws", label: "Does the company comply with all applicable local laws and regulations?" },
    { key: "hasInsurance", label: "Does the company hold valid liability insurance for this project?" },
  ];

  return (
    <div>
      {questions.map((q) => (
        <div key={q.key} className="mb-4">
          <span className="block text-sm font-medium text-slate-700 mb-2">{q.label}</span>
          <div className="flex gap-4">
            {["yes", "no"].map((val) => (
              <label key={val} className="inline-flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="radio"
                  disabled={readOnly}
                  name={q.key}
                  checked={app.declarations[q.key] === val}
                  onChange={setDecl(q.key)}
                  value={val}
                  className="accent-indigo-600"
                />
                {val === "yes" ? "Yes" : "No"}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className={`mt-6 rounded-md border p-4 ${errors.selfDeclaration ? "border-rose-400 bg-rose-50" : "border-slate-200 bg-slate-50"}`}>
        <label className="flex items-start gap-3 text-sm text-slate-700">
          <input
            type="checkbox"
            disabled={readOnly}
            checked={app.selfDeclaration}
            onChange={(e) => setApp({ ...app, selfDeclaration: e.target.checked })}
            className="mt-0.5 accent-indigo-600 w-4 h-4"
          />
          <span>
            I hereby declare that the information provided above is true and correct to the best of my knowledge, and I
            take full responsibility for any discrepancies.
          </span>
        </label>
        {errors.selfDeclaration && <p className="text-xs text-rose-600 mt-2">{errors.selfDeclaration}</p>}
      </div>
    </div>
  );
}


// APPLICANT VIEW


function ApplicantView({ applications, setApplications }) {
  const [screen, setScreen] = useState("list"); // 'list' | 'wizard'
  const [activeId, setActiveId] = useState(null);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const activeApp = applications.find((a) => a.id === activeId);
  const readOnly = activeApp && activeApp.status !== STATUS.DRAFT;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Mirrors: POST /api/applications
  const startNewApplication = () => {
    const app = blankApplication();
    setApplications([app, ...applications]);
    setActiveId(app.id);
    setStep(1);
    setErrors({});
    setScreen("wizard");
  };

  const openApplication = (id) => {
    setActiveId(id);
    setStep(1);
    setErrors({});
    setScreen("wizard");
  };

  const setActiveApp = (updated) => {
    
    setApplications(applications.map((a) => (a.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : a)));
  };

  
  const saveDraft = () => {
    setActiveApp(activeApp);
    showToast("Draft saved.");
  };

  
  const submitApplication = () => {
    const validationErrors = validateApplication(activeApp);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      showToast("Please fix the errors before submitting.");
      return;
    }
    setActiveApp({ ...activeApp, status: STATUS.SUBMITTED });
    showToast("Application submitted successfully.");
  };

  if (screen === "list") {
    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">My Applications</h2>
          <button
            onClick={startNewApplication}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-0.5 text-white text-sm font-medium rounded-full px-4 py-2 transition-all duration-200 shadow-md"
          >
            <Plus size={16} /> New Application
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="text-center text-slate-500 border border-dashed border-slate-300 rounded-lg py-12">
            No applications yet. Start a new one above.
          </div>
        ) : (
          <div className="space-y-2">
            {applications.map((a) => (
              <button
                key={a.id}
                onClick={() => openApplication(a.id)}
                className="w-full text-left flex items-center justify-between border border-white bg-white/50 backdrop-blur-sm rounded-xl px-4 py-3 hover:border-sky-300 hover:bg-white/80 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <p className="font-medium text-slate-800">{a.companyName || "Untitled Application"}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Updated {new Date(a.updatedAt).toLocaleDateString()}</p>
                </div>
                <StatusBadge status={a.status} />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => setScreen("list")} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-4">
        <ArrowLeft size={15} /> Back to my applications
      </button>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-slate-800">{activeApp.companyName || "New Application"}</h2>
        <StatusBadge status={activeApp.status} />
      </div>
      {readOnly && (
        <p className="text-xs text-slate-500 mb-4">This application has been submitted and can no longer be edited.</p>
      )}

      <StepIndicator step={step} />

      {step === 1 && <StepCompany app={activeApp} setApp={setActiveApp} errors={errors} readOnly={readOnly} />}
      {step === 2 && <StepPersonnel app={activeApp} setApp={setActiveApp} errors={errors} readOnly={readOnly} />}
      {step === 3 && <StepDeclarations app={activeApp} setApp={setActiveApp} errors={errors} readOnly={readOnly} />}

      <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-200">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 disabled:opacity-30 hover:text-indigo-600"
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div className="flex items-center gap-3">
          {!readOnly && (
            <button onClick={saveDraft} className="text-sm font-medium text-slate-600 hover:text-indigo-600 border border-slate-300 rounded-md px-4 py-2 transition">
              Save Draft
            </button>
          )}
          {step < 3 ? (
          <button
          onClick={() => {
              const stepErrors = validateStep(step, activeApp);
              setErrors(stepErrors);
              if (Object.keys(stepErrors).length === 0) setStep(step + 1);
          }}
          className="inline-flex items-center gap-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-0.5 text-white text-sm font-medium rounded-full px-4 py-2 transition-all duration-200 shadow-md"
          >
          Next <ChevronRight size={16} />
              </button>
          ) : (
            !readOnly && (
              <button onClick={submitApplication} className="bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-0.5 text-white text-sm font-semibold rounded-full px-6 py-2.5 transition-all duration-200 shadow-md shadow-indigo-200">
                Submit Application
              </button>
            )
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-4 py-2 rounded-md shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}


// REVIEWER VIEW


function ReviewerView({ applications, setApplications }) {
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


// ROOT APP

function SiteHeader({ mode, setMode }) {
  return (
    <header className="bg-white/70 backdrop-blur-xl border-b border-white sticky top-0 z-10 shadow-sm">
      {/* Top bar */}
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CrystalLogo size={40} />
          <div>
            <p className="font-semibold text-slate-800 text-[15px] leading-tight bg-gradient-to-r from-indigo-700 via-sky-600 to-fuchsia-600 bg-clip-text text-transparent">
              Company Application Portal
            </p>
            <p className="text-xs text-slate-500">A unit of C-DAC &nbsp;•&nbsp; MVP — Task 0</p>
          </div>
        </div>

        <div className="flex items-center bg-white/70 border border-white rounded-full p-1 shadow-inner">
          <button
            onClick={() => setMode("applicant")}
            className={`inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-3.5 py-1.5 transition-all duration-200 ${
              mode === "applicant"
                ? "bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 text-white shadow-md"
                : "text-slate-500 hover:text-indigo-600"
            }`}
          >
            <FileText size={15} /> Applicant
          </button>
          <button
            onClick={() => setMode("reviewer")}
            className={`inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-3.5 py-1.5 transition-all duration-200 ${
              mode === "reviewer"
                ? "bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 text-white shadow-md"
                : "text-slate-500 hover:text-indigo-600"
            }`}
          >
            <ClipboardList size={15} /> Reviewer
          </button>
        </div>
      </div>

      {/* Nav strip */}
      <div className="border-t border-white/60 bg-white/40">
        <nav className="max-w-5xl mx-auto px-6 h-10 flex items-center gap-6 text-sm text-slate-600">
          <a href="#" className="text-indigo-700 font-semibold">Home</a>
          <a href="#" className="hover:text-indigo-600 transition">My Applications</a>
          <a href="#" className="hover:text-indigo-600 transition">Guidelines</a>
          <a href="#" className="hover:text-indigo-600 transition">Help &amp; Support</a>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="relative mt-16 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-slate-300 overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-fuchsia-500 rounded-full opacity-20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-500 rounded-full opacity-20 blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CrystalLogo size={32} />
            <span className="text-white font-semibold">Application Portal</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            A single window for companies to register projects and for reviewers to approve or reject submissions.
          </p>
        </div>

        <div>
          <p className="text-white font-medium mb-3">Quick Links</p>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#" className="hover:text-cyan-300 transition">Home</a></li>
            <li><a href="#" className="hover:text-cyan-300 transition">Start an Application</a></li>
            <li><a href="#" className="hover:text-cyan-300 transition">Track Status</a></li>
            <li><a href="#" className="hover:text-cyan-300 transition">Reviewer Login</a></li>
          </ul>
        </div>

        <div>
  <p className="text-white font-medium mb-3">Resources</p>
  <ul className="space-y-2 text-slate-400">
    <li className="flex items-center gap-2"><HelpCircle size={14} /> <a href="#faqs" className="hover:text-cyan-300 transition">FAQs</a></li>
    <li><a href="#guidelines" className="hover:text-cyan-300 transition">Application Guidelines</a></li>
    <li><a href="#terms" className="hover:text-cyan-300 transition">Terms of Use</a></li>
    <li><a href="#privacy" className="hover:text-cyan-300 transition">Privacy Policy</a></li>
  </ul>
</div>

        <div>
          <p className="text-white font-medium mb-3">Contact</p>
          <ul className="space-y-2 text-slate-400">
            <li className="flex items-center gap-2"><Mail size={14} /> support@applicationportal.gov.in</li>
            <li className="flex items-center gap-2"><Phone size={14} /> +91 141 000 0000</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> New Delhi, Delhi, India</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Company Application Portal. All rights reserved.</span>
          <span>Built with React.js &amp; Spring Boot</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [applications, setApplications] = useState(seedApplications);
  const [mode, setMode] = useState("applicant");

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-fuchsia-50 font-sans flex flex-col relative overflow-x-hidden scroll-smooth">
      {/* CHANGE 1: added "scroll-smooth" at the end of the className above ☝️ */}

      {/* ambient crystal glows */}
      <div className="pointer-events-none fixed top-[-10%] left-[-5%] w-80 h-80 bg-sky-300 rounded-full opacity-30 blur-3xl" />
      <div className="pointer-events-none fixed top-[20%] right-[-10%] w-96 h-96 bg-fuchsia-300 rounded-full opacity-25 blur-3xl" />
      <div className="pointer-events-none fixed bottom-[-10%] left-[20%] w-96 h-96 bg-cyan-300 rounded-full opacity-25 blur-3xl" />

      <SiteHeader mode={mode} setMode={setMode} /> 
      <main className="relative max-w-3xl mx-auto px-6 py-10 flex-1 w-full">
        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl p-6 shadow-xl shadow-indigo-100">
          {mode === "applicant" ? (
            <ApplicantView applications={applications} setApplications={setApplications} />
          ) : (
            <ReviewerView applications={applications} setApplications={setApplications} />
          )}
        </div>
      </main>

      {mode === "applicant" && <ResourcesSection />}
      {/* CHANGE 2: added this line right here, between </main> and <SiteFooter /> */}

      <SiteFooter />
    </div>
  );
}


function FaqItem({ question, answer }) {
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

function ResourcesSection() {
  return (
    <div className="relative max-w-3xl mx-auto px-6 space-y-14 py-6">
      <section id="faqs" className="scroll-mt-28">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          <FaqItem question="How long does application review take?" answer="Reviewers typically respond within 3-5 business days after submission." />
          <FaqItem question="Can I edit my application after submitting?" answer="No. Once submitted, the application becomes read-only. You can only edit while it's still in DRAFT status." />
          <FaqItem question="What happens if my application is rejected?" answer="You'll see the reviewer's remarks on your application status page. You may create a new application addressing the feedback." />
        </div>
      </section>

      <section id="guidelines" className="scroll-mt-28">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Application Guidelines</h2>
        <div className="bg-white/60 backdrop-blur-sm border border-white rounded-xl p-5 shadow-sm text-sm text-slate-600 space-y-2">
          <p>Before submitting, make sure:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Company name, address, country, and project description are filled in.</li>
            <li>Your email address is valid and reachable.</li>
            <li>At least one key personnel entry is added.</li>
            <li>The self-declaration checkbox is checked.</li>
            <li>Place of stay is provided.</li>
          </ul>
        </div>
      </section>

      <section id="terms" className="scroll-mt-28">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Terms of Use</h2>
        <div className="bg-white/60 backdrop-blur-sm border border-white rounded-xl p-5 shadow-sm text-sm text-slate-600 space-y-2">
          <p>By using this portal, you agree to provide accurate and truthful information in your application.</p>
          <p>Misrepresentation of company or personnel details may result in rejection or revocation of approval.</p>
        </div>
      </section>

      <section id="privacy" className="scroll-mt-28">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Privacy Policy</h2>
        <div className="bg-white/60 backdrop-blur-sm border border-white rounded-xl p-5 shadow-sm text-sm text-slate-600 space-y-2">
          <p>Information submitted through this portal is used solely for application review purposes.</p>
          <p>Personnel details are not shared with third parties outside the review process.</p>
        </div>
      </section>
    </div>
  );
}