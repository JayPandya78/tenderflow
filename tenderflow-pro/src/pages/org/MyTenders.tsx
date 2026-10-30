// src/pages/org/MyTenders.tsx — List of organization's tenders

import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { TenderStatus } from "@/types";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Clock,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { label: string; value: TenderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "OPEN" },
  { label: "Evaluation", value: "EVALUATION" },
  { label: "Awarded", value: "AWARDED" },
  { label: "Closed", value: "CLOSED" },
];

type OrgContext = {
  data: any
};

export default function MyTenders() {
  
  const url = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const AwardTender = (id) => {};
  const { data } = useOutletContext<OrgContext>();
  console.log(data);

  const [APIResponse, setAPIResponse] = useState([]);

   useEffect(() => {
    const fetchData = async () => {

      const _response = await fetch(`${url}/tender/my`, {
        method: "GET", 
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        }
      });

      const data = await _response.json();
      setAPIResponse(data.success ? data.data || [] : []);

      console.log(data.data)


    };
    fetchData();
  }, [])

  useEffect(() => {
    console.log("APIResponse state updated:", APIResponse);
    APIResponse.map(i => {
      console.log("ID: " + i._id);
      console.log("Title: " + i.title);
      console.log("Description" + i.description);
      console.log("Deadline" + i.deadline.slice(0, 10));
      console.log("Budget: " + i.category);
    })
  }, [APIResponse]);



  const [activeFilter, setActiveFilter] = useState<TenderStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = APIResponse.filter((tender) => {
    const matchStatus = activeFilter === "all" || tender.status === activeFilter;
    const matchSearch = tender.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const tenderCounts = {
    all: APIResponse.length,
    OPEN: APIResponse.filter((tender) => tender.status === "OPEN").length,
    EVALUATION: APIResponse.filter((tender) => tender.status === "EVALUATION").length,
    AWARDED: APIResponse.filter((tender) => tender.status === "AWARDED").length,
    CLOSED: APIResponse.filter((tender) => tender.status === "CLOSED").length,
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <PageHeader
        title="My Tenders"
        description={`${APIResponse.length} total tenders`}
        actions={
          <Button size="sm" asChild className="gap-1.5">
            <Link to="/org/create-tender">
              <Plus className="w-3.5 h-3.5" />
              New Tender
            </Link>
          </Button>
        }
      />

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
              {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all",
                activeFilter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
                {f.label} ({tenderCounts[f.value === "all" ? "all" : f.value]})
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tenders..."
            className="h-8 pl-8 w-56 text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-card border border-border overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            title="No tenders found"
            description="Try adjusting your filters or create a new tender"
            action={
              <Button size="sm" asChild>
                <Link to="/org/create-tender">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Create Tender
                </Link>
              </Button>
            }
          />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                  Deadline
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                  Budget
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">
                  Quotations
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {APIResponse.map((tender) => (
                <tr
                  key={tender._id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <Link
                      to={`/org/tenders/${tender._id}`}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {tender.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {tender.category}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={tender.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {tender.deadline.slice(0, 10)}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-medium text-foreground">
                      ${Number(tender.budget || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <FileText className="w-3.5 h-3.5" />
                      {tender.quotationsCount}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Button variant="ghost" size="sm" asChild className="h-7 px-2">
                        <Link to={`/org/tenders/${tender._id}`}>
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          View
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem asChild>
                            <Link to={`/org/tenders/${tender._id}?edit=true`}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Close Tender
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
