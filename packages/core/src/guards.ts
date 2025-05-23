import { type NativeEventTarget, type createEvent } from "./main";

export function is_object(value: unknown): value is object {
  return value != null && value.constructor.name === "Object";
}

export function is_string(value: unknown): value is string {
  return typeof value === "string";
}

export function is_valid_browser_event_target(
  value: unknown,
): value is NativeEventTarget {
  return value === "document" || value === "window";
}

export function parse_browser_emitter(value: string) {
  const [target, event] = value.split(":");
  if (is_valid_browser_event_target(target)) {
    return { target, event };
  } else {
    throw new Error("Invalid browser event.");
  }
}

export function is_synthetic_emitter(
  value: unknown,
): value is ReturnType<typeof createEvent<any>> {
  return typeof value === "function";
}
