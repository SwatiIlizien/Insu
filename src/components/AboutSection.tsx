import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Shield, Users, Clock } from "lucide-react";
import familyImage from "@/assets/happy-family.jpg";
import consultationImage from "@/assets/consultation.jpg";
import ApplicationForm from "@/components/forms/ApplicationForm";
import ConsultationForm from "@/components/forms/ConsultationForm";

const AboutSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Why Choose Us */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
                Why Choose <span className="text-primary">Insu-Raksha?</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We understand that choosing the right insurance is crucial for protecting your future. 
                That's why we've built our services around what matters most to you.
              </p>
            </div>

            <div className="grid gap-6">
              {[
                {
                  icon: Shield,
                  title: "Comprehensive Coverage",
                  description: "Complete protection for all your insurance needs under one roof"
                },
                {
                  icon: Users,
                  title: "Expert Guidance",
                  description: "Our experienced team provides personalized advice for your unique situation"
                },
                {
                  icon: Clock,
                  title: "Quick Processing",
                  description: "Fast claim processing and instant policy issuance for your convenience"
                },
                {
                  icon: CheckCircle,
                  title: "100% Transparency",
                  description: "No hidden charges, clear terms, and honest recommendations always"
                }
              ].map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <ApplicationForm>
              <Button 
                size="lg" 
                className="primary-gradient shadow-soft hover:shadow-glow transition-spring"
              >
                Start Your Application
              </Button>
            </ApplicationForm>
          </div>

          <div className="relative max-w-md mx-auto">
            <div className="absolute -inset-4 accent-gradient rounded-2xl opacity-20 blur-lg"></div>
            <Card className="relative overflow-hidden shadow-card">
              <img 
                src={familyImage} 
                alt="Happy family representing our insurance protection services" 
                className="w-full h-auto object-cover max-h-64"
              />
            </Card>
          </div>
        </div>

        {/* Consultation Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="lg:order-2 space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
                Get <span className="text-accent">Personal</span> Consultation
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Our insurance experts are here to help you make informed decisions. 
                Schedule a free consultation to discuss your specific needs and find the perfect coverage.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-foreground">Free initial consultation</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-foreground">Personalized insurance recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-foreground">Compare multiple insurance providers</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span className="text-foreground">Ongoing support and assistance</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <ConsultationForm>
                <Button 
                  size="lg" 
                  className="accent-gradient shadow-soft hover:shadow-glow transition-spring"
                >
                  Book Consultation
                </Button>
              </ConsultationForm>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-spring"
              >
                Call Now: +91 79834 79191
              </Button>
            </div>
          </div>

          <div className="lg:order-1 relative max-w-md mx-auto">
            <div className="absolute -inset-4 primary-gradient rounded-2xl opacity-20 blur-lg"></div>
            <Card className="relative overflow-hidden shadow-card">
              <img 
                src={consultationImage} 
                alt="Professional insurance consultation meeting" 
                className="w-full h-auto object-cover max-h-64"
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;