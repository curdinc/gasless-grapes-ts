// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.Global.loadingUser:invocation[0]": {
      type: "done.invoke.Global.loadingUser:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    checkUserState: "done.invoke.Global.loadingUser:invocation[0]";
  };
  missingImplementations: {
    actions:
      | "clearAccountPassword"
      | "navigateToHomePage"
      | "navigateToOnboarding"
      | "navigateToPasswordPage";
    delays: never;
    guards: never;
    services: "checkUserState";
  };
  eventsCausingActions: {
    clearAccountPassword: "LOCK_ACCOUNT";
    navigateToHomePage:
      | "DONE_ONBOARDING"
      | "UNLOCK_ACCOUNT"
      | "done.invoke.Global.loadingUser:invocation[0]";
    navigateToOnboarding: "done.invoke.Global.loadingUser:invocation[0]";
    navigateToPasswordPage:
      | "LOCK_ACCOUNT"
      | "done.invoke.Global.loadingUser:invocation[0]";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isLoggedOut: "done.invoke.Global.loadingUser:invocation[0]";
    isNewUser: "done.invoke.Global.loadingUser:invocation[0]";
  };
  eventsCausingServices: {
    checkUserState:
      | "DONE_ONBOARDING"
      | "LOCK_ACCOUNT"
      | "UNLOCK_ACCOUNT"
      | "xstate.init";
  };
  matchesStates:
    | "loadingUser"
    | "loggedInUser"
    | "loggedOutUser"
    | "onboardingUser";
  tags: never;
}
