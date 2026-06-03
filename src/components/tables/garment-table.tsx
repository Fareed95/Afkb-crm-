"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/data-table";
import type { Garment } from "@/types";
import { formatCurrency } from "@/lib/utils/format";

const columns: ColumnDef<Garment>[] = [
  { accessorKey: "garment_name", header: "Garment" },
  {
    accessorKey: "default_rate",
    header: "Default Rate",
    cell: ({ getValue }) => formatCurrency(Number(getValue()))
  }
];

export function GarmentTable({ data }: { data: Garment[] }) {
  return <DataTable columns={columns} data={data} />;
}
