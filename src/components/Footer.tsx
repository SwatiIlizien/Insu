import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 primary-gradient rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">IR</span>
              </div>
              <span className="text-2xl font-display font-bold text-foreground">
                Insu-Raksha
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Your trusted partner for comprehensive insurance solutions. 
              We make insurance simple, accessible, and affordable for everyone.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm" className="border-border hover:border-primary">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-border hover:border-primary">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-border hover:border-primary">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="border-border hover:border-primary">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-3">
              {["About Us", "Services", "Claims", "Support", "Blog", "Careers"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Insurance Types */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Insurance Types</h3>
            <ul className="space-y-3">
              {["Car Insurance", "Health Insurance", "Life Insurance", "Travel Insurance", "Home Insurance", "Business Insurance"].map((insurance) => (
                <li key={insurance}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                    {insurance}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Contact Us</h3>
            <div className="space-y-4">
              <Card className="p-4 card-gradient border-border/50">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Call Us</p>
                    <p className="text-sm text-muted-foreground">+91 79834 79191</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 card-gradient border-border/50">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Email Us</p>
                    <p className="text-sm text-muted-foreground">support@insu-raksha.com</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4 card-gradient border-border/50">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Visit Us</p>
                    <p className="text-sm text-muted-foreground">New Delhi, India</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © 2024 Insu-Raksha. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;