import { ethers, type HDNodeWallet } from "ethers";
import { assign, createMachine } from "xstate";

type OnboardingContextType = {
  name: string;
  seedPhrase?: string;
  password: string;
  confirmPassword: string;
  errors?: Record<string, string>;
};

export const WalletOnboardingMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QHUCGAbdYAuB5AdgEYD2qAThAJb5QB0A7mOgMbEC2YAys2WGPgGIAQgFEA4gEkAcgH0AwgCURAQQAqImQFVOIhQG0ADAF1EoAA7FYlbJWL5TIAB6IATAE4AjLQAcbgMwA7L5+AGwArAAsLi4ANCAAnq4uYbRhfhERYWEBLiEBbiF+AL5FcWiYOAQk5FQ0DEysHNy8-MLi0jISALIACrgKqlo6+sYOFlY2dg7OCC4eKWEGIS4BAfPefm4GAX5xiQh+86lbye7eS5thJWUYWHhEpBTUdHbVTzTCynIA0jKquDJkCIADJyXBdDScRQiERSQwmJAgcbWWz2REzbwRWhrbwBCIGNI5Apubx7RB+bwLeZ5Dy5MLBELXEDlO5VR61F4PGrPASw9QKGS4KRCXDKBQAEWkYhk4pEqmUEmBnHhY0sKKm6MQeW8tAiuLCbhWc28LlCZIQIS8LgiIW83g86QyOSWTJZlS5705bw5Ak4miEXQkg2kQaGuhViORkzRoBmHm2OuSGzxhw8+QC5syBloBm2mQCWXyesZpWZt3d3uetB4YFQ2DAIlIAggdjAtGoADdiABrNtu+6Vuo1usN0gITvEZh11HwiPmNXR6aIeMGLFuTK+LIbgwec15ELYw4RPx+bZbVfFUv9tncoe8EeN1DN1vt-Bd3u0a8ejnV+-1x-jm+k7TnYs4eAi84TKiS4IA6gTYlkBj+AYprpA6ma4rQfhZMs2TrlkaRXFe5YDuyVawKgHajk+Lb4G2E4fl+g50BRVEAROU7RrOoyRgu0Gaha9JYWsITrqJBingU5pbAEWGrmE7g2h4biEq6JE3p6tCsdRz50a+759up37kZR1GAV2nEzsYejgaqUEarGy7YS4PgqQEq7RBsmIhOaazZnMHgZEsynRG4AQlKW+DEBAcAOExZE0HZ6oxk4iAALTJLQlrWri+TuLaBbmhlB5RPaZ4OgSFUljcFSkbedCMCw7BcDW-BJYuAnRFh+q0i42wSbSYTmh4IQHjkymhONpobGptUaT+rwJVA7X8Y5CDEjmBIUpS4TIRmCRalaqx5H4ZyjTsESzayxl1It9W0AAFpQsDYCtDmpbBO6ybmaR2mEu2nvt+zKQetIBKJWz4gahxXRWS20HdmkAK6wGAZDINYD1SMQIiOM9Ng0P2b0pXGX2bb9O3Q9s5qHAsawKRk6QrJEl41ddzEIzddAo2jGPYA9uP488RO8fZJPLmTP3bf9VNA642Q5gUmSnR4vg4rDdWacO-6kMTMHxssm3HS49qYpD5oKX4WUhDaer0jkBpEWzcP3dpj56wJ8buQhGz+CbEQ7P9vkUrQKk2nk+ERA6bga-NVbUCiGCUAAXpA7ui8lMGnSk7mBWsI34jbsQHetq6pO4YSBfSixBC4EVFEAA */
    id: "WalletOnboarding",
    tsTypes: {} as import("./onboardingMachine.typegen").Typegen0,
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
          },
      services: {} as {
        createEoaForUser: {
          data:
            | { userWallet: HDNodeWallet }
            | { error: { [key: string]: string } };
        };
        saveUserEoa: {
          data:
            | { userWallet: HDNodeWallet }
            | { error: { [key: string]: string } };
        };
        deoployUserScw: {
          data:
            | { userWallet: HDNodeWallet }
            | { error: { [key: string]: string } };
        };
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
            target: "onboarding.userWithExistingWallet",
          },
          BEGIN_IMPORT_USER: {
            target: "onboarding.userWithNoExistingWallet",
          },
        },
      },
      onboarding: {
        on: {
          BACK_TO_WELCOME_SCREEN: {
            target: "welcomeScreen",
          },
          ENTER_ONBOARDING_DETAILS: {
            actions: "updateContext",
          },
          SUBMIT_INIT_USER: {
            target: "createEoa",
          },
        },
        exit: ["clearErrors"],
        states: {
          hist: {
            type: "history",
          },
          userWithNoExistingWallet: {},
          userWithExistingWallet: {},
        },
      },
      createEoa: {
        invoke: [
          {
            src: "createEoaForUser",
            onDone: [
              {
                cond: "isValidWallet",
                target: "saveEoa",
              },
              {
                actions: "updateErrors",
                target: "onboarding.hist",
              },
            ],
          },
        ],
      },
      saveEoa: {
        invoke: [
          {
            src: "saveUserEoa",
            onDone: [
              {
                cond: "isValidWallet",
                target: "initializedEoa",
              },
              {
                actions: "updateErrors",
                target: "onboarding.hist",
              },
            ],
          },
        ],
      },
      initializedEoa: {
        type: "final",
      },
    },
  },
  {
    guards: {
      isValidWallet: (_, event) => !("error" in event.data),
    },
    actions: {
      updateContext: assign((_, event) => ({
        ...event.data,
      })),
      clearErrors: assign({
        errors: undefined,
      }),
      updateErrors: assign({
        errors: (_, event) => {
          if ("error" in event.data) {
            return event.data.error;
          }
          return;
        },
      }),
    },
    services: {
      createEoaForUser: async (
        context: OnboardingContextType,
      ): Promise<
        { userWallet: HDNodeWallet } | { error: { [key: string]: string } }
      > => {
        try {
          if (context.seedPhrase) {
            try {
              const userWallet = ethers.Wallet.fromPhrase(context.seedPhrase);
              return { userWallet };
            } catch (e) {
              return { error: { seedPhrase: "Invalid seed phrase given" } };
            }
          }
          const userWallet = ethers.Wallet.createRandom();
          return { userWallet };
        } catch (e) {
          return {
            error: { overall: `Something went wrong creating a wallet ${e}` },
          };
        }
      },
    },
  },
);
