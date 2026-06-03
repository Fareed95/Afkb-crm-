import { success, failure } from "@/lib/utils/api-response";
import { listPayments, recordPayment } from "@/lib/services/payments";

export async function GET() {
  try {
    const data = await listPayments();
    return success(data);
  } catch (error) {
    return failure((error as Error).message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await recordPayment(body);
    return success(data, "Payment recorded");
  } catch (error) {
    return failure((error as Error).message, 400);
  }
}
