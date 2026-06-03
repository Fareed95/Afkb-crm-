import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/db/supabase-server";
import { buildAdhocReceiptPdf } from "@/lib/pdf/adhoc";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("adhoc_receipts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return new NextResponse("Not found", { status: 404 });
  }

  const pdfBytes = await buildAdhocReceiptPdf(data);
  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=receipt-${id}.pdf`
    }
  });
}
