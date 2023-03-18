import { EventEmitter } from "events";
import type TypedEmitter from "typed-emitter";
import type { EvmRequestOutputType } from "~schema/EvmRequestSchema";

// Define your emitter's types in the following format:
// Key: Event name; Value: Listener function signature
type MessageEvents = {
  evmRequestComplete: (evmRequestResponse: EvmRequestOutputType) => void;
};

export const evmRpcEvents = new EventEmitter() as TypedEmitter<MessageEvents>;
