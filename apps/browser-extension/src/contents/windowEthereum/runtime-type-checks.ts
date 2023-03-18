import type { AAExtensionConfigPayload } from "./types";

export function isNumber(arg: unknown): arg is number {
  return getType(arg) === "Number";
}

export function getType(arg: unknown): string {
  return Object.prototype.toString.call(arg).slice("[object ".length, -1);
}

export function isMessageEvent(arg: unknown): arg is MessageEvent {
  return arg instanceof MessageEvent;
}

export function isString(arg: unknown): arg is string {
  return getType(arg) === "String";
}

export function isUndefined(arg: unknown): arg is undefined {
  return typeof arg === "undefined";
}

export function isObject(
  arg: unknown,
): arg is Record<string | number | symbol, unknown> {
  return getType(arg) === "Object";
}

export function isAAExtensionConfigPayload(
  arg: unknown,
): arg is AAExtensionConfigPayload {
  return isObject(arg) && arg.method === "aa-extension_getConfig";
}
