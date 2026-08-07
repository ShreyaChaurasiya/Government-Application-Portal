import SiteHeader from "./components/SiteHeader";

import SiteFooter from "./components/SiteFooter";
import ResourcesSection from "./components/ResourcesSection";
import ApplicantView from "./applicant/ApplicantView";
import ReviewerView from "./reviewer/ReviewerView";
import { useEffect, useState } from "react";
import { getApplications } from "./services/applicationService";

export default function App() {
    const [applications, setApplications] = useState([]);
    const [mode, setMode] = useState("applicant");



    useEffect(() => {
        getApplications()
            .then((response) => {
                setApplications(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);



  return (
    <div className="min-h-screen bg-linear-to-br from-sky-50 via-indigo-50 to-fuchsia-50 font-sans flex flex-col relative overflow-x-hidden scroll-smooth">
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
      <SiteFooter />
    </div>
  );
}
