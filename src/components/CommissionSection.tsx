import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Users, DollarSign, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommissionInfo {
  singlePolicy: {
    percentage: number;
    description: string;
  };
  multiplePolicy: {
    percentage: number;
    description: string;
  };
  companies: Array<{
    id: string;
    name: string;
    description: string;
    link: string;
    isActive: boolean;
  }>;
}

interface CommissionSectionProps {
  isLoggedIn: boolean;
  userPhone?: string;
}

const CommissionSection = ({ isLoggedIn, userPhone }: CommissionSectionProps) => {
  const [commissionInfo, setCommissionInfo] = useState<CommissionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCommissionInfo();
  }, []);

  const fetchCommissionInfo = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/commission-info");
      const data = await response.json();
      setCommissionInfo(data);
    } catch (error) {
      console.error("Error fetching commission info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyClick = async (companyId: string) => {
    if (!isLoggedIn || !userPhone) {
      toast({
        title: "Login Required",
        description: "Please login to access company links",
        variant: "destructive",
      });
      return;
    }

    try {
      // Track the referral
      await fetch("http://localhost:5000/api/track-referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: userPhone, 
          companyId: companyId,
          policyType: "Insurance Policy"
        }),
      });

      // For now, just show a toast. Later you can replace with actual links
      toast({
        title: "Redirecting...",
        description: `Redirecting to ${companyId}... (Link will be added later)`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error tracking referral:", error);
      toast({
        title: "Error",
        description: "Error processing referral. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading commission information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!commissionInfo) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">
            Earn with Us! 💰
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Become an insurance agent and earn up to 20% commission on every policy you refer. 
            The more policies you refer, the more you earn!
          </p>
        </div>

        {/* Commission Rates */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-2 border-green-200 hover:border-green-300 transition-colors">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">
                Single Policy
              </CardTitle>
              <CardDescription className="text-lg">
                {commissionInfo.singlePolicy.percentage}% Commission
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                {commissionInfo.singlePolicy.description}
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-700">
                Multiple Policies
              </CardTitle>
              <CardDescription className="text-lg">
                {commissionInfo.multiplePolicy.percentage}% Commission
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                {commissionInfo.multiplePolicy.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Company Partners */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-primary mb-4">
            Our Topmost High Converting Insurance Partners
          </h3>
          <p className="text-muted-foreground">
            {isLoggedIn 
              ? "Click on any company to access their insurance portal and start earning commissions!"
              : "Login to access company links and start earning commissions!"
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {commissionInfo.companies.map((company) => (
            <Card 
              key={company.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                isLoggedIn 
                  ? "hover:border-primary border-2" 
                  : "opacity-75 border-2 border-gray-200"
              }`}
              onClick={() => handleCompanyClick(company.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-primary">
                    {company.name}
                  </CardTitle>
                  {isLoggedIn ? (
                    <Badge variant="default" className="bg-green-500">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Click to Access
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      Login Required
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-base">
                  {company.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    <span>Trusted by thousands of customers</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>Competitive rates and comprehensive coverage</span>
                  </div>
                  {isLoggedIn && (
                    <Button 
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompanyClick(company.id);
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Get {commissionInfo.singlePolicy.percentage}% Off - Single Policy
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!isLoggedIn && (
          <div className="text-center mt-12">
            <Card className="max-w-2xl mx-auto border-2 border-dashed border-primary/30">
              <CardContent className="py-8">
                <h4 className="text-xl font-semibold text-primary mb-4">
                  Ready to Start Earning?
                </h4>
                <p className="text-muted-foreground mb-6">
                  Create your account to access our partner insurance companies and start earning commissions on every referral!
                </p>
                <Link to="/register">
                  <Button size="lg" className="primary-gradient">
                    Create Account & Start Earning
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommissionSection;
