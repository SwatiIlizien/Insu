import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const LoginPage = ({ setIsLoggedIn, setUserPhone }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePhoneChange = (e) => {
    // Remove non-digit characters and limit to 10 digits
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(value);
    setPhoneError(value.length < 10 ? "Phone number must be 10 digits" : "");
  };

  const handleLogin = async () => {
    if (!phone || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    if (phoneError) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      if (data.token) {
        // Store token and user data in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsLoggedIn(true);
        setUserPhone?.(data.user.phone || "");
        navigate("/");
        toast({
          title: "Login Successful!",
          description: "Welcome back! You can now access all features.",
          variant: "default",
        });
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Unable to connect. Please check your internet and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-primary text-center">Sign In</h2>
        <div className="space-y-4">
          <input
            className={`w-full border ${phoneError ? "border-red-500" : "border-primary/30"} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition`}
            placeholder="Phone Number"
            value={phone}
            onChange={handlePhoneChange}
            type="tel"
            maxLength={10}
            required
          />
          {phoneError && (
            <div className="text-red-500 text-sm">{phoneError}</div>
          )}
          <input
            className="w-full border border-primary/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full bg-primary text-white font-semibold py-3 rounded-lg shadow hover:bg-primary/90 transition disabled:opacity-50"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </div>
        <div className="mt-6 text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;