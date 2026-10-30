import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import OrgLayout from "./layouts/OrgLayout";
import TraderLayout from "./layouts/TraderLayout";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Org Pages
import OrgDashboard from "./pages/org/OrgDashboard";
import CreateTender from "./pages/org/CreateTender";
import MyTenders from "./pages/org/MyTenders";
import TenderDetails from "./pages/org/TenderDetails";
import QuotationsReceived from "./pages/org/QuotationsReceived";
import OrgSettings from "./pages/org/OrgSettings";

// Trader Pages
import TraderDashboard from "./pages/trader/TraderDashboard";
import BrowseTenders from "./pages/trader/BrowseTenders";
import TraderTenderDetails from "./pages/trader/TraderTenderDetails";
import MyQuotations from "./pages/trader/MyQuotations";
import TraderProfile from "./pages/trader/TraderProfile";

import NotFound from "./pages/NotFound";



const queryClient = new QueryClient();
const url = import.meta.env.VITE_API_URL;
console.log("HI: " + url);

console.log("hellow");

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Organization Area */}
          <Route path="/org" element={
            <ProtectedRoute allowedRole="ORG">
              <OrgLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/org/dashboard" replace />} />
            <Route path="dashboard" element={<OrgDashboard />} />
            <Route path="create-tender" element={<CreateTender />} />
            <Route path="tenders" element={<MyTenders />} />
            <Route path="tenders/:id" element={<TenderDetails />} />
            <Route path="quotations" element={<QuotationsReceived />} />
            <Route path="notifications" element={<OrgSettings />} />
            <Route path="settings" element={<OrgSettings />} />
          </Route>

          {/* Trader Area */}
          <Route path="/trader" element={
            <ProtectedRoute allowedRole="TRADER">
              <TraderLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/trader/dashboard" replace />} />
            <Route path="dashboard" element={<TraderDashboard />} />
            <Route path="browse" element={<BrowseTenders />} />
            <Route path="tenders/:id" element={<TraderTenderDetails />} />
            <Route path="quotations" element={<MyQuotations />} />
            <Route path="profile" element={<TraderProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
