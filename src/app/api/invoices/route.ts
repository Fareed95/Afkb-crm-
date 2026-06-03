import { success, failure } from "@/lib/utils/api-response";
import { listInvoices, createInvoice } from "@/lib/services/invoices";

export async function GET() {
  try {
    const data = await listInvoices();
    return success(data);
  } catch (error) {
    return failure((error as Error).message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await createInvoice(body);
    return success(data, "Invoice created");
  } catch (error) {
    return failure((error as Error).message, 400);
  }
}
