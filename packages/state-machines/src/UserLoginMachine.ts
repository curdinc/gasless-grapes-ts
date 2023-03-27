import { assign, createMachine } from "xstate";

export const UserLoginMachine = createMachine(
  {
    id: "UserLogin",
    tsTypes: {} as import("./UserLoginMachine.typegen").Typegen0,
    schema: {
      context: {} as { password: string; error?: unknown },
      events: {} as
        | { type: "ENTER_PASSWORD"; data: { password: string } }
        | { type: "LOGIN" },
      services: {} as {
        login: { data: void };
      },
    },
    predictableActionArguments: true,
    context: {
      password: "",
    },
    initial: "idle",
    states: {
      idle: {
        on: {
          ENTER_PASSWORD: {
            actions: "updatePassword",
          },
          LOGIN: {
            target: "loggingIn",
          },
        },
      },
      loggingIn: {
        invoke: {
          src: "login",
          onDone: {
            target: "loggedIn",
          },
          onError: {
            actions: "updateError",
            target: "idle",
          },
        },
      },
      loggedIn: {
        type: "final",
      },
    },
  },
  {
    actions: {
      updateError: assign((context, event) => ({
        ...context,
        error: event.data,
      })),
      updatePassword: assign((_, event) => ({
        password: event.data.password,
        error: undefined,
      })),
    },
  },
);
