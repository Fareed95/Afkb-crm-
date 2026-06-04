"use client";

import { useEffect, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, BarChart, Bar } from "recharts";
import { MetricCard } from "@/components/shared/metric-card";
import type { DashboardSnapshot } from "@/lib/services/dashboard";
import { formatCurrency } from "@/lib/utils/format";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, IndianRupee } from "lucide-react";

export function DashboardOverview({ snapshot }: { snapshot: DashboardSnapshot }) {
  const { kpis } = snapshot;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-6 grid gap-3 sm:flex sm:flex-wrap">
        <Link href="/work-entries" className="w-full sm:w-auto">
          <Button className="btn-lg w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Work Entry
          </Button>
        </Link>
        <Link href="/invoices" className="w-full sm:w-auto">
          <Button variant="outline" className="h-12 w-full rounded-xl border-border bg-card px-6 sm:w-auto">
            <FileText className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </Link>
        <Link href="/payments" className="w-full sm:w-auto">
          <Button variant="outline" className="h-12 w-full rounded-xl border-border bg-card px-6 sm:w-auto">
            <IndianRupee className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Today's Revenue" value={kpis.todaysRevenue} isCurrency />
        <MetricCard label="This Month Revenue" value={kpis.monthRevenue} isCurrency tone="accent" />
        <MetricCard label="Pending Balance" value={kpis.pendingBalance} isCurrency />
        <MetricCard label="Total Shops" value={kpis.totalShops} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-6 rounded-xl border bg-card p-4 text-card-foreground shadow-sm sm:p-6">
          <h3 className="font-semibold text-lg tracking-tight">Revenue by Day</h3>
          <div className="h-[250px] w-full bg-muted/10 rounded-lg flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={snapshot.revenueByDay}>
                  <XAxis dataKey="date" hide />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    formatter={(value) => formatCurrency(Number(value))}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="currentColor"
                    fill="currentColor"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    className="text-primary"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-sm text-muted-foreground animate-pulse">Loading chart...</span>
            )}
          </div>
        </div>

        <div className="space-y-6 rounded-xl border bg-card p-4 text-card-foreground shadow-sm sm:p-6">
          <h3 className="font-semibold text-lg tracking-tight">Revenue by Month</h3>
          <div className="h-[250px] w-full bg-muted/10 rounded-lg flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={snapshot.revenueByMonth}>
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    formatter={(value) => formatCurrency(Number(value))} 
                  />
                  <Bar dataKey="total" className="fill-primary" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-sm text-muted-foreground animate-pulse">Loading chart...</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-lg tracking-tight">Outstanding by Shop</h3>
          <ul className="space-y-3 text-sm">
            {snapshot.outstandingByShop.map((row) => (
              <li key={row.shop} className="flex justify-between items-center py-1 border-b last:border-0 border-border/50">
                <span className="text-muted-foreground font-medium">{row.shop}</span>
                <span className="font-semibold">{formatCurrency(row.balance)}</span>
              </li>
            ))}
            {snapshot.outstandingByShop.length === 0 && (
              <li className="text-muted-foreground text-sm py-2">No outstanding balances.</li>
            )}
          </ul>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-lg tracking-tight">Top Customers</h3>
          <ul className="space-y-3 text-sm">
            {snapshot.topCustomers.map((row) => (
              <li key={row.shop} className="flex justify-between items-center py-1 border-b last:border-0 border-border/50">
                <span className="text-muted-foreground font-medium">{row.shop}</span>
                <span className="font-semibold">{formatCurrency(row.total)}</span>
              </li>
            ))}
            {snapshot.topCustomers.length === 0 && (
              <li className="text-muted-foreground text-sm py-2">No data available.</li>
            )}
          </ul>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-lg tracking-tight">Most Processed Garments</h3>
          <ul className="space-y-3 text-sm">
            {snapshot.mostProcessed.map((row) => (
              <li key={row.garment} className="flex justify-between items-center py-1 border-b last:border-0 border-border/50">
                <span className="text-muted-foreground font-medium">{row.garment}</span>
                <span className="font-semibold bg-secondary px-2 py-0.5 rounded-full">{row.quantity}</span>
              </li>
            ))}
            {snapshot.mostProcessed.length === 0 && (
              <li className="text-muted-foreground text-sm py-2">No data available.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 border-t pt-6">
        <MetricCard label="Total Invoices" value={kpis.totalInvoices} />
        <MetricCard label="Total Payments" value={kpis.totalPayments} />
        <MetricCard label="Garments Processed" value={kpis.totalGarmentsProcessed} />
      </div>
    </div>
  );
}
