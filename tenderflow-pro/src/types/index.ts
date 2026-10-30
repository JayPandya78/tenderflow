// src/types/index.ts — Core domain types for the Tender Management System

export type UserRole = "organization" | "trader" | "admin";

export type TenderStatus = "OPEN" | "EVALUATION" | "AWARDED" | "CLOSED";

export type QuotationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization?: string;
  avatar?: string;
}

export interface Tender {
  _id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  deadline: string;
  status: TenderStatus;
  organization: string;
  organizationId: string;
  quotationsCount: number;
  visibility: "public" | "private";
  createdAt: string;
  documents?: string[];
}

export interface Quotation {
  id: string;
  tenderId: string;
  tenderTitle: string;
  traderId: string;
  traderName: string;
  traderCompany: string;
  price: number;
  timeline: string;
  proposal: string;
  status: QuotationStatus;
  submittedAt: string;
  rating?: number;
}

export interface ActivityLog {
  id: string;
  message: string;
  timestamp: string;
  type: "info" | "success" | "warning";
}

export interface StatsCard {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: string;
}
