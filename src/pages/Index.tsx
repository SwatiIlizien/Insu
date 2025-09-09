import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import AboutSection from "@/components/AboutSection";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";
import CommissionSection from "@/components/CommissionSection";

interface IndexProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  userPhone: string;
  setUserPhone: (value: string) => void;
}

const Index = ({ isLoggedIn, setIsLoggedIn, userPhone, setUserPhone }: IndexProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main>
        <section id="home">
          <HeroSection />
        </section>
        <section id="services">
          <ServicesGrid />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <StatsSection />
        
        {/* Commission/Referral Section */}
        <CommissionSection isLoggedIn={isLoggedIn} userPhone={userPhone} />
        
        <section id="contact">
          {/* You can add your contact form or info here */}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
