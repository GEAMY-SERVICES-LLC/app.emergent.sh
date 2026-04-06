import { Envelope } from "@phosphor-icons/react";

const Footer = () => {
  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#about", label: "About" },
    { href: "#terms", label: "Terms" },
    { href: "#contact", label: "Contact" },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t border-white/10 py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <a
              href="/"
              className="font-heading text-2xl font-bold text-white tracking-tight inline-block"
              data-testid="footer-logo"
            >
              GEAMY<span className="text-[#00d4ff]">.</span>
            </a>
            <p className="font-mono text-sm text-gray-400 leading-relaxed">
              IT solutions built to last.
              <br />
              Miami, FL — Remote available.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">
              Navigation
            </h4>
            <nav className="space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="block nav-link"
                  data-testid={`footer-link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">
              Contact
            </h4>
            <a
              href="mailto:gerardo@geamyservices.com"
              className="flex items-center gap-2 nav-link"
              data-testid="footer-email"
            >
              <Envelope size={16} weight="thin" />
              gerardo@geamyservices.com
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-gray-500">
            Copyright &copy; {new Date().getFullYear()} Geamy Services LLC. All rights reserved.
          </p>
          <p className="font-mono text-xs text-gray-500">
            State of Florida, USA.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
