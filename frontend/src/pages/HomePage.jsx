import { useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Terms from "@/components/Terms";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const hasTracked = useRef(false);

  const trackPageView = useCallback(async () => {
    if (hasTracked.current) return;
    hasTracked.current = true;
    
    try {
      await axios.post(`${API}/analytics`, {
        event_type: "page_view",
        page: "home",
        metadata: {
          referrer: document.referrer,
          userAgent: navigator.userAgent
        }
      });
    } catch (e) {
      console.log("Analytics tracking failed");
    }
  }, []);

  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  return (
    <div className="min-h-screen bg-[#040810] grid-texture relative overflow-hidden">
      <div className="glow-orb glow-orb-cyan w-[600px] h-[600px] -top-64 -right-64 fixed opacity-50" />
      <div className="glow-orb glow-orb-green w-[400px] h-[400px] top-1/2 -left-48 fixed opacity-30" />
      <div className="glow-orb glow-orb-cyan w-[500px] h-[500px] bottom-0 right-1/4 fixed opacity-20" />
      
      <Navigation />
      <main>
        <Hero />
        <Services />
        <About />
        <Terms />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
