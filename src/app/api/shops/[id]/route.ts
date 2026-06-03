import { success, failure } from "@/lib/utils/api-response";
import { getShopById, updateShop, deleteShop } from "@/lib/services/shops";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getShopById(id);
    return success(data);
  } catch (error) {
    return failure((error as Error).message, 404);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await updateShop(id, body);
    return success(data, "Shop updated");
  } catch (error) {
    return failure((error as Error).message, 400);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteShop(id);
    return success(true, "Shop deleted");
  } catch (error) {
    return failure((error as Error).message, 400);
  }
}
