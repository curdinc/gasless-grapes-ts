// content.ts

import console from "console";
import { postMessageLink } from "@elasticbottle/trpc-post-message/link";
import { createTRPCProxyClient, loggerLink } from "@trpc/client";
import type { PlasmoCSConfig } from "plasmo";

import type { WindowEthereumAppRouter } from "./bridge";

// type override
declare global {
  interface Window {
    test: () => void;
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
          console.log("event", event);
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
console.log("testing");
bridgeClient.request
  .query({
    method: "",
    params: [1, 2, 3],
  })
  .then((result) => {
    console.log("result", result);
  })
  .catch((e) => {
    console.error(e);
  });
window.test = () => {
  console.log("hello world");
};
