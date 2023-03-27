import { createMachine } from "xstate";

const WalletUsageMachine = createMachine({
  id: "WalletUsage",
  tsTypes: {} as import("./WalletUsageMachine.typegen").Typegen0,
  schema: {
    context: {} as { pendingTransaction: string[] },
    events: {} as
      | { type: "VIEW_ASSETS_PAGE" }
      | { type: "VIEW_TOKENS_TAB" }
      | { type: "VIEW_NFTS_TAB" }
      | {
          type: "VIEW_TRANSACTIONS_PAGE";
        }
      | {
          type: "VIEW_SETTINGS_PAGE";
        },
    services: {} as {
      deploySmartContractWallet: {
        data: { smartContractWalletAddress: string };
      };
    },
  },
  context: {
    pendingTransaction: [],
  },
  initial: "initialState",
  states: {
    initialState: {},
  },
});
