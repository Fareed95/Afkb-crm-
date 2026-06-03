import { NextResponse } from "next/server";
import { getLedger } from "@/lib/services/ledger";
import { getShopById } from "@/lib/services/shops";
import { buildLedgerPdf } from "@/lib/pdf/ledger";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ shopId: string }> }
) {
  const { shopId } = await params;
  const [ledger, shop] = await Promise.all([
    getLedger(shopId),
    getShopById(shopId)
  ]);
  const pdfBytes = await buildLedgerPdf(ledger, shop.shop_name);

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${shop.shop_name}-ledger.pdf`
    }
  });
}
