import FaqItem from "./FaqItem";
 
export default function ResourcesSection() {
  return (
    <div className="relative max-w-3xl mx-auto px-6 space-y-14 py-6">
      <section id="faqs" className="scroll-mt-28">
        <h2 className="font-display text-xl font-semibold mb-4" style={{ color: "var(--ink)" }}>Frequently Asked Questions</h2>
        <div className="space-y-3">
          <FaqItem question="How long does application review take?" answer="Reviewers typically respond within 3-5 business days after submission." />
          <FaqItem question="Can I edit my application after submitting?" answer="No. Once submitted, the application becomes read-only. You can only edit while it's still in DRAFT status." />
          <FaqItem question="What happens if my application is rejected?" answer="You'll see the reviewer's remarks on your application status page. You may create a new application addressing the feedback." />
        </div>
      </section>
 
      <section id="guidelines" className="scroll-mt-28">
        <h2 className="font-display text-xl font-semibold mb-4" style={{ color: "var(--ink)" }}>Application Guidelines</h2>
        <div className="card-panel p-5 text-sm space-y-2" style={{ color: "var(--ink-soft)" }}>
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
        <h2 className="font-display text-xl font-semibold mb-4" style={{ color: "var(--ink)" }}>Terms of Use</h2>
        <div className="card-panel p-5 text-sm space-y-2" style={{ color: "var(--ink-soft)" }}>
          <p>By using this portal, you agree to provide accurate and truthful information in your application.</p>
          <p>Misrepresentation of company or personnel details may result in rejection or revocation of approval.</p>
        </div>
      </section>
 
      <section id="privacy" className="scroll-mt-28">
        <h2 className="font-display text-xl font-semibold mb-4" style={{ color: "var(--ink)" }}>Privacy Policy</h2>
        <div className="card-panel p-5 text-sm space-y-2" style={{ color: "var(--ink-soft)" }}>
          <p>Information submitted through this portal is used solely for application review purposes.</p>
          <p>Personnel details are not shared with third parties outside the review process.</p>
        </div>
      </section>
    </div>
  );
}