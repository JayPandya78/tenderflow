// src/layouts/OrgLayout.tsx — Layout wrapper for Organization area

import {useState, useEffect} from 'react';

import { Outlet } from "react-router-dom";
import { OrgSidebar } from "@/components/layouts/OrgSidebar";
import { TopNavbar } from "@/components/layouts/TopNavbar";

type OrgSidebarProps = {
  data: any
}

export default function OrgLayout() {
  const url = import.meta.env.VITE_API_URL;

  console.log("hello world");

  const [data, setData] = useState<any>({});

  useEffect(() => {

    async function fetchData () {
      try {

        const _response = await fetch(`${url}/auth/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
          }
        });
        const data = await _response.json()
        console.log(data.data.email);
        setData(data.data);

      } catch(err) {

        console.log(err);

      }
    }

    fetchData();
    
  }, []);

  
  return (
    <div className="flex min-h-screen w-full bg-background">
      <OrgSidebar propsdata={data}/>
      <div className="flex flex-col flex-1 min-w-0">
        <TopNavbar />
        <main className="flex-1 p-6 animate-fade-in">
          <Outlet context={{
            data 
          }} />
        </main>
      </div>
    </div>
  );
}
