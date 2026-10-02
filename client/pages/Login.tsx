import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [authMethod, setAuthMethod] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Error", description: "Please enter email and password" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("authToken", email);
        localStorage.setItem("userEmail", email);
        toast({ title: "Success", description: "Login successful!" });
        navigate("/");
      } else {
        toast({ title: "Error", description: data.error || "Invalid credentials" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  // Email OTP
  const handleEmailOtpSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Error", description: "Please enter email" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/send-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        toast({ title: "Success", description: data.message || "OTP sent to your email" });
        setTimer(60);
        const countdown = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(countdown);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast({ title: "Error", description: data.error || "Failed to send OTP" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOtp) {
      toast({ title: "Error", description: "Please enter OTP" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-email-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: emailOtp }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userEmail", email);
        toast({ title: "Success", description: "Login successful!" });
        navigate("/");
      } else {
        toast({ title: "Error", description: data.error || "Invalid OTP" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  // Phone OTP
  const handlePhoneOtpSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast({ title: "Error", description: "Please enter phone number" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/send-phone-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        toast({ title: "Success", description: "OTP sent to your phone" });
        setTimer(60);
        const countdown = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(countdown);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast({ title: "Error", description: data.error || "Failed to send OTP" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOtp) {
      toast({ title: "Error", description: "Please enter OTP" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/verify-phone-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp: phoneOtp }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userPhone", phoneNumber);
        toast({ title: "Success", description: "Login successful!" });
        navigate("/");
      } else {
        toast({ title: "Error", description: data.error || "Invalid OTP" });
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

        <Tabs value={authMethod} onValueChange={setAuthMethod} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="emailotp">Email OTP</TabsTrigger>
            <TabsTrigger value="phoneotp">Phone OTP</TabsTrigger>
          </TabsList>

          {/* Password Login */}
          <TabsContent value="password">
            <form onSubmit={handlePasswordLogin} className="space-y-4">
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
                  Password <span className="text-red-500">*</span>
                </label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700">
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </form>
          </TabsContent>

          {/* Email OTP Login */}
          <TabsContent value="emailotp">
            <form
              onSubmit={otpSent ? handleEmailOtpVerify : handleEmailOtpSend}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={otpSent}
                  className="w-full"
                  required
                />
              </div>

              {otpSent && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Enter OTP <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    className="w-full text-center text-2xl tracking-widest font-mono"
                    required
                  />
                  {timer > 0 && (
                    <p className="text-xs text-slate-500 mt-2 text-center">
                      Resend in {timer}s
                    </p>
                  )}
                </div>
              )}

              <Button type="submit" disabled={loading || (otpSent && emailOtp.length !== 6)} className="w-full bg-green-600 hover:bg-green-700">
                {loading ? "Processing..." : otpSent ? "Verify OTP" : "Send OTP"}
              </Button>

              {otpSent && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setOtpSent(false);
                    setEmailOtp("");
                    setTimer(0);
                  }}
                  disabled={timer > 0}
                  className="w-full"
                >
                  {timer > 0 ? "Wait..." : "Send New OTP"}
                </Button>
              )}
            </form>
          </TabsContent>

          {/* Phone OTP Login */}
          <TabsContent value="phoneotp">
            <form
              onSubmit={otpSent ? handlePhoneOtpVerify : handlePhoneOtpSend}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone number <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  placeholder="9999999999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  disabled={otpSent}
                  maxLength={10}
                  className="w-full"
                  required
                />
              </div>

              {otpSent && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Enter OTP <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="000000"
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    maxLength={6}
                    className="w-full text-center text-2xl tracking-widest font-mono"
                    required
                  />
                  {timer > 0 && (
                    <p className="text-xs text-slate-500 mt-2 text-center">
                      Resend in {timer}s
                    </p>
                  )}
                </div>
              )}

              <Button type="submit" disabled={loading || (otpSent && phoneOtp.length !== 6)} className="w-full bg-green-600 hover:bg-green-700">
                {loading ? "Processing..." : otpSent ? "Verify OTP" : "Send OTP"}
              </Button>

              {otpSent && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setOtpSent(false);
                    setPhoneOtp("");
                    setTimer(0);
                  }}
                  disabled={timer > 0}
                  className="w-full"
                >
                  {timer > 0 ? "Wait..." : "Send New OTP"}
                </Button>
              )}
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center text-sm text-slate-600">
          New to Earth Root Agro?{" "}
          <Link to="/signup" className="text-green-600 hover:text-green-700 font-semibold">
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  );
}
