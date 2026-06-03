import { success } from "@/lib/utils/api-response";

export async function GET() {
  return success({ ok: true }, "healthy");
}
