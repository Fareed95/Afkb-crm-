import { success, failure } from "@/lib/utils/api-response";
import { listShops, createShop } from "@/lib/services/shops";

export async function GET() {
  try {
    const data = await listShops();
    return success(data);
  } catch (error) {
    return failure((error as Error).message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await createShop(body);
    return success(data, "Shop created");
  } catch (error) {
    return failure((error as Error).message, 400);
  }
}
