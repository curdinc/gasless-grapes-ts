import { initTRPC } from "@trpc/server";
import GrapeIcon from "data-base64:~assets/icon.png";
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

console.log("running bg script");

const appRouter = t.router({
  request: publicProcedure.input(EvmRequestInputSchema).query(({ input }) => {
    console.log("input", input);
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

      switch (input.method) {
        case "eth_getEncryptionPublicKey ": {
          break;
        }
        case "eth_accounts":
        case "eth_requestAccounts": {
          console.log("input.params", input.params);
          chrome.notifications.create(
            {
              iconUrl: GrapeIcon,
              message: "Allow this site to access your Ethereum account?",
              title: "Connect Wallet to Site",
              type: "basic",
              buttons: [
                {
                  title: "Approve",
                },
                {
                  title: "Reject",
                },
              ],
            },
            (notificationId) => {
              console.log("notificationId", notificationId);
            },
          );
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
