import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, User, LogOut } from "lucide-react";
import QuoteForm from "@/components/forms/QuoteForm";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const Header = ({ isLoggedIn, setIsLoggedIn }: HeaderProps) => {
  const [showLogin, setShowLogin] = useState(false);
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out!",
      variant: "default",
    });
  };

  return (
    <header className="w-full bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="/favicon.ico" 
              alt="Insu-Raksha Logo" 
              className="w-10 h-10 rounded-lg"
            />
            <span className="text-2xl font-display font-bold text-foreground">
              Insu-Raksha
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground hover:text-primary transition-smooth font-medium">
              Home
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-smooth font-medium">
              About
            </a>
            <a href="#services" className="text-foreground hover:text-primary transition-smooth font-medium">
              Services
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-smooth font-medium">
              Contact
            </a>
          </nav>

          {/* Contact & CTA */}
          <div className="flex items-center space-x-4 relative">
            <div className="hidden lg:flex items-center space-x-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">+91 79834 79191</span>
            </div>
            <QuoteForm>
              <Button variant="default" className="primary-gradient shadow-soft hover:shadow-glow transition-spring">
                Get Quote
              </Button>
            </QuoteForm>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="border-2 border-primary text-primary font-semibold rounded-xl px-4 py-2 shadow hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-2 border-red-500 text-red-500 font-semibold rounded-xl px-4 py-2 shadow hover:bg-red-500 hover:text-white transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div
                className="relative"
                onMouseEnter={() => setShowLogin(true)}
                onMouseLeave={() => setShowLogin(false)}
              >
                <Link to="/register">
                  <Button
                    variant="outline"
                    className="ml-2 border-2 border-primary text-primary font-semibold rounded-xl px-6 py-2 shadow hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <span className="font-bold text-lg tracking-wide">Register</span>
                  </Button>
                </Link>
                {showLogin && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-primary/30 rounded-2xl shadow-2xl p-6 z-50 flex flex-col items-center animate-fade-in">
                    <div className="text-base font-semibold text-primary mb-3 text-center tracking-wide">
                      Do you already have an account?
                    </div>
                    <Link to="/login" className="w-full">
                      <Button
                        variant="default"
                        className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl px-6 py-2 shadow-lg hover:scale-105 hover:shadow-glow transition-all duration-200"
                      >
                        <span className="text-lg tracking-wide">Login</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in {
            animation: fade-in 0.25s ease;
          }
        `}
      </style>
    </header>
  );
};

export default Header;