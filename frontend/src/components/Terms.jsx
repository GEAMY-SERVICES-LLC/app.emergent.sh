import { Package, Wrench } from "@phosphor-icons/react";

const Terms = () => {
  const materialsTerms = [
    "50% deposit required before any order",
    "Balance due before delivery",
    "Non-refundable deposit on cancellation",
    "7-day claims window",
    "Ownership stays with Geamy until paid in full",
    "Accepted payments: bank transfer, credit card, Zelle",
  ];

  const servicesTerms = [
    "Assessment before every project",
    "Written approval required",
    "50% deposit for all implementation work",
    "Hourly billing for one-time support",
    "Client provides access and credentials",
    "No liability for third-party platform failures (Microsoft, Google, GoDaddy)",
    "Out-of-scope work quoted separately",
    "30-day warranty on all work performed",
  ];

  return (
    <section className="py-24 md:py-32 relative bg-[#0a1120]/30" id="terms" data-testid="terms-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#00d4ff]">
            How We Work
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4">
            Terms & Conditions
          </h2>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8" data-testid="terms-columns">
          {/* Materials & Device Procurement */}
          <div className="glass-panel p-8" data-testid="materials-terms">
            <div className="flex items-center gap-3 mb-6">
              <Package size={28} weight="thin" className="text-[#00d4ff]" />
              <h3 className="font-heading text-xl font-semibold text-white">
                Materials & Device Procurement
              </h3>
            </div>

            <ul className="space-y-4">
              {materialsTerms.map((term, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[#00d4ff] font-mono text-sm mt-0.5">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-sm text-gray-400">
                    {term}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* IT Services & Implementation */}
          <div className="glass-panel p-8" data-testid="services-terms">
            <div className="flex items-center gap-3 mb-6">
              <Wrench size={28} weight="thin" className="text-[#00d4ff]" />
              <h3 className="font-heading text-xl font-semibold text-white">
                IT Services & Implementation
              </h3>
            </div>

            <ul className="space-y-4">
              {servicesTerms.map((term, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-[#00d4ff] font-mono text-sm mt-0.5">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-sm text-gray-400">
                    {term}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Jurisdiction Note */}
        <div className="mt-8 text-center" data-testid="jurisdiction">
          <p className="font-mono text-sm text-gray-500">
            Jurisdiction:{" "}
            <span className="text-gray-400">State of Florida</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Terms;
