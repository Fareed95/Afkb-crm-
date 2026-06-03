"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/tables/data-table";
import type { Shop } from "@/types";

const columns: ColumnDef<Shop>[] = [
  { accessorKey: "shop_name", header: "Shop" },
  { accessorKey: "phone_number", header: "Phone" },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => (getValue() as string) || "-"
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Link
        className="text-sm font-semibold text-primary"
        href={`/shops/${row.original.id}`}
      >
        View
      </Link>
    )
  }
];

export function ShopTable({ data }: { data: Shop[] }) {
  return <DataTable columns={columns} data={data} />;
}
