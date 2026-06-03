"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppHeader } from "@/components/shared/app-header";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname.startsWith("/login") || pathname.startsWith("/callback");

  if (isAuth) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/20">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto outline-none">
          <div className="container-page py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
