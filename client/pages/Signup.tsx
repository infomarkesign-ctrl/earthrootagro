import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const [signupMethod, setSignupMethod] = useState("email");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const validatePassword = () => {
    if (password.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters" });
      return false;
    }
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match" });
      return false;
    }
    return true;
  };

  const handleSignupEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      toast({ title: "Error", description: "Please fill in all required fields" });
      return;
    }
    if (!validatePassword()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          phoneNumber: phoneNumber || null,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userEmail", email);
        toast({ title: "Success", description: "Account created successfully!" });
        navigate("/");
      } else {
        toast({ title: "Error", description: data.error || "Signup failed" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignupPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber || !password || !confirmPassword) {
      toast({ title: "Error", description: "Please fill in all required fields" });
      return;
    }
    if (phoneNumber.length !== 10) {
      toast({ title: "Error", description: "Phone number must be 10 digits" });
      return;
    }
    if (!validatePassword()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phoneNumber,
          password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userPhone", phoneNumber);
        toast({ title: "Success", description: "Account created successfully!" });
        navigate("/");
      } else {
        toast({ title: "Error", description: data.error || "Signup failed" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Earth Root Agro</h1>
          <p className="text-slate-600 mt-1 text-sm">Farm Fresh to Your Door</p>
        </div>

        <Tabs value={signupMethod} onValueChange={setSignupMethod} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="email">Sign up with email</TabsTrigger>
            <TabsTrigger value="phone">Sign up with phone</TabsTrigger>
          </TabsList>

          {/* Email Signup */}
          <TabsContent value="email">
            <form onSubmit={handleSignupEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone number
                </label>
                <Input
                  type="tel"
                  placeholder="9999999999 (optional)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  maxLength={10}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm password <span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                {loading ? "Creating account..." : "Continue"}
              </Button>
            </form>
          </TabsContent>

          {/* Phone Signup */}
          <TabsContent value="phone">
            <form onSubmit={handleSignupPhone} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  placeholder="9999999999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  maxLength={10}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm password <span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                {loading ? "Creating account..." : "Continue"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
            Log in
          </Link>
        </div>
      </Card>
    </div>
  );
}
