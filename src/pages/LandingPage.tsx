import { Link } from "react-router-dom";
import CommissionSection from "@/components/CommissionSection";

const LandingPage = () => (
  <div className="min-h-screen">
    {/* Hero Section */}
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold mb-6 text-primary">Welcome to Insu-Raksha</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Register now to earn up to 20% as an agent or 14% as an individual on insurance policies!
        </p>
        <Link
          to="/register"
          className="w-full inline-block bg-primary text-white font-semibold py-3 rounded-lg shadow hover:bg-primary/90 transition mb-4"
        >
          Register
        </Link>
        <div className="mt-4 text-muted-foreground">
          Already have an account?
          <Link to="/login" className="ml-2 text-primary font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>

    {/* Commission Section */}
    <CommissionSection isLoggedIn={false} />
  </div>
);

export default LandingPage;