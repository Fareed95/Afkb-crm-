"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppHeader } from "@/components/shared/app-header";
import { getSupabaseBrowserClient } from "@/lib/db/supabase-browser";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuth = pathname.startsWith("/login") || pathname.startsWith("/callback");
  const isPrint = pathname.startsWith("/print");

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    // Only monitor authentication on protected/authenticated pages
    if (isAuth || isPrint) return;

    const supabase = getSupabaseBrowserClient();

    // Check initial session validity
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
      }
    });

    // Listen for client-side auth state changes (e.g. expiration, signout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/login";
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isAuth, isPrint]);

  if (isAuth || isPrint) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen overflow-hidden lg:h-screen print:h-auto print:overflow-visible print:block">
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden print:overflow-visible print:block">
        <AppHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto outline-none print:overflow-visible print:h-auto print:block">
          <div className="container-page py-5 sm:py-8 print:py-0 print:p-0 print:m-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
