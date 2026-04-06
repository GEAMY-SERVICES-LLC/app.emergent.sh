import { Package, Wrench } from "@phosphor-icons/react";

const MATERIALS_TERMS = [
  { id: "m1", text: "50% deposit required before any order" },
  { id: "m2", text: "Balance due before delivery" },
  { id: "m3", text: "Non-refundable deposit on cancellation" },
  { id: "m4", text: "7-day claims window" },
  { id: "m5", text: "Ownership stays with Geamy until paid in full" },
  { id: "m6", text: "Accepted payments: bank transfer, credit card, Zelle" },
];

const SERVICES_TERMS = [
  { id: "s1", text: "Assessment before every project" },
  { id: "s2", text: "Written approval required" },
  { id: "s3", text: "50% deposit for all implementation work" },
  { id: "s4", text: "Hourly billing for one-time support" },
  { id: "s5", text: "Client provides access and credentials" },
  { id: "s6", text: "No liability for third-party platform failures (Microsoft, Google, GoDaddy)" },
  { id: "s7", text: "Out-of-scope work quoted separately" },
  { id: "s8", text: "30-day warranty on all work performed" },
];

const TermsList = ({ terms }) => (
  <ul className="space-y-4">
    {terms.map((term, index) => (
      <li key={term.id} className="flex items-start gap-3">
        <span className="text-[#00d4ff] font-mono text-sm mt-0.5">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-mono text-sm text-gray-400">{term.text}</span>
      </li>
    ))}
  </ul>
);

const Terms = () => {
  return (
    <section className="py-24 md:py-32 relative bg-[#0a1120]/30" id="terms" data-testid="terms-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#00d4ff]">
            How We Work
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4">
            Terms & Conditions
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8" data-testid="terms-columns">
          <div className="glass-panel p-8" data-testid="materials-terms">
            <div className="flex items-center gap-3 mb-6">
              <Package size={28} weight="thin" className="text-[#00d4ff]" />
              <h3 className="font-heading text-xl font-semibold text-white">
                Materials & Device Procurement
              </h3>
            </div>
            <TermsList terms={MATERIALS_TERMS} />
          </div>

          <div className="glass-panel p-8" data-testid="services-terms">
            <div className="flex items-center gap-3 mb-6">
              <Wrench size={28} weight="thin" className="text-[#00d4ff]" />
              <h3 className="font-heading text-xl font-semibold text-white">
                IT Services & Implementation
              </h3>
            </div>
            <TermsList terms={SERVICES_TERMS} />
          </div>
        </div>

        <div className="mt-8 text-center" data-testid="jurisdiction">
          <p className="font-mono text-sm text-gray-500">
            Jurisdiction: <span className="text-gray-400">State of Florida</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Terms;
