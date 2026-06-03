import { success, failure } from "@/lib/utils/api-response";
import { updateGarment, deleteGarment } from "@/lib/services/garments";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = await updateGarment(id, body);
    return success(data, "Garment updated");
  } catch (error) {
    return failure((error as Error).message, 400);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteGarment(id);
    return success(null, "Garment deleted");
  } catch (error) {
    return failure((error as Error).message, 400);
  }
}
