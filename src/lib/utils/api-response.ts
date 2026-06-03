import { NextResponse } from "next/server";

export function success<T>(data: T, message = "") {
  return NextResponse.json({ success: true, data, message });
}

export function failure(message: string, status = 400) {
  return NextResponse.json({ success: false, data: null, message }, { status });
}
