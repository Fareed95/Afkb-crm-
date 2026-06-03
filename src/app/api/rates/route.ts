import { success, failure } from "@/lib/utils/api-response";
import { listShopRates, setShopRate } from "@/lib/services/rates";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get("shopId");

    if (!shopId) {
      return failure("shopId is required", 400);
    }

    const data = await listShopRates(shopId);
    return success(data);
  } catch (error) {
    return failure((error as Error).message, 400);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await setShopRate({
      shopId: body.shop_id,
      garmentId: body.garment_id,
      rate: body.rate
    });
    return success(data, "Rate updated");
  } catch (error) {
    return failure((error as Error).message, 400);
  }
}
