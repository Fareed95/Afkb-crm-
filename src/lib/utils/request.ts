export async function requestJson<T>(
  url: string,
  options: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const payload = await response.json();

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || "Request failed");
  }

  return payload.data as T;
}
