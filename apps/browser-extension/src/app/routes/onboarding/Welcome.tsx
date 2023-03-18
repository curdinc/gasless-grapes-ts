import { Button, Heading, Stack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function OnboardingWelcome() {
  return (
    <Stack spacing={10}>
      <Heading fontSize={"3xl"} textAlign="center">
        The developer&apos;s crypto wallet of choice
      </Heading>

      <Stack w="full" spacing={5}>
        <Button as={Link} to="/onboarding/new-user" w="full">
          Get Started
        </Button>
        <Button
          w="full"
          variant="ghost"
          as={Link}
          to="/onboarding/existing-user"
        >
          Import an existing wallet (Seed Phrase)
        </Button>
      </Stack>
    </Stack>
  );
}
