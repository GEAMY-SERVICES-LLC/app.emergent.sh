import {
  Network,
  Cloud,
  ShieldCheck,
  VideoCameraSlash,
  Globe,
  Robot,
  Database,
  Headset,
} from "@phosphor-icons/react";

const SERVICES = [
  {
    id: "network",
    icon: Network,
    title: "Network Infrastructure",
    description: "Firewall, router, switch, and Wi-Fi setup. Structured cabling, VLANs, VPNs.",
    tags: ["FortiGate", "Meraki", "Ubiquiti", "MikroTik"],
  },
  {
    id: "cloud",
    icon: Cloud,
    title: "Microsoft 365 & Cloud Migrations",
    description: "Full migrations to M365 or Google Workspace. Email, SharePoint, Teams, Intune.",
    tags: ["M365", "Azure", "Intune", "Google Workspace"],
  },
  {
    id: "security",
    icon: ShieldCheck,
    title: "Security & Endpoint Protection",
    description: "Antivirus, EDR, ThreatLocker, endpoint hardening.",
    tags: ["EDR", "ThreatLocker", "Sophos", "Palo Alto"],
  },
  {
    id: "cctv",
    icon: VideoCameraSlash,
    title: "CCTV & Physical Security",
    description: "IP cameras, NVR setup, remote viewing, access control.",
    tags: ["IP Cameras", "NVR", "Access Control", "Remote View"],
  },
  {
    id: "web",
    icon: Globe,
    title: "Website, Domain & Hosting",
    description: "Domain registration, DNS, hosting on GoDaddy/Hostinger/M365, basic web design.",
    tags: ["GoDaddy", "Hostinger", "DNS", "Web Design"],
  },
  {
    id: "automation",
    icon: Robot,
    title: "Automation & Workflow",
    description: "RMM scripting, process automation, workflow optimization.",
    tags: ["NinjaRMM", "PowerShell", "ConnectWise", "Scripts"],
  },
  {
    id: "backup",
    icon: Database,
    title: "Backup & Disaster Recovery",
    description: "Acronis, Veeam, cloud backup solutions.",
    tags: ["Acronis", "Veeam", "Cloud Backup", "Recovery"],
  },
  {
    id: "support",
    icon: Headset,
    title: "IT Support & Helpdesk",
    description: "Remote and on-site support, hardware installation, maintenance.",
    tags: ["Remote Support", "On-Site", "Hardware", "Maintenance"],
  },
];

const ServiceCard = ({ service }) => {
  const IconComponent = service.icon;
  
  return (
    <div className="service-card group" data-testid={`service-card-${service.id}`}>
      <div className="mb-6">
        <IconComponent
          size={40}
          weight="thin"
          className="text-[#00d4ff] group-hover:text-white transition-colors duration-300"
        />
      </div>
      <h3 className="font-heading text-lg font-semibold text-white mb-3">
        {service.title}
      </h3>
      <p className="font-mono text-sm text-gray-400 leading-relaxed mb-6">
        {service.description}
      </p>
      <div className="flex flex-wrap gap-2">
        {service.tags.map((tag) => (
          <span key={`${service.id}-${tag}`} className="tech-pill">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const Services = () => {
  return (
    <section className="py-24 md:py-32 relative" id="services" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#00d4ff]">
            What We Do
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4">
            Our Services
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="services-grid">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
