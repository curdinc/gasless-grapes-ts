// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.WalletOnboarding.createEoa:invocation[0]": {
      type: "done.invoke.WalletOnboarding.createEoa:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.WalletOnboarding.saveEoa:invocation[0]": {
      type: "done.invoke.WalletOnboarding.saveEoa:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
    "xstate.stop": { type: "xstate.stop" };
  };
  invokeSrcNameMap: {
    createEoaForUser: "done.invoke.WalletOnboarding.createEoa:invocation[0]";
    saveUserEoa: "done.invoke.WalletOnboarding.saveEoa:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: "saveUserEoa";
  };
  eventsCausingActions: {
    clearErrors: "BACK_TO_WELCOME_SCREEN" | "SUBMIT_INIT_USER" | "xstate.stop";
    updateContext: "ENTER_ONBOARDING_DETAILS";
    updateErrors:
      | "done.invoke.WalletOnboarding.createEoa:invocation[0]"
      | "done.invoke.WalletOnboarding.saveEoa:invocation[0]";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isValidWallet:
      | "done.invoke.WalletOnboarding.createEoa:invocation[0]"
      | "done.invoke.WalletOnboarding.saveEoa:invocation[0]";
  };
  eventsCausingServices: {
    createEoaForUser: "SUBMIT_INIT_USER";
    saveUserEoa: "done.invoke.WalletOnboarding.createEoa:invocation[0]";
  };
  matchesStates:
    | "createEoa"
    | "initializedEoa"
    | "onboarding"
    | "onboarding.userWithExistingWallet"
    | "onboarding.userWithNoExistingWallet"
    | "saveEoa"
    | "welcomeScreen"
    | { onboarding?: "userWithExistingWallet" | "userWithNoExistingWallet" };
  tags: never;
}
