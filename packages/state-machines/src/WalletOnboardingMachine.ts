import { ethers, type HDNodeWallet } from "ethers";
import { assign, createMachine } from "xstate";
import { ZodError, z } from "zod";

const createWalletSchema = z
  .object({
    name: z.string().min(1, "Account name must be provided"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters in length"),
    confirmPassword: z.string(),
    seedPhrase: z.string().min(1, "Invalid seed phrase given").optional(),
  })
  .refine(
    (args) => {
      return args.confirmPassword === args.password;
    },
    () => {
      return {
        message: "Password does not match",
        path: ["confirmPassword"],
      };
    },
  )
  .refine(
    (args) => {
      console.log("args", args);
      if (typeof args.seedPhrase === "string") {
        try {
          ethers.Wallet.fromPhrase(args.seedPhrase);
          return true;
        } catch (e) {
          return false;
        }
      }
      return true;
    },
    () => ({
      message: "Invalid Seed Phrase given",
      path: ["seedPhrase"],
    }),
  );

type OnboardingContextType = {
  name: string;
  seedPhrase?: string;
  password: string;
  confirmPassword: string;
  userWallet?: HDNodeWallet;
  errors?: z.typeToFlattenedError<z.infer<typeof createWalletSchema>, string>;
};

export const WalletOnboardingMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QHUCGAbdYAuB5AdgEYD2qAThAJb5QB0A7mOgMbEC2YAys2WGPgGIAQgFEA4gEkAcgH0AwgCURAQQAqImQFVOIhQG0ADAF1EoAA7FYlbJWL5TIAB6IAjC4BstAJwBmFwCYAFn8Ddz8AdgBWAA4vABoQAE9Ef3Dw2h9-F18XP1SfH2iAXyKEtEwcAhJyKhoGJlYObl5+YXFpGQkAWQAFXAVVLR19YwcLKxs7B2cEYJdaQN9wr0jA91ifcPcE5IR-AtoPSP93SJdorfCDcMCSsowsPCJSCmo6O2rXmmFlOQBpGSqXAyZAiAAyclwXQ0nEUIhEUkMJiQIHG1ls9hRM2igVo4XONwMkU2-i87i80R2iEKkVoZ0i7nxJxivncdxA5UeVRetXezxqbwECPUChkuCkQlwygUABFpGIZDKRKplBIwZwkWNLOipljEIzogsLpEvKkstF9tskvr5kF1tFcoEneEQmzShyHpV+V8+Z9eQJOJohF0JINpKGhrpNSi0ZNMaAZi5rob-DFNoE-C5luEqbNIgZaAZroFIlFS15AtE3fcKk8-W9aDwwKhsGARKQBBA7GBaNQAG7EADWPc5XvrdSbLbbpAQ-eIzBbGKR0fM2rj01cRdxFZZkVWMQMLlzjM84T8GZ81y8W587NHdZ5DcnrfbqE73d7+AHw9o9+5AonXgp1fWcv3nRc7GXFxkVXCYMQ3BBck2PE9wMXwDH2HxAlyXNK3SHw93cVNlhLPcCLvT0HwAuhYFQPtpzfLt8B7Ocfz-b1eVoWj6JAucFzjZdRhjNd4L1BBTkNTYPArckDEvMlc2vfCDBLUk1myYlwgo2t-x9Li6IY99mM-b8R0o3TOO4hjQIHfil2MPRoK1ODdQTVwCP8WhYlLFT-H8aJCjWXN8QLLIXCdUJsj8rwtPddjxzoMFiCgGAIAkfBNFgMAyC6VBmAAC2oHsAFd8HQedhwgV8BCUVQFAkEQADUNB6erGrUDQ-hEABNFdURE1ynGpZZaDCZ0VPpU1AlzXIVgyXJYjJbCHWiYo4vMjiGySlLIHSzLstygqitoUryuYSrqr62NRLchApNoM0tgtAKsnzabrUQy90iJUl1nUsl-O0rlNrqbbUr2rKcrywrjL7DBKAgbh6AEOQAAllCkMQNDR1VESE2CdXjIbZnCQ0xuw-MKQCVYZv2AtSbPNYsL8IivCBsdH1B5LwYyyHDphns4fQBGkYEZQZRlGQpBEZAZBEKUroGomZhLdJSwC7CCnxRZKQ+txonp44VjLEItludl8GICA4AceLOagZzCYQgBaVNRoCPDll+41c1dzxggdbJli8VklnZqi9MYFh2C4Jt+Ed9cxL8jJjQCU25Opmb3FPLJWRdAJClvdadJB317YTm7ibJLxCyJQpogZE0vuPW00iudvIqe8OLIbD57doQrYGwCvBsTQ9vrr1bG-QnM9bJQ5UnJa9AiJHJu9L2g++ok7IeQax8qkYgREcSgh7ee8R+Vzcs1r4kp9OGfcz8WlSxcY4nSw1JViLmtgYSzeN7FV3vvY+p8bA0AvsJFyV9ELj1vvXaezcPrEULEtYk5oYrnHXv-Z8DFL4ISTERWuaQiIrUWCpXMxwfCjXcGsSsMQXQmkiNg-uVlXz4LEkmK4KEAq+H8oEM8DJgqFG8KsbOJFVizRYdvag6J4YAC9IDsKgU7MSPhryiPCscDCoRMyz12Ktahh5CgrBimSM81YPQl3-mDXavMDrQyKhw26WjCzEmyA3TI2F8Q+BmmhIxaRfAhz4aaSxdtt62LSvYqGR1jKnQqko0gzjibZCMe4ik6DvE4T1peWkpxwrnANoUXIYSNo2O5nY-aMSBa0CFiLZg9BkkzBdJ4Vaaxx6LH8lmGauTRpnHUYsdwGkMzSL0pEiGDjYk9jAI4cYkAehkEoHDVsfwwC7AJonW6jICzk1OEWbOBEjw5LmqSekZwXREnNiUIAA */
    id: "WalletOnboarding",
    predictableActionArguments: true,
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import("./WalletOnboardingMachine.typegen").Typegen0,
    schema: {
      context: {} as OnboardingContextType,
      events: {} as
        | { type: "BEGIN_CREATE_USER" }
        | { type: "BEGIN_IMPORT_USER" }
        | {
            type: "BACK_TO_WELCOME_SCREEN";
          }
        | {
            type: "ENTER_ONBOARDING_DETAILS";
            data: Partial<OnboardingContextType>;
          }
        | {
            type: "SUBMIT_INIT_USER";
          }
        | {
            type: "RETRY_EOA_CREATION";
          },
      services: {} as {
        createEoaForUser: {
          data: { userWallet: HDNodeWallet };
        };
        saveUserEoa: { data: void };
        checkArguments: { data: void };
      },
    },
    context: {
      name: "",
      password: "",
      confirmPassword: "",
    },
    initial: "welcomeScreen",

    states: {
      welcomeScreen: {
        on: {
          BEGIN_CREATE_USER: {
            actions: "navigateToNewUserScreen",
            target: "#WalletOnboarding.onboarding.enteringNewUserDetails",
          },
          BEGIN_IMPORT_USER: {
            actions: "navigateToExistingUserScreen",
            target: "#WalletOnboarding.onboarding.enteringExistingUserDetails",
          },
        },
      },

      onboarding: {
        entry: ["clearErrors"],
        on: {
          BACK_TO_WELCOME_SCREEN: {
            actions: "navigateToWelcomeScreen",
            target: "#WalletOnboarding.welcomeScreen",
          },
          ENTER_ONBOARDING_DETAILS: {
            actions: ["updateContext", "clearErrors"],
          },
          SUBMIT_INIT_USER: {
            target: "#WalletOnboarding.onboarding.checkingUsersInput",
          },
        },
        states: {
          enteringNewUserDetails: {
            entry: ["clearSeedPhrase"],
          },
          enteringExistingUserDetails: {
            entry: ["ensureSeedPhraseIsRequired"],
          },
          checkingUsersInput: {
            invoke: [
              {
                src: "checkArguments",
                onDone: [
                  {
                    target: "#WalletOnboarding.creatingEoa",
                  },
                ],
                onError: [
                  {
                    actions: "updateError",
                    target: "#WalletOnboarding.onboarding.errorWithUserInput",
                  },
                ],
              },
            ],
          },
          errorWithUserInput: {},
        },
      },
      creatingEoa: {
        invoke: [
          {
            src: "createEoaForUser",
            onDone: {
              target: "#WalletOnboarding.savingEoa",
            },
            onError: {
              actions: "updateError",
              target: "#WalletOnboarding.onboarding.errorWithUserInput",
            },
          },
        ],
      },
      savingEoa: {
        invoke: [
          {
            src: "saveUserEoa",
            onDone: {
              target: "#WalletOnboarding.initializedEoa",
            },
            onError: {
              actions: "updateError",
              target: "#WalletOnboarding.onboarding.errorWithUserInput",
            },
          },
        ],
      },
      initializedEoa: {
        entry: ["navigateToLoggedInUserScreen"],
        type: "final",
      },
    },
  },
  {
    actions: {
      updateContext: assign((context, event) => ({
        ...context,
        ...event.data,
      })),
      clearSeedPhrase: assign((context) => ({
        ...context,
        seedPhrase: undefined,
      })),
      ensureSeedPhraseIsRequired: assign((context) => ({
        ...context,
        seedPhrase: "",
      })),
      clearErrors: assign({
        errors: undefined,
      }),
      updateError: assign((ctx, event) => {
        if (event.data instanceof ZodError) {
          console.log("event.data.flatten()", event.data.flatten());
          return {
            ...ctx,
            errors: event.data.flatten(),
          };
        }
        throw new Error("Unknown data type");
      }),
    },
    services: {
      checkArguments: async (ctx) => {
        createWalletSchema.parse(ctx);
      },
      createEoaForUser: async (context) => {
        try {
          if (context.seedPhrase) {
            // this should not throw because we verify this with the checkArgument function above
            const userWallet = ethers.Wallet.fromPhrase(context.seedPhrase);
            return { userWallet };
          }
          const userWallet = ethers.Wallet.createRandom();
          return { userWallet };
        } catch (e) {
          throw new Error("Something went wrong creating a wallet ${e}`");
        }
      },
    },
  },
);
