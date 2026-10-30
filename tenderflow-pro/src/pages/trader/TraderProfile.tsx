// src/pages/trader/TraderProfile.tsx — Trader's profile page
import { useOutletContext } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Award, FileCheck } from "lucide-react";

type TraderContext = {
  data: any
};
export default function TraderProfile() {
  const { data } = useOutletContext<TraderContext>();
  console.log(data);

  return (
    <div className="max-w-2xl space-y-5 animate-fade-in">
      <PageHeader title="My Profile" description="Manage your trader profile and credentials" />

      {/* Profile Overview */}
      <div className="bg-card rounded-xl shadow-card border border-border p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
            <span className="text-lg font-bold text-primary-foreground">NT</span>
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">NovaTech Solutions</h2>
            <p className="text-sm text-muted-foreground">sarah@novatech.com</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-3.5 h-3.5 text-status-evaluation fill-status-evaluation" />
                <span className="font-medium text-foreground">4.8</span>
                <span className="text-muted-foreground">rating</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <FileCheck className="w-3.5 h-3.5" />
                5 quotations
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Award className="w-3.5 h-3.5" />
                2 won
              </div>
            </div>
          </div>
          <Button size="sm" variant="outline" className="ml-auto">
            Edit Photo
          </Button>
        </div>
      </div>

      {/* Company Details */}
      <div className="bg-card rounded-xl shadow-card border border-border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Company Information</h2>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-sm">Company Name</Label>
            <Input defaultValue="NovaTech Solutions" className="h-9" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Contact Person</Label>
              <Input defaultValue="Sarah Chen" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Phone</Label>
              <Input defaultValue="+1 (555) 123-4567" className="h-9" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Company Bio</Label>
            <Textarea
              defaultValue="NovaTech Solutions is a leading technology company specializing in enterprise software development and cloud migrations."
              className="resize-none min-h-[80px]"
            />
          </div>
        </div>
        <Button size="sm">Save Changes</Button>
      </div>
    </div>
  );
}
