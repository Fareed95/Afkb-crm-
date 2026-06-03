import { success, failure } from "@/lib/utils/api-response";
import { listGarments, createGarment } from "@/lib/services/garments";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get("shopId");
    
    if (!shopId) {
      return failure("shopId is required", 400);
    }
    
    const data = await listGarments(shopId);
    return success(data);
  } catch (error) {
    return failure((error as Error).message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await createGarment(body);
    return success(data, "Garment created");
  } catch (error) {
    return failure((error as Error).message, 400);
  }
}
