import { Link } from "react-router-dom";
import { FileText, ShieldCheck, ClipboardCheck, ArrowRight, UserPlus, LogIn, Building2 } from "lucide-react";
import PortalLogo from "../components/PortalLogo";
import SiteFooter from "../components/SiteFooter";

const processSteps = [
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

const gettingStartedSteps = [
  {
    step: "1",
    title: "Sign up",
    body: "Create your portal account with your name, email, and password.",
    icon: UserPlus,
    link: "/signup",
    action: "Create account",
  },
  {
    step: "2",
    title: "Log in",
    body: "Return any time to open your dashboard and continue your work.",
    icon: LogIn,
    link: "/login",
    action: "Sign in",
  },
  {
    step: "3",
    title: "Register your company",
    body: "After signing in, start a new application and submit your company project for review.",
    icon: Building2,
    link: "/app",
    action: "Go to dashboard",
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
            <Link to="/signup" className="btn-primary">Sign up</Link>
            <Link to="/login" className="btn-outline">Log in</Link>
          </nav>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "var(--brass)" }}>
            Company Project Registration
          </p>
          <h1 className="font-display text-4xl md:text-[2.75rem] leading-[1.1] font-semibold mb-5" style={{ color: "var(--ink)" }}>
            One file, from application to decision.
          </h1>
          <p className="text-[15px] leading-relaxed mb-8" style={{ color: "var(--ink-soft)" }}>
            Create an account, sign in, then register your company&apos;s project and track
            every application through review — in one place, without emailing
            documents back and forth.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/signup" className="btn-primary inline-flex items-center gap-1.5">
              Sign up <ArrowRight size={15} />
            </Link>
            <Link to="/login" className="btn-outline">Log in</Link>
          </div>
        </div>

        <div className="card-panel p-6 shadow-sm">
          <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "var(--brass)" }}>
            Getting started
          </p>
          <div className="space-y-5">
            {gettingStartedSteps.map(({ step, title, body, icon: Icon, link, action }) => (
              <div key={step} className="flex gap-4">
                <div
                  className="shrink-0 w-9 h-9 flex items-center justify-center font-mono text-sm rounded-sm"
                  style={{ background: "var(--ink)", color: "var(--paper)" }}
                >
                  {step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={15} style={{ color: "var(--accent)" }} />
                    <h2 className="font-medium" style={{ color: "var(--ink)" }}>{title}</h2>
                  </div>
                  <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--ink-soft)" }}>{body}</p>
                  <Link to={link} className="text-sm font-medium" style={{ color: "var(--accent)" }}>
                    {action} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="font-display text-xl font-semibold mb-8" style={{ color: "var(--ink)" }}>
          How an application moves through the portal
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {processSteps.map(({ n, title, body, icon: Icon }) => (
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
