"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { 
  LayoutDashboard, 
  Store, 
  Scissors, 
  FileText, 
  IndianRupee, 
  BookOpen, 
  BarChart3, 
  Settings,
  Shirt
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/shops", label: "Shops", icon: Store },
  { href: "/work-entries", label: "Work Entries", icon: Scissors },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/payments", label: "Payments", icon: IndianRupee },
  { href: "/ledger", label: "Ledger", icon: BookOpen },
  { href: "/reports", label: "Reports", icon: BarChart3 }
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[260px] flex-col bg-card/90 backdrop-blur-md border-r shadow-xl dark:border-white/5 z-20">
      <div className="flex h-24 items-center px-6 border-b">
        <Link href="/dashboard" className="flex items-center gap-3 group w-full">
          <div className="relative h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <Shirt className="h-6 w-6 relative z-10" />
            <Scissors className="h-4 w-4 absolute bottom-2 right-2 opacity-80 z-10" />
          </div>
          <div>
            <h2 className="font-display font-black tracking-tight text-xl text-foreground">AFKB</h2>
            <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Tailor System</p>
          </div>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <p className="px-4 text-[11px] font-bold text-muted-foreground mb-4 uppercase tracking-[0.15em]">Main Menu</p>
        <nav className="grid gap-1.5">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200",
                  active 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 transition-transform duration-300", active ? "" : "text-muted-foreground group-hover:text-primary")} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t bg-muted/20">
        <Link
          href="/settings"
          className={cn(
            "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 mb-4",
            pathname.startsWith("/settings")
              ? "bg-primary text-primary-foreground shadow-md" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
          Settings
        </Link>
        
        <div className="px-2 py-3 text-center border-t border-border/50">
          <p className="text-[11px] font-medium text-muted-foreground">
            Built with <span className="text-primary font-bold">Crodlin Technology</span>
          </p>
          <a 
            href="https://crodlin.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors underline decoration-primary/30 underline-offset-2"
          >
            crodlin.in
          </a>
        </div>
      </div>
    </div>
  );
}
