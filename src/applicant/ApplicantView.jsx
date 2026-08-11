import {
  createApplication,
  updateApplication,
  submitApplication as submitApplicationApi,
  getApplications
} from "../services/applicationService";
import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
 
import StepCompany from "./StepCompany";
import StepPersonnel from "./StepPersonnel";
import StepDeclarations from "./StepDeclarations";
 
import StepIndicator from "../components/StepIndicator";
import StatusBadge from "../components/StatusBadge";
 
import { STATUS } from "../utils/constants";
import { blankApplication } from "../utils/helpers";
import { validateApplication, validateStep } from "../utils/validation";
 
const normalizeDate = (value) => {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parts = value.split(/[-/]/);
  if (parts.length === 3) {
    const [first, second, third] = parts;
    if (first.length === 4) return value;
    if (third.length === 4) return `${third}-${second.padStart(2, "0")}-${first.padStart(2, "0")}`;
  }
  return value;
};
 
const buildApplicationPayload = (app) => ({
  companyName: app?.companyName ?? "",
  address: app?.address ?? "",
  country: app?.country ?? "",
  projectDescription: app?.projectDescription ?? "",
  email: app?.email ?? "",
  placeOfStay: app?.placeOfStay ?? "",
  phoneNumber: app?.phoneNumber ?? "",
  selfDeclaration: Boolean(app?.selfDeclaration),
  personnel: (app?.personnel || []).map((person) => ({
    name: person?.name ?? "",
    role: person?.role ?? "",
    email: person?.email ?? "",
    nationality: person?.nationality ?? "",
    dateOfBirth: normalizeDate(person?.dob),
  })),
  declarations: {
    compliesLaws: app?.declarations?.compliesLaws ?? "",
    hasInsurance: app?.declarations?.hasInsurance ?? "",
  },
});
 
export default function ApplicantView({ applications, setApplications }) {
  const [screen, setScreen] = useState("list");
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
 
  const startNewApplication = () => {
    const app = blankApplication();
    app.phoneNumber = "";
    app.personnel = [];
    app.declarations = { compliesLaws: "", hasInsurance: "" };
    setApplications((prev) => [app, ...prev]);
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
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };
 
  const saveDraft = async () => {
    try {
      if (!activeApp) return;
      const payload = buildApplicationPayload(activeApp);
      let response;
 
      if (typeof activeApp.id === "string") {
        response = await createApplication(payload);
        setApplications((prev) =>
          prev.map((app) => (app.id === activeApp.id ? { ...app, id: response.data.id } : app))
        );
        setActiveId(response.data.id);
      } else {
        response = await updateApplication(activeApp.id, payload);
      }
 
      const refreshed = await getApplications();
      setApplications(refreshed.data);
      showToast("Draft saved.");
    } catch (error) {
      console.error(error);
      const responseData = error?.response?.data;
      const message = typeof responseData === "string"
        ? responseData
        : responseData?.message || error?.message || "Failed to save draft.";
      showToast(message);
    }
  };
 
  const submitApplication = async () => {
    const validationErrors = validateApplication(activeApp);
    setErrors(validationErrors);
 
    if (Object.keys(validationErrors).length > 0) {
      showToast("Please fix the errors before submitting.");
      return;
    }
 
    try {
      if (!activeApp) return;
      const payload = buildApplicationPayload(activeApp);
      let applicationId = activeApp.id;
 
      if (typeof applicationId === "string") {
        const createResponse = await createApplication(payload);
        applicationId = createResponse.data.id;
        setActiveId(applicationId);
      }
 
      await submitApplicationApi(applicationId);
      const refreshed = await getApplications();
      setApplications(refreshed.data);
      showToast("Application submitted successfully.");
      setScreen("list");
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || error?.message || "Failed to submit application.";
      showToast(message);
    }
  };
 
  if (screen === "list") {
    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold" style={{ color: "var(--ink)" }}>My Applications</h2>
          <button onClick={startNewApplication} className="btn-primary inline-flex items-center gap-1.5">
            <Plus size={16} /> New Application
          </button>
        </div>
 
        {applications.length === 0 ? (
          <div className="text-center border border-dashed rounded py-12" style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}>
            No applications yet. Start a new one above.
          </div>
        ) : (
          <div className="space-y-2">
            {applications.map((a) => (
              <button
                key={a.id}
                onClick={() => openApplication(a.id)}
                className="w-full text-left flex items-center justify-between card-panel px-4 py-3 hover:shadow-sm transition"
                style={{ borderColor: "var(--line)" }}
              >
                <div>
                  <p className="font-medium" style={{ color: "var(--ink)" }}>{a.companyName || "Untitled Application"}</p>
                  <p className="text-xs mt-0.5 font-mono" style={{ color: "var(--ink-soft)" }}>Updated {new Date(a.updatedAt).toLocaleDateString()}</p>
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
      <button onClick={() => setScreen("list")} className="inline-flex items-center gap-1.5 text-sm mb-4" style={{ color: "var(--ink-soft)" }}>
        <ArrowLeft size={15} /> Back to my applications
      </button>
 
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display text-lg font-semibold" style={{ color: "var(--ink)" }}>{activeApp.companyName || "New Application"}</h2>
        <StatusBadge status={activeApp.status} />
      </div>
      {readOnly && (
        <p className="text-xs mb-4" style={{ color: "var(--ink-soft)" }}>This application has been submitted and can no longer be edited.</p>
      )}
 
      <StepIndicator step={step} />
 
      {step === 1 && <StepCompany app={activeApp} setApp={setActiveApp} errors={errors} readOnly={readOnly} />}
      {step === 2 && <StepPersonnel app={activeApp} setApp={setActiveApp} errors={errors} readOnly={readOnly} />}
      {step === 3 && <StepDeclarations app={activeApp} setApp={setActiveApp} errors={errors} readOnly={readOnly} />}
 
      <div className="flex items-center justify-between mt-8 pt-5 border-t" style={{ borderColor: "var(--line)" }}>
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="inline-flex items-center gap-1 text-sm font-medium disabled:opacity-30"
          style={{ color: "var(--ink-soft)" }}
        >
          <ChevronLeft size={16} /> Back
        </button>
 
        <div className="flex items-center gap-3">
          {!readOnly && (
            <button onClick={saveDraft} className="btn-outline">Save Draft</button>
          )}
          {step < 3 ? (
            <button
              onClick={() => {
                const stepErrors = validateStep(step, activeApp);
                setErrors(stepErrors);
                if (Object.keys(stepErrors).length === 0) setStep(step + 1);
              }}
              className="btn-primary inline-flex items-center gap-1"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            !readOnly && (
              <button onClick={submitApplication} className="btn-primary">
                Submit Application
              </button>
            )
          )}
        </div>
      </div>
 
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-sm px-4 py-2 rounded shadow-lg" style={{ background: "var(--ink)", color: "var(--paper)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}