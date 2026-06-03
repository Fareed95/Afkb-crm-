"use client";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth/sign-out";
import { LogOut, Bell, Search } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex h-20 items-center gap-4 bg-background/40 backdrop-blur-md px-8 lg:h-[80px] z-10">
      <div className="w-full flex-1">
        <div className="relative max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="search"
            placeholder="Search anything..."
            className="w-full bg-card/60 backdrop-blur-xl shadow-sm appearance-none border border-white/20 dark:border-white/5 rounded-full pl-11 pr-4 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-background transition-all duration-300"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-card/60 shadow-sm border border-white/20 dark:border-white/5 hover:text-primary transition-colors">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border/50 mx-1" />
        <form action={signOutAction}>
          <Button variant="ghost" className="h-10 rounded-full px-5 text-destructive hover:bg-destructive/10 hover:text-destructive font-semibold gap-2 transition-all">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
