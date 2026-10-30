// src/pages/auth/Login.tsx — Login page

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {toast} from 'sonner';

export default function Login() {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState<"organization" | "trader">("organization");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    const url = import.meta.env.VITE_API_URL || "http://localhost:3000";

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const _response = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email, 
          password
        })
      });


      const _responseJson = await _response.json();
      if (!_response.ok || !_responseJson.status || !_responseJson.data?.token || !_responseJson.data?.user?.role) {
        throw new Error(_responseJson.message || "Invalid email or password");
      }

      localStorage.setItem("token", _responseJson.data.token);
      const userRole = _responseJson.data.user.role;
      const selectedRole = role === "organization" ? "ORG" : "TRADER";

      if (userRole !== selectedRole) {
        localStorage.removeItem("token");
        throw new Error(`This account is registered as ${userRole === "ORG" ? "an organization" : "a trader"}. Select the matching option.`);
      }

      if (userRole === "ORG") {
          navigate("/org/dashboard");
      } else if (userRole === "TRADER") {
          navigate("/trader/dashboard");
      } else {
        localStorage.removeItem("token");
        throw new Error("This account has an unsupported role");
      }

    } catch(err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">TenderFlow</span>
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to your account to continue
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-xl shadow-card p-6 border border-border">
          {/* Role Toggle */}
          <div className="flex rounded-lg bg-muted p-1 mb-5">
            {(["organization", "trader"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                aria-pressed={role === r}
                className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${
                  role === r
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "organization" ? "Organization" : "Trader"}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive" role="alert">{error}</p>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value = {email} 
                onChange={(e) => {setEmail(e.target.value)}}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm">
                  Password
                </Label>
                <a
                  href="#"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value = {password} 
                  onChange = {(e) => {setPassword(e.target.value)}}
                  className="h-9 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPass ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2 h-9">
              Sign in
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>

          
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
