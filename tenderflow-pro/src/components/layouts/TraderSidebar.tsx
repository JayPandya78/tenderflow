// src/components/layouts/TraderSidebar.tsx — Trader sidebar navigation

import { NavLink } from "@/components/NavLink";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  FileCheck,
  User,
  Building2,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/trader/dashboard", icon: LayoutDashboard },
  { label: "Browse Tenders", href: "/trader/browse", icon: Search },
  { label: "My Quotations", href: "/trader/quotations", icon: FileCheck },
  { label: "Profile", href: "/trader/profile", icon: User },
];

export function TraderSidebar(propsdata: any) {
  return (
    <aside className="w-60 min-h-screen bg-[hsl(var(--sidebar-background))] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[hsl(var(--sidebar-border))]">
        <Link to="/login" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[hsl(var(--sidebar-foreground))]">
              TenderFlow
            </p>
            <p className="text-[10px] text-[hsl(var(--sidebar-foreground))/60] uppercase tracking-wider">
              Trader Portal
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--sidebar-foreground))/40]">
          Menu
        </p>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[hsl(var(--sidebar-foreground))] hover:text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] transition-all duration-150 group"
            activeClassName="!text-sidebar-primary-foreground !bg-primary font-medium"
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Bottom user info */}
      <div className="px-3 py-4 border-t border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[hsl(var(--sidebar-accent))] cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-primary-foreground">
              {propsdata.propsdata.name?.split(" ").map(word => word[0]).join("")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[hsl(var(--sidebar-foreground))] truncate">
              {propsdata.propsdata.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
