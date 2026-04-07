import { useState, useCallback } from "react";
import { Envelope, MapPin, PaperPlaneTilt, CircleNotch } from "@phosphor-icons/react";
import axios from "axios";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API = "/api";

const SERVICES = [
  "Network Infrastructure",
  "Microsoft 365 & Cloud Migrations",
  "Security & Endpoint Protection",
  "CCTV & Physical Security",
  "Website, Domain & Hosting",
  "Automation & Workflow",
  "Backup & Disaster Recovery",
  "IT Support & Helpdesk",
  "Other",
];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

const Contact = () => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleServiceChange = useCallback((value) => {
    setFormData((prev) => ({ ...prev, service: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.service || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API}/contact`, formData);
      toast.success(response.data.message || "Message sent successfully!");
      setFormData(INITIAL_FORM);
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return (
    <section className="py-24 md:py-32 relative" id="contact" data-testid="contact-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#00d4ff]">
            Get In Touch
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-4">
            Contact Us
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <ContactInfo />
          <ContactForm
            formData={formData}
            isSubmitting={isSubmitting}
            onChange={handleChange}
            onServiceChange={handleServiceChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </section>
  );
};

const ContactInfo = () => (
  <div className="space-y-8" data-testid="contact-info">
    <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-white">
      Let's talk about
      <br />
      your project.
    </h3>

    <p className="font-mono text-base text-gray-400 leading-relaxed">
      Ready to improve your IT infrastructure? Get in touch for a free
      consultation. We respond within 24 hours.
    </p>

    <div className="space-y-4">
      <a
        href="mailto:gerardo@geamyservices.com"
        className="flex items-center gap-4 glass-panel p-4 hover:border-[#00d4ff]/50 transition-colors group"
        data-testid="contact-email"
      >
        <Envelope
          size={24}
          weight="thin"
          className="text-[#00d4ff] group-hover:text-white transition-colors"
        />
        <div>
          <div className="font-mono text-xs text-gray-500 uppercase tracking-wider">
            Email
          </div>
          <div className="font-mono text-sm text-white">
            gerardo@geamyservices.com
          </div>
        </div>
      </a>

      <div className="flex items-center gap-4 glass-panel p-4" data-testid="contact-location">
        <MapPin size={24} weight="thin" className="text-[#00d4ff]" />
        <div>
          <div className="font-mono text-xs text-gray-500 uppercase tracking-wider">
            Location
          </div>
          <div className="font-mono text-sm text-white">
            Miami, FL — Remote available
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ContactForm = ({ formData, isSubmitting, onChange, onServiceChange, onSubmit }) => (
  <div className="glass-panel p-8" data-testid="contact-form-container">
    <form onSubmit={onSubmit} className="space-y-6" data-testid="contact-form">
      <FormField label="Name *" name="name" type="text" value={formData.name} onChange={onChange} placeholder="Your name" required />
      <FormField label="Email *" name="email" type="email" value={formData.email} onChange={onChange} placeholder="your@email.com" required />
      <FormField label="Phone" name="phone" type="tel" value={formData.phone} onChange={onChange} placeholder="(555) 555-5555" />

      <div>
        <label className="font-mono text-xs text-gray-500 uppercase tracking-wider block mb-2">
          Service Needed *
        </label>
        <Select value={formData.service} onValueChange={onServiceChange}>
          <SelectTrigger
            className="w-full bg-transparent border-0 border-b border-white/10 rounded-none text-white font-mono focus:ring-0 focus:ring-offset-0 focus:border-[#00d4ff] h-12 px-0"
            data-testid="contact-select-service"
          >
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a1120] border-white/10">
            {SERVICES.map((service) => (
              <SelectItem
                key={service}
                value={service}
                className="font-mono text-gray-300 focus:bg-[#00d4ff]/10 focus:text-[#00d4ff]"
              >
                {service}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="font-mono text-xs text-gray-500 uppercase tracking-wider block mb-2">
          Message *
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={onChange}
          className="form-input min-h-[120px] resize-none"
          placeholder="Tell us about your project..."
          required
          data-testid="contact-input-message"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-neon w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        data-testid="contact-submit-btn"
      >
        {isSubmitting ? (
          <>
            <CircleNotch size={20} className="animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <PaperPlaneTilt size={20} weight="bold" />
            Send Message
          </>
        )}
      </button>
    </form>
  </div>
);

const FormField = ({ label, name, type, value, onChange, placeholder, required }) => (
  <div>
    <label className="font-mono text-xs text-gray-500 uppercase tracking-wider block mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="form-input"
      placeholder={placeholder}
      required={required}
      data-testid={`contact-input-${name}`}
    />
  </div>
);

export default Contact;
