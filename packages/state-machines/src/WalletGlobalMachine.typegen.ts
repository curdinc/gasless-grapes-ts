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
    actions: "clearAccountPassword";
    delays: never;
    guards: never;
    services: "checkUserState";
  };
  eventsCausingActions: {
    clearAccountPassword: "LOCK_ACCOUNT";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isLoggedOut: "done.invoke.Global.loadingUser:invocation[0]";
    isNewUser: "done.invoke.Global.loadingUser:invocation[0]";
  };
  eventsCausingServices: {
    checkUserState: "DONE_ONBOARDING" | "LOCK_ACCOUNT" | "xstate.init";
  };
  matchesStates:
    | "loadingUser"
    | "loggedInUser"
    | "loggedOutUser"
    | "onboardingUser";
  tags: never;
}
