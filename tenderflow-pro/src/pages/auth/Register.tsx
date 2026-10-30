// src/pages/auth/Register.tsx — Registration page with role selection

import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Building2, ArrowRight, CheckCircle2, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Role = "ORG" | "TRADER";

const ROLE_OPTIONS: {
  value: Role;
  label: string;
  description: string;
  icon: typeof Building2;
  perks: string[];
}[] = [
  {
    value: "ORG",
    label: "Organization",
    description: "Post tenders and receive competitive quotations",
    icon: Building2,
    perks: ["Create unlimited tenders", "Compare quotations side-by-side", "Award & manage contracts"],
  },
  {
    value: "TRADER",
    label: "Trader",
    description: "Browse tenders and submit winning proposals",
    icon: User2,
    perks: ["Browse open tenders", "Submit quotations instantly", "Track application status"],
  },
];

export default function Register() {
  const url = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [searchParams] = useSearchParams();
  const defaultRole = (searchParams.get("role") as Role) || "ORG";
  const [role, setRole] = useState<Role>(defaultRole);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {

    e.preventDefault();

    try {
      
      setLoading(true);
      setError("");

      const _response = await fetch(`${url}/auth/register`, {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        }, body: JSON.stringify({
          name: firstName + " " + lastName,
          email: email,
          password: password,
          role: role.toUpperCase()
        })
      });

      const _responseJson = await _response.json();
      if(!_response.ok || !_responseJson.success || !_responseJson.token || !_responseJson.user?.role) {
        throw new Error(_responseJson.message || "Unable to create account");
      }

      localStorage.setItem("token", _responseJson.token)
      const userRole = _responseJson.user.role;

      if (userRole === "ORG")  { 
        navigate("/org/dashboard")
      } else if (userRole === "TRADER"){ 
        navigate("/trader/dashboard");
      } else {
        localStorage.removeItem("token");
        throw new Error("This account has an unsupported role");
      }

    } catch(err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    } finally {
      setLoading(false);
    }


    // navigate(role === "organization" ? "/org/dashboard" : "/trader/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-7">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">TenderFlow</span>
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join thousands of organizations and traders
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-card p-6 border border-border space-y-5">
          {/* Role Selection */}
          <div>
            <p className="text-sm font-medium text-foreground mb-3">
              I am joining as a...
            </p>
            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { 
                    setRole(opt.value)
                    console.log("Role: " + opt.value)
                    }
                  }
                  className={cn(
                    "relative text-left p-4 rounded-xl border-2 transition-all duration-150",
                    role === opt.value
                      ? "border-primary bg-primary-light"
                      : "border-border bg-background hover:border-muted-foreground/40"
                  )}
                >
                  {role === opt.value && (
                    <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-primary" />
                  )}
                  <opt.icon
                    className={cn(
                      "w-5 h-5 mb-2",
                      role === opt.value ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <p className="text-sm font-semibold text-foreground">{opt.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {opt.description}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {opt.perks.map((perk) => (
                      <li
                        key={perk}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      >
                        <CheckCircle2 className="w-3 h-3 text-status-open shrink-0" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive" role="alert">{error}</p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm">First name</Label>
                <Input placeholder="First name" className="h-9" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Last name</Label>
                <Input placeholder="Last Name" className="h-9" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">
                {role === "ORG" ? "Organization name" : "Company name"}
              </Label>
              <Input
                placeholder={
                  role === "ORG" ? "Apex Enterprises Ltd." : "NovaTech Solutions"
                }
                value = {companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Work email</Label>
              <Input type="email" placeholder="you@company.com" className="h-9" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Password</Label>
              <Input type="password" placeholder="Min. 8 characters" className="h-9" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <Button type="submit" className="w-full gap-2 h-9">
              Create account
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By creating an account, you agree to our{" "}
              <a href="#" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
            </p>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
