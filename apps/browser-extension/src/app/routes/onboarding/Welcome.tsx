import { useContext } from "react";
import { Button, Heading, Stack } from "@chakra-ui/react";
import { OnboardingStateContext } from "~app/stateMachines/onboardingStateContext";

export function OnboardingWelcome() {
  const { onboardingService } = useContext(OnboardingStateContext);

  return (
    <Stack spacing={10}>
      <Heading fontSize={"3xl"} textAlign="center">
        The developer&apos;s crypto wallet of choice
      </Heading>

      <Stack w="full" spacing={5}>
        <Button
          onClick={() => {
            onboardingService.send("BEGIN_CREATE_USER");
          }}
          w="full"
        >
          Get Started
        </Button>
        <Button
          w="full"
          variant="ghost"
          onClick={() => {
            onboardingService.send("BEGIN_IMPORT_USER");
          }}
        >
          Import an existing wallet (Seed Phrase)
        </Button>
      </Stack>
    </Stack>
  );
}
