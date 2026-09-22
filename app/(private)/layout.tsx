"use client";

import Header from "@/components/header";
import { SidebarProvider, SidebarInset, Sidebar } from "@/components/sidebar";
import { CalendarProvider } from "@/context/calendar-context";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CalendarProvider>
      <SidebarProvider>
        <Sidebar />
        <SidebarInset className="bg-[#F7F7F8]">
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </CalendarProvider>
  );
}
