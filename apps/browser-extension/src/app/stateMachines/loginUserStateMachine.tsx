import { createContext, useContext } from "react";
import { useInterpret } from "@xstate/react";
import type { InterpreterFrom } from "xstate";

import { UserLoginMachine } from "@gg/state-machines";

import { GlobalStateContext } from "./globalStateContext";

export const LoginStateContext = createContext({
  loginService: {} as InterpreterFrom<typeof UserLoginMachine>,
});

export function LoginStateProvider(props: { children: React.ReactNode }) {
  const { accountsManager, userState } = useContext(GlobalStateContext);
  const loginService = useInterpret(UserLoginMachine, {
    services: {
      login: async (ctx) => {
        console.log("logging user in");
        const userStatus = await accountsManager.unlockAccount(ctx.password);
        console.log("userStatus", userStatus);
        if (userStatus !== "loggedInUser") {
          throw new Error("INVALID PASSWORD");
        } else {
          userState.send("UNLOCK_ACCOUNT");
        }
      },
    },
  });

  return (
    <LoginStateContext.Provider value={{ loginService }}>
      {props.children}
    </LoginStateContext.Provider>
  );
}
