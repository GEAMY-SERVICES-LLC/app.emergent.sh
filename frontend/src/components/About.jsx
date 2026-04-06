import Marquee from "react-fast-marquee";
import { MapPin, Globe, Translate, Clock, Certificate } from "@phosphor-icons/react";

const TECH_STACK = [
  "Meraki", "FortiGate", "Palo Alto", "WatchGuard", "MikroTik", "Ubiquiti",
  "Microsoft 365", "Azure", "Intune", "Sophos", "ThreatLocker", "Acronis",
  "Veeam", "VMware", "Hyper-V", "Proxmox", "ConnectWise", "NinjaRMM", "ITGlue",
];

const INFO_CARDS = [
  { id: "location", icon: MapPin, label: "Location", value: "Miami, FL" },
  { id: "area", icon: Globe, label: "Service Area", value: "South Florida + Remote" },
  { id: "lang", icon: Translate, label: "Languages", value: "English & Spanish" },
  { id: "response", icon: Clock, label: "Response Time", value: "< 24 hours" },
];

const CERTIFICATIONS = [
  { id: "net", name: "CompTIA Network+", status: "Active" },
  { id: "ms900", name: "MS-900", status: "Active" },
  { id: "sec", name: "CompTIA Security+", status: "In Progress" },
];

const InfoCard = ({ card }) => {
  const IconComponent = card.icon;
  return (
    <div className="glass-panel p-4">
      <IconComponent size={24} weight="thin" className="text-[#00d4ff] mb-2" />
      <div className="font-mono text-xs text-gray-500 uppercase tracking-wider">
        {card.label}
      </div>
      <div className="font-mono text-sm text-white mt-1">{card.value}</div>
    </div>
  );
};

const CertificationItem = ({ cert }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
    <span className="font-mono text-sm text-gray-300">{cert.name}</span>
    <span
      className={`font-mono text-xs px-3 py-1 ${
        cert.status === "Active"
          ? "text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/30"
          : "text-yellow-400 bg-yellow-400/10 border border-yellow-400/30"
      }`}
    >
      {cert.status}
    </span>
  </div>
);

const About = () => {
  return (
    <section className="py-24 md:py-32 relative" id="about" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#00d4ff]">
            Who We Are
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4">
            About Geamy Services
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-8">
            <div className="glass-panel p-8" data-testid="about-description">
              <p className="font-mono text-base text-gray-400 leading-relaxed mb-6">
                Geamy Services LLC is a Miami-based IT consultancy run by{" "}
                <span className="text-white">Gerardo Espinosa</span>, a network
                engineer with 12+ years of experience across ISP environments,
                managed services, and enterprise IT.
              </p>
              <p className="font-mono text-base text-gray-400 leading-relaxed">
                Bilingual in English and Spanish. Serving South Florida on-site
                and remote clients nationwide.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4" data-testid="info-cards">
              {INFO_CARDS.map((card) => (
                <InfoCard key={card.id} card={card} />
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-panel p-8" data-testid="certifications">
              <div className="flex items-center gap-3 mb-6">
                <Certificate size={24} weight="thin" className="text-[#00d4ff]" />
                <h3 className="font-heading text-xl font-semibold text-white">
                  Certifications
                </h3>
              </div>
              <div className="space-y-4">
                {CERTIFICATIONS.map((cert) => (
                  <CertificationItem key={cert.id} cert={cert} />
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 border-l-2 border-[#00d4ff]">
              <p className="font-mono text-sm text-gray-400">
                All work comes with a{" "}
                <span className="text-[#00d4ff] font-bold">30-day warranty</span>.
                Direct communication with the engineer, no ticket queues.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16" data-testid="tech-stack-marquee">
          <div className="text-center mb-8">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
              Technologies We Work With
            </span>
          </div>

          <Marquee
            gradient={true}
            gradientColor="#040810"
            gradientWidth={100}
            speed={30}
            pauseOnHover={true}
          >
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="tech-pill mx-2 hover:border-[#00d4ff]/50 hover:text-[#00d4ff] transition-colors cursor-default"
              >
                {tech}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
};

export default About;
