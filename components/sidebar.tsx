"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  ChevronRight,
  PanelLeft,
  LayoutDashboard,
  NotebookText,
  UserRound,
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
      onClick={toggleSidebar}
      className={cn(
        "rounded-xl p-2.5",
        "text-[#1E4637]",
        "transition-colors duration-200",
        "hover:bg-emerald-50",
        "focus:outline-none",
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

// ============================================================
// NAVIGATION DATA
// ============================================================

const defaultNavItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboard className="size-6 shrink-0" />,
  },

  {
    title: "LM Planner",
    url: "#",
    icon: <NotebookText className="size-6 shrink-0" />,
    isActive: true,
    items: [
      {
        title: "Client Profile",
        url: "/client-profile",
        icon: <UserRound className="size-5 shrink-0" />,
      },
    ],
  },
];

// ============================================================
// NAVIGATION ITEM
// ============================================================

function NavItemRow({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const { isExpanded } = useSidebar();

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
    "text-[#1D4D3E]",
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
          title={!isExpanded ? item.title : undefined}
          className={cn(
            "group/btn",
            "flex w-full items-center",
            "transition-[width,height,padding,gap]",
            "duration-300 ease-in-out",

            isActive ? activeStyles : normalStyles,

            isExpanded
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

              isExpanded
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

            isOpen && isExpanded
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
      title={!isExpanded ? item.title : undefined}
      className={cn(
        "flex w-full items-center",
        "transition-[width,height,padding,gap]",
        "duration-300 ease-in-out",

        isActive ? activeStyles : normalStyles,

        /*
         * Keep the icon at the same x-position.
         */
        isExpanded
          ? "h-12 rounded-xl px-2 gap-3"
          : "h-12 rounded-xl px-2 gap-3",
      )}
    >
      {/* ICON */}
      <div className={cn("flex size-8 shrink-0 items-center justify-center")}>
        {item.icon}
      </div>

      {/* TEXT */}
      <span
        className={cn(
          "min-w-0 truncate text-lg font-medium",
          "overflow-hidden",
          "transition-[opacity,max-width,transform]",
          "duration-300 ease-in-out",

          isExpanded
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
  const { isExpanded, setIsHovered } = useSidebar();

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative shrink-0 h-screen",

        "transition-[width]",
        "duration-300 ease-in-out",

        isExpanded ? "w-72" : "w-18",
      )}
    >
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40",
          "flex flex-col",
          "border-r border-gray-100",
          "bg-white",
          "shadow-lg",
          "overflow-hidden",
          "p-3 mt-20",
          "transition-[width]",
          "duration-300 ease-in-out",

          isExpanded ? "w-72" : "w-[72px]",
        )}
      >
        <nav className="flex w-full flex-col gap-2">
          {defaultNavItems.map((item) => (
            <NavItemRow key={item.title} item={item} />
          ))}
        </nav>
      </div>
    </aside>
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
