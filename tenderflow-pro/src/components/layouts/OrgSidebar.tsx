// src/components/layouts/orgsidebar.tsx — organization sidebar navigation
import { useState, useEffect } from "react";
import { NavLink } from "@/components/NavLink";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  InboxIcon,
  Bell,
  Settings,
  Building2,
  ChevronRight,
} from "lucide-react";

import { jwtDecode } from "jwt-decode";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/org/dashboard", icon: LayoutDashboard },
  { label: "Create Tender", href: "/org/create-tender", icon: PlusCircle },
  { label: "My Tenders", href: "/org/tenders", icon: FileText },
  // { label: "Quotations Received", href: "/org/quotations", icon: InboxIcon },
  // { label: "Notifications", href: "/org/notifications", icon: Bell },
  { label: "Settings", href: "/org/settings", icon: Settings },
];

export function OrgSidebar(propsdata: any) {

  console.log("PropsData: ")
  console.log(propsdata);
  console.log(propsdata.propsdata.email)
  console.log("PropsData end");

  // const [data, setData] = useState<any>({});

  // useEffect(() => {

  //   async function fetchData () {
  //     try {

  //       const _response = await fetch("http://localhost:3000/auth/me", {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Authorization": "Bearer " + localStorage.getItem("token")
  //         }
  //       });
  //       const data = await _response.json()
  //       console.log(data.data.email);
  //       setData(data.data);

  //     } catch(err) {

  //       console.log(err);

  //     }
  //   }

  //   fetchData();
    
  // }, []); // runs only once
  

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
              Organization
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
            activeClassName="bg-[hsl(var(--sidebar-active-bg))] text-[hsl(var(--sidebar-active-fg))] font-medium"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[hsl(var(--sidebar-foreground))] hover:text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] transition-all duration-150"
            
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            <ChevronRight className="w-3 h-3 opacity-50" />
          </NavLink>
        ))}
      </nav>

      {/* Bottom user info */}
      <div className="px-3 py-4 border-t border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[hsl(var(--sidebar-accent))] cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-primary-foreground">
              {propsdata.propsdata.name?.split(" ").map(word => word[0]).join("")}
            </span>

          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[hsl(var(--sidebar-foreground))] truncate">
            </p>
            <p className="text-[10px] text-[hsl(var(--sidebar-foreground))] truncate">
              {/* hello */}
              {propsdata.propsdata.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
