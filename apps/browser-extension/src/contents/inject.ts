// content.ts

import { postMessageLink } from "@elasticbottle/trpc-post-message/link";
import { createTRPCProxyClient, loggerLink } from "@trpc/client";
import type { PlasmoCSConfig } from "plasmo";

import type { WindowEthereumAppRouter } from "./bridge";
import { WindowEthereum } from "./windowEthereum";

// type override
declare global {
  interface Window {
    test: () => void;
    ethereum?: { test: () => void };
  }
}

// config
export const config: PlasmoCSConfig = {
  matches: ["file://*/*", "http://*/*", "https://*/*"],
  run_at: "document_start",
  all_frames: true,
  world: "MAIN",
};

export const bridgeClient = createTRPCProxyClient<WindowEthereumAppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    postMessageLink({
      addEventListener(listener) {
        const customListener = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) {
            return;
          }
          listener(event);
        };
        window.addEventListener("message", customListener);
        return customListener;
      },
      removeEventListener(listener) {
        window.removeEventListener("message", listener);
      },
      postMessage({ message }) {
        window.postMessage(message, window.location.origin);
      },
    }),
  ],
});

// inject
console.log("Injecting window.ethereum...");
const windowProvider = new WindowEthereum(bridgeClient);

Object.defineProperty(window, "ethereum", {
  get() {
    return windowProvider;
  },
});
