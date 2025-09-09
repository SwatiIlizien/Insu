import { Card, CardContent } from "@/components/ui/card";
import carImage from "@/assets/car-insurance.jpg";
import officeImage from "@/assets/office-interior.jpg";

const StatsSection = () => {
  const stats = [
    { number: "50,000+", label: "Happy Customers" },
    { number: "99.8%", label: "Claim Settlement Rate" },
    { number: "24/7", label: "Customer Support" },
    { number: "15+", label: "Insurance Partners" }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={officeImage} 
          alt="Professional office environment" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-primary/20"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Trusted by <span className="text-primary">Thousands</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our commitment to excellence has earned us the trust of customers across India. 
            Here's what makes us the preferred choice for insurance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="card-gradient shadow-card border-border/30 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="text-4xl lg:text-5xl font-display font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Insurance */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-3xl font-display font-bold text-foreground">
              Drive with <span className="text-primary">Confidence</span>
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our comprehensive car insurance coverage ensures you're protected on every journey. 
              From third-party liability to comprehensive coverage, we've got you covered with 
              competitive rates and exceptional service.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">What's Covered:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Third-party liability</li>
                  <li>• Own damage coverage</li>
                  <li>• Personal accident cover</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Add-on Benefits:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Zero depreciation</li>
                  <li>• Engine protection</li>
                  <li>• Roadside assistance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="overflow-hidden shadow-card">
              <img 
                src={carImage} 
                alt="Professional businessman driving safely with car insurance" 
                className="w-full h-full object-cover"
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;