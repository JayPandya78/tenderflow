// src/pages/org/OrgSettings.tsx — Organization settings placeholder
import { useOutletContext} from 'react-router-dom';
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

type OrgContext = { 
  data: any
};

export default function OrgSettings() {

  const { data } = useOutletContext<OrgContext>()
  console.log(data.name);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    setName(data.name);
    setEmail(data.email);
    setPhone("+91-9327182403");
  }, [data]);
  
  console.log("Name: " + name);

  return (
    <div className="max-w-xl space-y-5 animate-fade-in">
      <PageHeader title="Settings" description="Manage your organization profile and preferences" />

      <div className="bg-card rounded-xl shadow-card border border-border p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Organization Profile</h2>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-sm">Organization Name</Label>
            <Input  className="h-9" value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Email Address</Label>
            <Input className="h-9" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Phone</Label>
            <Input className="h-9" value={phone} onChange={(e) => setPhone(e.target.value)}/>
          </div>
        </div>
        <Button size="sm">Save Changes</Button>
      </div>
    </div>
  );
}
