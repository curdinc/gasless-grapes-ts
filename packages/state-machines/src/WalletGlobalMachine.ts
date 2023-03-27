import { createMachine } from "xstate";

export type WalletGlobalMachineContext = {};
export type UserWalletState = "newUser" | "loggedOutUser" | "loggedInUser";
export const WalletGlobalMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QHEA2B7ARgQ1QYgBEB5AOQFEB9UgISIEEAlAgSROQG0AGAXUVAAd0sAJYAXYegB2fEAA9EAJk6cAdABZlygJwBGAKx6FAdgDMatQBoQAT0U6VnE0bUAOHQDYNurVpN6Avv5WaFi4eAAyRADCANIUdFFRRACqJAAqXLxIIIIi4lIy8ggu7goqRr4uakYuWp5KljaIOmr2GqbmeiYueloK7oHBGDioKhjYEMKSUMmwYABOeBBSYCpTAG7oANarISNj6BNTM3PzCBvoAMbY+ZKZmTK5YhLS2UUKdSolLkbuTjXKFwKKy2BAKExlThaCrmar6Ep+QYgPa4A5HaazBZLFZrSSbHYqFGjcaTDGnc54q43F73HRZARCZ4FN6KT7fX7-FyA4FNBA6UwqUofCHuQGtGpIolo0knLHLSSrC4EqUk46Ys4Xa63e4Kek5Rm3QqKFwuQUmHTgtQmLRqOpQkHNBSmrR6UquzitE0uQJBECSdAQOAyImPA0vI0ILQOhAAWnc7jNRkMLR0nBcThNkuGqNVZIWoby4ZZCD0RmjOhKDncWjcvSqf2M3t9UqkmEO8xl6oLTNeoCK7iMRhUFYtegtnHBLvc0fBqldNfNak8pkcJizoWJ6CgMAgzEkXeyT0NxfjenKbgU-Rq6ZM5vLLWHOhrnEH4IUrWM6-2GG3kCIAFdRAPBlC2ZPtEFPc8LSvE1bzvXl+TKXpXCfXprR6JtAiAA */
    id: "Global",
    predictableActionArguments: true,

    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import("./WalletGlobalMachine.typegen").Typegen0,
    schema: {
      context: {} as WalletGlobalMachineContext,
      events: {} as
        | {
            type: "DONE_ONBOARDING";
          }
        | { type: "LOCK_ACCOUNT" }
        | { type: "UNLOCK_ACCOUNT"; data: { pwd: string } }
        | { type: "LOG_IN" },
      services: {} as {
        checkUserState: {
          data: { state: UserWalletState };
        };
      },
    },
    context: {},
    initial: "loadingUser",
    states: {
      loadingUser: {
        invoke: [
          {
            src: "checkUserState",
            onDone: [
              {
                cond: "isNewUser",
                target: "onboardingUser",
              },
              {
                cond: "isLoggedOut",
                target: "loggedOutUser",
              },
              {
                target: "loggedInUser",
              },
            ],
          },
        ],
      },
      onboardingUser: {
        entry: "navigateToOnboarding",
      },
      loggedInUser: {
        entry: "navigateToHomePage",
      },
      loggedOutUser: {
        entry: "navigateToPasswordPage",
      },
    },
    on: {
      DONE_ONBOARDING: {
        target: "loggedInUser",
      },
      LOCK_ACCOUNT: {
        target: "loggedOutUser",
        actions: "clearAccountPassword",
      },
      UNLOCK_ACCOUNT: {
        target: "loggedInUser",
      },
    },
  },
  {
    guards: {
      isLoggedOut: (_, event) => {
        return event.data.state === "loggedOutUser";
      },
      isNewUser: (_, event) => {
        return event.data.state === "newUser";
      },
    },
  },
);
