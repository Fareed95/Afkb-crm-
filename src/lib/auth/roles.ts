import type { Role } from "@/constants";

export const OWNER_ROLE: Role = "owner";
export const STAFF_ROLE: Role = "staff";

export function isOwner(role?: Role | null) {
  return role === OWNER_ROLE;
}

export function isStaff(role?: Role | null) {
  return role === STAFF_ROLE;
}
