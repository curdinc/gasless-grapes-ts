// content.ts
import { createPostMessageHandler } from "@elasticbottle/trpc-post-message/adapter";
import { createTRPCProxyClient, loggerLink } from "@trpc/client";
import { initTRPC } from "@trpc/server";
import type { PlasmoCSConfig } from "plasmo";
import { chromeLink } from "trpc-chrome/link";
import type { AppRouter } from "~background";
import { EvmRequestInputSchema } from "~schema/EvmRequestSchema";

// config
export const config: PlasmoCSConfig = {
  matches: ["file://*/*", "http://*/*", "https://*/*"],
  run_at: "document_start",
  all_frames: true,
};

// create client to talk to service worker
const port = chrome.runtime.connect(process.env.PLASMO_PUBLIC_EXTENSION_ID, {
  name: "bg-worker-messaging-port",
});
export const bgWorkerClient = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    chromeLink({ port }),
  ],
});

// create procedures for MAIN content script to call
const t = initTRPC.create({
  isServer: false,
  allowOutsideOfServer: true,
});
const publicProcedure = t.procedure;

const appRouter = t.router({
  request: publicProcedure
    .input(EvmRequestInputSchema)
    .query(async ({ input }) => {
      console.log("input", input);
      // const test = await bgWorkerClient.request.subscribe({ name: "test" });
      // console.log("test", test);
      // return test;
      return "done";
    }),
});
export type WindowEthereumAppRouter = typeof appRouter;

// Create handler to listen to the MAIN script
createPostMessageHandler({
  router: appRouter,
  onError:
    process.env.NODE_ENV === "development"
      ? ({ path, error }) => {
          console.error(
            `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
          );
        }
      : undefined,
  addEventListener(listener) {
    window.addEventListener("message", (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      listener(event);
    });
  },
  postMessage({ message, opts }) {
    const { event } = opts;
    event.source.postMessage(message, {
      targetOrigin: event.origin,
    });
  },
});
