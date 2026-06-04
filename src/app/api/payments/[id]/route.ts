import { success, failure } from "@/lib/utils/api-response";
import { deletePayment } from "@/lib/services/payments";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await deletePayment(id);
    return success(result, "Payment deleted successfully");
  } catch (error) {
    return failure((error as Error).message, 500);
  }
}
