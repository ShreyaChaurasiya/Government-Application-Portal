import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  HelpCircle,
} from "lucide-react";

import CrystalLogo from "./CrystalLogo";

export default function SiteFooter() {
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

