"use client";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth/sign-out";
import { LogOut, Bell, Menu, Search } from "lucide-react";

export function AppHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur-md sm:gap-4 sm:px-6 lg:h-20 lg:border-b-0 lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 lg:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <div className="min-w-0 flex-1">
        <div className="relative max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="search"
            placeholder="Search..."
            className="h-10 w-full appearance-none rounded-full border border-border bg-card/60 pl-10 pr-3 text-sm shadow-sm transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 sm:h-12 sm:pl-11 sm:pr-4"
          />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="hidden h-10 w-10 rounded-full bg-card/60 shadow-sm border border-white/20 dark:border-white/5 hover:text-primary transition-colors sm:inline-flex">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="mx-1 hidden h-8 w-px bg-border/50 sm:block" />
        <form action={signOutAction}>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto sm:px-5">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
