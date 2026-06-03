import { success, failure } from "@/lib/utils/api-response";
import { listWorkEntries, createWorkEntry } from "@/lib/services/work-entries";

export async function GET() {
  try {
    const data = await listWorkEntries();
    return success(data);
  } catch (error) {
    return failure((error as Error).message, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await createWorkEntry(body);
    return success(data, "Work entry created");
  } catch (error) {
    return failure((error as Error).message, 400);
  }
}
