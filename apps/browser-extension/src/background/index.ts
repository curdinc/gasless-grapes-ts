import { initTRPC } from "@trpc/server";
import { createChromeHandler } from "trpc-chrome/adapter";
import {
  EvmRequestInputSchema,
  type EvmRequestOutputType,
} from "~schema/EvmRequestSchema";

import { runChromeListeners } from "./chromeListeners";
import { evmRpcEvents } from "./events";

const t = initTRPC.create({
  isServer: false,
  allowOutsideOfServer: true,
});
const publicProcedure = t.procedure;

const appRouter = t.router({
  request: publicProcedure.input(EvmRequestInputSchema).query(({ input }) => {
    return new Promise<EvmRequestOutputType>((res, rej) => {
      const onEvmRequestComplete = (
        evmRequestResponse: EvmRequestOutputType,
      ) => {
        console.log("official");
        evmRpcEvents.off("evmRequestComplete", onEvmRequestComplete);
        res(evmRequestResponse);
      };
      const altFn = () => {
        console.log("test");
        evmRpcEvents.off("evmRequestComplete", altFn);
      };

      evmRpcEvents.on("evmRequestComplete", onEvmRequestComplete);
      evmRpcEvents.on("evmRequestComplete", altFn);
      evmRpcEvents.emit("evmRequestComplete", {
        method: "eth_chainId",
        result: "",
      });
      switch (input.method) {
        case "eth_getEncryptionPublicKey ": {
          break;
        }
        default: {
        }
      }
    });
  }),
});
export type AppRouter = typeof appRouter;

createChromeHandler({
  router: appRouter,
  onError:
    process.env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
});

runChromeListeners();
