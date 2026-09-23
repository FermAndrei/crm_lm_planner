"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

import {
  ChevronRight,
  PanelLeft,
  LayoutDashboard,
  NotebookText,
  UserRound,
  Menu,
  Home,
  FileText,
  Calculator,
  Calendar,
  X,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================

export type NavItem = {
  title: string;
  url: string;
  icon: React.ReactNode;
  isActive?: boolean;
  items?: NavItem[];
};

interface SidebarContextType {
  isCollapsed: boolean;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  toggleSidebar: () => void;

  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;

  isExpanded: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// ============================================================
// SIDEBAR CONTEXT
// ============================================================

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a CustomSidebarProvider");
  }

  return context;
}

// ============================================================
// SIDEBAR PROVIDER
// ============================================================

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const toggleMobile = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const isExpanded = !isCollapsed || isHovered;

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isHovered,
        setIsHovered,
        toggleSidebar,
        isMobileOpen,
        setIsMobileOpen,
        toggleMobile,
        isExpanded,
      }}
    >
      <div className="flex h-screen w-full overflow-hidden bg-[#fbfff9]">
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

// ============================================================
// SIDEBAR TRIGGER
// ============================================================

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar, isCollapsed } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className={cn(
        "hidden lg:inline-flex rounded-xl p-2.5", // desktop only on lg and above
        "text-[#1E4637]",
        "transition-colors duration-200",
        "hover:bg-emerald-50",
        "focus:outline-none cursor-pointer",
        className,
      )}
      title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
    >
      <PanelLeft className="size-6" />
      <span className="sr-only">
        {isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      </span>
    </button>
  );
}

export function SidebarMobileTrigger({ className }: { className?: string }) {
  const { toggleMobile, isMobileOpen } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleMobile}
      className={cn(
        "lg:hidden rounded-md border shadow p-1.5", // mobile/tablet only (screen < lg)
        "text-[#1E4637]",
        "transition-colors duration-200",
        "hover:bg-emerald-50",
        "focus:outline-none cursor-pointer flex items-center justify-center mr-2",
        className,
      )}
    >
      {isMobileOpen ? (
        <X className="size-6 text-[#1E4637]" />
      ) : (
        <Menu className="size-6 text-[#1E4637]" />
      )}
      <span className="sr-only">
        {isMobileOpen ? "Hide Sidebar" : "View Sidebar"}
      </span>
    </button>
  );
}

// ============================================================
// NAVIGATION DATA
// ============================================================

const defaultNavItems: NavItem[] = [
  {
    title: "Homepage",
    url: "/homepage",
    icon: <Home className="size-4 shrink-0" />,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboard className="size-4 shrink-0" />,
  },
  // {
  //   title: "LM Planner",
  //   url: "#",
  //   icon: <NotebookText className="size-6 shrink-0" />,
  //   isActive: true,
  //   items: [
  //     {
  //       title: "Client Profile",
  //       url: "/client-profile",
  //       icon: <UserRound className="size-5 shrink-0" />,
  //     },
  //   ],
  // },
  {
    title: "Client Profile",
    url: "/client-profile",
    icon: <UserRound className="size-4 shrink-0" />,
  },
  {
    title: "Report Modules",
    url: "/report-modules",
    icon: <FileText className="size-4 shrink-0" />,
  },
  {
    title: "Calendar Schedule",
    url: "/calendar-schedule",
    icon: <Calendar className="size-4 shrink-0" />,
  },
  {
    title: "Calculator",
    url: "/calculator",
    icon: <Calculator className="size-4 shrink-0" />,
  },
];

// ============================================================
// NAVIGATION ITEM
// ============================================================

function NavItemRow({
  item,
  onNavigate,
  expanded,
}: {
  item: NavItem;
  onNavigate?: () => void;
  expanded?: boolean;
}) {
  const pathname = usePathname();
  const { isExpanded: contextExpanded, setIsMobileOpen } = useSidebar();

  const handleLinkClick = () => {
    onNavigate?.();
    setIsMobileOpen(false);
  };

  const hasChildren = Boolean(item.items?.length);

  const isCurrent = item.url !== "#" && pathname === item.url;

  const hasActiveChild =
    hasChildren &&
    item.items?.some((child) => child.url !== "#" && pathname === child.url);

  const isActive = isCurrent || Boolean(hasActiveChild);

  const [isOpen, setIsOpen] = useState(
    item.isActive ?? Boolean(hasActiveChild),
  );

  useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  const normalStyles = cn(
    "text-[#333333] text-sm",
    "hover:bg-[#E6F4ED]",
    "hover:text-[#1D4D3E]",
  );

  const activeStyles = cn(
    "bg-[#1D4D3E]",
    "text-white",
    "font-semibold",
    "hover:bg-[#1D4D3E]",
    "hover:text-white",
  );

  const childStyle = cn(
    "border-b border-b-[#1D4D3E]",
    "text-[#1D4D3E]",
    "shadow",
    "text-bold text-teal-800",
  );

  // ==========================================================
  // ITEM WITH CHILDREN
  // ==========================================================

  if (hasChildren) {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          title={!expanded ? item.title : undefined}
          className={cn(
            "group/btn",
            "flex w-full items-center",
            "transition-[width,height,padding,gap]",
            "duration-300 ease-in-out",

            isActive ? activeStyles : normalStyles,

            expanded
              ? "h-12 rounded-xl px-2 gap-3"
              : "h-12 rounded-xl px-2 gap-3",
          )}
        >
          {/* ICON */}
          <div
            className={cn(
              "flex shrink-0 items-center justify-center",
              "transition-[width] duration-300",
              "size-8",
            )}
          >
            {item.icon}
          </div>

          {/* TEXT + CHEVRON */}
          <div
            className={cn(
              "flex min-w-0 flex-1 items-center justify-between",
              "overflow-hidden",
              "transition-[opacity,max-width,transform]",
              "duration-300 ease-in-out",

              expanded
                ? "max-w-full opacity-100 translate-x-0"
                : "max-w-0 opacity-0 -translate-x-2",
            )}
          >
            <span className="truncate text-lg font-medium">{item.title}</span>

            <ChevronRight
              className={cn(
                "ml-2 size-5 shrink-0",
                "transition-transform duration-300",
                isOpen && "rotate-90",
              )}
            />
          </div>
        </button>

        {/* ================================================== */}
        {/* CHILDREN                                           */}
        {/* ================================================== */}

        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity]",
            "duration-300 ease-in-out",

            isOpen && expanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <div className="mt-1.5 ml-4 space-y-1 border-l-2 border-emerald-800/20 pl-3">
              {item.items!.map((child) => {
                const isChildActive = pathname === child.url;

                return (
                  <Link
                    key={child.title}
                    href={child.url}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex h-12 items-center gap-3",
                      "rounded-xl px-3",
                      "text-base",
                      "transition-colors duration-200",

                      isChildActive ? childStyle : normalStyles,
                    )}
                  >
                    <div className="flex size-6 shrink-0 items-center justify-center">
                      {child.icon}
                    </div>

                    <span className="truncate font-medium">{child.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // NORMAL ITEM WITHOUT CHILDREN
  // ==========================================================

  return (
    <Link
      href={item.url}
      onClick={handleLinkClick}
      title={!expanded ? item.title : undefined}
      className={cn(
        "flex w-full items-center",
        "transition-[width,height,padding,gap]",
        "duration-300 ease-in-out",

        isActive ? activeStyles : normalStyles,

        /*
         * Keep the icon at the same x-position.
         */
        expanded ? "h-12 rounded-md px-2 gap-2" : "h-12 rounded-md px-2 gap-2",
      )}
    >
      {/* ICON */}
      <div className={cn("flex size-8 shrink-0 items-center justify-center")}>
        {item.icon}
      </div>

      {/* TEXT */}
      <span
        className={cn(
          "min-w-0 truncate text-sm font-medium",
          "overflow-hidden",
          "transition-[opacity,max-width,transform]",
          "duration-300 ease-in-out",

          expanded
            ? "max-w-full opacity-100 translate-x-0"
            : "max-w-0 opacity-0 -translate-x-2",
        )}
      >
        {item.title}
      </span>
    </Link>
  );
}

// ============================================================
// SIDEBAR
// ============================================================

export function Sidebar() {
  const { isExpanded, setIsHovered, isMobileOpen, setIsMobileOpen } =
    useSidebar();

  return (
    <>
      {/* ================================================== */}
      {/* MOBILE BACKDROP — click to close                   */}
      {/* ================================================== */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* ================================================== */}
      {/* DESKTOP SIDEBAR — visible only on lg screens       */}
      {/* ================================================== */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative hidden lg:block h-screen shrink-0",
          "transition-[width] duration-300 ease-in-out",
          isExpanded ? "w-72" : "w-18",
        )}
      >
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-30",
            "flex flex-col",
            "border-r border-gray-100",
            "bg-white",
            "shadow-lg",
            "overflow-hidden",
            "p-3 ",
            "transition-[width]",
            "duration-300 ease-in-out",
            isExpanded ? "w-72" : "w-18",
          )}
        >
          <Image
            src="/CARD_SME_Logo.png"
            alt="Institution Logo"
            width={180}
            height={60}
            className={cn(
              "object-contain transition-all duration-300 mb-2",
              isExpanded ? "h-14 w-auto" : "h-14 w-auto",
            )}
          />
          <nav className="flex w-full flex-col gap-2">
            {defaultNavItems.map((item) => (
              <NavItemRow key={item.title} item={item} expanded={isExpanded} />
            ))}
          </nav>
        </div>
      </aside>

      {/* ================================================== */}
      {/* MOBILE DRAWER — visible only on < lg screens       */}
      {/* ================================================== */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-70 w-72",
          "lg:hidden",
          "flex flex-col",
          "bg-white",
          "border-r border-gray-100",
          "shadow-2xl",
          "p-4",
          "transition-transform duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Drawer Header with Logo and Hide/Close Button */}
        {/* <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100"> */}
        <Image
          src="/CARD_SME_Logo.png"
          alt="Institution Logo"
          width={150}
          height={50}
          className="h-12 w-auto object-contain mb-4"
        />
        {/* <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="p-2 text-gray-500 hover:text-[#1E4637] hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
            title="Hide Sidebar"
            aria-label="Hide Sidebar"
          >
            <X className="size-6 text-[#1E4637]" />
          </button> */}
        {/* </div> */}

        {/* Drawer Navigation Links */}
        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
          {defaultNavItems.map((item) => (
            <NavItemRow
              key={item.title}
              item={item}
              expanded={true}
              onNavigate={() => setIsMobileOpen(false)}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}

// ============================================================
// SIDEBAR INSET
// ============================================================

export function SidebarInset({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "min-w-0 flex-1",
        "h-screen",
        "flex flex-col",
        "overflow-y-auto",
        "overflow-x-hidden",
        "bg-[#fbfff9]",
        "transition-[width]",
        "duration-300 ease-in-out",
        className,
      )}
    >
      {children}
    </main>
  );
}
