import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeArray<T extends unknown[]>(a: T): T {
  // @ts-expect-error
  return Array.isArray(a) ? a : [];
}

export function safeString(a: unknown) {
  return typeof a === "string" ? a : "";
}
