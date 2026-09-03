"use client";

import Header from "@/components/header";
import { SidebarProvider, SidebarInset, Sidebar } from "@/components/sidebar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <SidebarProvider>
        <Sidebar />
        <SidebarInset className="pt-20">{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
