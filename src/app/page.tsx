import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AboutSection } from "@/components/about-section";
import { ScheduleSection } from "@/components/schedule-section";
import { FAQSection } from "@/components/faq-section";
import { RegisterSection } from "@/components/register-section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <RegisterSection />
        <ScheduleSection />
        <FAQSection />
      </main>
      
      <Footer />
    </div>
  );
}
