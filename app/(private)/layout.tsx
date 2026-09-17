"use client";

import Header from "@/components/header";
import { SidebarProvider, SidebarInset, Sidebar } from "@/components/sidebar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="bg-[#F7F7F8]">
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
