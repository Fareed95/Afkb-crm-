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
    <div className="flex flex-col gap-4 pb-5 animate-in-fade sm:gap-6 sm:pb-8 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0 space-y-2 sm:space-y-3">
        <h1 className="break-words bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text font-display text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-sm font-medium text-muted-foreground sm:text-base lg:text-lg">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
