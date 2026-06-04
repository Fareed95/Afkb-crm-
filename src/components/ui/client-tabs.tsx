"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export function ClientTabs({ tabs }: { tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="space-y-6">
      <div className="flex space-x-1 rounded-xl bg-muted/50 p-1 w-fit max-w-full overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all whitespace-nowrap",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="animate-in-fade">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
}
