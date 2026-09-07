// shared/layout/mockData.ts
import { LayoutGrid, Beaker, X } from "lucide-react";

export interface Project {
  id: number;
  title: string;
  status: "Active" | "Pending" | "Completed";
  icon: string;
}

export interface UserProfile {
  name: string;
  id: string;
  role: string;
  institution: string;
  status: string;
}

export interface DashboardStat {
  id: string;
  label: string;
  value: string | number;
  remarks: string;
  // trend: string;
  color: string;
  change: string;
}

export interface ActiveProject {
  id: string;
  title: string;
  status: "On Track" | "At Risk" | "Completed";
  members: number;
  endDate: string;
  progress: number;
}

export const USER_MOCK: UserProfile = {
  name: "John Dela Cruz",
  id: "@202309-46832",
  role: "Project Manager",
  institution: "Bakawan Data Analytics, Inc.",
  status: "UA Verified",
};

export const PROJECTS_MOCK: Project[] = [
  { id: 1, title: "Client Portfolio", status: "Active", icon: "Users" },
  { id: 2, title: "Loan Processing", status: "Pending", icon: "CreditCard" },
  { id: 3, title: "Health Records", status: "Active", icon: "Activity" },
];

export const SIDEBAR_MENU = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid, path: "/dashboard" },

  {
    id: "ui-test",
    label: "UI Components",
    icon: Beaker,
    path: "/ui-test",
  },

  {
    id: "error-handler",
    label: "Error Handler",
    icon: X,
    children: [
      { label: "Stay Tuned Handler", path: "/error-handler/stay-tuned" },
      { label: "404", path: "/error-handler/404" },
    ],
  },
];

export const DASHBOARD_STATS: DashboardStat[] = [
  {
    id: "1",
    label: "Total Active Clients",
    value: "19",
    color: "blue",
    remarks: "+3 new accounts this quarter",
    change: "+18.7%",
  },
  {
    id: "2",
    label: "Outstanding Balance",
    value: "117.5M",
    color: "red",
    remarks: "Year-to-date total balance",
    change: "+8.4%",
  },
  {
    id: "3",
    label: "Total Amount Release for the Month",
    value: "2.5M",
    color: "emerald",
    remarks: "83.3% of ₱3.0M monthly quota",
    change: "+12.0%",
  },
  {
    id: "4",
    label: "PAR Rate",
    value: "5.25%",
    color: "purple",
    remarks: "Below 6.0% bank threshold",
    change: "-0.45%",
  },
  {
    id: "5",
    label: "Total Amount of Past Due Account",
    value: "27.5M",
    color: "amber",
    remarks: "16.0% of total portfolio balance",
    change: "-2.1%",
  },
];

export const ACTIVE_PROJECTS_MOCK: ActiveProject[] = [
  {
    id: "p1",
    title: "iProvidence V2 - Kairos Dashboard",
    status: "On Track",
    members: 8,
    endDate: "2026-03-15",
    progress: 75,
  },
  {
    id: "p2",
    title: "Balarao Service Integration",
    status: "At Risk",
    members: 5,
    endDate: "2026-02-28",
    progress: 45,
  },
  {
    id: "p3",
    title: "Staff Management System",
    status: "On Track",
    members: 6,
    endDate: "2026-04-01",
    progress: 60,
  },
];

export const MOCK_STAFF_RECORDS = [
  {
    id: "1",
    cid: "CID-2026-0001",
    name: "Juan Dela Cruz",
    institutionId: "1387",
    institution: "CARD Indogrosir HO",
    mbl: "185,000.00",
    dental: "8,500.00",
    contact: "09171234567",
    type: "Staff List",
  },
  {
    id: "2",
    cid: "CID-2026-0002",
    name: "Maria Santos",
    institutionId: "1387",
    institution: "CARD Indogrosir HO",
    mbl: "150,000.00",
    dental: "0.00",
    contact: "09187654321",
    type: "Remittance Report",
  },
  {
    id: "3",
    cid: "CID-2026-0003",
    name: "Carlos Reyes",
    institutionId: "1389",
    institution: "CI San Rafael, SPC",
    mbl: "185,000.00",
    dental: "10,000.00",
    contact: "09192233445",
    type: "Staff List",
  },
  {
    id: "4",
    cid: "CID-2026-0004",
    name: "Elena Vizcarra",
    institutionId: "1390",
    institution: "DC 1 Laguna",
    mbl: "200,000.00",
    dental: "15,000.00",
    contact: "09170001112",
    type: "Remittance Report",
  },
];
