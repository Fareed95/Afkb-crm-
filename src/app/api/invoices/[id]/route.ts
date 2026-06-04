import { success, failure } from "@/lib/utils/api-response";
import { getInvoiceById, deleteInvoice } from "@/lib/services/invoices";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getInvoiceById(id);
    return success(data);
  } catch (error) {
    return failure((error as Error).message, 404);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await deleteInvoice(id);
    return success(data, "Invoice deleted");
  } catch (error) {
    return failure((error as Error).message, 400);
  }
}
