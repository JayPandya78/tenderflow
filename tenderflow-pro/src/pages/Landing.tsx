// src/pages/Landing.tsx — Public landing page

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Shield,
  BarChart3,
  Zap,
  ArrowRight,
  CheckCircle2,
  Globe,
  Users,
  TrendingUp,
} from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    title: "Secure & Compliant",
    desc: "End-to-end encrypted submissions with full audit trails and compliance reporting built in.",
  },
  {
    icon: BarChart3,
    title: "Transparent Comparison",
    desc: "Side-by-side quotation analysis with automated scoring and ranking to make better decisions.",
  },
  {
    icon: Zap,
    title: "Fast & Efficient",
    desc: "Reduce tender cycles from weeks to days with automated workflows and instant notifications.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    desc: "Connect with verified traders worldwide. Expand your supplier network across borders.",
  },
  {
    icon: Users,
    title: "Multi-Role Access",
    desc: "Separate portals for organizations and traders with role-based permissions and controls.",
  },
  {
    icon: TrendingUp,
    title: "Analytics & Insights",
    desc: "Real-time dashboards tracking tender performance, spend analytics, and supplier metrics.",
  },
];

const STATS = [
  { value: "2,400+", label: "Active Tenders" },
  { value: "12,000+", label: "Registered Traders" },
  { value: "850+", label: "Organizations" },
  { value: "$2.4B+", label: "Processed Value" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">TenderFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how" className="hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#pricing" className="hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light text-accent-foreground text-xs font-medium mb-6 border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Now processing $2.4B+ in tender value
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5 tracking-tight">
          Smart Tender & Quotation
          <br />
          <span className="text-primary">Management</span>, Simplified
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
          The enterprise platform that connects organizations with verified traders.
          Create tenders, receive competitive quotations, and make data-driven
          decisions — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" asChild className="gap-2 px-6">
            <Link to="/register?role=organization">
              Register as Organization
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="gap-2 px-6">
            <Link to="/register?role=trader">
              Register as Trader
            </Link>
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-10 text-xs text-muted-foreground">
          {["SOC 2 Type II", "ISO 27001", "GDPR Compliant", "256-bit SSL"].map(
            (badge) => (
              <div key={badge} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-status-open" />
                {badge}
              </div>
            )
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-card border-y border-border py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Everything you need to manage procurement
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Built for modern organizations and verified traders who demand
            transparency, efficiency, and security.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-soft transition-shadow duration-200 border border-border"
            >
              <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center mb-4">
                <f.icon className="w-4.5 h-4.5 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary mx-6 md:mx-auto max-w-5xl rounded-2xl px-8 py-12 mb-16 text-center">
        <h2 className="text-2xl font-bold text-primary-foreground mb-3">
          Ready to transform your procurement process?
        </h2>
        <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
          Join 850+ organizations and 12,000+ traders who trust TenderFlow for
          smarter, faster, and fairer procurement.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="secondary" size="lg" asChild className="gap-2">
            <Link to="/register?role=organization">
              Start as Organization <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            asChild
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Link to="/register?role=trader">Join as Trader</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
              <Building2 className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-medium text-foreground">TenderFlow</span>
            <span>© 2024</span>
          </div>
          <nav className="flex gap-5">
            {["Privacy", "Terms", "Security", "Contact"].map((l) => (
              <a key={l} href="#" className="hover:text-foreground transition-colors">
                {l}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
