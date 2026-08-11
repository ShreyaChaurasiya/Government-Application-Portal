import { Link } from "react-router-dom";
import { FileText, ShieldCheck, ClipboardCheck, ArrowRight } from "lucide-react";
import PortalLogo from "../components/PortalLogo";
import SiteFooter from "../components/SiteFooter";
 
const steps = [
  {
    n: "01",
    title: "Submit your application",
    body: "Fill in company details, list key personnel, and confirm your declarations. Save as a draft and come back any time before you submit.",
    icon: FileText,
  },
  {
    n: "02",
    title: "Reviewer examines the file",
    body: "A reviewer checks the company details, personnel, and declarations against the guidelines before making a decision.",
    icon: ClipboardCheck,
  },
  {
    n: "03",
    title: "Decision is recorded",
    body: "You'll see the outcome and any reviewer remarks on your application. Approved files are closed; rejected ones can be re-filed.",
    icon: ShieldCheck,
  },
];
 
export default function LandingPage() {
  return (
    <div style={{ background: "var(--paper)" }} className="min-h-screen">
      <header className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PortalLogo size={30} />
            <span className="font-display font-semibold text-lg" style={{ color: "var(--ink)" }}>
              Application Portal
            </span>
          </div>
          <nav className="flex items-center gap-3">
            <Link to="/login" className="btn-outline">Log in</Link>
            <Link to="/signup" className="btn-primary">Register a company</Link>
          </nav>
        </div>
      </header>
 
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "var(--brass)" }}>
            Company Project Registration
          </p>
          <h1 className="font-display text-4xl md:text-[2.75rem] leading-[1.1] font-semibold mb-5" style={{ color: "var(--ink)" }}>
            One file, from application to decision.
          </h1>
          <p className="text-[15px] leading-relaxed mb-8" style={{ color: "var(--ink-soft)" }}>
            Register your company's project, list key personnel, and track
            every application through review — in one place, without emailing
            documents back and forth.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/signup" className="btn-primary inline-flex items-center gap-1.5">
              Start an application <ArrowRight size={15} />
            </Link>
            <Link to="/login" className="btn-outline">I already have an account</Link>
          </div>
        </div>
 
        <div className="card-panel p-6 shadow-sm relative">
          <div className="absolute -top-3 left-6 font-mono text-[11px] px-2 py-0.5" style={{ background: "var(--ink)", color: "var(--paper)" }}>
            FILE NO. APP-2026-00142
          </div>
          <div className="pt-3">
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Company</p>
            <p className="font-display text-lg font-semibold mb-4" style={{ color: "var(--ink)" }}>Solara Energy Systems</p>
 
            <div className="grid grid-cols-2 gap-y-3 text-sm mb-4">
              <div>
                <p style={{ color: "var(--ink-soft)" }}>Country</p>
                <p>India</p>
              </div>
              <div>
                <p style={{ color: "var(--ink-soft)" }}>Personnel</p>
                <p>2 listed</p>
              </div>
            </div>
 
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "var(--line)" }}>
              <span className="text-xs" style={{ color: "var(--ink-soft)" }}>Updated 30 Jul 2026</span>
              <span className="stamp text-[var(--approve)] -rotate-2">Approved</span>
            </div>
          </div>
        </div>
      </section>
 
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="font-display text-xl font-semibold mb-8" style={{ color: "var(--ink)" }}>How an application moves through the portal</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(({ n, title, body, icon: Icon }) => (
            <div key={n} className="card-panel p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-xs" style={{ color: "var(--brass)" }}>{n}</span>
                <Icon size={16} style={{ color: "var(--accent)" }} />
              </div>
              <h3 className="font-medium mb-1.5" style={{ color: "var(--ink)" }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ink-soft)" }}>{body}</p>
            </div>
          ))}
        </div>
      </section>
 
      <SiteFooter />
    </div>
  );
}