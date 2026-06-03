import { success, failure } from "@/lib/utils/api-response";
import { getLedger } from "@/lib/services/ledger";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get("shopId");

    if (!shopId) {
      return failure("shopId is required", 400);
    }

    const data = await getLedger(shopId);
    return success(data);
  } catch (error) {
    return failure((error as Error).message, 400);
  }
}
