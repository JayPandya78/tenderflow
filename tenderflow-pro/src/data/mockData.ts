// src/data/mockData.ts — Mock data for UI demonstration

import { Tender, Quotation, ActivityLog } from "@/types";

export const MOCK_TENDERS: Tender[] = [
  {
    _id: "t1",
    title: "Enterprise Software Development Platform",
    description:
      "Seeking a reliable partner for developing an enterprise-grade software platform including ERP modules, analytics dashboard, and API integrations.",
    budget: 120000,
    category: "Software Development",
    deadline: "2024-04-15",
    status: "OPEN",
    organization: "Apex Enterprises Ltd.",
    organizationId: "o1",
    quotationsCount: 7,
    visibility: "public",
    createdAt: "2024-02-01",
  },
  {
    _id: "t2",
    title: "Office IT Infrastructure Upgrade",
    description:
      "Complete infrastructure overhaul including servers, network equipment, workstations, and security systems across 3 office locations.",
    budget: 85000,
    category: "IT Infrastructure",
    deadline: "2024-03-28",
    status: "EVALUATION",
    organization: "Apex Enterprises Ltd.",
    organizationId: "o1",
    quotationsCount: 12,
    visibility: "public",
    createdAt: "2024-01-15",
  },
  {
    _id: "t3",
    title: "Annual Marketing Campaign Management",
    description:
      "Full-service digital and traditional marketing campaign covering SEO, PPC, social media, and offline events for FY2024.",
    budget: 45000,
    category: "Marketing",
    deadline: "2024-03-10",
    status: "AWARDED",
    organization: "Apex Enterprises Ltd.",
    organizationId: "o1",
    quotationsCount: 9,
    visibility: "public",
    createdAt: "2024-01-05",
  },
  {
    _id: "t4",
    title: "Legal Advisory Services — M&A",
    description:
      "Retaining a law firm for mergers and acquisitions advisory, due diligence, and regulatory compliance for upcoming transactions.",
    budget: 60000,
    category: "Legal Services",
    deadline: "2024-02-20",
    status: "CLOSED",
    organization: "Apex Enterprises Ltd.",
    organizationId: "o1",
    quotationsCount: 4,
    visibility: "public",
    createdAt: "2023-12-10",
  },
  {
    _id: "t5",
    title: "Cloud Migration & DevOps Setup",
    description:
      "Migration of on-premise infrastructure to AWS/Azure with CI/CD pipeline setup, Kubernetes orchestration, and 24/7 monitoring.",
    budget: 95000,
    category: "Cloud Services",
    deadline: "2024-05-01",
    status: "OPEN",
    organization: "Global Innovations Corp.",
    organizationId: "o2",
    quotationsCount: 3,
    visibility: "public",
    createdAt: "2024-02-10",
  },
  {
    _id: "t6",
    title: "Cybersecurity Audit & Penetration Testing",
    description:
      "Comprehensive cybersecurity audit including penetration testing, vulnerability assessment, and remediation roadmap.",
    budget: 35000,
    category: "Cybersecurity",
    deadline: "2024-04-01",
    status: "OPEN",
    organization: "TechVault Solutions",
    organizationId: "o3",
    quotationsCount: 5,
    visibility: "public",
    createdAt: "2024-02-08",
  },
];
// export const MOCK_TENDERS: Tender[] = [
// ];

export const MOCK_QUOTATIONS: Quotation[] = [
  {
    id: "q1",
    tenderId: "t1",
    tenderTitle: "Enterprise Software Development Platform",
    traderId: "tr1",
    traderName: "Sarah Chen",
    traderCompany: "NovaTech Solutions",
    price: 110000,
    timeline: "6 months",
    proposal:
      "We propose a phased delivery model with bi-weekly sprints. Our team of 8 senior engineers will ensure delivery on time.",
    status: "PENDING",
    submittedAt: "2024-02-10",
    rating: 4.8,
  },
  {
    id: "q2",
    tenderId: "t1",
    tenderTitle: "Enterprise Software Development Platform",
    traderId: "tr2",
    traderName: "James Okafor",
    traderCompany: "Catalyst Systems",
    price: 98500,
    timeline: "7 months",
    proposal:
      "Competitive pricing with dedicated project manager, QA team, and post-deployment support for 12 months.",
    status: "PENDING",
    submittedAt: "2024-02-12",
    rating: 4.5,
  },
  {
    id: "q3",
    tenderId: "t2",
    tenderTitle: "Office IT Infrastructure Upgrade",
    traderId: "tr3",
    traderName: "Priya Sharma",
    traderCompany: "InfoSystems Ltd.",
    price: 79000,
    timeline: "3 months",
    proposal:
      "Full hardware procurement, installation, and staff training included. Vendor partnerships with Dell and Cisco.",
    status: "ACCEPTED",
    submittedAt: "2024-01-20",
    rating: 4.9,
  },
  {
    id: "q4",
    tenderId: "t3",
    tenderTitle: "Annual Marketing Campaign Management",
    traderId: "tr4",
    traderName: "Marcus Rivera",
    traderCompany: "BrandForge Agency",
    price: 42000,
    timeline: "12 months",
    proposal:
      "360-degree campaign covering digital, social, and offline channels with monthly reporting and KPI tracking.",
    status: "ACCEPTED",
    submittedAt: "2024-01-12",
    rating: 4.7,
  },
  {
    id: "q5",
    tenderId: "t5",
    tenderTitle: "Cloud Migration & DevOps Setup",
    traderId: "tr1",
    traderName: "Sarah Chen",
    traderCompany: "NovaTech Solutions",
    price: 88000,
    timeline: "4 months",
    proposal:
      "AWS-certified team with 50+ successful migrations. Minimal downtime guaranteed with blue-green deployment strategy.",
    status: "PENDING",
    submittedAt: "2024-02-14",
    rating: 4.8,
  },
];

export const MOCK_ACTIVITY: ActivityLog[] = [
  {
    id: "a1",
    message: "New quotation received for 'Enterprise Software Development Platform'",
    timestamp: "2024-02-14 10:32",
    type: "info",
  },
  {
    id: "a2",
    message: "Tender 'Office IT Infrastructure Upgrade' moved to Evaluation",
    timestamp: "2024-02-13 15:15",
    type: "warning",
  },
  {
    id: "a3",
    message: "Quotation accepted from BrandForge Agency",
    timestamp: "2024-02-12 09:00",
    type: "success",
  },
  {
    id: "a4",
    message: "New tender 'Cloud Migration & DevOps Setup' published",
    timestamp: "2024-02-10 14:45",
    type: "info",
  },
  {
    id: "a5",
    message: "Tender 'Legal Advisory Services' closed",
    timestamp: "2024-02-05 11:20",
    type: "info",
  },
];
