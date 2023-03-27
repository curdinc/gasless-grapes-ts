// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.WalletOnboarding.creatingEoa:invocation[0]": {
      type: "done.invoke.WalletOnboarding.creatingEoa:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.WalletOnboarding.onboarding.checkingUsersInput:invocation[0]": {
      type: "done.invoke.WalletOnboarding.onboarding.checkingUsersInput:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "done.invoke.WalletOnboarding.savingEoa:invocation[0]": {
      type: "done.invoke.WalletOnboarding.savingEoa:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.WalletOnboarding.creatingEoa:invocation[0]": {
      type: "error.platform.WalletOnboarding.creatingEoa:invocation[0]";
      data: unknown;
    };
    "error.platform.WalletOnboarding.onboarding.checkingUsersInput:invocation[0]": {
      type: "error.platform.WalletOnboarding.onboarding.checkingUsersInput:invocation[0]";
      data: unknown;
    };
    "error.platform.WalletOnboarding.savingEoa:invocation[0]": {
      type: "error.platform.WalletOnboarding.savingEoa:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    checkArguments: "done.invoke.WalletOnboarding.onboarding.checkingUsersInput:invocation[0]";
    createEoaForUser: "done.invoke.WalletOnboarding.creatingEoa:invocation[0]";
    saveUserEoa: "done.invoke.WalletOnboarding.savingEoa:invocation[0]";
  };
  missingImplementations: {
    actions:
      | "completeOnboarding"
      | "navigateToExistingUserScreen"
      | "navigateToNewUserScreen"
      | "navigateToWelcomeScreen";
    delays: never;
    guards: never;
    services: "saveUserEoa";
  };
  eventsCausingActions: {
    clearErrors:
      | "BEGIN_CREATE_USER"
      | "BEGIN_IMPORT_USER"
      | "ENTER_ONBOARDING_DETAILS"
      | "SUBMIT_INIT_USER"
      | "error.platform.WalletOnboarding.creatingEoa:invocation[0]"
      | "error.platform.WalletOnboarding.savingEoa:invocation[0]";
    clearSeedPhrase: "BEGIN_CREATE_USER";
    completeOnboarding: "done.invoke.WalletOnboarding.savingEoa:invocation[0]";
    ensureSeedPhraseIsRequired: "BEGIN_IMPORT_USER";
    navigateToExistingUserScreen: "BEGIN_IMPORT_USER";
    navigateToNewUserScreen: "BEGIN_CREATE_USER";
    navigateToWelcomeScreen: "BACK_TO_WELCOME_SCREEN";
    updateContext: "ENTER_ONBOARDING_DETAILS";
    updateError:
      | "error.platform.WalletOnboarding.creatingEoa:invocation[0]"
      | "error.platform.WalletOnboarding.onboarding.checkingUsersInput:invocation[0]"
      | "error.platform.WalletOnboarding.savingEoa:invocation[0]";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    checkArguments: "SUBMIT_INIT_USER";
    createEoaForUser: "done.invoke.WalletOnboarding.onboarding.checkingUsersInput:invocation[0]";
    saveUserEoa: "done.invoke.WalletOnboarding.creatingEoa:invocation[0]";
  };
  matchesStates:
    | "creatingEoa"
    | "initializedEoa"
    | "onboarding"
    | "onboarding.checkingUsersInput"
    | "onboarding.enteringExistingUserDetails"
    | "onboarding.enteringNewUserDetails"
    | "onboarding.errorWithUserInput"
    | "savingEoa"
    | "welcomeScreen"
    | {
        onboarding?:
          | "checkingUsersInput"
          | "enteringExistingUserDetails"
          | "enteringNewUserDetails"
          | "errorWithUserInput";
      };
  tags: never;
}
