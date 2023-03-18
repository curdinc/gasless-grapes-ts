// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards:
      | "isNewUser"
      | "isPasswordInvalid"
      | "isPasswordValid"
      | "isUserLoggedIn"
      | "isUserLoggedOut";
    services: never;
  };
  eventsCausingActions: {};
  eventsCausingDelays: {};
  eventsCausingGuards: {
    isNewUser: "";
    isPasswordInvalid: "SUBMIT_PASSWORD";
    isPasswordValid: "SUBMIT_PASSWORD";
    isUserLoggedIn: "";
    isUserLoggedOut: "";
  };
  eventsCausingServices: {};
  matchesStates:
    | "loggedInUser"
    | "loggedOutUser"
    | "loggedOutUser.enteringPassword"
    | "loggedOutUser.wrongPassword"
    | "newUser"
    | "newUser.userWithExistingWallet"
    | "newUser.userWithNoExistingWallet"
    | "newUser.welcomeScreen"
    | {
        loggedOutUser?: "enteringPassword" | "wrongPassword";
        newUser?:
          | "userWithExistingWallet"
          | "userWithNoExistingWallet"
          | "welcomeScreen";
      };
  tags: never;
}
