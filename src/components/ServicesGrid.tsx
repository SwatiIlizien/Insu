import { Card, CardContent } from "@/components/ui/card";
import { 
  Car, 
  Bike, 
  Heart, 
  Umbrella, 
  Users, 
  Plane, 
  Shield, 
  Home,
  TrendingUp,
  Baby,
  DollarSign,
  Building
} from "lucide-react";

const services = [
  {
    icon: Car,
    title: "Car Insurance",
    description: "Comprehensive coverage for your vehicle",
    color: "text-blue-600"
  },
  {
    icon: Bike,
    title: "2 Wheeler Insurance", 
    description: "Protection for your bike and scooter",
    color: "text-green-600"
  },
  {
    icon: Users,
    title: "Family Health Insurance",
    description: "Complete health coverage for your family",
    color: "text-pink-600"
  },
  {
    icon: Umbrella,
    title: "Term Life Insurance",
    description: "Secure your family's financial future",
    color: "text-purple-600"
  },
  {
    icon: Heart,
    title: "Health Insurance",
    description: "Individual health protection plans",
    color: "text-red-600"
  },
  {
    icon: Shield,
    title: "Group Health Insurance",
    description: "Corporate health insurance solutions",
    color: "text-indigo-600"
  },
  {
    icon: Plane,
    title: "Travel Insurance",
    description: "Safe travels with comprehensive coverage",
    color: "text-cyan-600"
  },
  {
    icon: Home,
    title: "Life Insurance",
    description: "Complete life protection plans",
    color: "text-orange-600"
  },
  {
    icon: TrendingUp,
    title: "Retirement Plans",
    description: "Plan for a secure retirement future",
    color: "text-emerald-600"
  },
  {
    icon: Baby,
    title: "Child Savings Plans",
    description: "Secure your child's bright future",
    color: "text-yellow-600"
  },
  {
    icon: DollarSign,
    title: "Investment Plans",
    description: "Grow your wealth with smart investments",
    color: "text-teal-600"
  },
  {
    icon: Building,
    title: "Commercial Loan",
    description: "Business financing solutions",
    color: "text-gray-600"
  }
];

const ServicesGrid = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Our Insurance <span className="text-primary">Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive insurance solutions tailored to protect what matters most to you and your family.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={index} 
                className="card-gradient hover:shadow-card transition-spring cursor-pointer group border-border/50 hover:border-primary/20"
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-secondary/80 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-spring">
                    <IconComponent className={`w-8 h-8 ${service.color} group-hover:text-primary transition-smooth`} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;