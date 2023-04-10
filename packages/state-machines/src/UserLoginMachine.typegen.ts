// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "error.platform.UserLogin.loggingIn:invocation[0]": {
      type: "error.platform.UserLogin.loggingIn:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    login: "done.invoke.UserLogin.loggingIn:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: "login";
  };
  eventsCausingActions: {
    updateError: "error.platform.UserLogin.loggingIn:invocation[0]";
    updatePassword: "ENTER_PASSWORD";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    login: "LOGIN";
  };
  matchesStates: "idle" | "loggedIn" | "loggingIn";
  tags: never;
}
