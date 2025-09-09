import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Users } from "lucide-react";
import QuoteForm from "@/components/forms/QuoteForm";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// Use direct image URLs from the web
const images = [
  { src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80", alt: "Insurance Expert Woman" },
  { src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", alt: "Insurance Expert Man" },
  { src: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80", alt: "Happy Family Insured" },
];

const HeroSection = () => {
  return (
    <section className="hero-gradient min-h-[90vh] flex items-center py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
                Buy Insurance,{" "}
                <span className="text-primary">The Smart Way.</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Fifteen minutes could save you fifteen percent or more on car insurance. 
                Drive tension-free with our comprehensive insurance coverage that protects what matters most.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <QuoteForm>
                <Button 
                  size="lg" 
                  className="primary-gradient shadow-glow hover:shadow-glow text-lg px-8 py-6 transition-spring"
                >
                  Get Your Quote
                </Button>
              </QuoteForm>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6 transition-spring"
              >
                Learn More
              </Button>
            </div>

            {/* Features */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shadow-soft">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Quick & Easy</h3>
                  <p className="text-sm text-muted-foreground">Hassle Free Process</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center shadow-soft">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">100% Claims</h3>
                  <p className="text-sm text-muted-foreground">Support Guaranteed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image Slider */}
          <div className="relative">
            <div className="relative max-w-xs mx-auto lg:max-w-sm">
              <div className="absolute -inset-4 primary-gradient rounded-2xl opacity-20 blur-lg"></div>
              <Card className="relative overflow-hidden shadow-card rounded-2xl">
                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={30}
                  slidesPerView={1}
                  loop={true}
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-auto object-cover max-h-72"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </Card>
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-accent/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary/20 rounded-full blur-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;