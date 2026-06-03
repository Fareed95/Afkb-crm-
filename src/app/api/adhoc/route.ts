import { success, failure } from "@/lib/utils/api-response";
import { listAdhocReceipts, createAdhocReceipt } from "@/lib/services/adhoc";

export async function GET() {
  try {
    const data = await listAdhocReceipts();
    return success(data);
  } catch (error) {
    return failure((error as Error).message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await createAdhocReceipt(body);
    return success(data, "Receipt created");
  } catch (error) {
    return failure((error as Error).message, 400);
  }
}
