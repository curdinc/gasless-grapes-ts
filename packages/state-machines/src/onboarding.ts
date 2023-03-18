import { createMachine } from "xstate";

export const GaslessGrappesOnboardingMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QHFkGEBOBPADgFwHsB1AQwBsyw8BiAbQAYBdRUHA2ASzw4IDsWQAD0QAOAEwA6MQDYxAFhEB2OQGYxATjEiFAGhBZEAWkUBGKSrmr1ixSvUBWRwF8ne1JlyFSFKnRPMkEDZObj4BYQQ5aQlFMRMRe3ptaRM5eOk9AwQTWQkk2xNFezUReno5Fzd0bHxickoaWjEA1nYuHn5AiPszdT71Us1pHvj5TMR7RREJBJV6LTL7NIHKkHcar3qqCTICKBgIAHkAVzwAVVgwDAkwXjwrjl4oAAUSWFgAdwIMCGoAZTOACEALIASQAKgB9Z4AQT+fyIhwASgARBgtIJtUKdUARBLTUYOERqZQqUzjBAqaSKGKmBKJAbzRT0aSrdaeOo+PA7PYHE7nS7XW73DCPF5vT7fX4AkEQ6FwhHItH+ATBdphLqiKISYaFeixDQmcpyClLFQxezqKLSKKJHpiNnVDneBo8-aQfkXK4SD4YPji95fH7UcEATWeAFF5fDEaj0aqsR1wohVNF6D1FNYZHIllEKWJMxIc+oqdJ0znpOJ7I6PLUXdteGAPl7rh8wGQAMYEAC2YD+HYwYFu1DQSIjMPBUbOfwjSPjgTV2OTCDL9gkiQUuZEJhUc3UFJ3UhM8hUSz6Rs0JnUNY2nNdjebgp97a7vf7g+HoOBz2RUOns-nVoQiTTUV3TGYBjLIpmUtFQTApQwdxpOxpHUaQ7EmPoNxvZ0tm5B8WwkY5BSILgAAsADkCAjQQOFgbgnnrGhARhNAAGlIXBQ5ISICMABk0EOYEoz+UcIwjCjAMxYCNVxCY0IkTQxHoHdUNKeh1Hg-QjFsCQd2PO1xBUbdUhwus8IkAin2Iq5SLwMiaLohioCY6gWPYzjuN4gShJEsSJKkxcQLkhBLWiJSVKpRkNK0rJEL6GYLDkKYbHsaR0pyFxXBAXgCAgOABHZcyuQTGScSEIwzALbc5E04p8SQkQEOMmkbDUWqFDELqtDMzYuTdPlThbUr1XKiJjOmdNCizG1cwybTshtGZiiSOI0IGOQHWyoq+tdXZ3SOIan2FB4nleQMpRGpdQMrOQdTUDb7DiVDinzJ71wWER1CZWJUhEXq722fbBoFb1fX9c7JR+K7goqyIcwkKkTD1DSrS+lQKVPaY4LS8RnuKXcAaYgbIFBXhhoXRNZLh5TzRzOCKxkXcLCahajSvPI0sKHNigWattqdYr7ybCmgNG5cqXoCCxCpRwBjQ5GMYWww5iljTxAUMlTzUImLKssGXx7PsByHcqgupiI5CSaXZctL6Uh3BC4kkTb2tiG1tGR3X+v164bIwOzKOo2j6LFJiYYtxBNKqsQnqNDcTGKRQEOGItE9kS1NJEL7TG94XH29f3A8c0PGLwiOxqj635BEMsr0sGQHAQ1JzQLK3jK6lTmRULKnCAA */
  id: "GGCryptoWallet",
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  tsTypes: {} as import("./onboarding.typegen").Typegen0,
  schema: {
    context: {} as {},
    events: {} as
      | { type: "CREATE_USER" }
      | { type: "IMPORT_USER" }
      | { type: "BACK_TO_WELCOME_SCREEN" }
      | { type: "SUBMIT_PASSWORD" }
      | { type: "TYPE_PASSWORD" },
  },
  context: {},
  always: [
    {
      cond: "isNewUser",
      target: "newUser",
    },
    {
      cond: "isUserLoggedOut",
      target: "loggedOutUser",
    },
    {
      cond: "isUserLoggedIn",
      target: "loggedInUser",
    },
  ],
  states: {
    loggedOutUser: {
      initial: "enteringPassword",
      states: {
        enteringPassword: {
          on: {
            SUBMIT_PASSWORD: [
              { cond: "isPasswordInvalid", target: "wrongPassword" },
              {
                cond: "isPasswordValid",
                target: "#GGCryptoWallet.loggedInUser",
              },
            ],
          },
        },
        wrongPassword: {
          on: {
            TYPE_PASSWORD: {
              target: "enteringPassword",
            },
          },
        },
      },
    },
    loggedInUser: {},
    newUser: {
      initial: "welcomeScreen",
      states: {
        welcomeScreen: {
          on: {
            CREATE_USER: {
              target: "userWithNoExistingWallet",
            },
            IMPORT_USER: {
              target: "userWithExistingWallet",
            },
          },
        },
        userWithNoExistingWallet: {
          on: {
            BACK_TO_WELCOME_SCREEN: {
              target: "welcomeScreen",
            },
          },
        },
        userWithExistingWallet: {
          on: {
            BACK_TO_WELCOME_SCREEN: {
              target: "welcomeScreen",
            },
          },
        },
      },
    },
  },
});

GaslessGrappesOnboardingMachine.withConfig({
  guards: {
    
  },
  
});
