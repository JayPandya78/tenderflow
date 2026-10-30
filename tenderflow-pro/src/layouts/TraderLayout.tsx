// src/layouts/TraderLayout.tsx — Layout wrapper for Trader area

import { Outlet } from "react-router-dom";
import { TraderSidebar } from "@/components/layouts/TraderSidebar";
import { TopNavbar } from "@/components/layouts/TopNavbar";

import {useState, useEffect} from 'react';

type TraderSidebarProps = {
  data: any
}


export default function TraderLayout() {

  const url = import.meta.env.VITE_API_URL;

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
      <TraderSidebar propsdata={data}/>
      <div className="flex flex-col flex-1 min-w-0">
        <TopNavbar />
        <main className="flex-1 p-6 animate-fade-in">
          <Outlet context={{data}}/>
        </main>
      </div>
    </div>
  );
}
