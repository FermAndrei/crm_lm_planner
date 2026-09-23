"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  LogOut,
  Lock,
  User as UserIcon,
  Settings,
  ChevronRight,
  Home,
} from "lucide-react";

interface Breadcrumb {
  href: string;
  label: React.ReactNode;
  isLast: boolean;
  isClickable: boolean;
}
import Link from "next/link";
import DateAndTime from "./ui/date-time";
import { SidebarMobileTrigger } from "./sidebar";

// Define which routes are actual pages (leaf nodes)
const CLICKABLE_ROUTES = new Set([
  "/dashboard",
  "/ui-test",
  "/staff",
  "/reports",
  "/settings",
  "/error-handler/stay-tuned",
  "/error-handler/404",
  "/calendar-schedule",
  "/calculator",
]);

// Define parent routes that should NOT be clickable
const NON_CLICKABLE_PARENTS = new Set(["/error-handler"]);

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const generateBreadcrumbs = (): Breadcrumb[] => {
    const paths = pathname.split("/").filter((path) => path !== "");

    const breadcrumbs: Breadcrumb[] = [
      {
        href: "/homepage",
        label: <Home size={16} className="text-[#1E6E25]" />,
        isLast: paths.length === 0,
        isClickable: true,
      },
    ];

    let currentPath = "";
    paths.forEach((path, index) => {
      currentPath += `/${path}`;
      let label = path.charAt(0).toUpperCase() + path.slice(1);

      // Custom labels for specific paths
      if (path === "report-modules") label = "Report Module";
      if (path === "calendar-schedule") label = "Calendar Schedule";
      if (path === "calculator") label = "SME Calculator";

      const isClickable =
        CLICKABLE_ROUTES.has(currentPath) &&
        !NON_CLICKABLE_PARENTS.has(currentPath);
      const isLast = index === paths.length - 1;

      breadcrumbs.push({
        href: currentPath,
        label,
        isLast,
        isClickable,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="sticky top-0 z-40 shrink-0 h-19 min-h-19 px-4 md:px-8 flex items-center justify-between w-full bg-[#F7F7F8] backdrop-blur-md border-b border-[#191924]/[0.07] shadow-cloud-nav">
      {/* Left Section - Title & Breadcrumbs */}
      <div className="relative flex items-center gap-2">
        <SidebarMobileTrigger />
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment
            key={`${String(crumb.href)}-${String(crumb.label)}-${idx}`}
          >
            {idx > 0 && <ChevronRight size={14} className="text-gray-300" />}

            {crumb.isLast ? (
              <span className="text-[#1E6E25] font-medium text-sm flex items-center">
                {crumb.label}
              </span>
            ) : crumb.isClickable ? (
              <Link
                href={crumb.href}
                className="text-gray-500 hover:text-[#1E4637] transition-colors text-sm flex items-center"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-gray-400 text-sm cursor-default flex items-center">
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Right Section - Search & Profile */}
      <div className="flex items-center gap-4">
        <DateAndTime />

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 cursor-pointer p-1.5 sm:p-2 hover:bg-[#FAF9FD] border border-transparent hover:border-[#191924]/6 rounded-full sm:rounded-2xl transition-all"
          >
            <div className="w-10 h-10 bg-[#05512A] rounded-full flex items-center justify-center text-white shadow-md">
              <UserIcon size={18} />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-bold text-[#191924] leading-none">
                John Dela Cruz
              </p>
              <p className="text-[10px] text-slate-400 mt-1 font-bold tracking-wider">
                System Admin
              </p>
            </div>
            <ChevronDown
              size={15}
              className={`text-[#9a9ab0] transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
            />
          </div>

          {/* Profile Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-[#191924]/8 rounded-md shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              {/* Soft Cloud Gradient Banner */}
              <div className="h-24 bg-linear-to-r from-[#E4E9FF] via-[#FFE3EE] to-[#DDF6EA]" />

              <div className="p-5 -mt-10">
                <div className="w-20 h-20 bg-white rounded-full p-1 shadow-md mb-3">
                  <div className="w-full h-full bg-[#346006] rounded-full flex items-center justify-center text-white">
                    <UserIcon size={32} />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[#191924]">Ferm</h3>
                <p className="text-xs text-[#5a5a70]">
                  ferm.andrei@cardsme.bank
                </p>

                <div className="mt-5 space-y-3">
                  <div className="flex gap-3 items-center">
                    <UserIcon size={15} className="text-[#9a9ab0]" />
                    <div>
                      <p className="text-[10px] font-bold text-[#9a9ab0] uppercase tracking-wider">
                        Role
                      </p>
                      <p className="text-xs font-semibold text-[#191924]">
                        Portfolio & Loan Manager
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-center">
                    <Lock size={15} className="text-[#9a9ab0]" />
                    <div>
                      <p className="text-[10px] font-bold text-[#9a9ab0] uppercase tracking-wider">
                        Institution ID
                      </p>
                      <p className="text-xs font-semibold text-[#191924]">
                        PH1020 - CARD SME HO
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-[#E2F6ED] rounded-xl p-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#12946a] animate-pulse" />
                    <span className="text-xs font-bold text-[#12946a]">
                      Active · Certified Loan Officer
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-2.5">
                  <button className="w-full py-2.5 border border-[#191924]/10 text-[#191924] rounded-full text-xs font-bold hover:bg-[#FAF9FD] transition-colors flex items-center justify-center gap-2">
                    <Settings size={14} /> Account Settings
                  </button>
                  <button className="w-full py-2.5 bg-[#191924] text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#28283a] transition-colors shadow-sm">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
