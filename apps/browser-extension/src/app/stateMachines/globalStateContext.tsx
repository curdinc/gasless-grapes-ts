import { createContext } from "react";
import { useInterpret } from "@xstate/react";
import type { InterpreterFrom } from "xstate";
import { AccountsManager } from "~app/services/accounts";

import { WalletGlobalMachine } from "@gg/state-machines";

export const GlobalStateContext = createContext({
  userState: {} as InterpreterFrom<typeof WalletGlobalMachine>,
  accountsManager: new AccountsManager(),
});

export function GlobalStateProvider(props: { children: React.ReactNode }) {
  const accountsManager = new AccountsManager();
  const userState = useInterpret(WalletGlobalMachine, {
    services: {
      checkUserState: async () => {
        await new Promise((res, rej) => {
          setTimeout(res, 1000);
        });
        return { state: await accountsManager.getUserAccountState() };
      },
    },
    actions: {
      clearAccountPassword() {
        accountsManager.lockAccount();
      },
    },
  });

  return (
    <GlobalStateContext.Provider value={{ userState, accountsManager }}>
      {props.children}
    </GlobalStateContext.Provider>
  );
}
