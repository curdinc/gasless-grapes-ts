import { useInterpret } from "@xstate/react";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import type { InterpreterFrom } from "xstate";

import { WalletOnboardingMachine } from "@gg/state-machines";

import { GlobalStateContext } from "./globalStateContext";

export const OnboardingStateContext = createContext({
  onboardingService: {} as InterpreterFrom<typeof WalletOnboardingMachine>,
});

export function OnboardingStateProvider(props: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { accountsManager, userState } = useContext(GlobalStateContext);
  const onboardingService = useInterpret(WalletOnboardingMachine, {
    services: {
      saveUserEoa: async (ctx, event) => {
        console.log("saving user's wallet details");
        const wallet = event.data.userWallet;
        const mnemonic = wallet.mnemonic;
        const pwd = ctx.password;
        await accountsManager.createAccount({
          pwd,
          seedPhrase: mnemonic?.phrase,
          name: ctx.name,
          privateKey: wallet.privateKey,
        });
      },
    },
    actions: {
      navigateToExistingUserScreen() {
        navigate("/onboarding/existing-user");
      },
      navigateToNewUserScreen() {
        navigate("/onboarding/new-user");
      },
      navigateToWelcomeScreen() {
        navigate("/onboarding");
      },
      completeOnboarding() {
        userState.send("DONE_ONBOARDING");
      },
    },
  });

  return (
    <OnboardingStateContext.Provider value={{ onboardingService }}>
      {props.children}
    </OnboardingStateContext.Provider>
  );
}
