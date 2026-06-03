"use client";

import { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between pb-8 animate-in-fade">
      <div className="space-y-3">
        <h1 className="font-display text-4xl lg:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-muted-foreground max-w-2xl font-medium">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
