import {
  createApplication,
  updateApplication,
  submitApplication as submitApplicationApi,
  getApplications
} from "../services/applicationService";
import { useState } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

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
    nationality: person?.nationality ?? "",
    dateOfBirth: normalizeDate(person?.dob),
  })),
  declarations: {
    compliesLaws: app?.declarations?.compliesLaws ?? "",
    hasInsurance: app?.declarations?.hasInsurance ?? "",
  },
});

export default function ApplicantView({ applications, setApplications }) {
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

    app.phoneNumber = "";

    app.personnel = [];

    app.declarations = {
      compliesLaws: "",
      hasInsurance: ""
    };

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
    setApplications((prev) =>
        prev.map((a) =>
            a.id === updated.id ? updated : a
        )
    );
  };


const saveDraft = async () => {

  try {
    if (!activeApp) return;

    const payload = buildApplicationPayload(activeApp);
    let response;

    if (typeof activeApp.id === "string") {
      response = await createApplication(payload);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === activeApp.id ? { ...app, id: response.data.id } : app
        )
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