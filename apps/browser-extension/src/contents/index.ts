import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["file://*/*", "http://*/*", "https://*/*"],
  run_at: "document_start",
  all_frames: true,
  world: "MAIN",
};

declare global {
  interface Window {
    test: () => void;
  }
}

console.log("testing");
window.test = () => {
  console.log("hello world");
};
