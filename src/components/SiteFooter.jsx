import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, HelpCircle } from "lucide-react";
import PortalLogo from "./PortalLogo";

export default function SiteFooter() {
  return (
    <footer className="mt-16" style={{ background: "var(--ink)", color: "#c7cbd4" }}>
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <PortalLogo size={30} inverted />
            <span className="text-white font-display font-semibold">Application Portal</span>
          </div>
          <p className="leading-relaxed">
            A single window for companies to register projects and for reviewers to approve or reject submissions.
          </p>
        </div>

        <div>
          <p className="text-white font-medium mb-3">Quick Links</p>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/signup" className="hover:text-white transition">Sign up</Link></li>
            <li><Link to="/login" className="hover:text-white transition">Log in</Link></li>
            <li><Link to="/app" className="hover:text-white transition">Company registration</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-white font-medium mb-3">Resources</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2"><HelpCircle size={14} /> <a href="#faqs" className="hover:text-white transition">FAQs</a></li>
            <li><a href="#guidelines" className="hover:text-white transition">Application Guidelines</a></li>
            <li><a href="#terms" className="hover:text-white transition">Terms of Use</a></li>
            <li><a href="#privacy" className="hover:text-white transition">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <p className="text-white font-medium mb-3">Contact</p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2"><Mail size={14} /> support@applicationportal.gov.in</li>
            <li className="flex items-center gap-2"><Phone size={14} /> +91 141 000 0000</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> New Delhi, Delhi, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between text-xs" style={{ color: "#8b90a0" }}>
          <span>© {new Date().getFullYear()} Company Application Portal. All rights reserved.</span>
          <span className="font-mono">Built with React &amp; Spring Boot</span>
        </div>
      </div>
    </footer>
  );
}
